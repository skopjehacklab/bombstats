# -*- coding: utf-8 -*-

import json
from os import walk
from os.path import dirname, abspath
from os.path import join as path_join
from operator import itemgetter

from tokenizer import tokenize
from stopwords import stopwords

item1 = itemgetter(1)

DATAPATH = path_join(dirname(dirname(abspath(__file__))), 'транскрипти')

def iter_json():
    """Traverses transcript files and yields available json files"""
    for _, _, filenames in walk(DATAPATH):
        for filename in filenames:
            filename_lower = filename.lower()
            if filename.lower().endswith('.json') \
                    and filename_lower.startswith('transkript'):
                yield filename

def iter_replies(ijson):
    """Traverses all content and yields
    - filename
    - conversation index
    - reply index
    - reply content
    """
    for filename in ijson:
        with open(path_join(DATAPATH, filename), 'rb') as f:
            content = f.read()
            try:
                data = json.loads(content)
            except ValueError:
                print filename
                raise
            discussions = data[u'разговори']
            for idx, disc in enumerate(discussions):
                for reply_id, reply in enumerate(disc[u'содржина']):
                    yield filename, idx, reply_id, reply

def _tokenize(text):
    """Iterates words, non-stopwords, non-initials"""
    return [word
            for word, not_junk in tokenize(text)
            if not_junk and len(word) > 2 \
                and word.lower() not in stopwords]

def build_index(replies):
    """Builds GIN index with following:
    - key: a word
    - val: triplet of document_id, discussion_id, reply_id
    """
    index = {}

    for filename, disc_id, reply_id, reply in replies:
        for token in _tokenize(reply):

            entry = (filename, disc_id, reply_id)

            if token not in index:
                index[token] = [entry]
            elif entry not in index[token]:
                index[token].append(entry)

    return index
