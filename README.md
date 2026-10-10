# 🏏 ICC T20 World Cup Analytics & Predictive AI Engine (Power BI & AIML Mini Project 5)

> **Academic Capstone Submission • Final Year Engineering in AIML**  
> **Student Name**: Mithun Gowda M  
> **Program**: B.E. / B.Tech in Artificial Intelligence & Machine Learning (AIML)  
> **Department**: Department of Computer Science & Engineering (AIML)  
> **Specialization**: Sports Machine Learning, Predictive Modeling & Quantitative Analytics  

[![Tests](https://img.shields.io/badge/tests-7%2F7%20passed-brightgreen.svg)]()
[![AIML Engine](https://img.shields.io/badge/AIML-Bradley--Terry%20%7C%20PIM-blueviolet.svg)]()
[![Power BI](https://img.shields.io/badge/Power%20BI-Desktop-F2C811?logo=powerbi&logoColor=black)]()
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?logo=javascript&logoColor=black)]()
[![License](https://img.shields.io/badge/license-MIT-blue.svg)]()

---

## 📌 Abstract & Problem Statement
In professional tournament sports analytics, analyzing historical performance across fragmented event editions requires complex string parsing, dimensional harmonization, and probabilistic outcome modeling. Simple aggregate averages fail to account for pitch behavior, bowling efficiency, or head-to-head team strength.

This final-year engineering capstone mini-project implements:
1. **Bradley-Terry Elo Match Win Probability Predictor**: A calibrated probabilistic model quantifying win chances for international matchups based on tournament performance.
2. **Player Impact Metric (PIM / MVP Rating)**: A multi-variable machine scoring function rating tournament match-winners.
3. **Monte Carlo 1st Innings Par Score Simulation**: A 300-path stochastic simulator evaluating expected pitch totals across host venues.
4. **Power BI Tournament Overview & Dimensional Modeling**: Ingestion and harmonization of **223 matches across 7 World Cup editions** (2007–2021).
5. **Interactive AIML Web Companion**: Zero-CORS offline-ready dashboard with interactive matchup simulations.

---

## 🔬 Mathematical Formulations & Machine Learning Methodology

### 1. Bradley-Terry Logistic Win Probability
Given tournament calibrated Elo ratings $R_A, R_B \in \mathbb{R}$ for opponents $A$ and $B$:
$$P(A \text{ defeats } B) = \frac{1}{1 + 10^{-\frac{R_A - R_B}{400}}}$$
Ratings are updated iteratively based on expected score $E_A = P(A)$ and actual match outcome $S_A \in \{0, 1\}$:
$$R_A' = R_A + K \cdot (S_A - E_A)$$

### 2. Player Impact Metric (PIM / MVP Rating)
Quantifies clutch individual contributions:
$$\text{PIM} = \min\left(100, (\text{POM Awards} \times 22) + \max(0, 30 - 2 \cdot \text{Rank}) \right)$$

### 3. Monte Carlo Venue Par Projection
Gaussian realization around venue historical mean $\mu_v$ with pitch standard deviation $\sigma_v$:
$$S_{\text{par}} \sim \mathcal{N}(\mu_v, \sigma_v^2)$$

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
│   ├── cricket_analytics.js         # Score string parser & multi-edition engine
│   └── cricket_ml_engine.js         # Bradley-Terry Elo predictor & PIM metric
├── dashboard/
│   ├── index.html                   # Interactive sports analytics dashboard with AIML tab
│   ├── styles.css                   # Dynamic sports-themed dark UI styling
│   ├── data.js                      # Pre-bundled dataset (zero-CORS offline support)
│   ├── app.js                       # Chart.js timelines & matchup simulator
│   └── cricket_summary.json         # Precomputed aggregates
├── power_bi/
│   ├── measures.dax                 # Production DAX for team win rates & venue stats
│   ├── power_query.m                # Multi-file combiner & ETL M code
│   └── REPORT_GUIDE.md              # Visual-by-visual layout guide
└── tests/
    └── cricket_analytics.test.js    # Automated unit & ML probability tests
```

---

## 📊 Key Results & Insights Summary
- **Tournaments Analyzed**: **7 Global Editions** (2007 South Africa to 2021 UAE & Oman).
- **Match Volume**: **223 matches** played.
- **Scoring Output**: **61,945 total runs** scored (Average of **277.8 runs per match**).
- **Bowling Breakthroughs**: **2,719 wickets taken** (Average of **12.2 wickets per match**).
- **MVP Player Impact Metric Leaders**: Led by Chris Gayle (100 PIM), Mahela Jayawardene (100 PIM), Shane Watson (100 PIM), and Virat Kohli (100 PIM).
- **Predicted Matchup Probabilities**:
  - India (51.6%) vs Pakistan (48.4%)
  - Australia (58.4%) vs England (41.6%)
  - South Africa (60.4%) vs West Indies (39.6%)

---

## 📐 Key DAX Measures (`power_bi/measures.dax`)
```dax
Total Matches Played = COUNTROWS('T20_Matches')

Total Runs Scored = SUM('T20_Matches'[Total_Match_Runs])

Total Wickets Taken = SUM('T20_Matches'[Total_Match_Wickets])

Average Runs Per Match = DIVIDE([Total Runs Scored], [Total Matches Played], 0)

Team Win Rate % = DIVIDE([Team Total Wins], [Team Total Matches], 0) * 100
```

---

## 🧪 Automated Testing & Validation
Run automated tests verifying score parsing, all-out handling, and ML probability conservation:
```bash
node tests/cricket_analytics.test.js
```
**Test Results (7/7 Passed)**:
- `✓ Test 1 Passed`: 100% tournament match coverage verified (223 matches across 7 editions).
- `✓ Test 2 Passed`: Score string and all-out dismissal parser verified.
- `✓ Test 3 Passed`: Global aggregates verified (61,945 runs, 2,719 wickets).
- `✓ Test 4 Passed`: Team win-loss ratios and arithmetic verified.
- `✓ Test 5 Passed`: Player of the Match MVP records verified (Top: Chris Gayle with 5 awards).
- `✓ Test 6 Passed`: AIML Bradley-Terry Elo match prediction probability conservation verified ($P_A + P_B \equiv 100\%$).
- `✓ Test 7 Passed`: AIML multi-factor Player Impact Metric (PIM) verified.

---

## 💻 How to Run the Interactive Dashboard
1. **Direct Browser Open (Offline Compatible)**:
   - Double-click `dashboard/index.html` in Windows Explorer. It opens instantly with interactive matchup simulations and zero CORS restrictions!
2. **Local HTTP Server (Optional)**:
   ```bash
   npx serve dashboard
   ```

---

## 🎓 Final Year Engineering Capstone Learning Outcomes
- Developed sports analytics predictive engines using Bradley-Terry logistic modeling.
- Built multi-criteria machine ranking algorithms (Player Impact Metric) evaluating performance under pressure.
- Harmonized multi-tournament heterogeneous datasets into an integrated Power BI enterprise model.

---

## 👤 Author
**Mithun Gowda M**  
Final Year Engineering Student (B.E. / B.Tech AIML)  
Department of Computer Science & Engineering (AIML)  
GitHub: [@Mithun-gowda-M](https://github.com/Mithun-gowda-M)
