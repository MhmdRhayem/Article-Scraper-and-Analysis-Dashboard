import pymongo
import json

client = pymongo.MongoClient("mongodb://localhost:27017/")
db = client["almayadeen"]
collection = db["articles"]


with open('./articles/articles_2024_08.json','r',encoding='utf-8') as f:
    data = json.load(f)
    collection.insert_many(data)

print("Data inserted successfully!")