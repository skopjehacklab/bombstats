# -*- coding: utf-8 -*-

from pyparsing import Word, Literal, Or, Combine, alphas, oneOf

alpha_cap_uni = u"АБВГДЃЕЖЗЅИЈКЛЉМНЊОПРСТЌУФХЦЧЏШ"
alpha_lower_uni = u"абвгдѓежзѕијклљмнњопрстќуфхцчџшáèéѐôѝ"
alpha_uni = alpha_lower_uni + alpha_cap_uni

word = Word(alpha_uni)
latin_word = Word(alphas)
hypen_word = Combine(word + Literal('-') + word)
apos_word1 = Combine(Literal("'") + word)
apos_word2 = Combine(word + Literal("'") + word)

general_word = Or([word, latin_word, hypen_word, apos_word1, apos_word2])

sentence_start = oneOf(list(u'\n' + u'-—"„“”' + alpha_cap_uni))
sentence_end = Or(map(Literal, list(u'.?!…') + \
                  ['...', u'.”', u'”.', u'”.', u'".' ]))

def segmentize(text):
    """Segmentize a given text and yields sentences"""
    parser = (sentence_end + sentence_start).parseWithTabs()

    start = 0
    for token, s, e in parser.scanString(text):
        end = s
        yield text[start:end + len(token[0])]
        start = e - len(token[1])
    yield text[start:]

def tokenize(text):
    """Tokenize a given text for whole words,
    yields `token`, True if a whole word matches
    or `junk`, False if there is a segment that 
    does not matches a whole word"""
    start = 0
    parser = general_word.parseWithTabs()
    for t, s, e in parser.scanString(text):
        if s != 0:
            junk = text[start:s].strip()
            if junk != "":
                yield junk, False
        if t[0]:
            yield t[0], True
        start = e

    junk = text[start:].strip()
    if junk != "":
        yield junk, False
