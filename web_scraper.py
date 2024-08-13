from dataclasses import dataclass, field, asdict
from typing import List, Dict, Optional
from bs4 import BeautifulSoup
import os, requests, json

@dataclass
class Article:
    url : str
    post_id : Optional[str] = None
    title : str = ""
    keywords : List[str] = field(default_factory=list)
    description : Optional[str] = None
    thumbnail : Optional[str] = None
    published_date : Optional[str] = None
    last_updated : Optional[str] = None
    author : Optional[str] = None
    full_text : Optional[str] = None

def fetch_data(url):
    response = requests.get(url)
    if response.status_code == 200:
        return response.text
    else:
        raise Exception(f"Failed to fetch data from {url}, status code: {response.status_code}")

