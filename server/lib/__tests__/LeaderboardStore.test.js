const LeaderboardStore = require('../LeaderboardStore');

describe('LeaderboardStore', () => {
  test('new players start at 0 wins / 0 losses', () => {
    const store = new LeaderboardStore();
    store.ensurePlayer('Alice');
    expect(store.stats.get('Alice')).toEqual({ wins: 0, losses: 0 });
  });

  test('recordResult() increments the winner wins and loser losses', () => {
    const store = new LeaderboardStore();
    store.recordResult('Alice', 'Bob');
    expect(store.stats.get('Alice')).toEqual({ wins: 1, losses: 0 });
    expect(store.stats.get('Bob')).toEqual({ wins: 0, losses: 1 });
  });

  test('recordResult() accumulates across multiple games', () => {
    const store = new LeaderboardStore();
    store.recordResult('Alice', 'Bob');
    store.recordResult('Alice', 'Bob');
    store.recordResult('Bob', 'Alice');
    expect(store.stats.get('Alice')).toEqual({ wins: 2, losses: 1 });
    expect(store.stats.get('Bob')).toEqual({ wins: 1, losses: 2 });
  });

  test('toRanking() sorts players by wins, descending', () => {
    const store = new LeaderboardStore();
    store.recordResult('Alice', 'Bob');
    store.recordResult('Alice', 'Carol');
    store.recordResult('Bob', 'Carol');

    const ranking = store.toRanking();
    expect(ranking.map((r) => r.name)).toEqual(['Alice', 'Bob', 'Carol']);
    expect(ranking[0]).toEqual({ name: 'Alice', wins: 2, losses: 0 });
  });

  test('toRanking() returns an empty array when no games were played', () => {
    const store = new LeaderboardStore();
    expect(store.toRanking()).toEqual([]);
  });
});
