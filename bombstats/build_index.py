import json
from os.path import join as path_join

from language import DATAPATH, iter_json, iter_replies, build_index

with open(path_join(DATAPATH, 'index.json'), 'wb') as f:
    jsons = iter_json()
    index = build_index(iter_replies(jsons))
    f.write(json.dumps(index))
