import { onCardClicked } from '../main.js';
import { SUITS_TO_PICTURES } from './consts.js';

export const showSuitButtons = (isShow) => {
  if (isShow) {
    return $('#bid1').show();
  }
  $('#bid1').hide();
};

export const showBidButtons = (isShow) => {
  if (isShow) {
    return $('#bid2').show();
  }
  $('#bid2').hide();
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

// shows the bid/pass label
export const showBid = (playerIndex, bid) => {
  const playerCardDiv = `#player${playerIndex}Card h4`;
  $(playerCardDiv).html(bid);
};

export const showCards = (playerCards) => {
  let output = '';
  let index = 0;
  playerCards.forEach((card) => {
    output += `<img src="${card.getImage()}" class="cardImage" style:"z-index: ${index};" onclick="onCardClicked(this)">`;
    index++;
  });
  $('#player').html(output);
  makeHandRotated(playerCards.length)
};

export const makeHandRotated = (playerCardsLength) => {
  $.each($(".cardImage"), (index, card) => {
    // let rotationAngle = (index - playerCards.length)
    let yPos = (index - Math.floor(playerCardsLength / 2)) ** 2;
    let rotationAngle = (index - Math.floor(playerCardsLength / 2)) * 2;
    $(card).css("transform", `translateY(${yPos}px) rotate(${rotationAngle}deg)`);
  })
}

// makes the player's label bold while it's their turn
export const updateBoldLabel = (playerIndex) => {
  const playerLabels = [`#player1Card p`, `#player2Card p`, `#player3Card p`, `#player4Card p`];
  playerLabels.forEach((label) => {
    $(label).removeClass('bold');
  });

  $(playerLabels[playerIndex - 1]).addClass('bold');
};

const createRoundInfoTable = (game) => {
  const data = [
    { id: 'roundNumber', text: `Round ${game.round} of 14` },
    { id: 'trumpSuit', text: `Trump Suit: ${SUITS_TO_PICTURES[game.trumpSuit]}` },
    { id: 'totalBids', text: `Total Bids: ${game.totalBids}` },
    { id: 'roundMode', text: game.getRoundMode() },
  ];

  let table = $('<table></table>').addClass('table table-sm table-hover').html(` 
  <thead>
    <tr class="text-center">
      <th>
        <strong>Round Information</strong>
      </th>
    </tr>
  </thead>`);

  let tableBody = $('<tbody></tbody>');

  for (let row of data) {
    tableBody.append(`
    <tr id="${row.id}">
      <td>${row.text}</td>
    </tr>`);
  }
  table.append(tableBody);
  $('#roundInfo').html(table);
};

const createScoreTable = (game) => {
  let data = [];
  for (let player of game.players) {
    const { index, bid, tricks, score } = player;
    data.push({ id: `player${index}info`, player: `Player ${index}`, bid, tricks, score });
  }

  let table = $('<table></table>').addClass('table table-sm table-hover text-center').html(` 
  <thead>
    <tr>
      <th>Player</th>
      <th>Bid</th>
      <th>Tricks</th>
      <th>Score</th>
    </tr>
  </thead>`);

  let tableBody = $('<tbody></tbody>');

  for (let row of data) {
    const { id, player, bid, tricks, score } = row;
    tableBody.append(`
    <tr id="${id}">
      <td>${player}</td>
      <td>${bid}</td>
      <td>${tricks}</td>
      <td>${score}</td>
    </tr>`);
  }
  table.append(tableBody);
  $('#score').html(table);
};

export const createTrickBidButtons = (minBid, forbiddenBid) => {
  let newDiv = $('<div class="trick-buttons"></div');
  for (let i = 0; i <= 13; i++) {
    const disabled = i < minBid || i === forbiddenBid ? 'disabled' : '';
    newDiv.append(
      `<input type="button" class="btn btn-primary bidButton" value="${i}" onclick="onTricksBidButtonClicked(this)" ${disabled}/>`
    );
  }
  $('#bid2').html(newDiv);
};

export const reRenderTables = (game) => {
  createRoundInfoTable(game);
  createScoreTable(game);
};

export const clearCardImages = () => {
  for (let i = 1; i <= 4; i++) {
    const playerCardId = `#player${i}Card`;
    $(playerCardId).css('background', `rgba(249, 247, 238, 0.6)`);
  }
};

export const collapseGameInfo = (button) => {
  if ($(button).hasClass('accordion-button-active')) {
      $(button).removeClass('accordion-button-active');
      $("#info").css('maxHeight', '0');
  } else {
      $(button).addClass('accordion-button-active');
      $("#info").css('maxHeight', '200px');
  };
}
