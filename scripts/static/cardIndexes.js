// export const isCardInArray = (array, value)=> {
//   for (let i = 0; i < array.length; i++) {
//     if (array[i].value === value) {
//       return true;
//     }
//   }
//   return false;
// }

export const getCardIndex = (card, cards) => {
  for (const [index, cardEntry] of cards.entries()) {
    if (card.suit === cardEntry.suit && card.value === cardEntry.value) {
      return index;
    }
  }
};

export const getIndexOfHighestCardInHand = (cards) => {
  let highestCardIndex = 0;
  for (let i = 1; i < cards.length; i++) {
    if (cards[i].value > cards[highestCardIndex].value) {
      highestCardIndex = i;
    }
  }
  return highestCardIndex;
};

export const getIndexOfLowestCardInHand = (cards) => {
  let lowestCardIndex = 0;
  for (let i = 1; i < cards.length; i++) {
    if (cards[i].value < cards[lowestCardIndex].value) {
      lowestCardIndex = i;
    }
  }
  return lowestCardIndex;
};

export const getIndexOfLowestCardExcludingTrumpSuit = (cards, trumpSuit) => {
  let lowestCardIndex = 0;
  while (cards[lowestCardIndex].suit === trumpSuit && lowestCardIndex < cards.length) {
    lowestCardIndex++;
  }

  // only trump cards
  if (lowestCardIndex === cards.length) {
    return null;
  }

  for (let i = 0; i < cards.length; i++) {
    if (cards[i].suit === trumpSuit) {
      continue;
    }

    if (cards[i].value < cards[lowestCardIndex].value) {
      lowestCardIndex = i;
    }
  }
  return lowestCardIndex;
};

export const getIndexOfHighestCardExcludingTrumpSuit = (cards, trumpSuit) => {
  let highestCardIndex = 0;
  while (cards[highestCardIndex].suit === trumpSuit && highestCardIndex < cards.length) {
    highestCardIndex++;
  }

  // only trump cards
  if (highestCardIndex === cards.length) {
    return null;
  }

  for (let i = 0; i < cards.length; i++) {
    if (cards[i].suit === trumpSuit) {
      continue;
    }

    if (cards[i].value > cards[highestCardIndex].value) {
      highestCardIndex = i;
    }
  }
  return highestCardIndex;
};

export const isHighestCardOfSameSuit = (card, cards) => {
  for (const cardInstance of cards) {
    if (card.suit !== cardInstance.suit) {
      continue;
    }

    if (cardInstance.value > card.value) {
      return false;
    }
  }

  return true;
};
