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

console.log('\nAll ICC T20 World Cup Analytics tests passed successfully! (5/5)');
