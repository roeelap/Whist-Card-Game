import Deck from './deck.js'


export default class Game {
    SUITS = {1: "♣", 2: "♦", 3:"♥", 4:"♠", 5:"NT"};

    constructor(players) {
        this.players = players;
        this.deck;
        this.round = 1;
        this.highestBid = 0;
        this.trumpSuit = 0;
        this.totalBids = 0;
        this.PlayerIndex = 1;
        this.thrownCards = {};
    }

    newRound() {
        this.highestBid = 0;
        this.trumpSuit = 0;
        this.totalBids = 0;
        this.thrownCards = {};

        this.deck = new Deck();
        this.deck.shuffle();
        this.dealCards();
    }

    dealCards() {
        while (this.deck.cards.length > 0) {
            this.players.forEach(player => {
                player.cards.push(this.deck.cards.pop());
            });
        };
    }

    getRoundStatus() {
        if (this.totalBids > 13) {
            return `Over ${this.totalBids - 13}`;
        }
        else {
            return `Under ${13 - this.totalBids}`;
        }
    }

    static toggleSuitButtons() {
        $("#bid1").toggle();
    }
    
    static toggleBidButtons() {
        $("#bid1").toggle();
    }

    // disables all card clicks
    static toggleCardClicks() {
        document.querySelectorAll(".cardImage").forEach(cardImg => {
            $(cardImg).toggleClass("nonClickable");
        });  
    }

    static showBid(player, bid) {
        let playerCardDiv = `#player${player.index}Card h4`;
        $(playerCardDiv).html(bid);
    }
}