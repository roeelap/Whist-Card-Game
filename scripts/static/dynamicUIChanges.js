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
