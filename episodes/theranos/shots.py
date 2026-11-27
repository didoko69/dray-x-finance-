# Dray x finance — "Theranos Explained: The $9 Billion Blood Test That Never Worked"
# Sources: see sources.md in this folder.
def A(k, x, y=1000, s=1, p='stand', f=0, e=None, mv=0, **kw):
    d = dict(k=k, x=x, y=y, s=s, p=p, f=f, mv=mv); d.update(kw)
    if e: d['e'] = e
    return d
SU = lambda x, y=1000, s=1, p='stand', f=0, e=None, v=0, **k: A('suit', x, y, s, p, f, e, v=v, **k)
WK = lambda x, y=1000, s=1, p='stand', f=0, e=None, v=0, **k: A('worker', x, y, s, p, f, e, v=v, **k)
PX = lambda x, y=1000, s=1, p='stand', f=0, e=None, v=0, **k: A('pax', x, y, s, p, f, e, v=v, **k)
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


HOLMES = lambda x, y=1000, s=1, p='stand', f=0, e='det', **k: SU(x, y, s, p, f, e, v=4, **k)      # woman
SUNNY = lambda x, y=1000, s=1, p='stand', f=0, e='det', **k: SU(x, y, s, p, f, e, v=0, **k)       # black hair
TYLER = lambda x, y=1000, s=1, p='stand', f=0, e='det', **k: WK(x, y, s, p, f, e, v=1, **k)       # whistleblower
JOHN = lambda x, y=1000, s=1, p='stand', f=0, e='det', **k: WK(x, y, s, p, f, e, v=0, **k)        # WSJ reporter

# ================= COLD OPEN =================
V("October the fifteenth, 2015. Silicon Valley, California.", 'skyline', 'dim', (960, 700, 1.0, 1.15, 0, -60), au={'mystery': .7, 'tension': .5, 'cityamb': .4})
V("A young company called Theranos is one of the most celebrated startups in America.", 'office', 'day', (960, 600, 1.05, 1.2, 0, 0), [HOLMES(960, 1000, 1.0, 'stand', 0, 'soft')], au={'mystery': .5, 'tension': .4})
V("Its founder has promised something that sounds like a miracle. Dozens of lab tests from just a few drops of blood from a fingertip.", 'card', card=C(t='flow', title='THE PROMISE', nodes=['A few drops of blood', 'Tiny tube', 'Theranos machine', 'Dozens of test results']), au={'warm': .6, 'pops': 1})
V("Investors have valued the company at around nine billion dollars.", 'card', card=C(t='bignum', v=9e9, cur='$', label='THERANOS VALUATION · 2014', sub='Reported by Fortune and Time'), au={'tension': .8, 'hit': .7})
V("Then, that morning, the Wall Street Journal publishes an investigation.", 'desk', 'dim', (700, 540, 1.1, 1.35, 0, 0), au={'tension': .7, 'tick': .6})
V("It reports that Theranos is not using its own technology for most of the blood tests it offers.", 'card', card=C(t='headline', paper='THE DAILY LEDGER', date='OCTOBER 15, 2015', h='BLOOD-TEST STAR NOT USING ITS OWN DEVICE FOR MOST TESTS', sub='Company calls the report erroneous'), au={'tension': .9, 'hit': .8})
V("Theranos calls the story factually and scientifically erroneous.", 'office', 'day', fc_=fc(HOLMES(960, 1000, 1.0, 'point', 0, 'det'), 2.3), au={'tension': .7})
V("But within three years, the company would be gone. And its founder would end up in a federal prison.", 'prison', 'dim', (960, 560, 1.2, 1.0, 0, 0), au={'tension': 1, 'hit': .6, 'drop_after': 1})
V("This is the story of Theranos. The blood test that promised to change medicine, and the billions that were built on it.", 'skyline', 'night', (960, 800, 1.3, 1.5, 0, 0), au={'mystery': 1, 'tension': .7, 'drop_after': 1}, gap=1.0)
CARD(C(t='title', a='THERANOS'), 2.0, {'hit': 1, 'drop': 1})

# ================= CHAPTER 1 — THE PROMISE =================
CH(1, 'THE PROMISE')
V("In 2003, a nineteen-year-old Stanford student named Elizabeth Holmes started a company.", 'office', 'day', fc_=fc(HOLMES(960, 1000, 1.0, 'stand', 0, 'soft'), 2.2), hl='ELIZABETH HOLMES · FOUNDER', au={'warm': .6, 'mystery': .3})
V("She soon dropped out of university to run it full time, using money her parents had set aside for her education.", 'desk', 'day', (960, 540, 1.0, 1.15, 0, 0), au={'warm': .5, 'mystery': .4})
V("The company was first called Real-Time Cures. Later it became Theranos, a mix of the words therapy and diagnosis.", 'card', card=C(t='facts', title='THE NAME', rows=[['2003', 'Real-Time Cures'], ['THERA', 'Therapy'], ['NOS', 'Diagnosis']]), au={'warm': .5, 'pops': 1})
V("Her idea was simple and powerful. Most blood tests need a needle in the arm and several tubes of blood.", 'card', card=C(t='facts', title='THE BIG IDEA', rows=[['Normal test', 'Needle in the arm + tubes of blood'], ['Theranos', 'A few drops from a finger'], ['The pitch', 'Faster, cheaper, painless']]), au={'warm': .6, 'pops': 1})
V("Theranos said it could do the same work with a few drops from a finger prick, collected in a tiny tube it called the nanotainer.", 'card', card=C(t='flow', title='HOW IT WAS SUPPOSED TO WORK', nodes=['Finger prick', 'Nanotainer tube', 'Edison machine', 'Fast, cheap results']), au={'warm': .6, 'pops': 1})
V("The machine that would analyze the blood was named Edison, after the inventor Thomas Edison.", 'tvstudio', 'day', (960, 560, 1.0, 1.12, 0, 0), au={'warm': .6, 'mystery': .3})
V("Fast results. Lower prices. No big needles. Investors loved the story.", 'wallst', 'day', (960, 700, 1.1, 1.0, 0, 0), [SU(600 + i * 180, 1000, .85, 'stand', i % 2, 'soft', v=i) for i in range(4)], au={'warm': .8, 'crowd': .3})
V("According to Time, the company was valued at about one hundred and ninety-seven million dollars in 2007. By 2010, it was worth more than a billion.", 'card', card=C(t='chart', title='THERANOS VALUATION ($)', pts=[['2007', 1.97e8], ['2010', 1e9], ['2014', 9e9]], color='up', cur='$', note='2014: about $9 billion'), au={'warm': .7, 'pops': .6})
V("By 2009, a businessman named Ramesh Balwani, known as Sunny, had become the company's president and chief operating officer.", 'office', 'day', fc_=fc(SUNNY(960, 1000, 1.0, 'stand', 1, 'det'), 2.2), hl='SUNNY BALWANI · PRESIDENT & COO', au={'mystery': .6})
V("He and Holmes were also in a romantic relationship, which they kept private from investors.", 'boardroom', 'dim', (960, 520, 1.0, 1.15, 0, 0), [HOLMES(760, 1000, .95, 'stand', 0, 'soft'), SUNNY(1160, 1000, .95, 'stand', 1, 'det')], au={'mystery': .7, 'tension': .3}, gap=.8)

# ================= CHAPTER 2 — THE STAR =================
CH(2, 'THE STAR')
V("In July 2011, Holmes met George Shultz, a former U.S. Secretary of State. That same month, he joined the Theranos board.", 'boardroom', 'day', (960, 520, 1.0, 1.12, 0, 0), BOARD, au={'warm': .6, 'mystery': .3})
V("Over the next few years, the board filled up with famous names from government and the military.", 'card', card=C(t='facts', title='THE THERANOS BOARD', rows=[['George Shultz', 'Former Secretary of State'], ['Henry Kissinger', 'Former Secretary of State'], ['William Perry', 'Former Defense Secretary'], ['Jim Mattis', 'Retired Marine general']]), au={'warm': .6, 'pops': 1})
V("There were diplomats, senators and generals. But few of them had any experience in medical testing.", 'boardroom', 'dim', (960, 540, 1.2, 1.35, 0, 0), BOARD, au={'mystery': .7, 'tension': .4})
V("In 2013, Theranos partnered with Walgreens, one of America's biggest pharmacy chains.", 'card', card=C(t='headline', paper='MARKET WATCH DAILY', date='2013', h='WALGREENS TEAMS UP WITH THERANOS', sub='In-store blood tests from a finger prick'), au={'warm': .7, 'hit': .5})
V("Customers could get their blood tested inside the stores. The service opened in more than forty locations, with plans to go much further.", 'bankext', 'day', (960, 600, 1.0, 1.15, 0, 0), [PX(700, 1000, .9, 'stand', 0, 'soft', v=1), PX(1200, 1000, .9, 'walk', 1, 'soft', v=2)], au={'warm': .6, 'cityamb': .3})
V("The deal was meant to grow far beyond that. Walgreens had more than eight thousand stores across the country.", 'card', card=C(t='bignum', v=8000, fmt='raw', suf='+', label='WALGREENS STORES', sub='The long-term plan: Theranos centers in all of them'), au={'warm': .7, 'hit': .5})
V("By 2014, Theranos had raised more than four hundred million dollars. Its estimated value was around nine billion.", 'card', card=C(t='facts', title='THERANOS IN 2014', rows=[['$400M+', 'Raised from investors'], ['~$9B', 'Estimated value'], ['$4.5B', 'Holmes\'s net worth (Forbes)']]), au={'warm': .8, 'hit': .6})
V("Forbes estimated Holmes's own net worth at four and a half billion dollars. She was on magazine covers, and on stage at major conferences.", 'tvstudio', 'day', (960, 540, 1.0, 1.15, 0, 0), [HOLMES(960, 1000, 1.0, 'point', 0, 'soft')], fx=['flashbulbs'], au={'warm': .8, 'crowd': .3})
V("But inside the company, things looked very different.", 'office', 'night', fc_=fc(HOLMES(960, 1000, 1.0, 'stand', 0, 'det'), 2.4, 2.7), au={'mystery': .9, 'tension': .5, 'drop_after': 1}, gap=.8)
V("According to later investigations, Theranos ran many of its tests on ordinary commercial machines made by other companies.", 'desk', 'dim', (960, 540, 1.0, 1.15, 0, 0), au={'mystery': .7, 'tension': .5})
V("Because a finger prick gives so little blood, the samples were diluted so those machines could read them. A method that had not been properly validated.", 'card', card=C(t='flow', title='WHAT WAS REPORTED', nodes=['Tiny finger-prick sample', 'Diluted with liquid', 'Run on other firms\' machines', 'Unreliable results'], endRed=1), au={'tension': .7, 'pops': 1}, gap=.8)

# ================= CHAPTER 3 — THE WHISTLEBLOWERS =================
CH(3, 'THE WHISTLEBLOWERS')
V("Some employees started to worry. One of them was Tyler Shultz, who worked at Theranos from 2013 to 2014.", 'office', 'day', fc_=fc(TYLER(900, 1000, 1.0, 'stand', 0, 'det'), 2.2), hl='TYLER SHULTZ · FORMER EMPLOYEE', au={'mystery': .8, 'tension': .4})
V("He was the grandson of George Shultz, the board member. Using a false name, he reported the lab to health regulators in New York State.", 'desk', 'night', (700, 540, 1.1, 1.3, 0, 0), au={'tension': .7, 'paper': .6})
V("Outside experts had doubts too. In 2015, the researcher John Ioannidis questioned in a medical journal why Theranos had published so little data.", 'card', card=C(t='facts', title='EARLY DOUBTS · 2015', rows=[['JAMA', 'Researcher questions lack of published data'], ['Few studies', 'Little peer-reviewed evidence']]), au={'mystery': .7, 'tension': .5})
V("Then a reporter at the Wall Street Journal, John Carreyrou, started making calls.", 'office', 'night', fc_=fc(JOHN(900, 1000, 1.0, 'stand', 0, 'det'), 2.2), hl='JOHN CARREYROU · WALL STREET JOURNAL', au={'mystery': .8, 'tension': .5})
V("Tyler Shultz became a key source for his story. Theranos sent lawyers after people who talked to the paper.", 'court', 'dim', (960, 560, 1.0, 1.15, 0, 0), [TYLER(760, 1000, .95, 'stand', 0, 'fear'), SU(1160, 1000, .95, 'point', 1, 'det', v=1)], au={'tension': .8})
V("On October the fifteenth, 2015, the story came out. It reported that fewer than ten percent of the tests Theranos offered were done with finger-prick samples.", 'card', card=C(t='facts', title='THE WSJ REPORT · OCT 2015', rows=[['Under 10%', 'Of tests done by finger prick'], ['Most tests', 'Not run on Edison'], ['Theranos', 'Rejected the report']]), au={'tension': .8, 'hit': .6})
V("A follow-up report said U.S. regulators had approved the finger-prick method for just one test, out of more than one hundred the company had submitted.", 'card', card=C(t='bignum', v=1, fmt='raw', label='FINGER-PRICK TESTS CLEARED BY THE FDA', sub='Out of more than 100 submitted'), au={'tension': .8, 'hit': .7})
V("Holmes went on television to defend the company, and Theranos stood by its technology.", 'tvstudio', 'dim', (960, 540, 1.0, 1.15, 0, 0), [HOLMES(960, 1000, 1.0, 'point', 0, 'det')], au={'tension': .6})
V("But within days, Walgreens said it would not open any new Theranos centers until it had more information.", 'card', card=C(t='headline', paper='THE DAILY LEDGER', date='OCTOBER 24, 2015', h='WALGREENS PUTS THERANOS EXPANSION ON HOLD', sub='Pharmacy chain wants more information'), au={'tension': .8, 'hit': .6})
V("And on October the twenty-seventh, the FDA published inspection reports alleging poor record-keeping and mishandled complaints.", 'desk', 'dim', (700, 540, 1.2, 1.4, 0, 0), au={'tension': .9, 'paper': .6, 'drop_after': 1}, gap=.8)

# ================= CHAPTER 4 — THE COLLAPSE =================
CH(4, 'THE COLLAPSE')
V("In January 2016, inspectors from the federal agency that oversees labs said Theranos's California lab posed immediate jeopardy to patient health and safety.", 'card', card=C(t='quote', q='Immediate jeopardy to patient health and safety.', who='— U.S. lab regulator (CMS), January 2016'), au={'tension': 1, 'hit': .8})
V("In 2016, Theranos voided two years of results from its Edison machines, and sent out hundreds of thousands of corrected test reports.", 'card', card=C(t='facts', title='2016', rows=[['2 years', 'Edison results voided'], ['100,000s', 'Corrected test reports'], ['Patients', 'Told to re-check results']]), au={'tension': .9, 'pops': 1})
V("For patients, these were not just numbers. They were results that people and their doctors had relied on.", 'bankext', 'dim', (960, 700, 1.0, 1.15, 0, 0), [PX(700, 1000, .9, 'stand', 0, 'sad', v=1), PX(1200, 1000, .9, 'stand', 1, 'fear', v=3)], au={'sad': .8, 'tension': .5})
V("In June 2016, Forbes changed its estimate of Holmes's fortune. From four and a half billion dollars, to nothing.", 'card', card=C(t='compare', title='HOLMES\'S NET WORTH (FORBES)', a=['2014', 4.5e9], b=['JUNE 2016', 0], cur='$', note='From $4.5 billion to zero'), au={'tension': 1, 'hit': 1})
V("Forbes now valued the whole company at around eight hundred million dollars. That was barely more than the money investors had already put in.", 'tradefloor', 'red', (960, 520, 1.0, 1.15, 0, 0), fx=['redtick'], au={'tension': .9})
V("That same month, Walgreens ended the partnership. It later sued Theranos, and the case was settled.", 'bankext', 'red', (960, 560, 1.2, 1.0, 0, 0), au={'tension': .8})
V("In July 2016, regulators revoked the lab's certificate, and banned Holmes from owning or operating a clinical lab for two years.", 'court', 'dim', fc_=fc(HOLMES(960, 1000, 1.0, 'stand', 0, 'sad'), 2.2), au={'tension': .8})
V("Sunny Balwani had already left the company, in May 2016.", 'office', 'night', (960, 600, 1.0, 1.12, 0, 0), [SUNNY(960, 1000, 1.0, 'walk', 1, 'det', mv=-200)], au={'mystery': .7})
V("In April 2017, Theranos agreed to refund four point six five million dollars to customers in Arizona, under a deal with the state.", 'card', card=C(t='bignum', v=4.65e6, cur='$', label='REFUNDS TO ARIZONA CUSTOMERS', sub='Consent decree, April 2017'), au={'tension': .7, 'hit': .5})
V("In March 2018, the Securities and Exchange Commission charged Theranos, Holmes and Balwani with an elaborate, years-long fraud on investors.", 'card', card=C(t='headline', paper='THE DAILY LEDGER', date='MARCH 2018', h='SEC CHARGES THERANOS, HOLMES AND BALWANI WITH FRAUD', sub='Holmes settles; Balwani fights the charges'), au={'tension': 1, 'hit': .9})
V("Holmes settled without admitting or denying the charges. She paid a five hundred thousand dollar penalty and accepted a ten-year ban from running a public company.", 'card', card=C(t='facts', title='HOLMES\'S SEC SETTLEMENT', rows=[['$500,000', 'Penalty'], ['10 years', 'Barred from leading a public company'], ['No admission', 'Neither admitted nor denied']]), au={'tension': .7, 'pops': 1})
V("In June 2018, both were indicted on criminal charges of wire fraud and conspiracy.", 'court', 'red', (960, 600, 1.1, 1.25, 0, 0, 3), [HOLMES(760, 1000, .95, 'stand', 0, 'fear'), SUNNY(1160, 1000, .95, 'stand', 1, 'det')], fx=['flashbulbs'], au={'tension': 1, 'hit': .8})
V("And in September 2018, Theranos told its investors it would shut down. The company had raised more than seven hundred million dollars. Its shares were now worthless.", 'card', card=C(t='chart', title='THERANOS VALUE (2014 PEAK = 100)', pts=[['2014', 100], ['2016', 9], ['SEPT 2018', 0]], color='down', fmt='raw', unit='', labels=True, note='2016: Forbes estimate ~$800M · 2018: worthless'), au={'tension': 1, 'hit': .8, 'drop_after': 1}, gap=.9)

# ================= CHAPTER 5 — THE VERDICT =================
CH(5, 'THE VERDICT')
V("Holmes's criminal trial finally began in 2021 in San Jose, California. It lasted almost four months.", 'court', 'day', (960, 600, 1.0, 1.15, 0, 0), [HOLMES(960, 1000, .95, 'stand', 0, 'det')], au={'tension': .6})
V("She took the stand herself. She said she never stopped believing Theranos was close to perfecting its technology.", 'court', 'dim', fc_=fc(HOLMES(960, 1000, 1.0, 'stand', 0, 'sad'), 2.3), au={'tension': .6, 'mystery': .5})
V("She also blamed Balwani, saying he, not her, oversaw the company's financial forecasts. Balwani has always denied wrongdoing.", 'court', 'dim', fc_=fc(SUNNY(960, 1000, 1.0, 'stand', 1, 'det'), 2.3), au={'tension': .6})
V("On January the third, 2022, after more than fifty hours of deliberation, the jury reached its verdict.", 'court', 'red', (960, 400, 1.2, 1.4, 0, 0), au={'tension': 1, 'tick': .7})
V("Guilty on four counts of defrauding investors. Not guilty on four counts about deceiving patients. And no decision on three more.", 'card', card=C(t='facts', title='THE VERDICT · JANUARY 3, 2022', rows=[['4 counts', 'GUILTY — investor fraud'], ['4 counts', 'NOT GUILTY — patient fraud'], ['3 counts', 'Jury deadlocked']]), au={'tension': 1, 'hit': 1})
V("Each count carried up to twenty years in prison, although legal experts expected a much lower sentence.", 'court', 'dim', (960, 560, 1.1, 1.25, 0, 0), [HOLMES(960, 1000, .95, 'stand', 0, 'sad')], au={'tension': .8})
V("In July 2022, a separate jury convicted Sunny Balwani on all twelve counts against him, including fraud against patients.", 'court', 'day', fc_=fc(SUNNY(960, 1000, 1.0, 'stand', 1, 'sad'), 2.2), au={'tension': .8, 'hit': .5})
V("In November 2022, Holmes was sentenced to eleven years and three months in prison. A few weeks later, Balwani received twelve years and eleven months.", 'card', card=C(t='compare', title='PRISON SENTENCES (MONTHS)', a=['HOLMES', 135], b=['BALWANI', 155], fmt='raw', unit='', note='11 yrs 3 mo vs 12 yrs 11 mo'), au={'tension': .9, 'hit': .7})
V("The two were also ordered to pay four hundred and fifty-two million dollars in restitution to investors.", 'card', card=C(t='bignum', v=4.52e8, cur='$', label='RESTITUTION ORDERED', sub='Holmes and Balwani, jointly, to investors'), au={'tension': .8, 'hit': .6})
V("On May the thirtieth, 2023, Holmes reported to a federal prison camp in Bryan, Texas. Balwani had begun his sentence the month before.", 'prison', 'dim', (960, 560, 1.0, 1.12, 0, 0), [HOLMES(450, 820, 1.0, 'sit', 0, 'sad')], au={'sad': .8, 'tension': .4})
V("Their appeals failed. In 2025, a federal appeals court upheld the convictions, and in October 2026 the Supreme Court declined to hear Balwani's case.", 'card', card=C(t='timeline', title='AFTER THE VERDICTS', items=[['NOV 2022', 'Holmes sentenced'], ['MAY 2023', 'Holmes enters prison'], ['2025', 'Appeals court upholds convictions'], ['OCT 2026', 'Supreme Court rejects Balwani petition'], ['AUG 2027', 'Holmes halfway-house date (reported)']], hi=3), au={'tension': .7})
V("Holmes has asked President Trump to commute her sentence. At the time of this video, no decision had been announced.", 'prison', 'night', (960, 560, 1.2, 1.35, 0, 0), [HOLMES(450, 820, 1.0, 'sit', 0, 'det')], au={'mystery': .8, 'tension': .5})
V("Her sentence has been shortened for good behavior, and in September 2026, Forbes reported she had been approved to move to a halfway house in August 2027.", 'card', card=C(t='headline', paper='MARKET WATCH DAILY', date='SEPTEMBER 2026', h='HOLMES APPROVED FOR HALFWAY HOUSE IN 2027', sub='Clemency request still pending'), au={'mystery': .7, 'hit': .4})
V("Balwani's expected release date, according to prison officials, is in 2034.", 'prison', 'dim', (960, 560, 1.0, 1.1, 0, 0), [SUNNY(450, 820, 1.0, 'sit', 0, 'sad')], au={'sad': .7, 'drop_after': 1}, gap=.9)

# ================= LESSONS / OUTRO =================
V("So how did a company with an unproven machine reach a value of nine billion dollars?", 'office', 'night', (960, 600, 1.0, 1.15, 0, 0), au={'mystery': .8})
V("Part of the answer is that almost everyone wanted the story to be true. A young founder, a world-changing idea, and famous names to vouch for it.", 'wallst', 'dim', (960, 700, 1.1, 1.0, 0, 0), [SU(600 + i * 180, 1000, .85, 'stand', i % 2, 'soft', v=i) for i in range(4)], au={'mystery': .7})
V("Lesson one. If a company won't show its data, the story is not proof.", 'card', card=C(t='facts', title='3 LESSONS FROM THERANOS', rows=[['1', 'No data = no proof']]), au={'warm': .6, 'pops': 1})
V("Lesson two. Famous board members are not experts. Ask who actually understands the product.", 'card', card=C(t='facts', title='3 LESSONS FROM THERANOS', rows=[['1', 'No data = no proof'], ['2', 'Famous names ≠ expertise']]), au={'warm': .6, 'pops': 1})
V("And lesson three. When a company attacks the people asking questions, the questions usually matter.", 'card', card=C(t='facts', title='3 LESSONS FROM THERANOS', rows=[['1', 'No data = no proof'], ['2', 'Famous names ≠ expertise'], ['3', 'Attacking critics is a red flag']]), au={'warm': .6, 'pops': 1})
V("Theranos promised to change medicine with a single drop of blood. In the end, it showed how far a good story can go, before someone checks.", 'vault', 'dim', (300, 460, 1.0, 1.5, 0, 0), au={'mystery': .9, 'sad': .5}, gap=.8)
V("If you enjoyed this story, subscribe to Dray x finance for more stories about money, power and the people who lose it. And tell me in the comments: should Elizabeth Holmes get an early release?", 'skyline', 'night', (960, 700, 1.0, 1.1, 0, 0), au={'warm': .6, 'endtail5': 1}, gap=1.2)
CARD(C(t='sources', lines=['Wall Street Journal reporting via Fortune and Time timelines, 2015–2016', 'NPR and AP (PBS NewsHour): verdict reporting, January 2022', 'Forbes, September 2026; Fortune, January 2026; CNN Newsource, January 2026', 'U.S. Supreme Court docket 25-1330 (Balwani v. United States)', 'Wikipedia: Theranos, Sunny Balwani (as a pointer)']), 4.0, {'warm': .4})
CARD(C(t='blackend'), 1.5, {'silence': 1})
