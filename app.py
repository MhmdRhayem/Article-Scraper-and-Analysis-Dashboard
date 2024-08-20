from flask import Flask, jsonify
from pymongo import MongoClient

app = Flask(__name__)

client = MongoClient("mongodb://localhost:27017/")
db = client["almayadeen"]
collection = db["articles"]

@app.route("/top_keywords", methods=["GET"])
def top_keywords():
    pipeline = [
        {"$unwind": "$keywords"},
        {"$group": {"_id": "$keywords", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}},
        {"$limit": 10},
    ]
    result = list(collection.aggregate(pipeline))
    return jsonify(result)

@app.route("/top_authors", methods=["GET"])
def top_authors():
    pipeline = [
        {"$group": {"_id": "$author", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}},
        {"$limit": 10},
    ]
    result = list(collection.aggregate(pipeline))
    return jsonify(result)

@app.route("/articles_by_date", methods=["GET"])
def articles_by_date():
    pipeline = [
        {
            "$project": {
                "published_date": {"$dateFromString": {"dateString": "$published_time"}}
            }
        },
        {
            "$group": {
                "_id": {
                    "$dateToString": {"format": "%Y-%m-%d", "date": "$published_date"}
                },
                "count": {"$sum": 1},
            }
        },
        {"$sort": {"_id": -1}},
    ]
    result = list(collection.aggregate(pipeline))
    return jsonify(result)

@app.route("/articles_by_word_count", methods=["GET"])
def articles_by_word_count():
    pipeline = [
        {"$project": {"word_count": {"$toInt": "$word_count"}}},
        {"$group": {"_id": "$word_count", "count": {"$sum": 1}}},
        {"$sort": {"_id": -1}},
    ]
    result = list(collection.aggregate(pipeline))
    return jsonify(result)

@app.route("/articles_by_language", methods=["GET"])
def articles_by_language():
    pipeline = [
        {"$group": {"_id": "$lang", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}},
    ]
    result = list(collection.aggregate(pipeline))
    return jsonify(result)

@app.route("/articles_by_classes", methods=["GET"])
def articles_by_classes():
    pipeline = [
        {"$unwind": "$classes"},
        {"$match": {"classes.mapping": "category"}},
        {"$group": {"_id": "$classes.value", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}},
    ]
    result = list(collection.aggregate(pipeline))
    return jsonify(result)

@app.route("/recent_articles", methods=["GET"])
def recent_articles():
    pipeline = [
        {
            "$project": {
                "published_date": {"$dateFromString": {"dateString": "$published_time"}}
            }
        },
        {"$sort": {"published_time": 1}},
    ]
    result = list(collection.aggregate(pipeline))
    return jsonify(result)

@app.route("/articles_by_keyword/<keyword>",methods=["GET"])
def articles_by_keyword(keyword):
    pipeline = [
        {"$match":{"keywords":{"$in":[keyword]}}},
        {
        "$addFields": {
            "_id": {"$toString": "$_id"}
        }},
        {"$project" : {"title":1}}
    ]
    result = list(collection.aggregate(pipeline))
    return jsonify(result)

if __name__ == "__main__":
    app.run(debug=True)
