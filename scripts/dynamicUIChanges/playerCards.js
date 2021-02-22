import { getUnplayableCards, getCardIndex } from '../static/cardFunctions.js'

export const changeCardClickable = (isClickable) => {
  document.querySelectorAll('.cardImage').forEach((cardImg) => {
    if (isClickable) {
      $(cardImg).removeClass('nonClickable');
    } else {
      $(cardImg).addClass('nonClickable');
    }
  });
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
