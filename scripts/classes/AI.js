import { SUITS_TO_PICTURES, TRUMP_SUIT_SCORER, OTHER_SUIT_SCORER } from '../static/consts.js';


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
          bid += TRUMP_SUIT_SCORER[card.value];
        } else {
          bid += OTHER_SUIT_SCORER[card.value];
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
    };

    // updating the pass count
    game.passCount++;
    return 'pass';
  }

  static calculateBidForTrickBidRound(cards, trumpSuit) {
    let bid = 0;

    cards.forEach(card => {
      if (card.suit === trumpSuit) {
        bid += TRUMP_SUIT_SCORER[card.value];
      } else {
        bid += OTHER_SUIT_SCORER[card.value];
      }
    });

    return Math.floor(bid);
  }

  static getTrickBid(game, player) {
    let bid = Ai.calculateBidForTrickBidRound(player.cards, game.trumpSuit);

    if (game.isTrickBidValid(bid)) {
      return bid;
    }

    if (Math.random() > 0.5) {
      return bid + 1;
    } 

    return bid - 1;

  }
}
