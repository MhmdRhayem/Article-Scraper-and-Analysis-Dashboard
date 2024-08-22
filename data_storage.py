import pymongo
import json
import os

client = pymongo.MongoClient("mongodb://localhost:27017/")
db = client["almayadeen"]
collection = db["articles"]

folder_path = "./articles"
file_names = os.listdir(folder_path)
print(file_names)

for file in file_names:
    with open(f"{folder_path}/{file}", "r", encoding="utf-8") as f:
        data = json.load(f)
        collection.insert_many(data)

print("Data inserted successfully!")
