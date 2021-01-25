const mostFreqSuitScorer = [
[2, 0.25],
[3, 0.25],
[4, 0.25],
[5, 0.25],
[6, 0.5],
[7, 0.5],
[8, 0.5],
[9, 0.75],
[10, 0.75],
[11, 1],
[12, 1],
[13, 1],
[14, 1],
];
const otherSuitScorer = [
[12, 0.5],
[13, 1],
[14, 1],
];


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
    
  }

  static getTrumpSuitBid(game, player) {
    let clubs = player.cards.filter((card) => card.suit === 1);
    let diamonds = player.cards.filter((card) => card.suit === 2);
    let hearts = player.cards.filter((card) => card.suit === 3);
    let spades = player.cards.filter((card) => card.suit === 4);

    // figure out which suit is the most common
    let cards = [clubs, diamonds, hearts, spades].sort((a, b) => b.length - a.length);

    let mostFreqSuit = cards[0];
    let otherSuits = cards.slice(1, 4);

    // if the most common suit is less than 4 cards, just pass
    if (mostFreqSuit.length < 5) {
      // updating the pass count
      game.passCount++;
      return 'pass';
    }

    let bid = 0;

    // get the score for the most common suit
    mostFreqSuitScorer.forEach((cardValue) => {
      if (Ai.isCardInArray(mostFreqSuit, cardValue[0])) {
        bid += cardValue[1];
      }
    });

    // get the score for the other suits
    otherSuits.forEach((suitArray) => {
      otherSuitScorer.forEach((cardValue) => {
        if (Ai.isCardInArray(suitArray, cardValue[0])) {
          bid += cardValue[1];
        }
      });
    });

    if (game.isTrumpSuitBidValid(Math.floor(bid), mostFreqSuit[0].suit)) {
      game.bidCount++;
      game.passCount = 0;

      // updating the highest bid and the trump suit
      game.highestBid = player.bid = Math.floor(bid);
      game.trumpSuit = mostFreqSuit[0].suit;

      return `${Math.floor(bid)}${SUITS_TO_PICTURES[mostFreqSuit[0].suit]}`;
    } else {
      // updating the pass count
      game.passCount++;
      return 'pass';
    }
  }
}