import { NO_TRUMP } from './consts.js';

const count = (value, array) => {
  return array.filter((item) => item === value).length;
};

export const convertScoreToBid = (totalScore) => {
  const bid =
    totalScore <= 5
      ? 0
      : totalScore <= 9
      ? 1
      : totalScore <= 12
      ? 2
      : totalScore <= 15
      ? 3
      : totalScore <= 18
      ? 4
      : totalScore <= 21
      ? 5
      : totalScore <= 24
      ? 6
      : totalScore <= 27
      ? 7
      : totalScore <= 30
      ? 8
      : totalScore <= 32
      ? 9
      : totalScore <= 34
      ? 10
      : totalScore <= 36
      ? 11
      : totalScore <= 38
      ? 12
      : 13;

  return bid;
};

const constructValuesCountArray = (cards) => {
  let valuesCountArray = new Array(15).fill(0);
  for (const card of cards) {
    valuesCountArray[card.value]++;
  }
  return valuesCountArray;
};

const constructSuitsCountArray = (cards) => {
  let suitsCountArray = new Array(6).fill(0);
  for (const card of cards) {
    suitsCountArray[card.suit]++;
  }
  return suitsCountArray;
};

// Returns an array of arrays, each array holds the cards of a specific suit
const divideCardsBySuits = (cards) => {
  const clubs = cards.filter((card) => card.suit === 1);
  const diamonds = cards.filter((card) => card.suit === 2);
  const hearts = cards.filter((card) => card.suit === 3);
  const spades = cards.filter((card) => card.suit === 4);

  return [clubs, diamonds, hearts, spades];
};

const calculateHighCardPoints = (cardsBySuit, valuesCountArray) => {
  let HCP = 0;
  /*  Basic evaluation method assigns values to the top four honour cards as follows:
      ace = 4 HCP
      king = 3 HCP
      queen = 2 HCP
      jack = 1 HCP   */
  HCP += valuesCountArray[14] * 4 + valuesCountArray[13] * 3 + valuesCountArray[12] * 2 + valuesCountArray[11] * 1;

  // if no Aces -> reducing 1 HCP
  if (valuesCountArray[14] === 0) {
    HCP -= 1;
  }
  // if 4 Aces -> adding 1 HCP
  if (valuesCountArray[14] === 4) {
    HCP += 1;
  }
  // adjust 10's -> adding 1/2 HCP for each 10
  HCP += valuesCountArray[10] / 2;

  // deducting one HCP for a singleton king, queen, or jack.
  for (const suitsArray of cardsBySuit) {
    if (suitsArray.length === 1) {
      const cardValue = suitsArray[0].value;
      if (cardValue >= 11 && cardValue != 14) {
        HCP--;
      }
    }
  }

  return HCP;
};

/* 
Length Points (LP)
5-card suit = 1 point
6 card suit = 2 points
7 card suit = 3 points ... etc.
*/
const calculateLengthPoints = (suitsCountArray) => {
  let LP = 0;
  for (const suitCount of suitsCountArray) {
    if (suitCount >= 5) {
      LP += suitCount - 4;
    }
  }
  return LP;
};

/* 
Shortage Points (SP):
When the supporting hand holds three trumps, shortness is valued as follows:
void = 3 points
singleton = 2 points
doubleton = 1 point
When the supporting hand holds four or more trumps, thereby having
more spare trumps for ruffing, shortness is valued as follows:
void = 5 points
singleton = 3 points
doubleton = 1 point
Shortage points are added to HCP to give total points.            
*/
const calculateShortagePoints = (suitsCountArray, trumpSuit) => {
  if (!trumpSuit) {
    return 0;
  }

  let SP = 0;
  const trumpCount = suitsCountArray[trumpSuit];
  if (trumpCount === 3) {
    SP += count(0, suitsCountArray) * 3 + count(1, suitsCountArray) * 2 + count(2, suitsCountArray) * 1;
  } else if (trumpCount >= 4) {
    SP += count(0, suitsCountArray) * 5 + count(1, suitsCountArray) * 3 + count(2, suitsCountArray) * 1;
  }

  return SP;
};

/* 
Evaluates the initial bidding (no trump)
and the secondary (with trump selected).
Summary:
    When intending to make a bid in a suit and there is no agreed upon
    trump suit, add high card points (HCP) and length points (LP) to
    get the total point value of one's hand.
    With an agreed trump suit, add high card points and shortness
    points (SP) instead.
    When making a bid in noTrump with intent to play, value high-card 
    points only.
*/
export const handEvaluation = (cards, trumpSuit = null) => {
  const cardsBySuit = divideCardsBySuits(cards);
  const valuesCountArray = constructValuesCountArray(cards);
  const suitsCountArray = constructSuitsCountArray(cards);
  const HCP = calculateHighCardPoints(cardsBySuit, valuesCountArray);
  const LP = calculateLengthPoints(suitsCountArray);
  const SP = calculateShortagePoints(suitsCountArray, trumpSuit);

  const totalScore = !trumpSuit ? HCP + LP : trumpSuit === NO_TRUMP ? HCP : HCP + SP;
  return totalScore;
};

export const selectTrump = (cards) => {
  let scores = new Array(6).fill(null);
  for (let suit = 1; suit < 6; suit++) {
    scores[suit] = handEvaluation(cards, suit);
  }

  // returns the suit with highest score
  return { suit: scores.indexOf(Math.max(...scores)), bid: convertScoreToBid(Math.max(...scores)) };
};
