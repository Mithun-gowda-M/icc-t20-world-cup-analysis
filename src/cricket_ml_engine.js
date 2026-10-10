/**
 * Advanced AIML Cricket Analytics & Match Prediction Engine
 * Final Year AIML Capstone Component
 * Implements:
 * 1. Logistic Bradley-Terry Match Win Probability Predictor
 * 2. Multi-Factor Player Impact Metric (PIM / MVP Rating)
 * 3. Monte Carlo 1st Innings Par Score Simulator by Venue
 */

function calculateEloRatings(teamStats) {
  const eloMap = {};
  const baseElo = 1500;

  teamStats.forEach(t => {
    // Calibrate Elo based on win rate and matches played
    const winRate = t.winRatePct / 100;
    const matchesBonus = Math.min(200, t.matches * 4);
    const calibratedElo = baseElo + (winRate - 0.5) * 600 + matchesBonus;
    eloMap[t.team] = Math.round(calibratedElo);
  });

  return eloMap;
}

function predictMatchOutcome(teamA, teamB, eloMap) {
  const eloA = eloMap[teamA] || 1500;
  const eloB = eloMap[teamB] || 1500;

  // Logistic Bradley-Terry Probability: P(A) = 1 / (1 + 10^((EloB - EloA) / 400))
  const exponent = (eloB - eloA) / 400;
  const probA = 1 / (1 + Math.pow(10, exponent));
  const probB = 1 - probA;

  return {
    teamA,
    teamB,
    eloA,
    eloB,
    probA: Number((probA * 100).toFixed(1)),
    probB: Number((probB * 100).toFixed(1)),
    predictedWinner: probA >= probB ? teamA : teamB
  };
}

function calculatePlayerImpactMetric(topPlayers) {
  // PIM = (Awards * 20) + (Dominance Factor * 15)
  return topPlayers.map((p, idx) => {
    const rawScore = (p.awards * 22) + Math.max(0, 30 - idx * 2);
    return {
      player: p.player,
      awards: p.awards,
      team: p.team,
      pimScore: Math.min(100, Number(rawScore.toFixed(1))),
      impactTier: p.awards >= 4 ? 'Elite Match Winner' : 'Key Impact Performer'
    };
  });
}

function venueMonteCarloParScores(topVenues, numSims = 300) {
  // Simulates 1st innings expected totals using Gaussian distribution around ground average
  return topVenues.slice(0, 6).map(v => {
    const meanFirstInnings = Math.round(v.avgMatchScore / 2);
    const stdDev = 18;

    const scores = [];
    for (let i = 0; i < numSims; i++) {
      // Box Muller
      const u1 = Math.max(1e-10, Math.random());
      const u2 = Math.random();
      const z = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
      scores.push(Math.round(meanFirstInnings + z * stdDev));
    }

    scores.sort((a, b) => a - b);
    return {
      venue: v.venue.split(',')[0],
      p10Par: scores[Math.floor(numSims * 0.10)],
      medianPar: scores[Math.floor(numSims * 0.50)],
      p90Par: scores[Math.floor(numSims * 0.90)]
    };
  });
}

module.exports = { calculateEloRatings, predictMatchOutcome, calculatePlayerImpactMetric, venueMonteCarloParScores };
