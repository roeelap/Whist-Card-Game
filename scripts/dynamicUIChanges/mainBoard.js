import { SUITS_TO_IMAGES } from '../static/consts.js';

// shows the trump bid
export const showTrumpBid = (playerIndex, value, suit) => {
  const playerCardDiv = `#player${playerIndex}Card .bid div`;
  const bidValue = $(`${playerCardDiv} h4`);
  const bidSuit = $(`${playerCardDiv} h1`);
  $(bidValue).html(value);
  $(bidSuit).html(suit);
};

// shows the pass label
export const showPass = (playerIndex) => {
  const playerCardDiv = `#player${playerIndex}Card .bid div`;
  $(`${playerCardDiv} h1`).empty();
  $(`${playerCardDiv} h4`).html('PASS');
};

// shows the tricks bid
export const showTricksBid = (playerIndex, tricks) => {
  const playerCardDiv = `#player${playerIndex}Card .bid div`;
  const bidValue = $(`${playerCardDiv} h1`);
  $(bidValue).html(tricks);
};

export const clearAllBidText = () => {
  for (let i = 1; i <= 4; i++) {
    const playerCardDiv = `#player${i}Card .bid div`;
    $(`${playerCardDiv} h4`).empty();
    $(`${playerCardDiv} h1`).empty();
  }
};

export const showTrumpSuit = () => {
  $('.suit-background').css('background-image', `url(${SUITS_TO_IMAGES[game.trumpSuit]})`);
  if (game.trumpSuit === 5) {
    $('.suit-background').addClass('no-trump-image');
  } else {
    $('.suit-background').removeClass('no-trump-image');
  }
};

export const showGameMode = () => {
  const roundModeText = game.roundMode > 0 ? `+${game.roundMode}` : game.roundMode;
  $('.round-mode').html(roundModeText);
  $('.round-mode').css('background', 'rgba(249, 247, 238, 0.6)');
};

export const removeGameModeLabel = () => {
  $('.suit-background').css('background', '');
  $('.round-mode').css('background', '');
  $('.round-mode').empty();
};

// add glow to player label when it's their turn
export const updateTurnGlow = (playerIndex) => {
  const playerLabels = ['#player1Card', '#player2Card', '#player3Card', '#player4Card'];
  playerLabels.forEach((label) => {
    $(label).removeClass('glowing-border');
  });

  $(playerLabels[playerIndex - 1]).addClass('glowing-border');
};

export const updateRoundNumber = (roundNumber) => {
  const output = `Round ${roundNumber}/14`;
  $('#round-number').html(output);
};

export const updateScoreList = (playerList) => {
  let scoreOutput = '';
  for (const player of playerList) {
    scoreOutput += `<p>${player.score}</p>`;
  }

  $('#scores').html(scoreOutput);
};

export const updateAllProgressions = () => {
  for (const player of game.players) {
    const progression = `#player${player.index}Card .progression`;
    $(progression).html(`${player.tricks}/${player.bid}`);
  }
};

export const removeAllProgressionLabels = () => {
  for (const player of game.players) {
    const progression = `#player${player.index}Card .progression`;
    $(progression).empty();
  }
};

export const showCard = (img, cardLabel) => {
  cardLabel.css('opacity', 0.4);
  cardLabel.css('background', `url(${img}) no-repeat center center/cover`);
  cardLabel.fadeTo(300, 1);
};

export const clearCardImages = () => {
  for (let i = 1; i <= 4; i++) {
    const playerCardId = `#player${i}Card`;
    $(playerCardId).css('background', `rgba(249, 247, 238, 0.6)`);
  }
};
