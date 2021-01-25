import Game from './game.js';
import { SUITS_TO_PICTURES } from './consts.js';
import Player from './player.js';
import Ai from './ai.js';

const newGame = () => {
  let players = [];
  for (let i = 1; i <= 4; i++) {
    players.push(new Player(i));
  }

  const game = new Game(players);

  game.newRound(false);

  return game;
};

// Correct bid
const onBidInputChange = (bidInput) => {
  if (bidInput.value < 5) {
    return (bidInput.value = 5);
  }
  if (bidInput.value > 13) {
    return (bidInput.value = 13);
  }
};
window.onBidInputChange = onBidInputChange;

const newRound = () => {
  game.newRound(true);
  game.showCards();
  trumpSuitBidRound();
};

const trumpSuitBidRound = () => {
  // checking if trump suit bid round has ended
  if (game.passCount === 3 && game.bidCount >= 1) {
    console.log('phase complete');
    return tricksBidRound();
  } else if (game.passCount === 4) {
    return setTimeout(() => {
      return newRound();
    }, 0);
  }

  // player turn
  if (game.turn === 1) {
    return Game.showSuitButtons(true);
  }

  // AI turn
  setTimeout(() => {
    Game.showBid(game.turn, Ai.getTrumpSuitBid(game, game.players[game.turn - 1]));
    game.nextTurn();
    return trumpSuitBidRound();
  }, 1000);
};

// on suit bid click
const onSuitBidButtonClicked = (bidButton) => {
  const bidAmount = parseInt($('#bidAmount').val());
  const bidSuit = $(bidButton).index();
  const choice = game.isTrumpSuitBidValid(bidAmount, bidSuit);

  // invalid choice
  if (!choice) {
    return alert('Not a valid bid, please try again.');
  }

  if (choice === 'pass') {
    game.passCount++;
    Game.showBid(1, choice);
  } else {
    game.bidCount++;
    game.passCount = 0;

    game.highestBid = game.players[0].bid = bidAmount;
    game.trumpSuit = bidSuit;

    Game.showBid(1, bidAmount + SUITS_TO_PICTURES[bidSuit]);
  }

  // updating the turn and letting the cpu act
  Game.showSuitButtons(false);
  game.nextTurn();
  return trumpSuitBidRound();
};

const tricksBidRound = () => {
  // Tricks round ended
  if (game.trickBidsMade === 4) {
    $('#roundMode').html(`<td><strong>${game.getRoundMode()}</strong></td>`);
    return gameRound();
  }

  // waiting for player to bid
  if (game.turn === 1) {
    return Game.showBidButtons(true);
  }

  // TODO AI bid
  console.log("ai's turn");
  game.trickBidsMade++;
};

const onTricksBidButtonClicked = (bidButton) => {
  const bid = parseInt(bidButton.value);

  if (!game.isTrickBidValid(bid)) {
    return alert('Not a valid bid, please try again.');
  }

  game.players[0].bid = bid;
  game.totalBids += bid;
  $('#totalBids').html(`<td><strong>Total Bids: </strong>${game.totalBids}</td>`);

  Game.showBidButtons(false);
  Game.showBid(1, bid);
  game.trickBidsMade++;

  // updating the turn and letting the cpu act
  game.nextTurn();
  return tricksBidRound();
};

const gameRound = () => {
  // check if round has ended and calculate scores
  if (game.players.every((player) => player.cards.length === 0)) {
    Game.calculateScore(player);
    return game.newRound(false);
  }

  // if sub-round ended
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
};

// function for when the player wants to throw a card
const putCard = (player, index, cardImg = null) => {
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
};

// creating a new game
const game = newGame();
window.game = game;

$(document).ready(() => {
  // showing player1's cards and disabling any clicks on them
  game.showCards();
  Game.toggleCardClicks();

  window.onSuitBidButtonClicked = onSuitBidButtonClicked;
  window.onTricksBidButtonClicked = onTricksBidButtonClicked;

  // onclick events for the card images
  document.querySelectorAll('.cardImage').forEach((cardImg) => {
    cardImg.onclick = function () {
      putCard(game.players[0], $(cardImg.parentElement).index(), cardImg);
    };
  });

  //starting the trump suit bid round
  trumpSuitBidRound();
});
