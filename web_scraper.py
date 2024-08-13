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

class SitemapParser: 
    def __init__(self, index_url="https://www.almayadeen.net/sitemaps/all.xml"):
        self.index_url = index_url

    def get_monthly_sitemap_urls(self):
        try:
            xml_content = fetch_data(self.index_url)
            if xml_content:
                soup = BeautifulSoup(xml_content, "lxml")
                sitemaps = soup.find_all("loc")
                sitemap_urls = [sitemap.string for sitemap in sitemaps]
                return sitemap_urls
            return []
        except Exception as e:
            print(f"Failed to parse sitemaps: {e}")
            return []

    def get_article_urls(self, sitemap_url):
        try:
            xml_content = fetch_data(sitemap_url)
            if xml_content:
                soup = BeautifulSoup(xml_content, "lxml")
                article_urls = [loc.text for loc in soup.find_all('loc')]
                return article_urls
            return []
        except Exception as e:
            print(f"Failed to parse article urls: {e}")
            return []


@dataclass
class ArticleScraper:

    def scrape_article(self,article_url):
        try:
            xml_content = fetch_data(article_url)
            soup = BeautifulSoup(xml_content, "lxml")
            script = soup.find("script",{"type" : "text/tawsiyat"})
            metadata = json.loads(script.string) if script else {}

            full_text = ""
            for p in soup.find_all("p"):
                full_text += p.text + "\n"
            article = Article(
                url = article_url,
                post_id = metadata.get('postid',''),
                title = metadata.get('title',''),
                keywords =metadata.get('keywords',[]),
                thumbnail = metadata.get('thumbnail',''),
                published_date = metadata.get('published_time',''),
                last_updated = metadata.get('last_updated',''),
                author = metadata.get('author',''),
                description= metadata.get('description',''),
                full_text = full_text
            )
            return article
        except Exception as e:
            print(f"Failed to scrape article {article_url}: {e}")
            return None
