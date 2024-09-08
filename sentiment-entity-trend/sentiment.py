from textblob import TextBlob
from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017/")
db = client["almayadeen"]
collection = db["articles"]


def analyze_sentiment(text):
    blob = TextBlob(text)

    polarity = blob.sentiment.polarity
    
    if polarity > 0:
        sentiment = "Positive"
    elif polarity < 0:
        sentiment = "Negative"
    else:
        sentiment = "Neutral"
    return (sentiment, polarity)

for doc in collection.find():
    text = doc.get("full_text", "")
    overall_sentiment, polarity = analyze_sentiment(text)
    print(f"Title: {doc.get("title")} : {overall_sentiment}")
    
    collection.update_one(
        {"_id": doc["_id"]}, 
        {"$set": {"sentiment": overall_sentiment, "polarity": polarity}} 
    )


