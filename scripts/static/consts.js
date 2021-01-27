export const SUITS_TO_PICTURES = {
  1: '<i class="bi bi-suit-club-fill"></i>',
  2: '<i class="bi bi-suit-diamond-fill red"></i>',
  3: '<i class="bi bi-suit-heart-fill red"></i>',
  4: '<i class="bi bi-suit-spade-fill"></i>',
  5: 'NT',
};

export const TRUMP_SUIT_SCORER = {
  2: 0.25,
  3: 0.25,
  4: 0.25,
  5: 0.25,
  6: 0.5,
  7: 0.5,
  8: 0.5,
  9: 0.75,
  10: 0.75,
  11: 1,
  12: 1,
  13: 1,
  14: 1,
};

export const OTHER_SUIT_SCORER = {
  2: 0,
  3: 0,
  4: 0,
  5: 0,
  6: 0,
  7: 0,
  8: 0,
  9: 0,
  10: 0,
  11: 0,
  12: 0.5,
  13: 1,
  14: 1,
};
