import glob
import json
import os
import requests


hederi = {'content-type': 'application/json'}


def zapisi(pateka, db_url):
    for fajl in glob.glob(os.path.join(pateka, '*.json')):
        with open(fajl, 'r') as jsonf:
            transkript = json.load(jsonf)
            for razgovor in transkript['razgovori']:
                rezultat = requests.post(db_url, data=json.dumps(razgovor),
                                         headers=hederi)
                print("Запишан е нов документ. Статус: {}".format(rezultat))


def izbrisi(db_url):
    site_dokumenti = requests.get("{}/{}".format(db_url, "/_all_docs"))

    for dok in site_dokumenti.json()['rows']:
        if not dok['key'].startswith('_design'):
            url = "{url}/{dok_id}?rev={rev}".format(url=db_url,
                                                    dok_id=dok['id'],
                                                    rev=dok['value']['rev'])
            requests.delete(url, headers=hederi)
            print("Избришан е документот {}".format(dok['id']))


def resetiraj(pateka, db_url):
    izbrisi(db_url)
    zapisi(pateka, db_url)


if __name__ == "__main__":
    import os
    import sys

    if len(sys.argv) < 2:
        print("python deploy.py COUDH_DB_URL [pateka_do_json_fajlovite]")
        exit(-1)

    db_url = sys.argv[1]

    try:
        pateka = sys.argv[2]
    except IndexError as _:
        pateka = 'transkripti'

    resetiraj(db_url, pateka)
