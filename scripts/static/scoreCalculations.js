const calculateScoreForBid0 = (player, isSuccess, roundMode) => {
  // score calculations
  return isSuccess
    ? roundMode > 0
      ? 5
      : roundMode === -1
      ? 30
      : roundMode === -2
      ? 40
      : 50
    : roundMode > 0
    ? -5 + 5 * (player.tricks - 1)
    : roundMode === -1
    ? -30 + 10 * (player.tricks - 1)
    : roundMode === -2
    ? -40 + 10 * (player.tricks - 1)
    : -50 + 10 * (player.tricks - 1);
};

const calculateScore = (player, isSuccess, tricksBidDifference) => {
  if (isSuccess) {
    return 10 + player.bid ** 2;
  }

  if (player.bid < 5) {
    return -5 * tricksBidDifference;
  }
  if (player.bid === 5) {
    return -10 * tricksBidDifference;
  }
  if (player.bid === 6) {
    return -15 * tricksBidDifference;
  }

  return -20 * tricksBidDifference;
};

export const updateScore = (player, roundMode) => {
  const tricksBidDifference = Math.abs(player.tricks - player.bid);
  const isSuccess = tricksBidDifference === 0;

  if (player.bid === 0) {
    player.score += calculateScoreForBid0(player, isSuccess, roundMode);
  } else {
    player.score += calculateScore(player, isSuccess, tricksBidDifference);
  }
};
