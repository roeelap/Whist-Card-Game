const SUITS = [1, 2, 3, 4];
const VALUES = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];

export default class Deck {
  constructor(cards = freshDeck()) {
    this.cards = cards;
    this.deckLength = this.cards.length;
  }

  shuffle() {
    for (let i = this.deckLength - 1; i > 0; i--) {
      const newIndex = Math.floor(Math.random() * (i + 1));
      const oldValue = this.cards[newIndex];
      this.cards[newIndex] = this.cards[i];
      this.cards[i] = oldValue;
    }
  }
}

class Card {
  constructor(value, suit) {
    this.value = value;
    this.suit = suit;
  }

  getImage() {
    let value = this.value;
    let suit = this.suit;

    if (value === 11) {
      value = 'J';
    } else if (value === 12) {
      value = 'Q';
    } else if (value === 13) {
      value = 'K';
    } else if (value === 14) {
      value = 'A';
    }

    if (suit === 1) {
      suit = 'C';
    } else if (suit === 2) {
      suit = 'D';
    } else if (suit === 3) {
      suit = 'H';
    } else if (suit === 4) {
      suit = 'S';
    }

    this.image = `./images/cards/${value}${suit}.png`;
    return this.image;
  }
}

function freshDeck() {
  return SUITS.flatMap((suit) => {
    return VALUES.map((value) => {
      return new Card(value, suit);
    });
  });
}
