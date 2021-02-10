import { SUITS_TO_PICTURES, TRUMP_SUIT_SCORER, OTHER_SUIT_SCORER } from '../static/consts.js';

export default class AI {
  static isCardInArray(array, value) {
    for (let i = 0; i < array.length; i++) {
      if (array[i].value === value) {
        return true;
      }
    }
    return false;
  }

  static divideCardsBySuits(cards) {
    const clubs = cards.filter((card) => card.suit === 1);
    const diamonds = cards.filter((card) => card.suit === 2);
    const hearts = cards.filter((card) => card.suit === 3);
    const spades = cards.filter((card) => card.suit === 4);

    return [clubs, diamonds, hearts, spades];
  }

  static calculateBidForTrumpSuitRound(cards) {
    const mostFreqSuit = cards[0][0].suit;
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
    const cards = AI.divideCardsBySuits(player.cards).sort((a, b) => b.length - a.length);

    // if the most common suit is less than 5 cards, just pass
    if (cards[0].length < 5) {
      game.passCount++;
      return 'pass';
    }

    // calculate the wanted suit and bid
    const [bid, suit] = AI.calculateBidForTrumpSuitRound(cards);

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

  static calculateBidForTrickBidRound(cards, trumpSuit) {
    let bid = 0;

    cards.forEach((card) => {
      if (card.suit === trumpSuit) {
        bid += TRUMP_SUIT_SCORER[card.value];
      } else {
        bid += OTHER_SUIT_SCORER[card.value];
      }
    });

    return Math.floor(bid);
  }

  static getTrickBid(game, player) {
    const bid = AI.calculateBidForTrickBidRound(player.cards, game.trumpSuit);

    if (game.isTrickBidValid(bid)) {
      return bid;
    }

    if (Math.random() > 0.5) {
      return bid + 1;
    }

    return bid - 1;
  }

  static getIndexOfHighestCardInHand(cards) {
    let highestCardIndex = 0;
    for (let i = 1; i < cards.length; i++) {
      if (cards[i].value > cards[highestCardIndex].value) {
        highestCardIndex = i;
      }
    }
    return highestCardIndex;
  }

  static getIndexOfLowestCardInHand(cards) {
    let lowestCardIndex = 0;
    for (let i = 1; i < cards.length; i++) {
      if (cards[i].value < cards[lowestCardIndex].value) {
        lowestCardIndex = i;
      }
    }
    return lowestCardIndex;
  }

  static getCardToThrowOver(game, player) {
    const cards = player.cards;

    if (game.thrownCards.length === 0) {
      return AI.getIndexOfHighestCardInHand(cards);
    }

    const playedCard = game.thrownCards[0];
    const playedSuit = playedCard.card.suit;

    if (cards.filter((card) => card.suit === playedSuit).length > 0) {
      for (let i = cards.length - 1; i > -1; i--) {
        if (cards[i].suit === playedSuit) {
          return i;
        }
      }
    }

    return AI.getIndexOfLowestCardInHand(cards);
  }

  static getCardToThrowUnder(game, player) {
    const cards = player.cards;

    if (game.thrownCards.length === 0) {
      return AI.getIndexOfLowestCardInHand(cards);
    }

    const playedCard = game.throwCards[0];
    const playedSuit = playedCard.card.suit;

    if (cards.filter((card) => card.suit === playedSuit).length > 0) {
      for (let i = 0; i < cards.length; i++) {
        if (cards[i].suit === playedSuit) {
          return i;
        }
      }
    }

    return AI.getIndexOfHighestCardInHand(cards);
  }

  static throwCard = (player, index) => {
    // putting the clicked card on the game board
    const img = player.cards[index].getImage();
    const playerCardId = `#player${player.index}Card`;
    $(playerCardId).css('background', `url(${img}) no-repeat center center/contain`);

    // removing the card from the player's hand
    game.thrownCards.push({ player, card: player.cards.splice(index, 1)[0] });

    // next turn
    game.nextTurn();
  };
}
