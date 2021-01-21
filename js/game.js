import Deck from './deck.js'


export default class Game {
    SUITS = {1: "♣", 2: "♦", 3:"♥", 4:"♠", 5:"NT"};

    constructor(players) {
        this.players = players;
        this.deck;
        this.round = 1;
        this.highestBid = 0;
        this.trumpSuit = 1;
        this.totalBids = 0;
        this.turn = 1;
        this.thrownCards = {};
        this.bidCount = 0;
        this.passCount = 0;
        this.trickBidsMade = 0;
        this.firstPlayerToPlay = 0;
    }


    newRound() {
        this.highestBid = 6;
        this.trumpSuit = 0;
        this.totalBids = 0;
        this.thrownCards = {};
        this.bidCount = 0;
        this.passCount = 0;
        this.trickBidsMade = 0;
        this.firstPlayerToPlay = 0;

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


    // showing the player's hand
    showCards() {
        let output = "";
        let index = 0;
        this.players[0].cards.forEach(card => {
            output += `
                <div style:"z-index: ${index};">
                    <img src="${card.getImage()}" class="cardImage" style="margin-left: -60px">
                </div>
            `;

            index++;
        });

        $("#player").html(output);

        document.querySelectorAll(".cardImage").forEach(cardImg => {
            cardImg.onclick = function() {
                let cardIndex = $(cardImg.parentElement).index()
                putCard(this, this.players[0], cardIndex, cardImg);
            };
        });
    }


    getRoundStatus() {
        if (this.totalBids > 13) {
            return `Over ${this.totalBids - 13}`;
        }
        else {
            return `Under ${13 - this.totalBids}`;
        }
    }


    nextTurn() {
        this.turn = (this.turn + 1) % 4;
    }


    static toggleSuitButtons() {
        $("#bid1").toggle();
    }
    

    static toggleBidButtons() {
        $("#bid2").toggle();
    }


    // disables all card clicks
    static toggleCardClicks() {
        document.querySelectorAll(".cardImage").forEach(cardImg => {
            $(cardImg).toggleClass("nonClickable");
        });  
    }

    // shows the bid/pass label 
    static showBid(player, bid) {
        let playerCardDiv = `#player${player.index}Card h4`;
        $(playerCardDiv).html(bid);
    }
}