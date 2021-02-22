import Game from './classes/Game.js';
import { SUITS_TO_ICONS, TURN_TIMEOUT, ROUND_TIMEOUT, SUITS_TO_IMAGES, OVER, UNDER } from './static/consts.js';
import Player from './classes/Player.js';
import AI from './classes/AI.js';
import {
  showBidButtons,
  showSuitButtons,
  showLastTrickButton,
  changeCardClickable,
  showPlayerCards,
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
  showCard,
  showTrumpSuit,
  updateLastTrick,
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
  showPlayerCards(game.players[0].cards);
  changeCardClickable(false);
  // reRenderTables(game);
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

  // reRenderTables(game);
  
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
      showLastTrickButton(true);
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
      // reRenderTables(game);
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
    showLastTrickButton(false);
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
  const cardLabel = $(`#player${player.index}Card`);
  showCard(img, cardLabel);

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

const displayCardsModal = () => {
  updateLastTrick(game.lastThrownCards);
  $('#cardsModal').modal();
};

const bindConstsToWindow = () => {
  window.game = game;
  window.onSuitBidButtonClicked = onSuitBidButtonClicked;
  window.onTricksBidButtonClicked = onTricksBidButtonClicked;
  window.onBidInputChange = onBidInputChange;
  window.onCardClicked = onCardClicked;
  window.collapseGameInfo = collapseGameInfo;
  window.displayCardsModal = displayCardsModal;
};

// creating a new game
const game = newGame();

$(document).ready(() => {
  bindConstsToWindow();
  newRound(false);
});
