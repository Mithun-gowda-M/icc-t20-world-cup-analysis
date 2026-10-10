/**
 * ICC T20 World Cup Interactive Dashboard Controller
 */

let cricketData = null;
let charts = {};

async function init() {
  try {
    const res = await fetch('cricket_summary.json');
    cricketData = await res.json();
    renderKPIs(cricketData.kpis);
    renderTimelineChart(cricketData.editions);
    renderTeamChart(cricketData.topTeams);
    renderVenueChart(cricketData.topVenues);
    renderPomChart(cricketData.topPlayers);
    renderAICharts(cricketData.aiIntelligence);
    renderFinalsTable(cricketData.recentFinals);
  } catch (err) {
    console.error('Failed to load cricket data:', err);
  }
}

function renderAICharts(ai) {
  if (!ai) return;

  // 1. Matchup Simulator Output
  const simContainer = document.getElementById('matchupSimulatorOutput');
  if (simContainer && ai.sampleMatchups) {
    simContainer.innerHTML = '';
    ai.sampleMatchups.forEach(m => {
      const card = document.createElement('div');
      card.style.cssText = 'padding: 10px 14px; background: rgba(255, 255, 255, 0.03); border-radius: 8px; border: 1px solid var(--border-subtle); display: flex; justify-content: space-between; align-items: center;';
      card.innerHTML = `
        <div style="flex: 1;">
          <strong style="color: ${m.probA > m.probB ? '#34d399' : '#f1f5f9'};">${m.teamA}</strong>
          <span style="font-size: 11px; color: #94a3b8; margin-left: 4px;">(${m.eloA} Elo)</span>
          <span style="margin: 0 6px; color: #64748b;">vs</span>
          <strong style="color: ${m.probB > m.probA ? '#34d399' : '#f1f5f9'};">${m.teamB}</strong>
          <span style="font-size: 11px; color: #94a3b8; margin-left: 4px;">(${m.eloB} Elo)</span>
        </div>
        <div style="display: flex; gap: 8px; align-items: center;">
          <span style="font-size: 12px; font-weight: 700; color: #38bdf8;">${m.probA}% - ${m.probB}%</span>
          <span style="font-size: 11px; background: rgba(16, 185, 129, 0.15); color: #34d399; padding: 2px 8px; border-radius: 6px;">Pick: ${m.predictedWinner}</span>
        </div>
      `;
      simContainer.appendChild(card);
    });
  }

  // 2. Par Score Chart
  const simVenues = ai.venueSimulations;
  if (simVenues) {
    const labels = simVenues.map(v => v.venue);
    const medians = simVenues.map(v => v.medianPar);
    const p90s = simVenues.map(v => v.p90Par);

    const ctxPar = document.getElementById('parScoreChart')?.getContext('2d');
    if (ctxPar) {
      charts.parScore = new Chart(ctxPar, {
        type: 'bar',
        data: {
          labels,
          datasets: [
            {
              label: 'Median 1st Innings Par',
              data: medians,
              backgroundColor: 'rgba(2, 132, 199, 0.8)',
              borderRadius: 4
            },
            {
              label: '90th Percentile Ceiling',
              data: p90s,
              backgroundColor: 'rgba(245, 158, 11, 0.75)',
              borderRadius: 4
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { labels: { color: '#94a3b8' } } },
          scales: {
            x: { grid: { display: false }, ticks: { color: '#94a3b8' } },
            y: { grid: { color: 'rgba(255, 255, 255, 0.04)' }, ticks: { color: '#94a3b8' }, title: { display: true, text: 'Runs', color: '#64748b' } }
          }
        }
      });
    }
  }
}

function renderKPIs(kpis) {
  document.getElementById('kpiMatches').textContent = kpis.totalMatches.toLocaleString();
  document.getElementById('kpiRuns').textContent = kpis.totalRuns.toLocaleString();
  document.getElementById('kpiWickets').textContent = kpis.totalWickets.toLocaleString();
  document.getElementById('kpiAvgRuns').textContent = `${kpis.avgRunsPerMatch} Runs`;
  document.getElementById('kpiAvgWickets').textContent = `${kpis.avgWicketsPerMatch} Wkts`;
}

function renderTimelineChart(editions) {
  const years = editions.map(e => e.year);
  const matches = editions.map(e => e.matches);
  const runs = editions.map(e => e.totalRuns);

  const ctx = document.getElementById('timelineChart').getContext('2d');
  charts.timeline = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: years,
      datasets: [
        {
          type: 'line',
          label: 'Total Runs Scored',
          data: runs,
          borderColor: '#f59e0b',
          backgroundColor: '#f59e0b',
          borderWidth: 2,
          pointRadius: 4,
          yAxisID: 'y1'
        },
        {
          type: 'bar',
          label: 'Matches Played',
          data: matches,
          backgroundColor: 'rgba(2, 132, 199, 0.75)',
          borderRadius: 6,
          yAxisID: 'y'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { labels: { color: '#94a3b8' } } },
      scales: {
        x: { grid: { display: false }, ticks: { color: '#94a3b8' } },
        y: { grid: { color: 'rgba(255, 255, 255, 0.04)' }, ticks: { color: '#94a3b8' }, title: { display: true, text: 'Matches', color: '#64748b' } },
        y1: { position: 'right', grid: { display: false }, ticks: { color: '#f59e0b' }, title: { display: true, text: 'Runs', color: '#f59e0b' } }
      }
    }
  });
}

function renderTeamChart(teams) {
  const top = teams.slice(0, 7);
  const labels = top.map(t => t.team);
  const wins = top.map(t => t.wins);
  const losses = top.map(t => t.losses);

  const ctx = document.getElementById('teamChart').getContext('2d');
  charts.team = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'Wins',
          data: wins,
          backgroundColor: '#10b981',
          borderRadius: 4
        },
        {
          label: 'Losses',
          data: losses,
          backgroundColor: '#f43f5e',
          borderRadius: 4
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { labels: { color: '#94a3b8' } } },
      scales: {
        x: { grid: { display: false }, ticks: { color: '#94a3b8' } },
        y: { grid: { color: 'rgba(255, 255, 255, 0.04)' }, ticks: { color: '#94a3b8' } }
      }
    }
  });
}

function renderVenueChart(venues) {
  const top = venues.slice(0, 7);
  const labels = top.map(v => v.venue.split(',')[0]);
  const matches = top.map(v => v.matches);
  const avgRuns = top.map(v => v.avgMatchScore);

  const ctx = document.getElementById('venueChart').getContext('2d');
  charts.venue = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'Matches Hosted',
          data: matches,
          backgroundColor: 'rgba(2, 132, 199, 0.8)',
          borderRadius: 6,
          yAxisID: 'y'
        },
        {
          type: 'line',
          label: 'Avg Match Aggregate',
          data: avgRuns,
          borderColor: '#10b981',
          backgroundColor: '#10b981',
          borderWidth: 2,
          pointRadius: 4,
          yAxisID: 'y1'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { labels: { color: '#94a3b8' } } },
      scales: {
        x: { grid: { display: false }, ticks: { color: '#94a3b8' } },
        y: { grid: { color: 'rgba(255, 255, 255, 0.04)' }, ticks: { color: '#94a3b8' }, title: { display: true, text: 'Matches', color: '#64748b' } },
        y1: { position: 'right', grid: { display: false }, ticks: { color: '#10b981' }, title: { display: true, text: 'Avg Runs', color: '#10b981' } }
      }
    }
  });
}

function renderPomChart(players) {
  const top = players.slice(0, 8);
  const labels = top.map(p => p.player);
  const awards = top.map(p => p.awards);

  const ctx = document.getElementById('pomChart').getContext('2d');
  charts.pom = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'POM Awards',
        data: awards,
        backgroundColor: 'rgba(245, 158, 11, 0.85)',
        borderRadius: 6
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { color: 'rgba(255, 255, 255, 0.04)' }, ticks: { color: '#94a3b8', stepSize: 1 } },
        y: { grid: { display: false }, ticks: { color: '#94a3b8' } }
      }
    }
  });
}

function renderFinalsTable(finals) {
  const tbody = document.querySelector('#finalsTable tbody');
  tbody.innerHTML = '';

  finals.forEach(f => {
    const teams = (f.team1 && f.team2) ? [f.team1, f.team2] : f.matchBetween?.split(' vs ') || ['Team A', 'Team B'];
    const champ = f.winner;
    const runnerUp = teams.find(t => t.toLowerCase() !== champ.toLowerCase()) || 'Runner Up';

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><span class="edition-pill">${f.edition}</span></td>
      <td><span class="champ-badge">🏆 ${champ}</span></td>
      <td>${runnerUp}</td>
      <td><strong>${f.winningRuns ? f.winningRuns + '/' + f.winningWickets : f.winScoreRaw}</strong></td>
      <td>${f.losingRuns ? f.losingRuns + '/' + f.losingWickets : f.loseScoreRaw}</td>
      <td>${f.result}</td>
      <td><strong>⭐ ${f.playerOfTheMatch}</strong></td>
    `;
    tbody.appendChild(tr);
  });
}

document.addEventListener('DOMContentLoaded', init);
