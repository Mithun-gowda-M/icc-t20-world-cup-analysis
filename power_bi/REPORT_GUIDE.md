# ICC T20 World Cup Analytics & Predictive AI Engine - Power BI Implementation Guide

> **Academic Capstone Submission • Final Year Engineering in AIML**  
> **Student Name**: Mithun Gowda M  
> **Program**: B.E. / B.Tech in Artificial Intelligence & Machine Learning (AIML)  
> **Department**: Department of Computer Science & Engineering (AIML)  
> **Repository**: [https://github.com/Mithun-gowda-M/icc-t20-world-cup-analysis](https://github.com/Mithun-gowda-M/icc-t20-world-cup-analysis)  

---
## 1. Overview
Analyzes 223 matches across 7 editions (2007, 2009, 2010, 2012, 2014, 2016, 2021) of the ICC Men's T20 World Cup, evaluating team records, venue behavior, runs scored, and Player of the Match awards.

## 2. Visual Architecture
1. **Summary Cards Strip (Top)**:
   - Card 1: `Total Matches Played`
   - Card 2: `Total Runs Scored`
   - Card 3: `Total Wickets Taken`
   - Card 4: `Average Runs Per Match`
   - Card 5: `Tournament Editions Count`

2. **Tournament Timeline & Growth (Top Left)**:
   - Visual: Line and Clustered Column Chart
   - Shared Axis: `Edition`
   - Column: `[Total Matches Played]`
   - Line: `[Total Runs Scored]`

3. **Team Performance (Top Right)**:
   - Visual: Clustered Bar Chart
   - Y-Axis: `Team`
   - X-Axis: `[Team Total Wins]` & `[Team Total Losses]`

4. **Venue Distribution & Scoring Dynamics (Bottom Left)**:
   - Visual: Line and Clustered Column Chart
   - Shared Axis: `Venue`
   - Column: `[Venue Matches Hosted]`
   - Line: `[Venue Average Runs]`

5. **Player of the Match Leaders (Bottom Right)**:
   - Visual: Horizontal Bar Chart
   - Y-Axis: `Player_Of_The_Match`
   - X-Axis: `[Player POM Awards Count]`


### 5. AIML Integration in Power BI
- **Tournament Elo Rating Dimension**: Ingest calibrated historical Elo ratings and win expectancy matrices into Power BI.
- **Player Impact Metric (PIM / MVP) Leaderboard**: Feed normalized PIM ratings into a Power BI decomposed tree / ranking card.
- **Python Visual in Power BI Desktop**: Render Monte Carlo 1st innings par score probability density distributions (KDE) per venue.
