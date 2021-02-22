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

export const INSTRUCTIONS = [
  {
    title: "ISRAELI WHIST RULES",
    body: `Israeli Whist is a four player card game.
    A round begins by dealing out all the
    cards (without jokers) to four players.
    There are two rounds of bidding:
    a round to determine the trump suit,
    and a round to determine the contract.
    The object of the game is to win the exact
    number of tricks in the contract.`
  },
  {
    title: "BID FOR TRUMP SUIT",
    body: `During the bidding that determines the
    trump suit, each player can say "pass",
    or to bid. Bidding includes the number
    of future tricks given a certain trump suit.
    The bid that determines the trump is the
    one that after it there are three "passes"
    in a row. If all four players say "pass"
    a new round begins.`
  },
  {
    title: "BID FOR CONTRACT",
    body: `After the trump suit is determined, there
    is another bidding round in which the
    "contracts" are determined. The player that
    determined the trump suit, must declare the
    number of tricks to be at least the number
    he declared in the previous bidding round.
    The last player is not allowed to make a bid
    that makes the sum of all four bids 13.`
  },
  {
    title: "PUTTING DOWN CARDS",
    body: `After the contracts are declared, the players
    can start putting down cards. every time, the winner of the
    previous round starts. every player must put down a card
    that matches the suit of the starting card. if he doesn't
    have any matching cards, he can put any card that he wants.`
  },
  {
    title: "SCORE",
    body: `If a player makes his contract (with zero
      as the exception), he receives the number
      of tricks squared plus ten.
      If a player does not make his contract
      (with zero as the exception), he gets minus
      ten points for each deviation from his"
      contract.`
  },
  {
    title: "ZERO CONTRACT",
    body: `A player that bids zero and makes it,
    receives 50 points in an "under" game
    (sum of bids is less than 13) and 25 in an
    "over" game (sum of bids is more than 13).
    A player that bids zero loses 50 points if
    he wins one trick. If he wins more than
    one trick, for each additional trick he won,
    he receives 10 points.`
  }
]