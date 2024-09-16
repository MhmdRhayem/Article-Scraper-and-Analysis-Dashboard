function include(file) {
 
    let script = document.createElement('script');
    script.src = file;
    script.type = 'text/javascript';
    script.defer = true;
 
    document.getElementsByTagName('head').item(0).appendChild(script);
 
}

path_to_scripts = "../../visualizations/scripts/"
const chartScripts = [
    'articles_count.js',
    'top_author.js',
    'trending_keyword.js',
    'max_article_length.js',
    'articles_by_classes.js',
    'articles_by_language.js',
];

for (let script of chartScripts){
    script = path_to_scripts + script;
    include(script);
}

