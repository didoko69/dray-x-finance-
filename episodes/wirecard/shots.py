# Dray x finance — "Wirecard Explained: The €1.9 Billion That Never Existed"
# Sources: see sources.md in this folder.
def A(k, x, y=1000, s=1, p='stand', f=0, e=None, mv=0, **kw):
    d = dict(k=k, x=x, y=y, s=s, p=p, f=f, mv=mv); d.update(kw)
    if e: d['e'] = e
    return d
SU = lambda x, y=1000, s=1, p='stand', f=0, e=None, v=0, **k: A('suit', x, y, s, p, f, e, v=v, **k)
WK = lambda x, y=1000, s=1, p='stand', f=0, e=None, v=0, **k: A('worker', x, y, s, p, f, e, v=v, **k)
PX = lambda x, y=1000, s=1, p='stand', f=0, e=None, v=0, **k: A('pax', x, y, s, p, f, e, v=v, **k)
BRAUN = lambda x, y=1000, s=1, p='stand', f=0, e='det', **k: SU(x, y, s, p, f, e, v=3, **k)     # glasses
MARS = lambda x, y=1000, s=1, p='stand', f=0, e='soft', **k: SU(x, y, s, p, f, e, v=0, **k)     # black hair
DAN = lambda x, y=1000, s=1, p='stand', f=0, e='det', **k: WK(x, y, s, p, f, e, v=0, **k)       # FT reporter
def fc(a, z=2.3, z1=None, shake=0, dx=0):
    return dict(cam=(a['x'] + dx, a['y'] - 210 * a['s'] + 40, z, z1 or z * 1.08, 0, 0, shake), actors=[a])
S = []
def V(text, env, light='day', cam=(960, 540, 1, 1.08, 0, 0), actors=(), fx=(), au=None, voice='nar', card=None, gap=.3, fc_=None, cuts=None, **kw):
    if fc_: cam = fc_['cam']; actors = list(fc_['actors']) + list(actors)
    d = dict(text=text, env='card' if card else env, light='' if card else light, cam=list(cam if not card else (960, 540, 1, 1, 0, 0)), actors=list(actors), fx=list(fx), card=card, au=au or {'mystery': .5, 'tension': .3}, gap=gap, voice=voice)
    if cuts: d['cuts'] = cuts
    d.update(kw); S.append(d)
def CUT(env=None, light='day', cam=(960, 540, 1, 1.08, 0, 0), actors=(), fx=(), card=None, fc_=None, **kw):
    if fc_: cam = fc_['cam']; actors = list(fc_['actors']) + list(actors)
    d = dict(env='card' if card else env, light='' if card else light, cam=list(cam if not card else (960, 540, 1, 1, 0, 0)), actors=list(actors), fx=list(fx), card=card); d.update(kw); return d
def CARD(c, dur=2.2, au=None, **kw):
    d = dict(text=None, dur=dur, env='card', card=c, cam=[960, 540, 1, 1, 0, 0], actors=[], fx=[], light='', au=au or {'hit': .8, 'drop': 1}, gap=0); d.update(kw); S.append(d)
C = lambda **k: k
CH = lambda n, a: CARD(C(t='chapter', n=n, a=a), 2.4, {'hit': .9, 'drop': 1, 'riser': .5})
BOARD = [SU(500, 1000, .95, 'sit', 0, 'det', v=1), SU(1420, 1000, .95, 'sit', 1, 'soft', v=2)]

# ================= COLD OPEN =================
V("June the eighteenth, 2020. Munich, Germany.", 'skyline', 'dim', (960, 700, 1.0, 1.15, 0, -60), au={'mystery': .7, 'tension': .5, 'cityamb': .4})
V("One of the most celebrated tech companies in Europe is about to publish its annual results.", 'office', 'day', (960, 600, 1.05, 1.2, 0, 0), [BRAUN(960, 1000, 1.0, 'stand', 0, 'det')], au={'mystery': .5, 'tension': .4})
V("Its auditor has one last question. Where is the money?", 'desk', 'day', (700, 540, 1.1, 1.35, 0, 0), au={'tension': .7, 'tick': .6})
V("One point nine billion euros. Cash that is supposed to be sitting in two banks in the Philippines.", 'card', card=C(t='bignum', v=1.9e9, cur='€', label='CASH THAT CAN\'T BE FOUND', sub='Supposedly held in trustee accounts in the Philippines'), au={'tension': .8, 'hit': .7})
V("The banks reply with four words that will destroy the company.", 'vault', 'dim', (960, 600, 1.0, 1.2, 0, 0), au={'tension': .9, 'silence': .4})
V("The documents are spurious.", 'card', card=C(t='quote', q='The documents are spurious.', who='— Philippine bank response, June 2020'), au={'tension': 1, 'hit': 1}, gap=.6)
V("Within a week, a company once worth more than Deutsche Bank is bankrupt.", 'card', card=C(t='chart', title='WIRECARD SHARES, JUNE 2020 (JUNE 17 = 100)', pts=[['JUNE 17', 100], ['JUNE 18', 40], ['JUNE 25', 3]], color='down', fmt='raw', unit='', labels=True, note='About −97% in one week'), au={'tension': 1, 'hit': .8, 'drop_after': 1})
V("This is the story of Wirecard. The fintech star that fooled investors, auditors and an entire country's regulators for years.", 'wallst', 'day', (960, 560, 1.15, 1.0, 0, 0), au={'mystery': .8, 'tension': .5}, gap=.8)
V("And the man at the center of it, who vanished the moment it fell apart.", 'skyline', 'night', (960, 800, 1.3, 1.5, 0, 0), [MARS(960, 1080, 1.4, 'stand', 1, 'soft')], au={'mystery': 1, 'tension': .7, 'drop_after': 1}, gap=1.0)
CARD(C(t='title', a='WIRECARD'), 2.0, {'hit': 1, 'drop': 1})

# ================= CHAPTER 1 — THE RISE =================
CH(1, 'THE RISE')
V("Wirecard was founded in 1999 in Aschheim, a small town just outside Munich.", 'office', 'day', (960, 560, 1.0, 1.12, 0, 0), [WK(700, 1000, .95, 'stand', 0, 'det', v=1), WK(1200, 1000, .95, 'point', 1, 'soft', v=2)], au={'warm': .6, 'mystery': .3})
V("Its business was simple. It processed online card payments for websites that banks didn't want to touch.", 'card', card=C(t='flow', title='HOW WIRECARD MADE MONEY', nodes=['Customer pays online', 'Wirecard processes', 'Merchant gets paid', 'Wirecard takes a fee']), au={'warm': .6, 'pops': 1})
V("Mostly online gambling, and adult websites. Risky, but very profitable.", 'card', card=C(t='facts', title='EARLY CLIENTS', rows=[['High risk', 'Online gambling'], ['High risk', 'Adult websites'], ['High fees', 'Banks stayed away']]), au={'warm': .5, 'pops': 1})
V("In 2002, the young company nearly collapsed. A new chief executive took over.", 'boardroom', 'dim', (960, 520, 1.0, 1.15, 0, 0), BOARD, au={'tension': .4, 'mystery': .5})
V("His name was Markus Braun. An Austrian former consultant with a doctorate, and big ambitions.", 'office', 'day', fc_=fc(BRAUN(960, 1000, 1.0, 'stand', 0, 'det'), 2.2), hl='MARKUS BRAUN · CEO', au={'mystery': .6})
V("Two years earlier, a twenty-year-old Austrian named Jan Marsalek had joined the company. He would later become its chief operating officer.", 'office', 'day', fc_=fc(MARS(960, 1000, 1.0, 'stand', 1, 'soft'), 2.2), hl='JAN MARSALEK · COO', au={'mystery': .8})
V("In 2005, Wirecard got onto the Frankfurt Stock Exchange through a reverse merger with an already-listed company.", 'wallst', 'day', (960, 600, 1.0, 1.15, 0, 0), au={'warm': .6, 'cityamb': .3})
V("That same year it bought a small bank, which gave it something very valuable: a full German banking licence.", 'bankext', 'day', (960, 560, 1.0, 1.15, 0, 0), au={'warm': .6})
V("Then came the growth. Between 2007 and 2012, revenue went from around 150 million euros to more than 400 million.", 'card', card=C(t='chart', title='WIRECARD REVENUE (€)', pts=[['2004', 4e7], ['2007', 1.5e8], ['2012', 4e8], ['2017', 1e9]], color='up', cur='€', note='2017: over €1 billion for the first time'), au={'warm': .7, 'pops': .6})
V("Much of it came from Asia and the Middle East, through a long list of acquisitions and partners.", 'card', card=C(t='flow', title='EXPANSION', nodes=['Munich HQ', 'Singapore', 'Philippines', 'Dubai'], note='Growth through partners abroad'), au={'warm': .6, 'pops': 1})
V("And in 2017, Wirecard crossed one billion euros in annual revenue for the first time.", 'tradefloor', 'day', (960, 500, 1.0, 1.12, 0, 0), fx=['greentick'], au={'warm': .7, 'cityamb': .4})
V("Investors loved it. Germany had finally found its own tech champion, a company that could compete with Silicon Valley.", 'wallst', 'day', (960, 700, 1.1, 1.0, 0, 0), [SU(600 + i * 180, 1000, .85, 'stand', i % 2, 'soft', v=i) for i in range(5)], fx=['flashbulbs'], au={'warm': .8, 'crowd': .3})
V("On the twenty-fourth of September, 2018, Wirecard joined the DAX, Germany's top stock index.", 'card', card=C(t='headline', paper='THE DAILY LEDGER', date='SEPTEMBER 24, 2018', h='WIRECARD JOINS THE DAX', sub='The payments company replaces Commerzbank'), au={'warm': .8, 'hit': .5})
V("It took the place of Commerzbank, one of the country's oldest banks.", 'bankext', 'dim', (960, 560, 1.2, 1.0, 0, 0), au={'warm': .4, 'mystery': .4})
V("At its peak, Wirecard was valued at more than twenty-four billion euros. More than Deutsche Bank itself.", 'card', card=C(t='facts', title='SEPTEMBER 2018', rows=[['€24B+', 'Wirecard peak value'], ['Less', 'Deutsche Bank'], ['DAX 30', 'Germany\'s top index']]), au={'warm': .7, 'hit': .6})
V("Braun was now a billionaire on paper. But some people were starting to ask uncomfortable questions.", 'office', 'night', fc_=fc(BRAUN(960, 1000, 1.0, 'stand', 0, 'soft'), 2.4, 2.7), au={'mystery': .9, 'tension': .5, 'drop_after': 1}, gap=.9)

# ================= CHAPTER 2 — THE WARNINGS =================
CH(2, 'THE WARNINGS')
V("The doubts were not new. As early as 2008, a group of shareholders published a dossier alleging problems in Wirecard's accounts.", 'desk', 'dim', (960, 540, 1.0, 1.15, 0, 0), au={'mystery': .7, 'paper': .6})
V("The auditor, EY, cleared the company. And the dossier's authors were later convicted of market manipulation.", 'court', 'day', (960, 560, 1.0, 1.15, 0, 0), au={'mystery': .6})
V("In 2016, an anonymous research group called Zatarra accused Wirecard of fraud and money laundering. The share price dropped, then recovered.", 'card', card=C(t='headline', paper='MARKET WATCH DAILY', date='FEBRUARY 2016', h='SHORT SELLER REPORT HITS WIRECARD', sub='Company rejects the allegations'), au={'mystery': .7, 'tension': .4})
V("Every time, Wirecard said the same thing. The critics were short sellers, betting against the stock and trying to profit from a crash.", 'office', 'day', fc_=fc(BRAUN(960, 1000, 1.0, 'point', 0, 'det'), 2.3), au={'mystery': .6, 'tension': .4})
V("And one journalist kept digging anyway. Dan McCrum of the Financial Times.", 'office', 'night', fc_=fc(DAN(900, 1000, 1.0, 'stand', 0, 'det'), 2.2), hl='DAN McCRUM · FINANCIAL TIMES', au={'mystery': .8, 'tension': .4})
V("At the heart of his questions was a strange part of the business: third-party acquirers.", 'card', card=C(t='flow', title='THIRD-PARTY ACQUIRERS', nodes=['Merchant', 'Partner company abroad', 'Wirecard books revenue', 'Profit reported in Munich'], endRed=1), au={'tension': .6, 'pops': 1})
V("These were partner firms that processed payments for Wirecard in places where it had no licence of its own. Wirecard reported their business as its own revenue.", 'card', card=C(t='facts', title='THE PARTNERS', rows=[['Dubai', 'Partner company'], ['Singapore', 'Partner company'], ['Philippines', 'Partner company']]), au={'tension': .6, 'pops': 1})
V("According to the FT, these partners made up around half of Wirecard's reported revenue, and a large part of its profits.", 'card', card=C(t='compare', title='SHARE OF WIRECARD REVENUE', a=['PARTNERS', 50], b=['EVERYTHING ELSE', 50], fmt='raw', unit='%', note='FT estimate, 2019'), au={'tension': .7, 'hit': .5})
V("When reporters went looking for some of these partners, the addresses led to places like a family home in the Philippines.", 'card', card=C(t='quote', q='Some partner addresses led to a family home.', who='— Financial Times investigation, 2019'), au={'tension': .8, 'mystery': .7}, gap=.6)

# ================= CHAPTER 3 — SHOOT THE MESSENGER =================
CH(3, 'SHOOT THE MESSENGER')
V("In January 2019, the FT published leaked documents from Wirecard's Singapore office.", 'card', card=C(t='headline', paper='THE DAILY LEDGER', date='JANUARY 30, 2019', h='WHISTLEBLOWER ALLEGES FORGED CONTRACTS AT WIRECARD', sub='Report cites internal documents from Singapore'), au={'tension': .7, 'hit': .6})
V("They suggested backdated contracts and forged documents. Within days, the share price fell by almost forty percent.", 'card', card=C(t='chart', title='WIRECARD SHARES, EARLY 2019 (BEFORE = 100)', pts=[['BEFORE THE FT REPORT', 100], ['DAYS LATER', 60]], color='down', fmt='raw', note='Almost −40% within days'), au={'tension': .8, 'hit': .5})
V("Then something extraordinary happened. Germany's financial regulator, BaFin, didn't turn on Wirecard.", 'court', 'dim', (960, 520, 1.0, 1.2, 0, 0), au={'tension': .8, 'mystery': .6})
V("It turned on the journalists.", 'office', 'red', fc_=fc(DAN(900, 1000, 1.0, 'stand', 0, 'fear'), 2.6, 2.9), slam='THE JOURNALISTS', au={'tension': 1, 'hit': 1})
V("BaFin banned short selling of Wirecard shares for two months.", 'card', card=C(t='facts', title='BaFin, FEBRUARY 2019', rows=[['2 months', 'Short selling banned'], ['1 company', 'Wirecard protected'], ['2 reporters', 'Criminal complaint filed']]), au={'tension': .8, 'pops': 1})
V("And it filed a criminal complaint against Dan McCrum and a colleague for market manipulation. Those complaints were later dropped.", 'court', 'day', (960, 600, 1.1, 1.25, 0, 0), [DAN(760, 1000, .95, 'stand', 0, 'sad'), WK(1160, 1000, .95, 'stand', 1, 'sad', v=1)], au={'tension': .7})
V("To many investors, the message was clear. Wirecard was the victim. The stock recovered.", 'tradefloor', 'day', (960, 520, 1.0, 1.12, 0, 0), fx=['greentick'], au={'warm': .5, 'mystery': .4})
V("In April 2019, Japanese giant SoftBank agreed to invest nine hundred million euros.", 'card', card=C(t='bignum', v=9e8, cur='€', label='SOFTBANK INVESTMENT · APRIL 2019', sub='Convertible bond'), au={'warm': .7, 'hit': .5})
V("But in October 2019, the FT came back with more. New documents suggesting that hundreds of millions of euros in payments could not have taken place.", 'desk', 'night', (700, 540, 1.1, 1.3, 0, 0), au={'tension': .8, 'paper': .6})
V("This time, the pressure worked. Wirecard hired KPMG to carry out a special independent audit.", 'boardroom', 'day', (960, 520, 1.0, 1.12, 0, 0), BOARD, au={'tension': .6})
V("At the end of April 2020, KPMG reported back. It found no definitive proof of fraud.", 'card', card=C(t='headline', paper='THE DAILY LEDGER', date='APRIL 28, 2020', h='KPMG SPECIAL AUDIT: NO PROOF OF FRAUD', sub='But key revenues could not be verified'), au={'tension': .6})
V("But it also couldn't confirm most of the partner revenue, or around one billion euros of cash in trustee accounts.", 'card', card=C(t='bignum', v=1e9, cur='€', label='CASH KPMG COULD NOT VERIFY', sub='April 2020'), au={'tension': .9, 'hit': .7, 'drop_after': 1}, gap=.9)

# ================= CHAPTER 4 — THE MISSING BILLIONS =================
CH(4, 'THE MISSING BILLIONS')
V("On the fifth of June, 2020, police raided Wirecard's headquarters.", 'office', 'red', (960, 560, 1.1, 1.25, 0, 0, 3), [SU(700, 1000, .95, 'stand', 0, 'fear', v=1), WK(1200, 1000, .95, 'stand', 1, 'fear', v=2)], fx=['flashbulbs'], au={'tension': 1, 'siren': .5})
V("Then came the eighteenth of June. EY refused to sign off on the 2019 accounts.", 'desk', 'dim', (700, 540, 1.2, 1.4, 0, 0), au={'tension': 1, 'tick': .8})
V("It could not confirm one point nine billion euros, money that was supposed to sit in trustee accounts at two Philippine banks. Roughly a quarter of Wirecard's entire balance sheet.", 'card', card=C(t='facts', title='JUNE 18, 2020', rows=[['€1.9 billion', 'Cannot be confirmed'], ['2 banks', 'In the Philippines'], ['~25%', 'Of the balance sheet']]), au={'tension': 1, 'hit': .7})
V("That day, the share price fell sixty percent.", 'tradefloor', 'red', (960, 520, 1.0, 1.15, 0, 0, 3), fx=['redtick'], au={'tension': 1, 'alarm': .5})
V("The next morning, Markus Braun resigned.", 'card', card=C(t='headline', paper='THE DAILY LEDGER', date='JUNE 19, 2020', h='WIRECARD CEO MARKUS BRAUN RESIGNS', sub='Company still cannot find €1.9 billion'), au={'tension': .9, 'hit': .8})
V("On the twenty-second of June, Wirecard admitted what many had feared. The money most likely did not exist at all.", 'vault', 'red', (300, 460, 1.4, 1.8, 0, 0), au={'tension': 1, 'hit': 1}, slam='IT NEVER EXISTED')
V("The same day, Braun was arrested. He was released on five million euros bail.", 'court', 'dim', fc_=fc(BRAUN(960, 1000, 1.0, 'stand', 0, 'sad'), 2.2), au={'tension': .8})
V("On the twenty-fifth of June, 2020, Wirecard filed for insolvency. It was the first company in the history of the DAX to do so.", 'card', card=C(t='headline', paper='THE DAILY LEDGER', date='JUNE 25, 2020', h='WIRECARD FILES FOR INSOLVENCY', sub='First DAX company ever to go bust'), au={'tension': 1, 'hit': 1})
V("It owed creditors almost four billion euros. Its shares lost around ninety-nine percent of their value.", 'card', card=C(t='facts', title='THE DAMAGE', rows=[['~€4 billion', 'Owed to creditors'], ['−99%', 'Share price'], ['€1.9 billion', 'Cash that never existed']]), au={'tension': .9, 'pops': 1})
V("Investors, including ordinary savers who had trusted Germany's tech champion were left with almost nothing.", 'bankext', 'dim', (960, 700, 1.0, 1.15, 0, 0), fx=['crowdq'], au={'sad': .8, 'tension': .5, 'drop_after': 1}, gap=.9)

# ================= CHAPTER 5 — THE ESCAPE =================
CH(5, 'THE ESCAPE')
V("But one man was missing. Jan Marsalek, the chief operating officer who ran Wirecard's business in Asia.", 'office', 'night', fc_=fc(MARS(960, 1000, 1.0, 'stand', 1, 'soft'), 2.3), au={'mystery': 1, 'tension': .6})
V("He had been suspended on the day the money disappeared. Then he vanished.", 'skyline', 'night', (960, 900, 1.4, 1.2, 0, 0), au={'mystery': 1, 'wind': .4})
V("At first, records suggested he had travelled to the Philippines, and then on to China. Investigators later concluded those records were fake.", 'card', card=C(t='flow', title='THE FALSE TRAIL', nodes=['Munich', 'Philippines?', 'China?', 'Fake records'], endRed=1), au={'mystery': 1, 'pops': 1})
V("In reality, according to investigators, he left on a private jet to Belarus, and from there went on to Russia.", 'card', card=C(t='flow', title='THE REAL ROUTE (PER INVESTIGATORS)', nodes=['Austria', 'Private jet', 'Belarus', 'Russia'], endRed=1), au={'mystery': 1, 'tension': .7, 'pops': 1})
V("He has been on international wanted lists ever since.", 'card', card=C(t='quote', q='Wanted. Whereabouts believed to be Russia.', who='— Interpol / European arrest warrants'), au={'mystery': .9, 'tension': .7})
V("And the story got even stranger. In March 2025, a court in London convicted three Bulgarians of spying for Russia.", 'court', 'day', (960, 560, 1.0, 1.15, 0, 0), [PX(600 + i * 300, 1000, .9, 'stand', i % 2, 'sad', v=i + 2) for i in range(3)], au={'mystery': .9, 'tension': .6})
V("Prosecutors said the spy ring had been directed by Jan Marsalek, acting as a go-between for Russian intelligence.", 'skyline', 'red', fc_=fc(MARS(960, 1000, 1.0, 'stand', 1, 'det'), 2.6, 2.9), slam='MARSALEK', au={'tension': 1, 'hit': 1})
V("The former manager of a German payments company, now described as a key figure in a Russian espionage operation. He has never been arrested.", 'skyline', 'night', (960, 700, 1.2, 1.0, 0, 0), au={'mystery': 1, 'drop_after': 1}, gap=.9)

# ================= CHAPTER 6 — THE RECKONING =================
CH(6, 'THE RECKONING')
V("In Germany, the fallout reached the very top. The head of BaFin left his post, and the regulator was given new powers to investigate companies' accounts directly.", 'bankext', 'day', (960, 560, 1.0, 1.12, 0, 0), au={'mystery': .5, 'tension': .4})
V("A parliamentary inquiry produced a report of six hundred and seventy-five pages. EY faced lawsuits from shareholders, and has said it acted professionally.", 'card', card=C(t='facts', title='THE FALLOUT', rows=[['BaFin', 'Chief left, new powers'], ['675 pages', 'Parliamentary report'], ['EY', 'Shareholder lawsuits']]), au={'mystery': .5, 'pops': 1})
V("In December 2022, Markus Braun went on trial in Munich, alongside two former colleagues.", 'court', 'day', (960, 600, 1.0, 1.15, 0, 0), [BRAUN(700, 1000, .95, 'stand', 0, 'det'), SU(960, 1000, .95, 'stand', 0, 'sad', v=1), SU(1220, 1000, .95, 'stand', 1, 'sad', v=2)], au={'tension': .6})
V("Prosecutors say the partner business in Dubai, Singapore and the Philippines simply did not exist, and that the results from 2015 to 2018 were inflated.", 'card', card=C(t='quote', q='The partner business did not actually exist.', who='— Munich prosecutors (allegation)'), au={'tension': .7})
V("Braun denies wrongdoing. He says he was the victim, and that others, including Marsalek, stole the money behind his back.", 'court', 'dim', fc_=fc(BRAUN(960, 1000, 1.0, 'stand', 0, 'det'), 2.3), au={'tension': .6, 'mystery': .5})
V("One of his co-defendants, Oliver Bellenhaus, who ran Wirecard's Dubai unit, chose to cooperate with prosecutors.", 'court', 'day', fc_=fc(SU(960, 1000, 1.0, 'stand', 1, 'sad', v=1), 2.2), hl='OLIVER BELLENHAUS · WITNESS', au={'tension': .6})
V("In 2024, a civil court ordered Braun and two former executives to pay one hundred and forty million euros in damages.", 'card', card=C(t='bignum', v=1.4e8, cur='€', label='CIVIL DAMAGES · 2024', sub='Braun and two former executives'), au={'tension': .7, 'hit': .5})
V("In September 2026, the criminal judge called Braun's victim theory speculation, saying there were no signs the partner business had ever existed.", 'court', 'red', (960, 400, 1.2, 1.4, 0, 0), au={'tension': .9, 'hit': .6})
V("After almost four years and more than two hundred and ninety days in court, the trial is now in its final phase. At the time of this video, a verdict was expected around the end of 2026.", 'card', card=C(t='timeline', title='THE TRIAL', items=[['DEC 2022', 'Trial opens in Munich'], ['2024', 'Civil damages €140M'], ['SEP 2026', 'Judge rejects victim theory'], ['NOV 2026', '291 hearing days'], ['2026–27', 'Verdict expected']], hi=4), au={'tension': .7})
V("Braun has been in custody since July 2020. If convicted, he could face up to fifteen years in prison.", 'prison', 'dim', (960, 560, 1.0, 1.12, 0, 0), [BRAUN(450, 820, 1.0, 'sit', 0, 'sad')], au={'sad': .8, 'tension': .4})

# ================= LESSONS / OUTRO =================
V("So how did a company hide a hole of almost two billion euros for so long?", 'office', 'night', (960, 600, 1.0, 1.15, 0, 0), au={'mystery': .8})
V("Lesson one. When a company's profits come from partners nobody can visit, ask why.", 'card', card=C(t='facts', title='3 LESSONS FROM WIRECARD', rows=[['1', 'Profits nobody can check = red flag']]), au={'warm': .6, 'pops': 1})
V("Lesson two. Attacking critics is not the same as answering them.", 'card', card=C(t='facts', title='3 LESSONS FROM WIRECARD', rows=[['1', 'Profits nobody can check = red flag'], ['2', 'Attacking critics ≠ answering them']]), au={'warm': .6, 'pops': 1})
V("And lesson three. A famous name, an index listing and a big-four auditor are not proof that the money is real.", 'card', card=C(t='facts', title='3 LESSONS FROM WIRECARD', rows=[['1', 'Profits nobody can check = red flag'], ['2', 'Attacking critics ≠ answering them'], ['3', 'Big names are not proof']]), au={'warm': .6, 'pops': 1})
V("Wirecard told the world it had one point nine billion euros in the bank. In the end, the only thing that was real was the damage.", 'vault', 'dim', (300, 460, 1.0, 1.5, 0, 0), au={'mystery': .9, 'sad': .5}, gap=.8)
V("If you enjoyed this story, subscribe to Dray x finance for more stories about money, power and the people who lose it. And tell me in the comments: who should have caught this first?", 'skyline', 'night', (960, 700, 1.0, 1.1, 0, 0), au={'warm': .6, 'endtail5': 1}, gap=1.2)
CARD(C(t='sources', lines=['Financial Times reporting (Dan McCrum), 2015–2020', 'Reuters / AFP timelines of the Wirecard collapse', 'Munich Regional Court trial reporting (beck-aktuell, Nov 2026)', 'Crown Prosecution Service, R v Roussev and others (2025)', 'Quartr: The rise and fall of Wirecard']), 4.0, {'warm': .4})
CARD(C(t='blackend'), 1.5, {'silence': 1})
