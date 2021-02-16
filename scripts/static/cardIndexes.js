export const getCardIndex = (card, cards) => {
  for (const [index, cardEntry] of cards.entries()) {
    if (card.suit === cardEntry.suit && card.value === cardEntry.value) {
      return index;
    }
  }
};

export const getHighestThrownCard = (thrownCards) => {
  const firstCardSuit = thrownCards[0].card.suit;
  let highest = thrownCards[0].card;
  for (const entry of thrownCards) {
    if (entry.card.value > highest.value && entry.card.suit === firstCardSuit) {
      highest = entry.card;
    }
  }

  return highest;
};

export const getHighestLosingCard = (cards, highestCard) => {
  for (const card of cards) {
    if (card.value > highestCard) {
      return card;
    }
  }
  return null;
};

export const getHighestCardInHand = (cards) => {
  let highestCard = cards[0];
  for (let i = 1; i < cards.length; i++) {
    if (cards[i].value > highestCard.value) {
      highestCard = cards[i];
    }
  }
  return highestCard;
};

export const getLowestWinningTrumpCard = (cards, trumpSuit, thrownCards) => {
  const highestThrownTrumpCard = highestThrownTrumpCard(thrownCards, trumpSuit);

  for (const card of cards) {
    if (card.suit === trumpSuit && card.value > highestThrownTrumpCard.value) {
      return card;
    }
  }

  return null;
};

export const getTrumpCard = (cards, trumpSuit) => {
  for (const card of cards) {
    if (card.suit === trumpSuit) {
      return card;
    }
  }
  return null;
};

export const highestThrownTrumpCard = (thrownCards, trumpSuit) => {
  let highest = getTrumpCard(thrownCards, trumpSuit);

  if (!highest) {
    return null;
  }

  for (const card of thrownCards) {
    if (card.suit !== trumpSuit) {
      continue;
    }

    if (card.value > highest.value) {
      highest = card;
    }
  }
  return highest;
};

export const getLowestCardInHand = (cards) => {
  let lowestCard = cards[0];
  for (let i = 1; i < cards.length; i++) {
    if (cards[i].value < lowestCard.value) {
      lowestCard = cards[i];
    }
  }
  return lowestCard;
};

export const getLowestCardExcludingTrumpSuit = (cards, trumpSuit) => {
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
  return cards[lowestCardIndex];
};

export const getHighestCardExcludingTrumpSuit = (cards, trumpSuit) => {
  let highestCardIndex = 0;
  while (highestCardIndex < cards.length && cards[highestCardIndex].suit === trumpSuit) {
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
  return cards[highestCardIndex];
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

export const isCardLosingInUnder = (card, remainingCards) => {
  let lowerCardsCounter = 0;
  for (const cardInstance of remainingCards) {
    if (card.suit !== cardInstance.suit) {
      continue;
    }

    if (cardInstance.value < card.value) {
      lowerCardsCounter++;
    }
  }

  if (lowerCardsCounter >= 3) {
    return false;
  }

  return true;
};

export const getLosingCard = (cards, remainingCards) => {
  for (const card of cards) {
    if (isCardLosingInUnder(card, remainingCards)) {
      return card;
    }
  }
  return null;
};
