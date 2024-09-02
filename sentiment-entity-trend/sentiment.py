import nltk
from nltk.sentiment import SentimentIntensityAnalyzer

nltk.download('vader_lexicon')

sia = SentimentIntensityAnalyzer()
text = "I love this product"

def classify_sentiment(text):
    sentiment = sia.polarity_scores(text)
    compound = sentiment['compound']
    
    if compound > 0.05:
        return 'positive'
    elif compound < -0.05:
        return 'negative'
    else:
        return 'neutral'

print(classify_sentiment(text))