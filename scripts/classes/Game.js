import Deck from './Deck.js';
import { updateBoldLabel } from '../static/dynamicUIChanges.js';

export default class Game {
  constructor(players) {
    this.players = players;
    this.deck;
    this.round = 1;
    this.highestBid = 5;
    this.trumpSuit = 0;
    this.totalBids = 0;
    this.roundMode = 0;
    this.turn = 1;
    this.thrownCards = [];
    this.bidCount = 0;
    this.passCount = 0;
    this.trickBidsMade = 0;
    this.firstPlayerToPlay = 0;
  }

  determineFirstPlayer(isAllPassed) {
    // in case all the players passed, don't pass the turn to next player
    if (isAllPassed) {
      return this.turn;
    }
    if (this.firstPlayerToPlay === 4) {
      return 1;
    }
    return this.firstPlayerToPlay + 1;
  }

  newRound(isAllPassed) {
    this.highestBid = 5;
    this.trumpSuit = 0;
    this.totalBids = 0;
    this.roundMode = 0;
    this.thrownCards = [];
    this.bidCount = 0;
    this.passCount = 0;
    this.trickBidsMade = 0;

    this.firstPlayerToPlay = this.determineFirstPlayer(isAllPassed);

    //resetting the stats of each player
    this.players.forEach((player) => {
      player.resetStats();
    });

    //creating a new deck
    this.deck = new Deck();
    this.deck.shuffle();
    this.dealCards();
    console.log(this.players);

    updateBoldLabel(this.firstPlayerToPlay);
  }

  dealCards() {
    while (this.deck.cards.length > 0) {
      this.players.forEach((player) => {
        player.cards.push(this.deck.cards.pop());
        player.sortCards();
      });
    }
  }

  // checks if the trump suit bid is valid
  isTrumpSuitBidValid(bidAmount, bidSuit) {
    // if the player passes - the pass button is the sixth button
    if (bidSuit === 6) {
      return 'pass';
    }

    //if the player tries to bid
    if (bidAmount < this.highestBid) {
      return false;
    }

    if (bidAmount === this.highestBid && bidSuit <= this.trumpSuit) {
      return false;
    }

    console.log('good bid');
    return true;
  }

  isTrickBidValid(bid) {
    if (this.trickBidsMade === 0 && bid < this.highestBid) {
      return false;
    }
    if (this.trickBidsMade === 3 && this.totalBids + bid === 13) {
      return false;
    }
    return true;
  }

  isCardValid(player, card) {
    // first player card is always valid
    if (this.thrownCards.length === 0) {
      return true;
    }

    // the suit of the first card played
    const playedSuit = this.thrownCards[0][1].suit;

    // valid if the suits are identical
    if (card.suit === playedSuit) {
      return true;
    }

    // checking if the player has cards of the same suit
    player.cards.forEach((card) => {
      if (card.suit === playedSuit) {
        return false;
      }
    });

    // all other cases
    return true;
  }

  // over or under
  getRoundMode() {
    this.roundMode = this.totalBids - 13;
    if (this.roundMode > 0) {
      return `Over ${this.roundMode}`;
    }
    return `Under ${13 - this.totalBids}`;
  }

  nextTurn() {
    if (this.turn === 4) {
      this.turn = 1;
    } else {
      this.turn++;
    }

    updateBoldLabel(this.turn);
  }

  determineTrickWinner() {
    let trumpCount = 0;
    const firstCard = this.thrownCards[0][1];

    // removing all the cards that don't match the played suit or the trump suit

    // I do not understand this condition
    // Why do we need trumpCount (filter will just not do anything if trumpCount is 0)
    // is sub-round actually called 'Trick'?
    for (let i = 0; i < this.thrownCards.length; i++) {
      const card = this.thrownCards[i][1];
      if (card.suit !== firstCard.suit && card.suit !== this.trumpSuit) {
        this.thrownCards.splice(i, 1);
      } else if (card.suit === this.trumpSuit) {
        trumpCount++;
      }
    }

    // removing all the card that don't match the trump suit
    if (trumpCount > 0) {
      this.thrownCards.filter((PlayerCardPair) => PlayerCardPair[1].suit === this.trumpSuit);
    }

    // sorting the list by descending values
    this.thrownCards.sort((a, b) => b[1].value - a[1].value);

    // getting the winner and giving him the trick
    let winningPlayer = this.thrownCards[0][0];
    winningPlayer.tricks++;

    this.thrownCards = [];
    this.turn = winningPlayer.index;

    updateBoldLabel(winningPlayer.index);
  }
}
