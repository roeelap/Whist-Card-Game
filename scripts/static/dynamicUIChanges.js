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
    output += `
              <div style:"z-index: ${index};">
                  <img src="${card.getImage()}" class="cardImage" style="margin-left: -60px">
              </div>
          `;

    index++;
  });

  $('#player').html(output);
};

// makes the player's label bold while it's their turn
export const updateBoldLabel = (playerIndex) => {
  const playerLabels = [`#player1Card p`, `#player2Card p`, `#player3Card p`, `#player4Card p`];
  playerLabels.forEach((label) => {
    $(label).removeClass('bold');
  });

  $(playerLabels[playerIndex - 1]).addClass('bold');
};

export const createRoundInfoTable = (game) => {
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

  for (let header of data) {
    tableBody.append(`
    <tr id="${header.id}">
      <th>${header.text}</th>
    </tr>`);
  }
  table.append(tableBody);
  $('#roundInfo').html(table);
};

// <table class="table table-sm table-hover">
//   <tr class="text-center">
//     <th>
//       <strong>Round Information</strong>
//     </th>
//   </tr>
//   <tr id="roundNumber">
//     <td>
//       <strong>Round 1 of 14</strong>
//     </td>
//   </tr>
//   <tr id="trumpSuit">
//     <td>
//       <strong>Trump Suit: </strong>Spades
//     </td>
//   </tr>
//   <tr id="totalBids">
//     <td>
//       <strong>Total Bids: </strong>14
//     </td>
//   </tr>
//   <tr id="roundMode">
//     <td>
//       <strong>Over 1</strong>
//     </td>
//   </tr>
// </table>;
