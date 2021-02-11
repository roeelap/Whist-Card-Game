import { SUITS_TO_PICTURES, TRUMP_SUIT_SCORER, OTHER_SUIT_SCORER } from '../static/consts.js';
import Player from './Player.js';
import * as cardIndexes from '../static/cardIndexes.js';

export default class AI extends Player {
  constructor(index, roundMode) {
    super(index);
    this.remainingCards = [];
    this.playingMode = roundMode;
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

  startingTheRoundOver() {
    const indexOfHighest = cardIndexes.getIndexOfHighestCardExcludingTrumpSuit(this.cards, game.trumpSuit);

    // only trump cards in hand - pick random one
    if (!indexOfHighest) {
      return Math.floor(Math.random() * this.cards.length);
    }

    const isHighestCard = cardIndexes.isHighestCardOfSameSuit(this.cards[indexOfHighest], this.remainingCards);

    // if not the highest, throw the lowest card
    if (!isHighestCard) {
      return cardIndexes.getIndexOfLowestCardExcludingTrumpSuit(this.cards, game.trumpSuit);
    }

    return indexOfHighest;
  }

  // returns cards AND INDEXES
  getPlayableCards(playedSuit) {
    let playableCards = [];
    for (const [index, card] of this.cards.entries()) {
      if (card.suit === playedSuit) {
        playableCards.push({ index, card });
      }
    }

    if (!playableCards.length) {
      return this.cards;
    }

    return playableCards;
  }

  getThrowingCardIndexOver() {
    // if starting the game
    if (game.thrownCards.length === 0) {
      return this.startingTheRoundOver();
    }

    const playedCard = game.thrownCards[0];
    const playedSuit = playedCard.card.suit;
    const playableCards = this.getPlayableCards(playedSuit);

    // can play any cards
    if (playableCards.length === this.cards.length) {
      return; // TODO - put trump over any card played
    }

    const highestCardOfPlayableCard = playableCards[playableCards.length - 1];
    if (cardIndexes.isHighestCardOfSameSuit(highestCardOfPlayableCard.card, this.remainingCards)) {
      return highestCardOfPlayableCard.index;
    }

    return cardIndexes.getIndexOfLowestCardInHand(this.cards);
  }

  getThrowingCardIndexUnder() {
    if (game.thrownCards.length === 0) {
      return cardIndexes.getIndexOfLowestCardInHand(this.cards);
    }

    const playedCard = game.thrownCards[0];
    const playedSuit = playedCard.card.suit;

    if (cards.filter((card) => card.suit === playedSuit).length > 0) {
      for (let i = 0; i < cards.length; i++) {
        if (cards[i].suit === playedSuit) {
          return i;
        }
      }
    }

    return cardIndexes.getIndexOfHighestCardInHand(cards);
  }

  throwCard = () => {
    const thrownCardIndex = this.playingMode > 0 ? this.getThrowingCardIndexOver() : this.getThrowingCardIndexUnder();

    // putting the clicked card on the game board
    const img = this.cards[thrownCardIndex].getImage();
    const playerCardId = `#player${this.index}Card`;
    $(playerCardId).css('background', `url(${img}) no-repeat center center/contain`);

    // removing the card from the player's hand
    game.thrownCards.push({ player: this, card: this.cards.splice(thrownCardIndex, 1)[0] });

    // calculate playingMode for AI
    if (this.tricks == this.bid) {
      this.playingMode = -1;
    }

    // next turn
    game.nextTurn();
  };
}
