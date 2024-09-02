from transformers import pipeline
from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017/")
db = client["almayadeen"]
collection = db["articles"]

sentiment_analysis = pipeline("sentiment-analysis", model="CAMeL-Lab/bert-base-arabic-camelbert-da-sentiment")


def classify_sentiment(text):
    result = sentiment_analysis(text)[0]
    print(sentiment_analysis(text))
    label = result['label'].lower()
    return label

