import Deck from './deck.js';

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

  newRound(isAllPassed) {
    // resetting the stats
    this.highestBid = 5;
    this.trumpSuit = 0;
    this.totalBids = 0;
    this.roundMode = 0;
    this.thrownCards = [];
    this.bidCount = 0;
    this.passCount = 0;
    this.trickBidsMade = 0;

    // in case all the players passed, don't pass the turn to next player
    if (isAllPassed) {
      this.firstPlayerToPlay = this.turn;
    } else {
      if (this.firstPlayerToPlay === 4) {
        this.firstPlayerToPlay = 1;
      } else {
        this.firstPlayerToPlay++;
      }
    }

    //resetting the stats of each player
    this.players.forEach((player) => {
      player.bid = 0;
      player.tricks = 0;
      player.cards = [];
    });

    //creating a new deck
    this.deck = new Deck();
    this.deck.shuffle();
    this.dealCards();

    // making the label of the first-player-to-act bold
    Game.updateBoldLabel(this.firstPlayerToPlay);
  }

  dealCards() {
    while (this.deck.cards.length > 0) {
      this.players.forEach((player) => {
        player.cards.push(this.deck.cards.pop());
        player.sortCards();
      });
    }
  }

  // showing the player's hand
  showCards() {
    let output = '';
    let index = 0;
    this.players[0].cards.forEach((card) => {
      output += `
                <div style:"z-index: ${index};">
                    <img src="${card.getImage()}" class="cardImage" style="margin-left: -60px">
                </div>
            `;

      index++;
    });

    $('#player').html(output);
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
    } else if (bidAmount === this.highestBid) {
      if (bidSuit > this.trumpSuit) {
        console.log('good bid');
        return true;
      } else {
        return false;
      }
    } else {
      console.log('good bid');
      return true;
    }
  }

  isTrickBidValid(bid) {
    if (this.trickBidsMade !== 3 || this.trickBidsMade !== 0) {
      return true;
    } else if (this.trickBidsMade === 3) {
      if (this.totalBids + bid === 13) {
        return false;
      } else {
        return true;
      }
    } else if (this.trickBidsMade === 0) {
      if (bid < this.highestBid) {
        return false;
      } else {
        return true;
      }
    }
  }

  isCardValid(player, card) {
    // if it's the first player's turn
    if (this.thrownCards.length === 0) {
      return true;
    }

    // the suit of the first card played
    playedSuit = this.thrownCards[0][1].suit;
    // if the suit if the same
    if (card.suit === playedSuit) {
      return true;
    } else {
      // checking if the player has cards of the same suit
      player.cards.forEach((card) => {
        if (card.suit === playedSuit) {
          return false;
        } else {
          return true;
        }
      });
    }
  }

  getRoundMode() {
    this.roundMode = this.totalBids - 13;
    if (this.roundMode > 0) {
      return `Over ${this.roundMode}`;
    } else {
      return `Under ${13 - this.totalBids}`;
    }
  }

  nextTurn() {
    if (this.turn === 4) {
      this.turn = 1;
    } else {
      this.turn++;
    }

    Game.updateBoldLabel(this.turn);
  }

  determineTrickWinner() {
    let trumpCount = 0;

    // removing all the cards that don't match the played suit or the trump suit
    for (let i = 0; i < this.thrownCards.length; i++) {
      if (this.thrownCards[i][1].suit !== this.thrownCards[0][1].suit && this.thrownCards[i][1].suit !== this.trumpSuit) {
        this.thrownCards.splice(i, 1);
      } else if (this.thrownCards[i][1].suit === this.trumpSuit) {
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

    // resetting the thrown cards list
    this.thrownCards = [];

    // updating the turn according to the winning player
    this.turn = winningPlayer.index;

    Game.updateBoldLabel(winningPlayer.index);
  }

  calculateScoreForBid0(player) {
    if (this.roundMode > 0) {
      if (player.tricks == 0) {
        player.score += 5;
      } else if (player.tricks >= 1) {
        player.score += -5 + 5 * (player.tricks - 1);
      }
    } else if (this.roundMode === -1) {
      if (player.tricks === 0) {
        player.score += 30;
      } else if (player.tricks >= 1) {
        player.score += -30 + 10 * (player.tricks - 1);
      }
    } else if (this.roundMode === -2) {
      if (player.tricks === 0) {
        player.score += 40;
      } else if (player.tricks >= 1) {
        player.score += -40 + 10 * (player.tricks - 1);
      }
    } else if (this.roundMode <= -3) {
      if (player.tricks === 0) {
        player.score += 50;
      } else if (player.tricks >= 1) {
        player.score += -50 + 10 * (player.tricks - 1);
      }
    }
  }

  static calculateScore(player) {
    if (player.bid === 0) {
      return this.calculateScoreForBid0(player);
    }

    if (player.bid === player.tricks && player.bid > 0) {
      player.score += 10 + player.bid ** 2;
    } else if (player.bid != player.tricks && 0 < player.bid < 5) {
      player.score += -5 * Math.abs(tricks - bid);
    } else if (player.bid != player.tricks && player.bid == 5) {
      player.score += -10 * Math.abs(player.tricks - player.bid);
    } else if (player.bid != player.tricks && player.bid == 6) {
      player.score += -15 * Math.abs(player.tricks - player.bid);
    } else if (player.bid != player.tricks && player.bid >= 7) {
      player.score += -20 * Math.abs(player.tricks - player.bid);
    }
  }

  static showSuitButtons(isShow) {
    if (isShow) {
      return $('#bid1').show();
    }
    $('#bid1').hide();
  }

  static showBidButtons(isShow) {
    if (isShow) {
      return $('#bid2').show();
    }
    $('#bid2').hide();
  }

  static changeCardClickable(isClickable) {
    if (isClickable) {
      return document.querySelectorAll('.cardImage').forEach((cardImg) => {
        $(cardImg).addClass('nonClickable');
      });
    }
    document.querySelectorAll('.cardImage').forEach((cardImg) => {
      $(cardImg).removeClass('nonClickable');
    });
  }

  // shows the bid/pass label
  static showBid(playerIndex, bid) {
    let playerCardDiv = `#player${playerIndex}Card h4`;
    $(playerCardDiv).html(bid);
  }

  // makes the player's label bold while it's their turn
  static updateBoldLabel(playerIndex) {
    let playerLabels = [`#player1Card p`, `#player2Card p`, `#player3Card p`, `#player4Card p`];
    playerLabels.forEach((label) => {
      $(label).removeClass('bold');
    });

    $(playerLabels[playerIndex - 1]).addClass('bold');
  }
}
