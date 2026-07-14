class LeaderboardStore {
  constructor() {
    this.stats = new Map(); // name -> { wins, losses }
  }

  recordResult(winnerName, loserName) {
    this.ensurePlayer(winnerName);
    this.ensurePlayer(loserName);
    this.stats.get(winnerName).wins += 1;
    this.stats.get(loserName).losses += 1;
  }

  ensurePlayer(name) {
    if (!this.stats.has(name)) {
      this.stats.set(name, { wins: 0, losses: 0 });
    }
  }

  toRanking() {
    return Array.from(this.stats.entries())
      .map(([name, record]) => ({ name, ...record }))
      .sort((a, b) => b.wins - a.wins);
  }
}

module.exports = LeaderboardStore;
