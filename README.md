# Article Scraper

## Overview

ArticleScraper is a Python project designed to scrape articles from a website using sitemap URLs, extract metadata, and save the articles in JSON format. The project leverages the `requests` library for making HTTP requests, `BeautifulSoup` for parsing HTML/XML, and Python's `dataclasses` for structured data management.

## Features

- **Fetch Sitemap URLs:** Extracts monthly sitemap URLs from a primary sitemap index.
- **Scrape Articles:** Downloads and parses articles, extracting metadata like title, author, keywords, and full text.
- **Save to JSON:** Saves scraped articles into JSON files, organized by the year and month of publication.

## Prerequisites

- Python 3.7 or later
- Libraries: Install the required libraries using the following command:

  ```bash
  pip install requests beautifulsoup4 lxml
  ```

## Usage 
1. Clone the repository 
``` bash
git clone url
```
2. Run the scraper
``` bash 
python web_scraper.py
```

## Output 
The articles will be saved in the `./articles` directory, organized by year and month.

## Code Structure 
- `Article`: A data class representing an article with fields like url, post_id, title, keywords, etc.
- `fetch_data(url)`: A function to fetch data from a URL.
- `save_articles(articles_list)`: A function to save a list of articles to a JSON file.
- `SitemapParser`: A class to parse the main sitemap and retrieve monthly sitemap URLs.
- `ArticleScraper`: A class to scrape and parse individual articles from their URLs.
- `main()`: The main function to control the flow of the program.