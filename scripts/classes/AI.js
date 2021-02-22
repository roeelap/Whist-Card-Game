import { SUITS_TO_ICONS, OVER, UNDER, MIN_VALID_TRUMP_BID } from '../static/consts.js';
import Player from './Player.js';
import * as cf from '../static/cardFunctions.js';
import { selectTrump, handEvaluation, convertScoreToBid } from '../static/bidCalculations.js';
import { showCard } from '../static/dynamicUIChanges.js';

export default class AI extends Player {
  constructor(index, roundMode) {
    super(index);
    this.remainingCards = [];
    this.playingMode = roundMode;
  }

  trumpSuitBid(game) {
    // calculate the wanted suit and bid
    const obj = selectTrump(this.cards);
    const suit = obj.suit;
    const bid = obj.bid;

    /* figure out the minimum bid which will be higher than the highest bid,
       and lower/equal to the wanted bid. */
    for (let value = MIN_VALID_TRUMP_BID; value <= bid; value++) {
      if (game.isTrumpSuitBidValid(value, suit)) {
        game.bidCount++;
        game.passCount = 0;
        game.highestBid = this.bid = value;
        game.trumpSuit = suit;

        return { value, suit: SUITS_TO_ICONS[suit] };
      }
    }
    // updating the pass count
    game.passCount++;
    return 'pass';
  }

  tricksBid(game) {
    const totalScore = handEvaluation(this.cards, game.trumpSuit);
    const bid = convertScoreToBid(totalScore);

    if (game.isTrickBidValid(bid)) {
      return bid;
    }

    if (Math.random() < 0.5 && bid !== 0) {
      return bid - 1;
    }

    return bid + 1;
  }

  startingTheRoundOver() {
    const HighestCard = cf.getHighestCardExcludingTrumpSuit(this.cards, game.trumpSuit);

    // only trump cards in hand - pick random one
    if (!HighestCard) {
      return this.cards[Math.floor(Math.random() * this.cards.length)];
    }

    const isHighestCard = cf.isHighestCardOfSameSuit(HighestCard, this.remainingCards);

    // if not the highest, throw the lowest card
    if (!isHighestCard) {
      return cf.getLowestCardExcludingTrumpSuit(this.cards, game.trumpSuit);
    }

    return HighestCard;
  }

  startingTheRoundUnder() {
    const lowestCard = cf.getLowestCardExcludingTrumpSuit(this.cards, game.trumpSuit);

    // only trump cards in hand - pick random one
    if (!lowestCard) {
      return this.cards[Math.floor(Math.random() * this.cards.length)];
    }

    const isLowestCard = cf.isCardLosingInUnder(lowestCard, this.remainingCards);

    // if lowest card not found, return the certain losing card
    if (!isLowestCard) {
      const losingCard = cf.getLosingCard(this.cards, this.remainingCards);

      // if no certain losing card, return the lowest card in hand
      if (!losingCard) {
        return cf.getLowestCardInHand(this.cards);
      }
      return losingCard;
    }

    return lowestCard;
  }

  getThrowingCardOver() {
    // if starting the game
    if (game.thrownCards.length === 0) {
      return this.startingTheRoundOver();
    }

    const playedCard = game.thrownCards[0];
    const playedSuit = playedCard.card.suit;
    const playableCards = cf.getPlayableCards(this.cards, playedSuit);

    // can play any cards
    if (playableCards.length === this.cards.length) {
      const lowestWinningTrumpCard = cf.getLowestWinningTrumpCard(this.cards, game.trumpSuit, game.thrownCards);
      if (lowestWinningTrumpCard) {
        return lowestWinningTrumpCard;
      }
      // if no trump cards in hand, put the lowest card
      return cf.getLowestCardInHand(this.cards);
    }

    // check if trump card has been played. If so - put lowest playable card
    const playedTrumpCard = cf.getTrumpCard(game.thrownCards, game.trumpSuit);
    if (playedTrumpCard) {
      return cf.getLowestCardInHand(playableCards);
    }

    // can play only of specific suit
    const highestPlayableCard = playableCards[playableCards.length - 1];
    if (cf.isHighestCardOfSameSuit(highestPlayableCard, this.remainingCards)) {
      return highestPlayableCard;
    }

    // if none of the above, put lowest card in hand
    return cf.getLowestCardInHand(playableCards);
  }

  getThrowingCardUnder() {
    // if starting the game
    if (game.thrownCards.length === 0) {
      return this.startingTheRoundUnder(); // TODO
    }

    const playedCard = game.thrownCards[0];
    const playedSuit = playedCard.card.suit;
    const playableCards = cf.getPlayableCards(this.cards, playedSuit);

    // can play any cards
    if (playableCards.length === this.cards.length) {
      const highestCardInHand = cf.getHighestCardExcludingTrumpSuit(this.cards, game.trumpSuit);
      if (highestCardInHand) {
        return highestCardInHand;
      }
      // only trump cards in hand
      return cf.getHighestCardInHand(this.cards);
    }

    // can play only of specific suit - put highest card that cannot win
    const highestThrownCard = cf.getHighestThrownCard(game.thrownCards);
    const highestLosingCard = cf.getHighestLosingCard(playableCards, highestThrownCard, this.remainingCards);

    if (highestLosingCard) {
      return highestLosingCard;
    }

    // if none of the above, put highest card in hand
    return cf.getHighestCardInHand(playableCards);
  }

  throwCard = () => {
    this.playingMode = this.determinePlayingMode(game.players, game.roundMode);
    const thrownCard = this.playingMode === OVER ? this.getThrowingCardOver() : this.getThrowingCardUnder();
    const thrownCardIndex = cf.getCardIndex(thrownCard, this.cards);

    // putting the card on the game board
    const img = this.cards[thrownCardIndex].getImage();
    const cardLabel = $(`#player${this.index}Card`);
    showCard(img, cardLabel);

    // removing the card from the player's hand
    game.thrownCards.push({ player: this, card: this.cards.splice(thrownCardIndex, 1)[0] });

    game.nextTurn();
  };

  determinePlayingMode = (players, roundMode) => {
    if (this.tricks >= this.bid) {
      return UNDER;
    }

    let failCount = 0;
    for (const player of players) {
      if (player.tricks > player.bid && player.index !== this.index) {
        failCount += player.tricks - player.bid;
      }
    }

    if (failCount >= Math.abs(roundMode)) {
      return OVER;
    }

    return roundMode > 0 ? OVER : UNDER;
  };
}
