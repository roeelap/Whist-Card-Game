export const SUITS_TO_ICONS = {
  1: '<i class="bi bi-suit-club-fill"></i>',
  2: '<i class="bi bi-suit-diamond-fill red"></i>',
  3: '<i class="bi bi-suit-heart-fill red"></i>',
  4: '<i class="bi bi-suit-spade-fill"></i>',
  5: 'NT',
};

export const SUITS_TO_IMAGES = {
  1: '../../images/suits/clubs.png',
  2: '../../images/suits/diamond.png',
  3: '../../images/suits/heart.png',
  4: '../../images/suits/spade.png',
  5: '../../images/suits/no-trump.png',
};

export const NO_TRUMP = 5;
export const OVER = 1;
export const UNDER = -1;
export const MIN_VALID_TRUMP_BID = 5;

const SECOND = 1000;
export const TURN_TIMEOUT = 0 * SECOND;
export const ROUND_TIMEOUT = 0 * SECOND;
