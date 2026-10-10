# 🏏 ICC T20 World Cup Analysis 2007–2021 (Power BI Mini Project 5)

[![Test Suite](https://img.shields.io/badge/tests-5%2F5%20passed-brightgreen.svg)]()
[![Platform](https://img.shields.io/badge/platform-Power%20BI%20%7C%20Web-blue.svg)]()
[![License](https://img.shields.io/badge/license-MIT-green.svg)]()

Comprehensive cricket analytics across **7 editions of the ICC Men's T20 World Cup (2007 to 2021)**, analyzing 223 matches, team performance trajectories, venue pitch behaviors, scoring rates, and Player of the Match MVP records.

---

## 🏆 Key Tournament Insights & Highlights
- **Total Tournaments**: **7 Global Editions** (2007 South Africa, 2009 England, 2010 West Indies, 2012 Sri Lanka, 2014 Bangladesh, 2016 India, 2021 UAE & Oman).
- **Match Volume**: **223 matches** played.
- **Scoring Output**: **61,945 total runs** scored (Average of **277.8 runs per match**).
- **Bowling Impact**: **2,719 wickets taken** (Average of **12.2 wickets per match**).
- **MVP Player of the Match Leaders**: Led by Chris Gayle (5 awards), Virat Kohli, Shahid Afridi, and Mahela Jayawardene.

---

## 📁 Repository Architecture
```
icc-t20-world-cup-analysis/
├── data/
│   ├── t20_2007_matches.csv         # Edition 2007 matches
│   ├── t20_2009_matches.csv         # Edition 2009 matches
│   ├── t20_2010_matches.csv         # Edition 2010 matches
│   ├── t20_2012_matches.csv         # Edition 2012 matches
│   ├── t20_2014_matches.csv         # Edition 2014 matches
│   ├── t20_2016_matches.csv         # Edition 2016 matches
│   ├── t20_2021_matches.csv         # Edition 2021 matches
│   ├── all_t20_matches_2007_2021.csv# Consolidated master fact table
│   └── DATA_DICTIONARY.md           # Metrics and schema definitions
├── src/
│   └── cricket_analytics.js         # Score string parser & multi-edition engine
├── dashboard/
│   ├── index.html                   # Interactive cricket analytics dashboard
│   ├── styles.css                   # Dynamic sports-themed dark UI styling
│   ├── app.js                       # Chart.js timelines & finals showcase
│   └── cricket_summary.json         # Precomputed aggregates
├── power_bi/
│   ├── measures.dax                 # Production DAX for team win rates & venue stats
│   ├── power_query.m                # Multi-file combiner & ETL M code
│   └── REPORT_GUIDE.md              # Visual-by-visual layout guide
└── tests/
    └── cricket_analytics.test.js    # Automated unit & integration tests
```

---

## 📊 Power BI DAX Measures Reference
Located in [`power_bi/measures.dax`](power_bi/measures.dax):
- `Total Matches Played`, `Total Runs Scored`, `Total Wickets Taken`
- `Average Runs Per Match = DIVIDE([Total Runs Scored], [Total Matches Played], 0)`
- `Team Win Rate % = DIVIDE([Team Total Wins], [Team Total Matches], 0) * 100`
- `Venue Average Runs` and `Venue High Scoring Status`
- `Player POM Awards Count` and `Top MVP Rank`

---

## 🧪 Testing & Execution
Run the automated test suite verifying score string parsing, all-out dismissal handling, and tournament aggregates:
```bash
node tests/cricket_analytics.test.js
```

---

## 💻 Running the Web Companion
Open `dashboard/index.html` in any browser or serve locally:
```bash
npx serve dashboard
```

---

## 📄 License
MIT License. Developed for cricket sports analytics and tournament strategy.
