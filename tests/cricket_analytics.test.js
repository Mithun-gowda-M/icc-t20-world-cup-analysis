/**
 * Automated Test Suite - ICC T20 World Cup Analytics
 */

const assert = require('assert');
const path = require('path');
const { processCricketData, parseScore } = require('../src/cricket_analytics');

console.log('Running ICC T20 World Cup Analytics Test Suite...');

const dataDir = path.join(__dirname, '..', 'data');
const result = processCricketData(dataDir);

// Test 1: Tournament Coverage & Total Matches
assert.strictEqual(result.kpis.totalTournaments, 7, 'Must cover 7 tournament editions');
assert.strictEqual(result.kpis.totalMatches, 223, `Expected 223 matches, got ${result.kpis.totalMatches}`);
console.log(`✓ Test 1 Passed: 100% tournament match coverage verified (${result.kpis.totalMatches} matches across 7 editions)`);

// Test 2: Score String Parser Accuracy
const parsed1 = parseScore('208/2(17.4 overs)');
assert.strictEqual(parsed1.runs, 208, 'Runs must be 208');
assert.strictEqual(parsed1.wickets, 2, 'Wickets must be 2');
assert.strictEqual(parsed1.overs, 17.4, 'Overs must be 17.4');

const parsedAllOut = parseScore('73(16.5 overs)');
assert.strictEqual(parsedAllOut.runs, 73, 'Runs must be 73');
assert.strictEqual(parsedAllOut.wickets, 10, 'All-out must register 10 wickets');
console.log('✓ Test 2 Passed: Score and all-out dismissal parser verified');

// Test 3: Total Runs & Wickets Aggregates
assert(result.kpis.totalRuns > 50000, `Expected > 50,000 runs, got ${result.kpis.totalRuns}`);
assert(result.kpis.totalWickets > 2000, `Expected > 2,000 wickets, got ${result.kpis.totalWickets}`);
console.log(`✓ Test 3 Passed: Global aggregates verified (${result.kpis.totalRuns} runs, ${result.kpis.totalWickets} wickets)`);

// Test 4: Team Win-Loss Consistency
result.topTeams.forEach(t => {
  assert(t.wins <= t.matches, `Wins cannot exceed matches for ${t.team}`);
  assert(t.winRatePct >= 0 && t.winRatePct <= 100, `Win rate out of bounds for ${t.team}`);
});
console.log('✓ Test 4 Passed: Team win-loss ratios and arithmetic verified');

// Test 5: Player of the Match Leaders
assert(result.topPlayers.length > 0, 'POM leaders must be populated');
assert(result.topPlayers[0].awards >= 4, 'Top MVP should have at least 4 awards');
console.log(`✓ Test 5 Passed: Player of the Match MVP records verified (Top: ${result.topPlayers[0].player} with ${result.topPlayers[0].awards} awards)`);

// Test 6: AIML Bradley-Terry Elo Win Probability
const matchups = result.aiIntelligence.sampleMatchups;
assert(matchups.length >= 4, 'Must simulate sample headline matchups');
matchups.forEach(m => {
  const sum = Number((m.probA + m.probB).toFixed(1));
  assert.strictEqual(sum, 100.0, `Probabilities must sum to 100%, got ${sum}%`);
  assert(m.eloA > 1000 && m.eloB > 1000, 'Elo ratings must be calibrated > 1000');
});
console.log(`✓ Test 6 Passed: AIML Bradley-Terry Elo match prediction probability conservation verified (${matchups[0].teamA} vs ${matchups[0].teamB}: ${matchups[0].probA}% - ${matchups[0].probB}%)`);

// Test 7: AIML Player Impact Metric (PIM)
const pim = result.aiIntelligence.playerImpactScores;
assert(pim.length > 0, 'PIM scores must be generated');
pim.forEach(p => {
  assert(p.pimScore >= 0 && p.pimScore <= 100, `PIM score out of bounds [0, 100]: ${p.pimScore}`);
});
console.log(`✓ Test 7 Passed: AIML Multi-factor Player Impact Metric (PIM) verified (#1: ${pim[0].player} - ${pim[0].pimScore}/100)`);

console.log('\nAll ICC T20 World Cup Analytics tests passed successfully! (7/7)');
