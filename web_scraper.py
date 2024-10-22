from dataclasses import dataclass, field, asdict
from typing import List, Dict, Optional
from bs4 import BeautifulSoup
import os, requests, json
from datetime import datetime


@dataclass
class Article:
    url: str
    postid: Optional[str] = None
    title: str = ""
    keywords: List[str] = field(default_factory=list)
    thumbnail: Optional[str] = None
    video_duration: Optional[str] = None
    word_count: Optional[int] = None
    lang: Optional[str] = None
    published_time: Optional[str] = None
    last_updated: Optional[str] = None
    description: Optional[str] = None
    author: Optional[str] = None
    classes: List[dict] = field(default_factory=list)
    full_text: Optional[str] = None


def fetch_data(url):
    response = requests.get(url)
    if response.status_code == 200:
        return response.text
    else:
        raise Exception(
            f"Failed to fetch data from {url}, status code: {response.status_code}"
        )


def save_articles(articles_list):
    try:
        if articles_list:
            output_dir = "./articles"
            if not os.path.exists(output_dir):
                os.makedirs(output_dir)
            splitted_article = articles_list[0].published_time.split("-")
            year = splitted_article[0]
            month = splitted_article[1]

            file_name = os.path.join(output_dir, f"articles_{year}_{month}.json")
            with open(file_name, "w", encoding="utf-8") as f:
                json.dump(
                    [asdict(article) for article in articles_list],
                    f,
                    ensure_ascii=False,
                    indent=4,
                )
            print(f"Data saved to {file_name}")
        else:
            print("No articles to save")
    except Exception as e:
        print(f"Failed to save articles: {e}")


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
                article_urls = [loc.text for loc in soup.find_all("loc")]
                return article_urls
            return []
        except Exception as e:
            print(f"Failed to parse article urls: {e}")
            return []


@dataclass
class ArticleScraper:

    def scrape_article(self, article_url):
        try:
            xml_content = fetch_data(article_url)
            soup = BeautifulSoup(xml_content, "lxml")
            script = soup.find("script", {"type": "text/tawsiyat"})
            metadata = json.loads(script.string) if script else {}

            full_text = ""
            for p in soup.find_all("p"):
                full_text += p.text + "\n"
            article = Article(
                url=article_url,
                postid=metadata.get("postid", ""),
                title=metadata.get("title", ""),
                keywords=metadata.get("keywords", []).split(","),
                thumbnail=metadata.get("thumbnail", ""),
                video_duration=metadata.get("video_duration", ""),
                word_count=metadata.get("word_count", ""),
                lang=metadata.get("lang", ""),
                published_time=metadata.get("published_time", ""),
                last_updated=metadata.get("last_updated", ""),
                description=metadata.get("description", ""),
                author=metadata.get("author", ""),
                classes=metadata.get("classes", []),
                full_text=full_text,
            )
            return article
        except Exception as e:
            print(f"Failed to scrape article {article_url}: {e}")
            return None


def main():
    max_articles = 100000
    article_nb = 1
    
    folder_path = "./articles"
    scraped_months = os.listdir(folder_path)

    parser = SitemapParser()
    monthly_sitemaps = parser.get_monthly_sitemap_urls()

    for sitemap_url in monthly_sitemaps:
        
        current_year = str(datetime.now().year)
        current_month = str(datetime.now().month).zfill(2)
        
        year = sitemap_url.split("-")[-2]
        month = sitemap_url.split("-")[-1].split(".")[0]
        if (len(month) == 1):
            month = "0" + month
        article_name = f"articles_{year}_{month}.json"
        
        print(article_name)
        
        if (article_name in scraped_months) and not (year == current_year and month == current_month):
            print(f"Skipping {sitemap_url}")
            continue
        
        if article_nb > max_articles:
            break
        print(f"Parsing {sitemap_url}")
        article_urls = parser.get_article_urls(sitemap_url)
        print(f"Found {len(article_urls)} articles")
        articles = []

        scraper = ArticleScraper()
        for url in article_urls:
            if article_nb > max_articles:
                break
            article = scraper.scrape_article(url)
            if article:
                print(f"Scraping article {article_nb} {url}")
                article_nb += 1
                articles.append(article)
        save_articles(articles)


main()
