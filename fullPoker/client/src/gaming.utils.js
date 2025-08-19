const canPlay = (rows, i) => {
  return rows[i].stillPlaying;
}

export function nextEligible (rows, start) {
  const n = rows.length;
  for (let i = 0; i < n; i++) {
    const player = (i + start) % n;
    if (canPlay(rows, player)) return player;
  }
  return -1;
};

export function resetGameUtil(prevRows, {winner, pot, SB, BB, bigBlind, smallBlind}) {
  const n = prevRows.length;
  if (!n) return { "rows": prevRows, "pot": 0, "SB": SB, "BB": BB, "hasAction": 0 };

  const afterWin = prevRows.map((row, i) => {
    const chips = row.chips + (i === winner ? pot : 0);
    return {
      ...row,
      position: "",
      stillPlaying: true,
      hasAction: false,
      preFlop: 0,
      flop: 0,
      turn: 0,
      river: 0,
      actions: [1, 2, 3, 4],
      message: "",
      chips,
    };
  });

  const activePlayers = afterWin.map((row) => {
    if (row.chips >= bigBlind) return row;
    return { ...row, stillPlaying: false, message: "not enough chips"}
  });

  const newSB = nextEligible(activePlayers, (SB + 1) % n);
  if (newSB === -1) return { "row": activePlayers, "pot": 0, "SB": -1, "BB": -1, "hasAction": 0}
  const newBB = nextEligible(activePlayers, (newSB + 1) % n)
  if (newBB === -1) return { "row": activePlayers, "pot": 0, "SB": -1, "BB": -1, "hasAction": 0}

  const withBlinds = activePlayers.map((row, i) => {
    if (i === newSB) {
      return { ...row, position: "SB", preFlop: smallBlind, chips: row.chips - smallBlind };
    }
    if (i === newBB) {
      return { ...row, position: "BB", preFlop: bigBlind, chips: row.chips - bigBlind };
    }
    return row;
  });

  const nextHasAction = nextEligible(activePlayers, (BB + 1) % n);
  const withAction = withBlinds.map((row, i) => {
    if (i === nextHasAction) {
      return { ...row, hasAction: true};
    }
    return row;
  });

  return {
    "rows": withAction,
    "pot": smallBlind + bigBlind,
    "SB": newSB,
    "BB": newBB,
    "hasAction": nextHasAction,
  };
}


