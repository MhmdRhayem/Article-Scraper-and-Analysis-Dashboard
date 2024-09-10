from flask import Flask, jsonify
from pymongo import MongoClient, TEXT
from bson import ObjectId
from datetime import datetime, timedelta
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)

client = MongoClient("mongodb://localhost:27017/")
db = client["almayadeen"]
collection = db["articles"]


@app.route("/articles_count", methods=["GET"])
def articles_count():
    return jsonify(collection.count_documents(filter={}))


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
            "$group": {
                "_id": {
                    "$dateToString": {
                        "format": "%Y-%m-%d",
                        "date": {"$dateFromString": {"dateString": "$published_time"}},
                    }
                },
                "count": {"$sum": 1},
            }
        },
        {"$sort": {"_id": 1}},
    ]
    result = list(collection.aggregate(pipeline))
    return jsonify(result)


@app.route("/articles_by_word_count", methods=["GET"])
def articles_by_word_count():
    pipeline = [
        {"$group": {"_id": {"$toInt": "$word_count"}, "count": {"$sum": 1}}},
        {"$sort": {"_id": 1}},
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
                "url": 1,
                "title": 1,
                "keywords": 1,
                "published_time": {
                    "$dateFromString": {"dateString": "$published_time"}
                },
            }
        },
        {"$sort": {"published_time": -1}},
        {"$limit": 10},
    ]
    result = list(collection.aggregate(pipeline))
    return jsonify(result)


@app.route("/articles_grouped_by_keywords_count", methods=["GET"])
def articles_grouped_by_keywords_count():
    pipeline = [
        {"$group": {"_id": {"$size": "$keywords"}, "titles": {"$push": "$title"}}},
        {"$sort": {"_id": -1}},
        {"$project": {"titles": {"$slice": ["$titles", 5]}}},
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
        {
            "$project": {
                "_id": 0,
                "url": 1,
                "title": 1,
                "keywords": 1,
                "published_time": 1,
            }
        },
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
        {
            "$project": {
                "_id": 0,
                "url": 1,
                "title": 1,
                "keywords": 1,
                "published_time": 1,
            }
        },
    ]
    result = list(collection.aggregate(pipeline))
    return jsonify(result)


@app.route("/articles_with_video", methods=["GET"])
def articles_with_video():
    pipeline = [
        {"$match": {"video_duration": {"$ne": None}}},
        {"$project": {"_id": 0, "title": 1}},
    ]
    result = list(collection.aggregate(pipeline))
    return jsonify(result)


@app.route("/articles_by_year/<int:year>", methods=["GET"])
def articles_by_year(year):
    pipeline = [
        {
            "$match": {
                "$expr": {
                    "$eq": [
                        {
                            "$year": {
                                "$dateFromString": {"dateString": "$published_time"}
                            }
                        },
                        year,
                    ]
                }
            }
        },
        {
            "$group": {
                "_id": {
                    "$year": {"$dateFromString": {"dateString": "$published_time"}}
                },
                "count": {"$sum": 1},
            }
        },
    ]
    result = list(collection.aggregate(pipeline))
    return jsonify(result)


@app.route("/articles_grouped_by_year", methods=["GET"])
def articles_grouped_by_year():
    pipeline = [
        {
            "$group": {
                "_id": {
                    "$year": {"$dateFromString": {"dateString": "$published_time"}}
                },
                "count": {"$sum": 1},
            }
        },
        {"$sort": {"_id": -1}},
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
        {"$match": {"$expr": {"$ne": [{"$toInt": "$word_count"}, 0]}}},
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
        {"$group": {"_id": {"$size": "$keywords"}, "articles_count": {"$sum": 1}}},
        {"$sort": {"_id": 1}},
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
            "$match": {
                "$expr": {
                    "$gt": [
                        {"$dateFromString": {"dateString": "$last_updated"}},
                        {"$dateFromString": {"dateString": "$published_time"}},
                    ]
                }
            }
        },
        {"$project": {"_id": 0, "title": 1, "published_time": 1}},
    ]
    result = list(collection.aggregate(pipeline))
    return jsonify(result)


@app.route("/articles_grouped_by_coverage_perYear", methods=["GET"])
def articles_grouped_by_coverage_perYear():
    pipeline = [
        {
            "$project": {
                "year": {
                    "$year": {"$dateFromString": {"dateString": "$published_time"}}
                },
                "classes": "$classes",
            }
        },
        {"$unwind": "$classes"},
        {"$match": {"classes.mapping": "category"}},
        {
            "$group": {
                "_id": {"year": "$year", "coverage": "$classes.value"},
                "count": {"$sum": 1},
            }
        },
        {"$sort": {"_id.year": 1, "count": -1}},
        {
            "$group": {
                "_id": "$_id.year",
                "coverages": {
                    "$push": {"category": "$_id.coverage", "count": "$count"}
                },
            }
        },
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


@app.route("/popular_keywords_last_X_days/<int:day>", methods=["GET"])
def popular_keywords_last_X_days(day):
    date_X_days_ago = datetime.utcnow() - timedelta(days=day)
    print(date_X_days_ago)
    pipeline = [
        {
            "$match": {
                "$expr": {
                    "$gte": [
                        {"$dateFromString": {"dateString": "$published_time"}},
                        date_X_days_ago,
                    ]
                }
            }
        },
        {"$unwind": "$keywords"},
        {"$group": {"_id": "$keywords", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}},
        {"$limit": 15},
    ]
    result = list(collection.aggregate(pipeline))
    return jsonify(result)


@app.route("/articles_by_month/<int:year>/<int:month>", methods=["GET"])
def articles_by_month(year, month):
    pipeline = [
        {
            "$group": {
                "_id": {
                    "year": {
                        "$year": {"$dateFromString": {"dateString": "$published_time"}}
                    },
                    "month": {
                        "$month": {"$dateFromString": {"dateString": "$published_time"}}
                    },
                },
                "count": {"$sum": 1},
            }
        },
        {"$match": {"_id.year": year, "_id.month": month}},
        {
            "$project": {
                "_id": 0,
                "year": "$_id.year",
                "month": "$_id.month",
                "count": 1,
            }
        },
    ]
    result = list(collection.aggregate(pipeline))
    return jsonify(result)


@app.route("/articles_grouped_by_month", methods=["GET"])
def articles_grouped_by_month():
    pipeline = [
        {
            "$group": {
                "_id": {
                    "year": {
                        "$year": {"$dateFromString": {"dateString": "$published_time"}}
                    },
                    "month": {
                        "$month": {"$dateFromString": {"dateString": "$published_time"}}
                    },
                },
                "count": {"$sum": 1},
            }
        },
        {"$sort": {"_id.year": 1, "_id.month": 1}},
    ]
    result = list(collection.aggregate(pipeline))
    return jsonify(result)


@app.route("/articles_by_word_count_range/<int:min>/<int:max>", methods=["GET"])
def articles_by_word_count_range(min, max):
    pipeline = [
        {
            "$match": {
                "$expr": {
                    "$and": [
                        {"$gte": [{"$toInt": "$word_count"}, min]},
                        {"$lte": [{"$toInt": "$word_count"}, max]},
                    ]
                }
            }
        },
        {"$project": {"_id": 0, "title": 1, "word_count": 1}},
        {"$sort": {"word_count": 1}},
    ]
    result = list(collection.aggregate(pipeline))
    return jsonify(result)


@app.route("/articles_with_specific_keyword_count/<int:count>", methods=["GET"])
def articles_with_specific_keyword_count(count):
    pipeline = [
        {"$match": {"$expr": {"$eq": [{"$size": "$keywords"}, count]}}},
        {"$project": {"_id": 0, "title": 1}},
    ]
    result = list(collection.aggregate(pipeline))
    return jsonify(result)


@app.route("/articles_by_specific_date/<date>", methods=["GET"])
def articles_by_specific_date(date):
    date_format = "%Y-%m-%d"
    date = str(datetime.strptime(date, date_format).date())

    pipeline = [
        {
            "$project": {
                "_id": 0,
                "published_time": {
                    "$dateFromString": {"dateString": "$published_time"}
                },
            }
        },
        {
            "$match": {
                "$expr": {
                    "$eq": [
                        {
                            "$dateToString": {
                                "date": "$published_time",
                                "format": date_format,
                            }
                        },
                        date,
                    ]
                }
            }
        },
    ]
    result = list(collection.aggregate(pipeline))
    return jsonify(result)


@app.route("/articles_containing_text/<text>", methods=["GET"])
def articles_containing_text(text):
    collection.create_index([("full_text", TEXT)])
    pipeline = [
        {"$match": {"$text": {"$search": text}}},
        {"$project": {"_id": 0, "title": 1}},
    ]
    result = list(collection.aggregate(pipeline))
    return jsonify(result)


@app.route("/articles_with_more_than/<int:word_count>", methods=["GET"])
def articles_with_more_than(word_count):
    pipeline = [
        {"$match": {"$expr": {"$gte": [{"$toInt": "$word_count"}, word_count]}}},
        {"$project": {"_id": 0, "title": 1, "word_count": {"$toInt": "$word_count"}}},
        {"$sort": {"word_count": 1}},
    ]
    result = list(collection.aggregate(pipeline))
    return jsonify(result)


@app.route("/articles_grouped_by_coverage", methods=["GET"])
def articles_grouped_by_coverage():
    pipeline = [
        {"$unwind": "$classes"},
        {"$match": {"classes.mapping": "coverage"}},
        {"$group": {"_id": "$classes.value", "count": {"$sum": 1}}},
        {"$sort": {"count": 1}},
    ]
    result = list(collection.aggregate(pipeline))
    return jsonify(result)


@app.route("/articles_last_X_hours/<int:hour>", methods=["GET"])
def articles_last_X_hours(hour):
    date_X_hours_ago = datetime.utcnow() - timedelta(hours=hour)
    pipeline = [
        {
            "$match": {
                "$expr": {
                    "$gte": [
                        {"$dateFromString": {"dateString": "$published_time"}},
                        date_X_hours_ago,
                    ]
                }
            }
        },
        {"$project": {"title": 1, "_id": 0}},
    ]
    result = list(collection.aggregate(pipeline))
    return jsonify(result)


@app.route("/articles_by_title_length", methods=["GET"])
def articles_by_title_length():
    pipeline = [
        {"$group": {"_id": {"$strLenCP": "$title"}, "count": {"$sum": 1}}},
        {"$sort": {"_id": 1}},
    ]
    result = list(collection.aggregate(pipeline))
    return jsonify(result)


@app.route("/articles_by_top_keyword_count", methods=["GET"])
def articles_by_top_keyword_count():
    pipeline = [
        {"$group": {"_id": {"$size": "$keywords"}, "count": {"$sum": 1}}},
        {"$sort": {"count": -1}},
        {"$limit": 5},
    ]
    result = list(collection.aggregate(pipeline))
    return jsonify(result)


@app.route("/articles_by_sentiment_count", methods=["GET"])
def articles_by_sentiment_count():
    pipeline = [
        {"$group": {"_id": "$sentiment", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}},
    ]
    result = list(collection.aggregate(pipeline))
    return jsonify(result)


@app.route("/articles_by_sentiment/<sentiment>", methods=["GET"])
def articles_by_sentiment(sentiment):
    pipeline = [
        {"$match": {"sentiment": sentiment}},
        {"$project": {"_id": 0, "title": 1, "polarity": 1}},
        {"$sort": {"polarity": -1 if sentiment == "Positive" else 1}},
        {"$limit": 10},
    ]
    result = list(collection.aggregate(pipeline))
    return jsonify(result)


@app.route("/sentiments_by_month", methods=["GET"])
def sentiments_by_month():
    pipeline = [
        {
            "$group": {
                "_id": {
                    "sentiment": "$sentiment",
                    "year": {
                        "$year": {"$dateFromString": {"dateString": "$published_time"}}
                    },
                    "month": {
                        "$month": {"$dateFromString": {"dateString": "$published_time"}}
                    },
                },
                "count": {"$sum": 1},
            }
        },
        {
            "$project": {
                "sentiment": "$_id.sentiment",
                "year": "$_id.year",
                "month": "$_id.month",
                "count": 1,
                "_id": 0,
            }
        },
        {"$sort": {"year": 1, "month": 1}},
    ]
    result = list(collection.aggregate(pipeline))
    return jsonify(result)


@app.route("/articles_by_entity/<entity>", methods=["GET"])
def articles_by_entity(entity):
    pipeline = [
        {"$unwind": "$entities"},
        {"$match": {"entities.entity": entity}},
        {"$project": {"_id": 0, "title": 1, "entities": 1}},
        {"$limit": 10},
    ]
    result = list(collection.aggregate(pipeline))
    return jsonify(result)


@app.route("/articles_by_entities_count", methods=["GET"])
def articles_by_entities_count():
    pipeline = [
        {"$unwind": "$entities"},
        {"$group": {"_id": "$entities.entity", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}},
        {"$limit": 10},
    ]
    result = list(collection.aggregate(pipeline))
    return jsonify(result)


@app.route("/entities_by_year", methods=["GET"])
def entities_by_year():
    pipeline = [
        {"$unwind": "$entities"},
        {
            "$group": {
                "_id": {
                    "year": {
                        "$year": {"$dateFromString": {"dateString": "$published_time"}}
                    },
                    "entity": "$entities.entity",
                },
                "count": {"$sum": 1},
            }
        },
        {"$sort": {"_id.year": 1, "count": -1}},
        {
            "$group": {
                "_id": "$_id.year",
                "entities": {"$push": {"entity": "$_id.entity", "count": "$count"}},
            }
        },
        {"$project": {"_id": 1, "entities": {"$slice": ["$entities", 5]}}},
    ]
    result = list(collection.aggregate(pipeline))
    return jsonify(result)


@app.route("/articles_grouped_by_entity_and_sentiment", methods=["GET"])
def articles_grouped_by_entity_and_sentiment():
    pipeline = [
        {"$unwind": "$entities"},
        {
            "$group": {"_id": "$entities.entity", "count": {"$sum": 1}},
        },
        {"$sort": {"count": -1}},
        {"$limit" : 5}
    ]
    temp_result = list(collection.aggregate(pipeline))
    entity_ids = [doc["_id"] for doc in temp_result]
    
    articles_pipeline = [
        {"$unwind" : "$entities"},
        {
            "$match": {
                "entities.entity": {"$in": entity_ids}  # Match documents where entity is in entity_ids
            }
        },
        {"$group" : {"_id": {"entity": "$entities.entity", "sentiment": "$sentiment"}, "count": {"$sum": 1}}},]
    result = list(collection.aggregate(articles_pipeline))
    return jsonify(result)

@app.route("/top_entities",methods=["GET"])
def top_entities():
    pipeline = [
        {"$unwind": "$entities"},
        {"$group": {"_id": "$entities.entity", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}},
        {"$limit": 10}
    ]
    result = list(collection.aggregate(pipeline))
    return jsonify(result)

@app.route("/top_entity_by_sentiment",methods=["GET"])
def top_entity_by_sentiment():
    try:
        response = requests.get("http://127.0.0.1:5000/top_entities")
        if response.status_code == 200:
            data = response.json()
            top_entity = data[0]["_id"]
            print(top_entity)
            pipeline = [
                {"$unwind" : "$entities"},
                {"$match" : {"entities.entity": top_entity}},
                {"$group" : {"_id": "$sentiment", "count": {"$sum": 1}}}
            ]
            result = list(collection.aggregate(pipeline))
            return jsonify(result)
        else:
            print(f"Error: Received status code {response.status_code}")
    
    except requests.exceptions.RequestException as e:
        print(f"An error occurred: {e}")
        
@app.route("/most_positive_articles",methods=["GET"])
def most_positive_articles():
    pipeline = [
        {"$sort" : {"polarity" : -1}},
        {"$project" : {"_id" : 0, "title" : 1, "polarity" : 1}},
        {"$limit" : 10}
    ]
    result = list(collection.aggregate(pipeline))
    return jsonify(result)


if __name__ == "__main__":
    app.run(debug=True)
