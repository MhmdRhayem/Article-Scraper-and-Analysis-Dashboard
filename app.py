from flask import Flask, jsonify
from pymongo import MongoClient
from bson import ObjectId

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


@app.route("/articles_by_keyword/<keyword>", methods=["GET"])
def articles_by_keyword(keyword):
    pipeline = [
        {"$match": {"keywords": {"$in": [keyword]}}},
        {"$project": {"_id": {"$toString": "$_id"}, "title": 1, "keywords": 1}},
    ]
    result = list(collection.aggregate(pipeline))
    return jsonify(result)


@app.route("/articles_by_author/<author_name>", methods=["GET"])
def articles_by_author(author_name):
    pipeline = [
        {"$match": {"author": author_name}},
        {"$project": {"_id": {"$toString": "$_id"}, "title": 1, "author": 1}},
    ]
    result = list(collection.aggregate(pipeline))
    return jsonify(result)


@app.route("/top_classes", methods=["GET"])
def top_classes():
    pipeline = [
        {"$unwind": "$classes"},
        {"$group": {"_id": "$classes.value", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}},
    ]
    result = list(collection.aggregate(pipeline))
    return jsonify(result)


@app.route("/article_details/<postid>", methods=["GET"])
def article_details(postid):
    postid = ObjectId(postid)
    pipeline = [
        {"$match": {"_id": postid}},
        {"$addFields": {"_id": {"$toString": "$_id"}}},
    ]
    result = list(collection.aggregate(pipeline))
    return jsonify(result)


@app.route("/articles_with_video", methods=["GET"])
def articles_with_video():
    pipeline = [
        {"$match": {"video_duration": {"$ne": None}}},
        {"$addFields": {"_id": {"$toString": "$_id"}}},
    ]
    result = list(collection.aggregate(pipeline))
    return jsonify(result)


@app.route("/articles_by_year/<int:year>", methods=["GET"])
def articles_by_year(year):
    pipeline = [
        {
            "$project": {
                "_id": {"$toString": "$_id"},
                "published_time": {
                    "$dateFromString": {"dateString": "$published_time"}
                },
            }
        },
        {"$match": {"$expr": {"$eq": [{"$year": "$published_time"}, year]}}},
    ]
    result = list(collection.aggregate(pipeline))
    return jsonify(result)


@app.route("/longest_articles", methods=["GET"])
def longest_articles():
    pipeline = [
        {
            "$project": {
                "_id": {"$toString": "$_id"},
                "word_count": {"$toInt": "$word_count"},
            }
        },
        {"$sort": {"word_count": -1}},
        {"$limit" : 10}
    ]
    result = list(collection.aggregate(pipeline))
    return jsonify(result)

@app.route("/shortest_articles",metohds=["GET"])
def shortest_articles():
    pipeline = [
        {
            "$project": {
                "_id": {"$toString": "$_id"},
                "word_count": {"$toInt": "$word_count"},
            }
        },
        {"$sort": {"word_count": 1}},
        {"$limit" : 10}
    ]
    result = list(collection.aggregate(pipeline))
    return jsonify(result)



if __name__ == "__main__":
    app.run(debug=True)
