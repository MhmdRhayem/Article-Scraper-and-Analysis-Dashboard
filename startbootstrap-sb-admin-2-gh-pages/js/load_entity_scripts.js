function include(file) {
 
    let script = document.createElement('script');
    script.src = file;
    script.type = 'text/javascript';
    script.defer = true;
 
    document.getElementsByTagName('head').item(0).appendChild(script);
 
}

path_to_scripts = "../../visualizations/scripts/entity/"
const chartScripts = [
    'top_entities.js',
    'top_entity_by_sentiment.js',
    'entities_by_year.js',
    'entity_trends.js'
];

for (let script of chartScripts){
    script = path_to_scripts + script;
    include(script);
}

