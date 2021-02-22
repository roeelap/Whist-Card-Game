import { SUITS_TO_ICONS, SUITS_TO_IMAGES } from './consts.js';
import { getUnplayableCards, getCardIndex } from './cardFunctions.js';

export const showSuitButtons = (isShow) => {
  if (isShow) {
    return $('#suit-bid').show();
  }
  $('#suit-bid').hide();
};

export const showBidButtons = (isShow) => {
  if (isShow) {
    return $('#tricks-bid').show();
  }
  $('#tricks-bid').hide();
};

export const showLastTrickButton = (isShow) => {
  if (isShow) {
    return $('#last-trick-btn').show();
  }
  $('#last-trick-btn').hide();
};

export const changeCardClickable = (isClickable) => {
  document.querySelectorAll('.cardImage').forEach((cardImg) => {
    if (isClickable) {
      $(cardImg).removeClass('nonClickable');
    } else {
      $(cardImg).addClass('nonClickable');
    }
  });
};

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

export const showPlayerCards = (playerCards) => {
  let output = '';
  let index = 0;
  playerCards.forEach((card) => {
    output += `<img src="${card.getImage()}" class="cardImage" style:"z-index: ${index};" onclick="onCardClicked(this)">`;
    index++;
  });
  $('#player').html(output);
  makeHandRotated(playerCards.length);
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

export const makeHandRotated = (playerCardsLength) => {
  $.each($('.cardImage'), (index, card) => {
    const yPos = (index + 0.5 - playerCardsLength / 2) ** 2;
    const rotationAngle = (index - (playerCardsLength - 1) / 2) * 2;
    $(card).attr('style', `transform: translateY(${yPos}px) rotate(${rotationAngle}deg)`);

    $(card).hover(
      function () {
        $(this).attr('style', `transform: translate(${rotationAngle / 5}px, ${yPos - 20}px) rotate(${rotationAngle}deg)`);
      },
      function () {
        $(this).attr('style', `transform: translateY(${yPos}px) rotate(${rotationAngle}deg)`);
      }
    );
  });
};

// add glow to player label when it's their turn
export const updateTurnGlow = (playerIndex) => {
  const playerLabels = ['#player1Card', '#player2Card', '#player3Card', '#player4Card'];
  playerLabels.forEach((label) => {
    $(label).removeClass('glowing-border');
  });

  $(playerLabels[playerIndex - 1]).addClass('glowing-border');
};

// const createRoundInfoTable = (game) => {
//   const data = [
//     { id: 'roundNumber', text: `Round ${game.round} of 14` },
//     { id: 'trumpSuit', text: `Trump Suit: ${SUITS_TO_ICONS[game.trumpSuit]}` },
//     { id: 'totalBids', text: `Total Bids: ${game.totalBids}` },
//     { id: 'roundMode', text: game.getRoundMode() },
//   ];

//   let table = $('<table></table>').addClass('table table-sm table-hover').html(`
//   <thead>
//     <tr class="text-center">
//       <th>
//         <strong>Round Information</strong>
//       </th>
//     </tr>
//   </thead>`);

//   let tableBody = $('<tbody></tbody>');

//   for (let row of data) {
//     tableBody.append(`
//     <tr id="${row.id}">
//       <td>${row.text}</td>
//     </tr>`);
//   }
//   table.append(tableBody);
//   $('#roundInfo').html(table);
// };

// const createScoreTable = (game) => {
//   let data = [];
//   for (let player of game.players) {
//     const { index, bid, tricks, score } = player;
//     data.push({ id: `player${index}info`, player: `Player ${index}`, bid, tricks, score });
//   }

//   let table = $('<table></table>').addClass('table table-sm table-hover text-center').html(`
//   <thead>
//     <tr>
//       <th>Player</th>
//       <th>Bid</th>
//       <th>Tricks</th>
//       <th>Score</th>
//     </tr>
//   </thead>`);

//   let tableBody = $('<tbody></tbody>');

//   for (let row of data) {
//     const { id, player, bid, tricks, score } = row;
//     tableBody.append(`
//     <tr id="${id}">
//       <td>${player}</td>
//       <td>${bid}</td>
//       <td>${tricks}</td>
//       <td>${score}</td>
//     </tr>`);
//   }
//   table.append(tableBody);
//   $('#score').html(table);
// };

export const createTrickBidButtons = (minBid, forbiddenBid) => {
  let newDiv = $('<div class="trick-buttons"></div');
  for (let i = 0; i <= 13; i++) {
    const disabled = i < minBid || i === forbiddenBid ? 'disabled' : '';
    newDiv.append(
      `<input type="button" class="btn btn-primary bidButton" value="${i}" onclick="onTricksBidButtonClicked(this)" ${disabled}/>`
    );
  }
  $('#tricks-bid').html(newDiv);
};

// export const reRenderTables = (game) => {
//   createRoundInfoTable(game);
//   createScoreTable(game);
// };

export const clearCardImages = () => {
  for (let i = 1; i <= 4; i++) {
    const playerCardId = `#player${i}Card`;
    $(playerCardId).css('background', `rgba(249, 247, 238, 0.6)`);
  }
};

export const collapseGameInfo = (button) => {
  if ($(button).hasClass('accordion-button-active')) {
    $(button).removeClass('accordion-button-active');
    $('#info').css('maxHeight', '0');
  } else {
    $(button).addClass('accordion-button-active');
    $('#info').css('maxHeight', '200px');
  }
};

export const removeAllFilters = () => {
  $.each($('.cardImage'), (index, card) => {
    $(card).removeClass('dark highlight');
  });
};

export const highlightPlayableCards = (cards, playedSuit) => {
  const unplayableCards = playedSuit ? getUnplayableCards(cards, playedSuit) : [];
  const cardImages = $('.cardImage');

  removeAllFilters();

  for (const card of cards) {
    const cardIndex = getCardIndex(card, cards);
    // if card unplayable - darken, else - highlight.
    if (unplayableCards.some((unplayableCard) => unplayableCard.value === card.value && unplayableCard.suit === card.suit)) {
      $(cardImages[cardIndex]).addClass('dark');
    } else {
      $(cardImages[cardIndex]).addClass('highlight');
    }
  }
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

export const updateLastTrick = (lastTrick) => {
  let output = '';
  for (const entry of lastTrick) {
    output += `
    <div class="modal-card-image">
      <h4 class="text-center">Player ${entry.player.index}</h4>
      <img src=${entry.card.getImage()}>
    </div>`;
  }

  $('#cardsModal .modal-body').html(output);
};
