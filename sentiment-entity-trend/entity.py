import stanza
import spacy_stanza
from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017/")
db = client["almayadeen"]
collection = db["articles"]

stanza.download('ar')
nlp = stanza.Pipeline('ar')

def get_entities(text):
    doc = nlp(text)
    entities = []
    for ent in doc.ents:
        entities.append({"entity": ent.text, "label": ent.type})
    
    print(f"---------------------------------\nEntities: {entities}\n---------------------------------")
    return entities

count = 0
for doc in collection.find():
    count += 1
    print(f"{count}- Title: {doc.get("title")}")
    entities = doc.get("entities"," ")
    if(entities == " "):
        text = doc.get("full_text", "")
        entities = get_entities(text)
        collection.update_one(
            {"_id": doc["_id"]}, 
            {"$set": {"entities": entities}} 
        )