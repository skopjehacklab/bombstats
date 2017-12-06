#!/usr/bin/env python
import datetime
import json
import re



class Bomba(dict):
    def __init__(self, datum, reden_broj):
        if isinstance(datum, datetime.datetime):
            self['datum'] = datum.isoformat()
        else:
            self['datum'] = datum
        self['reden_broj'] = reden_broj


class Sogovornik(dict):
    def __init__(self, naziv):
        self['naziv'] = naziv.strip()
        self['inicijali'] = "".join(a.strip()[0].upper() for a in naziv.split() if
                                    a.isalpha())


class Replika(dict):
    def __init__(self, sogovornik, sodrzina):
        self['sogovornik'] = sogovornik
        self['sodrzina'] = sodrzina.strip()


class Razgovor(dict):
    def __init__(self, bomba, reden_broj, naslov, repliki):
        self['bomba'] = bomba
        self['reden_broj'] = reden_broj

        iminja = re.sub(r'\d*\.?\s*Разговор помеѓу', '', naslov).split(' и ')
        iminja = [s.strip().rstrip() for s in iminja]
        self['sogovornici'] = [Sogovornik(naziv) for naziv in iminja]
        self['repliki'] = repliki


def transkript(filename, reden_broj_na_bombata):
    reden_broj_na_razgovor = 1

    fdt = re.search('\d{4}.\d{2}.\d{2}', filename).group()

    datum = datetime.datetime.strptime(fdt, '%Y.%m.%d')
    bomba = Bomba(datum, reden_broj_na_bombata)

    with open(filename, 'r') as f:
        razgovori = []
        for linija in f:
            linija = linija.strip()
            if re.match('.*\s*Разговор\s+помеѓу', linija):
                naslov = linija
                razgovor = Razgovor(bomba, reden_broj_na_razgovor, naslov, [])
                razgovori.append(razgovor)
                reden_broj_na_razgovor += 1
            elif linija != '' and len(razgovori) > 0:
                inicijali, _, sodrzina = linija.partition(":")
                sogovornik = filter(lambda x: x['inicijali'] == inicijali.strip(),
                                    razgovor['sogovornici'])
                try:
                    replika = Replika(next(sogovornik), sodrzina.strip())
                    razgovor['repliki'].append(replika)
                except StopIteration as ex:
                    print("Невалидна линија ... оригинал:")
                    print(linija)
                    print(razgovor['sogovornici'])
                    print('==' * 30)

        return razgovori


def kreiraj_json(reden_broj_na_bombata, filename):
    razgovori = transkript(fajl, reden_broj_na_bombata)
    transkript_dict = {'razgovori': [dict(r) for r in razgovori]}

    print(filename, reden_broj_na_bombata, len(razgovori))

    json_filename = filename.replace(".txt", ".json")
    with open(json_filename, 'w+') as jsonf:
        json.dump(transkript_dict, jsonf)


if __name__ == "__main__":
    import glob
    import os
    import sys

    if len(sys.argv) == 1:
        lista_fajlovi = sorted(glob.glob('transkripti/*.txt'))
        for i, fajl in enumerate(lista_fajlovi, 1):
            kreiraj_json(i, fajl)
    else:
        fajl = sys.argv[1]
        reden_broj_na_bombata = sys.argv[2]
        kreiraj_json(reden_broj_na_bombata, fajl)
