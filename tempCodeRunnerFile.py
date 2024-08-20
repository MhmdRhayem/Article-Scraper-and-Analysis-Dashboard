[
        {"$match": {"author": author_name}},
        {"$addFields": {"_id": {"$toString": "$_id"}}},
        {"$project": {"title": 1, "author": 1}},
    ]