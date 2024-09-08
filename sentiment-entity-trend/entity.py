import stanza
import spacy_stanza

stanza.download('ar')

def get_entities(text):
    nlp = spacy_stanza.load_pipeline("ar")
    doc = nlp(text)
    entities = []
    for ent in doc.ents:
        entities.append({"entity": ent.text, "label": ent.label_})
    return entities
