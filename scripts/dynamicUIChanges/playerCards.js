import { getUnplayableCards, getCardIndex } from '../static/cardFunctions.js';

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
    $(card).css('transform', `translateY(${yPos}px) rotate(${rotationAngle}deg)`);

    $(card).hover(
      function () {
        $(this).css('transform', `translate(${rotationAngle / 5}px, ${yPos - 20}px) rotate(${rotationAngle}deg)`);
      },
      function () {
        $(this).css('transform', `translateY(${yPos}px) rotate(${rotationAngle}deg)`);
      }
    );
  });
};

export const showPlayerCards = (playerCards) => {
  let output = '';

  playerCards.forEach((card, index) => {
    output += `<img src="${card.getImage()}" class="cardImage" style="z-index: ${index}" onclick="onCardClicked(this)" onload="rearrangeCardsMobile()">`;
  });
  $('#player').html(output);

  makeHandRotated(playerCards.length);
};

export const rearrangeCardsMobile = () => {
  const isMobile = $(document).width() < 500;
  if (!isMobile) {
    return;
  }

  const cardImages = $('.cardImage');
  const marginalHeight = $(cardImages[0]).offset().top;

  for (const cardImage of cardImages) {
    if ($(cardImage).offset().top > marginalHeight) {
      if (!window.marginalMobileCardIndex) {
        window.marginalMobileCardIndex = $(cardImage).css('z-index');
      }
      $(cardImage).css('margin-top', '-50px');
    }
  }
};

export const fixCardContainerHeight = () => {
  const height = $('#player1Card').height();
  $('#player2Card').height(height);
  $('#player4Card').height(height);
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
