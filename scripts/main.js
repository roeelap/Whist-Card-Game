import Game from './classes/Game.js';
import { SUITS_TO_PICTURES } from './static/consts.js';
import Player from './classes/Player.js';
import AI from './classes/AI.js';
import {
  showBid,
  showBidButtons,
  showSuitButtons,
  changeCardClickable,
  showCards,
  reRenderTables,
  createTrickBidButtons,
  clearCardImages,
  collapseGameInfo,
} from './static/dynamicUIChanges.js';
import { updateScore } from './static/scoreCalculations.js';

const newGame = () => {
  let players = [];
  players.push(new Player(1));
  for (let i = 2; i <= 4; i++) {
    players.push(new AI(i));
  }

  return new Game(players);
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

const newRound = (isAllPassed) => {
  game.newRound(isAllPassed);
  showCards(game.players[0].cards);
  changeCardClickable(false);
  reRenderTables(game);
  return trumpSuitBidRound();
};

const trumpSuitBidRound = () => {
  // checking if trump suit bid round has ended
  if (game.passCount === 3 && game.bidCount >= 1) {
    console.log('phase complete');
    return tricksBidRound();
  } else if (game.passCount === 4) {
    return setTimeout(() => {
      return newRound(true);
    }, 0);
  }

  // player turn
  if (game.turn === 1) {
    return showSuitButtons(true);
  }

  // AI turn
  return setTimeout(() => {
    showBid(game.turn, AI.getTrumpSuitBid(game, game.players[game.turn - 1]));
    game.nextTurn();
    trumpSuitBidRound();
  }, 0);
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
    showBid(1, choice);
  } else {
    game.bidCount++;
    game.passCount = 0;

    game.highestBid = game.players[0].bid = bidAmount;
    game.trumpSuit = bidSuit;

    showBid(1, bidAmount + SUITS_TO_PICTURES[bidSuit]);
  }

  // updating the turn and letting the cpu act
  showSuitButtons(false);
  game.nextTurn();
  return trumpSuitBidRound();
};

const tricksBidRound = () => {
  reRenderTables(game);
  // Tricks round ended
  if (game.trickBidsMade === 4) {
    $('#roundMode').html(`<td><strong>${game.getRoundMode()}</strong></td>`);

    // update playing mode for AI
    for (let ai of game.players) {
      ai.playingMode = game.roundMode;
    }

    return gameRound();
  }

  // waiting for player to bid
  if (game.turn === 1) {
    const minBid = game.trickBidsMade === 0 ? game.highestBid : 0;
    const forbiddenBid = game.trickBidsMade === 3 ? 13 - game.totalBids : null;
    createTrickBidButtons(minBid, forbiddenBid);
    return showBidButtons(true);
  }

  // AI turn
  return setTimeout(() => {
    let bid = AI.getTrickBid(game, game.players[game.turn - 1]);
    showBid(game.turn, bid);
    game.players[game.turn - 1].bid = bid;
    game.totalBids += bid;
    game.trickBidsMade++;
    game.nextTurn();
    trumpSuitBidRound();
  }, 0);
};

const onTricksBidButtonClicked = (bidButton) => {
  const bid = parseInt(bidButton.value);

  if (!game.isTrickBidValid(bid)) {
    return alert('Not a valid bid, please try again.');
  }

  game.players[0].bid = bid;
  game.totalBids += bid;
  $('#totalBids').html(`<td><strong>Total Bids: </strong>${game.totalBids}</td>`);

  showBidButtons(false);
  showBid(1, bid);
  game.trickBidsMade++;

  // updating the turn and letting the cpu act
  game.nextTurn();
  return tricksBidRound();
};

const printRoundCards = () => {
  let printMsg = '';
  for (let card of game.thrownCards) {
    printMsg += `player: ${card.player.index}, card: ${card.card.value},${card.card.suit}\n`;
  }
  console.log(printMsg);
};

const gameRound = () => {
  // check if round has ended and calculate scores

  // calculate remaining cards at the start of each round
  if (game.thrownCards.length === 0) {
    game.calculateRemainingCards();
  }

  // if sub-round ended - figure out the winning card and the starting player of the next putdown
  if (game.thrownCards.length === 4) {
    printRoundCards();
    return setTimeout(() => {
      console.log(`Winner: player ${game.determineTrickWinner()}`);
      reRenderTables(game);
      clearCardImages();
      return gameRound();
    }, 0);
  }

  if (game.players.every((player) => player.cards.length === 0)) {
    for (const player of game.players) {
      updateScore(player, game.roundMode);
    }
    return newRound(false);
  }

  // player turn
  if (game.turn === 1) {
    return changeCardClickable(true);
  }

  // AI turn
  const ai = game.players[game.turn - 1];
  ai.throwCard();
  return gameRound();
};

export const onCardClicked = (cardImg) => {
  if ($(cardImg).hasClass('nonClickable')) {
    return;
  }

  const index = $(cardImg).index();
  const player = game.players[0];

  if (!game.isCardValid(player, player.cards[index])) {
    return alert('Card is not valid!');
  }

  // putting the clicked card on the game board
  const img = player.cards[index].getImage();
  const playerCardId = `#player${player.index}Card`;
  $(playerCardId).css('background', `url(${img}) no-repeat center center/contain`);

  // removing the card from the player's hand
  game.thrownCards.push({ player, card: player.cards.splice(index, 1)[0] });

  $(cardImg).remove();

  // making the cards in the player's hand look rotated (like a fan)
  // makeHandRotated(game.players[0].cards.length);

  changeCardClickable(false);

  // next turn
  game.nextTurn();
  return gameRound();
};

const bindConstsToWindow = () => {
  window.game = game;
  window.onSuitBidButtonClicked = onSuitBidButtonClicked;
  window.onTricksBidButtonClicked = onTricksBidButtonClicked;
  window.onBidInputChange = onBidInputChange;
  window.onCardClicked = onCardClicked;
  window.collapseGameInfo = collapseGameInfo;
};

// creating a new game
const game = newGame();

$(document).ready(() => {
  bindConstsToWindow();
  newRound(false);
});
