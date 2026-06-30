const K_FACTOR = 32;

export function expectedScore(ratingA: number, ratingB: number): number {
  return 1 / (1 + 10 ** ((ratingB - ratingA) / 400));
}

export function updateRatings(
  winnerRating: number,
  loserRating: number,
): { winner: number; loser: number } {
  const expectedWinner = expectedScore(winnerRating, loserRating);
  const expectedLoser = expectedScore(loserRating, winnerRating);

  return {
    winner: Math.round(winnerRating + K_FACTOR * (1 - expectedWinner)),
    loser: Math.round(loserRating + K_FACTOR * (0 - expectedLoser)),
  };
}
