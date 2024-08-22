from flask import Flask, jsonify
from pymongo import MongoClient
from bson import ObjectId
from datetime import datetime, timedelta

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
                "published_time": {"$dateFromString": {"dateString": "$published_time"}}
            }
        },
        {
            "$group": {
                "_id": {
                    "$dateToString": {"format": "%Y-%m-%d", "date": "$published_time"}
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
                "_id": 0,
                "title": 1,
                "published_date": {
                    "$dateFromString": {"dateString": "$published_time"}
                },
            }
        },
        {"$sort": {"published_time": 1}},
        {"$limit": 10},
    ]
    result = list(collection.aggregate(pipeline))
    return jsonify(result)


@app.route("/articles_by_keyword/<keyword>", methods=["GET"])
def articles_by_keyword(keyword):
    pipeline = [
        {"$match": {"keywords": {"$in": [keyword]}}},
        {"$project": {"_id": 0, "title": 1}},
    ]
    result = list(collection.aggregate(pipeline))
    return jsonify(result)


@app.route("/articles_by_author/<author_name>", methods=["GET"])
def articles_by_author(author_name):
    pipeline = [
        {"$match": {"author": author_name}},
        {"$project": {"_id": 0, "title": 1, "author": 1}},
    ]
    result = list(collection.aggregate(pipeline))
    return jsonify(result)


@app.route("/top_classes", methods=["GET"])
def top_classes():
    pipeline = [
        {"$unwind": "$classes"},
        {"$group": {"_id": "$classes.value", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}},
        {"$limit": 10},
    ]
    result = list(collection.aggregate(pipeline))
    return jsonify(result)


@app.route("/article_details/<postid>", methods=["GET"])
def article_details(postid):
    postid = ObjectId(postid)
    pipeline = [
        {"$match": {"_id": postid}},
        {"$project": {"_id": 0, "url": 1, "title": 1, "keywords": 1}},
    ]
    result = list(collection.aggregate(pipeline))
    return jsonify(result)


@app.route("/articles_with_video", methods=["GET"])
def articles_with_video():
    pipeline = [
        {"$match": {"video_duration": {"$ne": None}}},
        {"$addFields": {"_id": 0, "title": 1}},
    ]
    result = list(collection.aggregate(pipeline))
    return jsonify(result)


@app.route("/articles_by_year/<int:year>", methods=["GET"])
def articles_by_year(year):
    pipeline = [
        {
            "$project": {
                "_id": 0,
                "title": 1,
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
                "_id": 0,
                "title": 1,
                "word_count": {"$toInt": "$word_count"},
            }
        },
        {"$sort": {"word_count": -1}},
        {"$limit": 10},
    ]
    result = list(collection.aggregate(pipeline))
    return jsonify(result)


@app.route("/shortest_articles", methods=["GET"])
def shortest_articles():
    pipeline = [
        {
            "$project": {
                "_id": 0,
                "title": 1,
                "word_count": {"$toInt": "$word_count"},
            }
        },
        {"$sort": {"word_count": 1}},
        {"$limit": 10},
    ]
    result = list(collection.aggregate(pipeline))
    return jsonify(result)


@app.route("/articles_by_keyword_count", methods=["GET"])
def articles_by_keyword_count():
    pipeline = [
        {
            "$project": {
                "keywords_count": {"$size": "$keywords"},
            }
        },
        {"$group": {"_id": "$keywords_count", "articles_count": {"$sum": 1}}},
    ]
    result = list(collection.aggregate(pipeline))
    return jsonify(result)


@app.route("/articles_with_thumbnail", methods=["GET"])
def articles_with_thumbnail():
    pipeline = [
        {"$match": {"thumbnail": {"$ne": None}}},
        {"$project": {"_id": 0, "title": 1, "thumbnail": 1}},
    ]
    result = list(collection.aggregate(pipeline))
    return jsonify(result)


@app.route("/articles_updated_after_publication", methods=["GET"])
def articles_updated_after_publication():
    pipeline = [
        {
            "$project": {
                "_id": 0,
                "title": 1,
                "published_time": {
                    "$dateFromString": {"dateString": "$published_time"}
                },
                "last_updated": {"$dateFromString": {"dateString": "$last_updated"}},
            }
        },
        {"$match": {"$expr": {"$gt": ["$last_updated", "$published_time"]}}},
    ]
    result = list(collection.aggregate(pipeline))
    return jsonify(result)


@app.route("/articles_by_coverage/<coverage>", methods=["GET"])
def articles_by_coverage(coverage):
    pipeline = [
        {"$unwind": "$classes"},
        {"$match": {"classes.mapping": "coverage", "classes.value": coverage}},
        {"$project": {"_id": 0, "title": 1, "author": 1}},
    ]
    result = list(collection.aggregate(pipeline))
    return jsonify(result)


@app.route("/popular_keywords_last_X_days", methods=["GET"])
def popular_keywords_last_X_days():
    date_X_days_ago = datetime.utcnow() - timedelta(days=7)
    print(date_X_days_ago)
    pipeline = [
        {
            "$project": {
                "published_time": {
                    "$dateFromString": {"dateString": "$published_time"}
                },
                "_id": 0,
            }
        },
        {"$match": {"published_time": {"$gte": date_X_days_ago}}},
    ]
    result = list(collection.aggregate(pipeline))
    return jsonify(result)


@app.route("/articles_by_month/<year>/<month>", methods=["GET"])
def articles_by_month(year, month):
    pipeline = [
        {
            "$project": {
                "_id": 0,
                "title": 1,
                "published_time": {
                    "$dateFromString": {"dateString": "$published_time"}
                },
                "month": {"$month": "$published_time"},
            }
        },
    ]
    result = list(collection.aggregate(pipeline))
    return jsonify(result)


if __name__ == "__main__":
    app.run(debug=True)
