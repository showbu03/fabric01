#!/usr/bin/env python3
# coding: utf-8
import json
import requests
import sys

database=sys.argv[1]
if len(database)==0:
    sys.exit(1)

r=requests.get("http://localhost:5984/{}/_all_docs".format(database))
rows=json.loads(r.text)['rows']

todelete=[]
for doc in rows:
    if not doc["id"].startswith("_design"):
        todelete.append({"_deleted": True, "_id": doc["id"], "_rev": doc["value"]["rev"]})

r=requests.post("http://localhost:5984/{}/_bulk_docs".format(database), json={"docs": todelete})
print(r.status_code)
