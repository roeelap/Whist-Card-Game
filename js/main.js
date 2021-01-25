import Game, {SUITS_TO_PICTURES} from './game.js';
import Player from './player.js';
import Ai from './ai.js'

function newGame() {
  const player1 = new Player(1);
  const player2 = new Player(2);
  const player3 = new Player(3);
  const player4 = new Player(4);

  const game = new Game([player1, player2, player3, player4]);

  game.newRound(false);

  return game;
}

function trumpSuitBidRound() {
  // checking if 3 player passed and 1 bid || OR || the 4 players have passed
  if (game.passCount === 3 && game.bidCount >= 1) {
    console.log('phase complete');
    return tricksBidRound();
  } else if (game.passCount === 4) {
    setTimeout(() => {
      // a new round
      game.newRound(true);
      game.showCards();
      return trumpSuitBidRound();
    }, 0);
  }

  if (game.turn === 1) {
    return Game.toggleSuitButtons();
  }

  setTimeout(() => {
    Game.showBid(game.turn, Ai.getTrumpSuitBid(game, game.players[game.turn - 1]));
    //updating the turn and letting the cpu act
    game.nextTurn();
    return trumpSuitBidRound();
  }, 0);
}

function player1SuitBid(bidButton) {
  let bidAmount = parseInt($('#bidAmount').val());
  let bidSuit = $(bidButton).index();
  let choice = game.isTrumpSuitBidValid(bidAmount, bidSuit);

  if (choice === 'pass') {
    // updating the pass count
    game.passCount++;

    // removing the suit buttons
    Game.toggleSuitButtons();

    // showing the player's bid
    Game.showBid(1, choice);

    //updating the turn and letting the cpu act
    game.nextTurn();
    return trumpSuitBidRound();
  } else if (choice) {
    // updating the bid and pass counts
    game.bidCount++;
    game.passCount = 0;

    // updating the highest bid and the trump suit
    game.highestBid = game.players[0].bid = bidAmount;
    game.trumpSuit = bidSuit;

    // removing the suit buttons
    Game.toggleSuitButtons();

    // showing the player's bid
    Game.showBid(1, bidAmount + SUITS_TO_PICTURES[bidSuit]);

    //updating the turn and letting the cpu act
    game.nextTurn();
    return trumpSuitBidRound();
  } else {
    // if the bid is not valid
    alert('Not a valid bid, please try again.');
  }
}

function tricksBidRound() {
  if (game.trickBidsMade === 4) {
    $('#roundMode').html(`<td><strong>${game.getRoundMode()}</strong></td>`);
    return gameRound();
  }

  if (game.turn === 1) {
    return Game.toggleBidButtons();
  }

  console.log("ai's turn");
  game.trickBidsMade++;
}

function player1TricksBid(bidButton) {
  let bid = parseInt(bidButton.value);

  if (!game.isTrickBidValid(bid)) {
    // if the bid is not valid
    return alert('Not a valid bid, please try again.');
  }

  // updating the player's bid
  game.players[0].bid = bid;

  // updating the total bids of the round
  game.totalBids += bid;
  $('#totalBids').html(`<td><strong>Total Bids: </strong>${game.totalBids}</td>`);

  // removing the bid buttons
  Game.toggleBidButtons();

  // showing the player's bid on the game board
  Game.showBid(1, bid);

  // updating the number of tricks that has been made
  game.trickBidsMade++;

  // updating the turn and letting the cpu act
  game.nextTurn();
  return tricksBidRound();
}

function gameRound() {
  // if the players have run out of cards
  if (game.players.every((player) => player.cards.length === 0)) {
    // calculate score for each player
    if (player.bid === 0) {
      game.calculateScoreForBid0(player);
    } else {
      Game.calculateScore(player);
    }

    return game.newRound(false);
  }

  // if 4 players put a card down
  if (game.thrownCards.length === 4) {
    // figure out the winning card and the starting player of the next putdown
    game.determineTrickWinner();
    return gameRound();
  }

  // if it's player1's turn
  if (game.turn === 1) {
    Game.toggleCardClicks();
  }

  // if it's the cpu's turn
  else if (game.turn === 2 || 3 || 4) {
    console.log("cpu's turn");
  }
}

// function for when the player wants to throw a card
function putCard(player, index, cardImg = null) {
  // check if the player can put the card down
  if (game.isCardValid(player, player.cards[index])) {
    // putting the clicked card on the game board
    let img = player.cards[index].getImage();
    let playerCardId = `#player${player.index}Card .usedCardImage`;
    $(playerCardId).attr('src', img);

    // removing the card from the player's hand
    game.thrownCards.push([player, player.cards.splice(index, 1)]);
    $(cardImg.parentElement).remove();

    // toggling the card clicks if the player is player1
    if (player.index === 1) {
      Game.toggleCardClicks();
    }

    // next turn
    game.nextTurn();
    return gameRound();
  }
}


// creating a new game
let game = newGame();
window.game = game;


$(document).ready(() => {
  // showing player1's cards and disabling any clicks on them
  game.showCards();
  Game.toggleCardClicks();

  window.player1SuitBid = player1SuitBid
  window.player1TricksBid = player1TricksBid
  
  // onclick events for the card images
  document.querySelectorAll('.cardImage').forEach((cardImg) => {
    cardImg.onclick = function () {
      putCard(game.players[0], $(cardImg.parentElement).index(), cardImg);
    };
  });

  //starting the trump suit bid round
  trumpSuitBidRound();
});
