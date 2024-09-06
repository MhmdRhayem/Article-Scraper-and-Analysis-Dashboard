from textblob import TextBlob
from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017/")
db = client["almayadeen"]
collection = db["articles"]


def analyze_sentiment(text):
    blob = TextBlob(arabic_text)
    
    translated_text = blob.translate(to='en')

    polarity = translated_text.sentiment.polarity
    
    if polarity > 0:
        sentiment = "Positive"
    elif polarity < 0:
        sentiment = "Negative"
    else:
        sentiment = "Neutral"
    return sentiment
