/**
 * ICC T20 World Cup Analytics Engine (2007-2021)
 * Ingests, parses, and harmonizes match data across 7 tournament editions
 */

const fs = require('fs');
const path = require('path');

function parseCSV(content) {
  const lines = content.split(/\r?\n/).filter(l => l.trim().length > 0);
  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  const records = [];
  
  for (let i = 1; i < lines.length; i++) {
    const row = [];
    let insideQuote = false;
    let entry = '';
    for (const char of lines[i]) {
      if (char === '"') {
        insideQuote = !insideQuote;
      } else if (char === ',' && !insideQuote) {
        row.push(entry.trim());
        entry = '';
      } else {
        entry += char;
      }
    }
    row.push(entry.trim());

    if (row.length >= headers.length) {
      const rec = {};
      headers.forEach((h, idx) => rec[h] = row[idx]);
      records.push(rec);
    }
  }
  return records;
}

function parseScore(scoreStr) {
  if (!scoreStr) return { runs: 0, wickets: 0, overs: 20 };
  // e.g. "208/2(17.4 overs)" or "73(16.5 overs)"
  const scoreMatch = scoreStr.match(/^(\d+)(?:\/(\d+))?(?:\(([0-9.]+)\s*overs?\))?/i);
  if (!scoreMatch) return { runs: 0, wickets: 0, overs: 20 };

  const runs = parseInt(scoreMatch[1], 10) || 0;
  // If no slash, the team was bowled out (10 wickets)
  const wickets = scoreMatch[2] !== undefined ? parseInt(scoreMatch[2], 10) : 10;
  const overs = scoreMatch[3] !== undefined ? parseFloat(scoreMatch[3]) : 20.0;

  return { runs, wickets, overs };
}

function processCricketData(dataDir) {
  const editions = [2007, 2009, 2010, 2012, 2014, 2016, 2021];
  const allMatches = [];

  let totalMatches = 0;
  let totalRuns = 0;
  let totalWickets = 0;

  const editionStats = {};
  const teamStats = {};
  const venueStats = {};
  const playerStats = {};

  editions.forEach(year => {
    const filePath = path.join(dataDir, `t20_${year}_matches.csv`);
    if (!fs.existsSync(filePath)) return;

    const raw = parseCSV(fs.readFileSync(filePath, 'utf-8'));
    editionStats[year] = {
      year,
      matches: 0,
      totalRuns: 0,
      totalWickets: 0,
      avgScorePerMatch: 0
    };

    raw.forEach(r => {
      const matchNo = r['Match No'];
      const date = r['Date'];
      const stage = r['Group/Semi Final/Final'] || 'Group';
      const matchBetween = r['Match Between'] || '';
      const venue = r['Venue'] || 'Unknown Venue';
      const winScoreRaw = r['Winning Team Score'] || '';
      const loseScoreRaw = r['Losing Team Score'] || '';
      const winner = (r['Winner Team'] || '').trim();
      const result = r['Result'] || '';
      const pom = (r['Player Of The Match'] || '').trim();

      const winParsed = parseScore(winScoreRaw);
      const loseParsed = parseScore(loseScoreRaw);

      const matchRuns = winParsed.runs + loseParsed.runs;
      const matchWickets = winParsed.wickets + loseParsed.wickets;

      totalMatches += 1;
      totalRuns += matchRuns;
      totalWickets += matchWickets;

      editionStats[year].matches += 1;
      editionStats[year].totalRuns += matchRuns;
      editionStats[year].totalWickets += matchWickets;

      // Extract teams
      const teams = matchBetween.split(/\s+vs\s+/i).map(t => t.trim());
      const team1 = teams[0] || 'Team A';
      const team2 = teams[1] || 'Team B';

      // Update team stats
      [team1, team2].forEach(t => {
        if (!t) return;
        if (!teamStats[t]) {
          teamStats[t] = { team: t, matches: 0, wins: 0, losses: 0, tieNoResult: 0, winRatePct: 0 };
        }
        teamStats[t].matches += 1;
        if (winner && winner.toLowerCase() === t.toLowerCase()) {
          teamStats[t].wins += 1;
        } else if (winner && winner.toLowerCase() !== 'no result' && winner.toLowerCase() !== 'tied') {
          teamStats[t].losses += 1;
        } else {
          teamStats[t].tieNoResult += 1;
        }
      });

      // Update venue stats
      if (!venueStats[venue]) {
        venueStats[venue] = { venue, matches: 0, totalRuns: 0, avgMatchScore: 0 };
      }
      venueStats[venue].matches += 1;
      venueStats[venue].totalRuns += matchRuns;

      // Update Player of the Match
      if (pom && pom !== 'Not awarded') {
        if (!playerStats[pom]) playerStats[pom] = { player: pom, awards: 0, teams: new Set() };
        playerStats[pom].awards += 1;
        if (winner) playerStats[pom].teams.add(winner);
      }

      allMatches.push({
        edition: year,
        matchNo,
        date,
        stage,
        team1,
        team2,
        venue,
        winScoreRaw,
        loseScoreRaw,
        winner,
        result,
        playerOfTheMatch: pom,
        winningRuns: winParsed.runs,
        winningWickets: winParsed.wickets,
        losingRuns: loseParsed.runs,
        losingWickets: loseParsed.wickets,
        totalMatchRuns: matchRuns,
        totalMatchWickets: matchWickets
      });
    });

    // Compute edition averages
    if (editionStats[year].matches > 0) {
      editionStats[year].avgScorePerMatch = Number((editionStats[year].totalRuns / editionStats[year].matches).toFixed(1));
    }
  });

  // Calculate team win rates
  Object.values(teamStats).forEach(t => {
    t.winRatePct = t.matches > 0 ? Number(((t.wins / t.matches) * 100).toFixed(1)) : 0;
  });

  // Venue averages
  Object.values(venueStats).forEach(v => {
    v.avgMatchScore = v.matches > 0 ? Number((v.totalRuns / v.matches).toFixed(1)) : 0;
  });

  // Top Teams (min 10 matches)
  const topTeams = Object.values(teamStats)
    .filter(t => t.matches >= 5)
    .sort((a, b) => b.wins - a.wins);

  // Top Venues
  const topVenues = Object.values(venueStats)
    .sort((a, b) => b.matches - a.matches)
    .slice(0, 10);

  // Top POM Players
  const topPlayers = Object.values(playerStats).map(p => ({
    player: p.player,
    awards: p.awards,
    team: [...p.teams][0] || 'Unknown'
  })).sort((a, b) => b.awards - a.awards).slice(0, 15);

  // Write master merged CSV
  let masterCsv = 'Edition,Match_No,Date,Stage,Team1,Team2,Venue,Winning_Score,Losing_Score,Winner,Result,Player_Of_The_Match,Winning_Runs,Winning_Wickets,Losing_Runs,Losing_Wickets,Total_Match_Runs,Total_Match_Wickets\n';
  allMatches.forEach(m => {
    masterCsv += `${m.edition},"${m.matchNo}","${m.date}","${m.stage}","${m.team1}","${m.team2}","${m.venue}","${m.winScoreRaw}","${m.loseScoreRaw}","${m.winner}","${m.result}","${m.playerOfTheMatch}",${m.winningRuns},${m.winningWickets},${m.losingRuns},${m.losingWickets},${m.totalMatchRuns},${m.totalMatchWickets}\n`;
  });
  fs.writeFileSync(path.join(dataDir, 'all_t20_matches_2007_2021.csv'), masterCsv);

  return {
    kpis: {
      totalTournaments: editions.length,
      totalMatches,
      totalRuns,
      totalWickets,
      avgRunsPerMatch: Number((totalRuns / totalMatches).toFixed(1)),
      avgWicketsPerMatch: Number((totalWickets / totalMatches).toFixed(1))
    },
    editions: Object.values(editionStats),
    topTeams: topTeams.slice(0, 12),
    topVenues,
    topPlayers,
    recentFinals: allMatches.filter(m => m.stage.toLowerCase().includes('final') && !m.stage.toLowerCase().includes('semi'))
  };
}

module.exports = { processCricketData, parseScore, parseCSV };

if (require.main === module) {
  const dataDir = path.join(__dirname, '..', 'data');
  const summary = processCricketData(dataDir);
  console.log('--- ICC T20 World Cup Analytics Summary ---');
  console.log(JSON.stringify(summary.kpis, null, 2));
  fs.writeFileSync(path.join(__dirname, '..', 'dashboard', 'cricket_summary.json'), JSON.stringify(summary, null, 2));
  console.log('Saved summary to dashboard/cricket_summary.json');
}
