import glob
import json
import requests
from parser import креирај_и_запиши_џејсон


def ресетирај_ги_документите(db_url):
    резултат = requests.get("{}/{}".format(db_url, "/_all_docs"))

    for док in резултат.json()['rows']:
        if not док['key'].startswith('_design'):
            url = "{url}/{doc_id}?rev={rev}".format(url=db_url,
                                                    doc_id=док['id'],
                                                    rev=док['value']['rev'])
            requests.delete(url)
            print("Избришан е документот {}".format(док['id']))

    хедери = {'content-type': 'application/json'}
    for датотека in glob.glob('транскрипти/*.json'):
        with open(датотека, 'r') as џејсон:
            транскрипт = json.load(џејсон)
            for разговор in транскрипт['разговори']:
                резултат = requests.post(db_url, data=json.dumps(разговор),
                                         headers=хедери)
                print("Запишан е нов документ. Статус: {}".format(резултат))


if __name__ == "__main__":
    import os
    import sys

    if len(sys.argv) != 2:
        print("python deploy.py COUDH_DB_URL")
        exit(-1)

    db_url = sys.argv[1]
    ресетирај_ги_документите(db_url)
