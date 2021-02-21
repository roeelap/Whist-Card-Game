import Game from './classes/Game.js';
import { SUITS_TO_ICONS, TURN_TIMEOUT, ROUND_TIMEOUT, SUITS_TO_IMAGES, OVER, UNDER } from './static/consts.js';
import Player from './classes/Player.js';
import AI from './classes/AI.js';
import {
  showBidButtons,
  showSuitButtons,
  changeCardClickable,
  showCards,
  reRenderTables,
  createTrickBidButtons,
  clearCardImages,
  collapseGameInfo,
  highlightPlayableCards,
  makeHandRotated,
  removeAllFilters,
  showPass,
  showTrumpBid,
  showTricksBid,
  clearAllBidText,
  showGameMode,
  updateAllProgressions,
  showTrumpSuit,
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
    return setTimeout(() => {
      tricksBidRound();
    }, ROUND_TIMEOUT);
  }

  if (game.passCount === 4) {
    clearAllBidText();
    return setTimeout(() => {
      newRound(true);
    }, ROUND_TIMEOUT);
  }

  // player turn
  if (game.turn === 1) {
    return showSuitButtons(true);
  }

  // AI turn
  return setTimeout(() => {
    const AiBid = game.players[game.turn - 1].trumpSuitBid(game);
    AiBid === 'pass' ? showPass(game.turn) : showTrumpBid(game.turn, AiBid.value, AiBid.suit);
    game.nextTurn();
    trumpSuitBidRound();
  }, TURN_TIMEOUT);
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
    showPass(1);
  } else {
    game.bidCount++;
    game.passCount = 0;

    game.highestBid = game.players[0].bid = bidAmount;
    game.trumpSuit = bidSuit;

    showTrumpBid(1, bidAmount, SUITS_TO_ICONS[bidSuit]);
  }

  // updating the turn and letting the cpu act
  showSuitButtons(false);
  game.nextTurn();
  return trumpSuitBidRound();
};

const tricksBidRound = () => {
  // clear trump round info
  if (game.trickBidsMade === 0) {
    clearAllBidText();
    showTrumpSuit();
  }

  reRenderTables(game);
  // Tricks round ended
  if (game.trickBidsMade === 4) {
    return setTimeout(() => {
      $('#roundMode').html(`<td><strong>${game.getRoundMode()}</strong></td>`);

      // update playing mode for AI
      for (const ai of game.players) {
        ai.playingMode = game.roundMode > 0 ? OVER : UNDER;
      }

      showGameMode();
      clearAllBidText();
      gameRound();
    }, ROUND_TIMEOUT);
  }

  // waiting for player to bid
  if (game.turn === 1) {
    const minBid = game.trickBidsMade === 0 ? game.highestBid : 0;
    const forbiddenBid = game.trickBidsMade === 3 ? 13 - game.totalBids : null;
    createTrickBidButtons(minBid, forbiddenBid);
    return showBidButtons(true);
  }
data:image/jpeg;base64,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
  // AI turn
  return setTimeout(() => {
    const AI = game.players[game.turn - 1];
    const bid = AI.tricksBid(game);
    AI.bid = bid;
    showTricksBid(game.turn, bid);
    game.totalBids += bid;
    game.trickBidsMade++;
    game.nextTurn();
    tricksBidRound();
  }, TURN_TIMEOUT);
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
  showTricksBid(1, bid);
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
  // UI - update the tricks for every player
  updateAllProgressions();

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
      gameRound();
    }, ROUND_TIMEOUT);
  }

  // check if round has ended and calculate scores
  const isRoundEnd = game.players.every((player) => player.cards.length === 0);
  if (isRoundEnd) {
    for (const player of game.players) {
      updateScore(player, game.roundMode);
    }
    return newRound(false);
  }

  // player turn
  if (game.turn === 1) {
    const playedSuit = game.thrownCards.length ? game.thrownCards[0].card.suit : null;
    highlightPlayableCards(game.players[0].cards, playedSuit);
    makeHandRotated(game.players[0].cards.length);
    return changeCardClickable(true);
  }

  // AI turn
  return setTimeout(() => {
    const ai = game.players[game.turn - 1];
    ai.throwCard();
    gameRound();
  }, TURN_TIMEOUT);
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
  $(playerCardId).css('background', `url(${img}) no-repeat center center/cover`);

  // removing the card from the player's hand
  game.thrownCards.push({ player, card: player.cards.splice(index, 1)[0] });

  $(cardImg).remove();
  changeCardClickable(false);

  // removing highlight and dark filters from the cards
  removeAllFilters();

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
