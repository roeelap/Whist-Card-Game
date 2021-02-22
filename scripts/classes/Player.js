export default class Player {
  constructor(index) {
    this.index = index;
    this.cards = [];
    this.score = 0;
    this.scoreDelta = 0;
    this.bid = 0;
    this.tricks = 0;
  }

  resetStats() {
    this.bid = 0;
    this.tricks = 0;
    this.cards = [];
  }

  sortCards() {
    this.cards.sort((a, b) => {
      return a.value - b.value;
    });
    this.cards.sort((a, b) => {
      return a.suit - b.suit;
    });
  }
}
