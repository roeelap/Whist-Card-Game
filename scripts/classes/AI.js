import { SUITS_TO_PICTURES } from '../static/consts.js';

const mostFreqSuitScores = {
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

const otherSuitScores = {
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

export default class Ai {
  static isCardInArray(array, value) {
    for (let i = 0; i < array.length; i++) {
      if (array[i].value === value) {
        return true;
      }
    }
    return false;
  }

  static divideCardsBySuits(cards) {
    let clubs = cards.filter((card) => card.suit === 1);
    let diamonds = cards.filter((card) => card.suit === 2);
    let hearts = cards.filter((card) => card.suit === 3);
    let spades = cards.filter((card) => card.suit === 4);

    return [clubs, diamonds, hearts, spades];
  }

  static calculateBidForTrumpSuitRound(cards) {
    let mostFreqSuit = cards[0][0].suit;
    let bid = 0;

    // for each card, add it's score to the bid variable
    cards.forEach((suitArray) => {
      suitArray.forEach((card) => {
        if (card.suit === mostFreqSuit) {
          bid += mostFreqSuitScores[card.value];
        } else {
          bid += otherSuitScores[card.value];
        }
      });
    });

    return [Math.floor(bid), mostFreqSuit];
  }

  static getTrumpSuitBid(game, player) {
    // figure out which suit is the most common
    let cards = Ai.divideCardsBySuits(player.cards).sort((a, b) => b.length - a.length);

    // if the most common suit is less than 5 cards, just pass
    if (cards[0].length < 5) {
      game.passCount++;
      return 'pass';
    }

    // calculate the wanted suit and bid
    let [bid, suit] = Ai.calculateBidForTrumpSuitRound(cards);

    // figure out the minimum bid which will be higher than the highest bid,
    // and lower/equal to the wanted bid.
    for (let i = 0; i <= bid; i++) {
      if (game.isTrumpSuitBidValid(i, suit)) {
        game.bidCount++;
        game.passCount = 0;
        game.highestBid = player.bid = i;
        game.trumpSuit = suit;

        return `${i}${SUITS_TO_PICTURES[suit]}`;
      }
    }

    // updating the pass count
    game.passCount++;
    return 'pass';
  }
}
