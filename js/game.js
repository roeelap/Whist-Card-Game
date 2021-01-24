import Deck from './deck.js'


export default class Game {
    SUITS = {1: "♣", 2: "♦", 3:"♥", 4:"♠", 5:"NT"};
    mostFreqSuitScorer = [["2", 0.25], ["3", 0.25], ["4", 0.25], ["5", 0.25], ["6", 0.5], ["7", 0.5], ["8", 0.5], ["9", 0.75], ["10", 0.75], ["11", 1], ["12", 1], ["13", 1], ["14", 1]];
    otherSuitScorer = [["12", 0.5], ["13", 1], ["14", 1]];

    constructor(players) {
        this.players = players;
        this.deck;
        this.round = 1;
        this.highestBid = 5;
        this.trumpSuit = 0;
        this.totalBids = 0;
        this.roundMode = 0;
        this.turn = 1;
        this.thrownCards = [];
        this.bidCount = 0;
        this.passCount = 0;
        this.trickBidsMade = 0;
        this.firstPlayerToPlay = 0;
    }


    newRound() {
        // resetting the stats
        this.highestBid = 5;
        this.trumpSuit = 0;
        this.totalBids = 0;
        this.roundMode = 0;
        this.thrownCards = [];
        this.bidCount = 0;
        this.passCount = 0;
        this.trickBidsMade = 0;
        this.firstPlayerToPlay++;
        
        //resetting the stats of each player
        this.players.forEach(player => {
            player.bid = 0;
            player.tricks = 0;
        })

        //creating a new deck
        this.deck = new Deck();
        this.deck.shuffle();
        this.dealCards();

        // making the label of the first-player-to-act bold
        Game.updateBoldLabel(this.firstPlayerToPlay);
    }


    dealCards() {
        while (this.deck.cards.length > 0) {
            this.players.forEach(player => {
                player.cards.push(this.deck.cards.pop());
                player.sortCards();
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
    }


    // checks if the trump suit bid is valid
    isTrumpSuitBidValid(bidAmount, bidSuit) {
        // if the player passes - the pass button is the sixth button
        if (bidSuit === 6) {
            this.passCount += 1;
            return "pass";
        }

        //if the player tries to bid
        if (bidAmount < this.highestBid) {
            return false;
        } else if (bidAmount === this.highestBid) {
            if (bidSuit > this.trumpSuit) {
                console.log("good bid");
                return true;
            } else {
                return false;
            }
        } else {
            console.log("good bid");
            return true;
        }
    }


    isTrickBidValid(bid) {
        if (this.trickBidsMade !== 3 || 0) {
            return true;
        } else if (this.trickBidsMade === 3) {
            if (this.totalBids + bid === 13) {
                return false;
            } else {
                return true;
            }
        } else if (this.trickBidsMade === 0) {
            if (bid < this.highestBid) {
                return false;
            } else {
                return true;
            }
        }
    }


    isCardValid(player, card) {
        // if it's the first player's turn
        if (this.thrownCards.length === 0) {
            return true;
        }
    
        // the suit of the first card played
        playedSuit = this.thrownCards[0][1].suit;
        // if the suit if the same
        if (card.suit === playedSuit) {
            return true;
        } else {
            // checking if the player has cards of the same suit
            player.cards.forEach(card => {
                if (card.suit ===  playedSuit) {
                    return false;
                } else {
                    return true;
                }
            });
        }
    }


    getRoundMode() {
        this.roundMode = this.totalBids - 13;
        if (this.roundMode > 0) {
            return `Over ${this.roundMode}`;
        }
        else {
            return `Under ${13 - this.totalBids}`;
        }
    }


    nextTurn() {
        if (this.turn === 4) {
            this.turn = 1;
        } else {
            this.turn++;
        }
        
        Game.updateBoldLabel(this.turn);
    }


    determineTrickWinner() {
        let trumpCount = 0;

        // removing all the cards that don't match the played suit or the trump suit
        for (let i = 0; i < this.thrownCards.length; i++) {
            if (this.thrownCards[i][1].suit !== this.thrownCards[0][1].suit && this.thrownCards[i][1].suit !== this.trumpSuit) {
                this.thrownCards.splice(i, 1);
            } else if (this.thrownCards[i][1].suit === this.trumpSuit) {
                trumpCount++;
            }
        };

        // removing all the card that don't match the trump suit
        if (trump_count > 0) {
            this.thrownCards.filter(PlayerCardPair => PlayerCardPair[1].suit === this.trumpSuit);
        }

        // sorting the list by descending values
        this.thrownCards.sort((a, b) => b[1].value - a[1].value);

        // getting the winner and giving him the trick
        let winningPlayer = this.thrownCards[0][0];
        winningPlayer.tricks++;
        
        // resetting the thrown cards list
        game.thrownCards = [];

        // updating the turn according to the winning player
        this.turn = winningPlayer.index;

        // updating the bold label
        let playerDiv = `#player${winningPlayer.index}Card p`;
        if (!$(playerDiv).hasClass("bold")) {
            Game.updateBoldLabel(winningPlayer.index);
        }
    }


    calculateScoreForBid0(player) {
        if (this.roundMode > 0) {
            if (player.tricks == 0) {
                player.score += 5
            } else if (player.tricks >= 1) {
                player.score += (-5 + 5 * (player.tricks - 1));
            }

        } else if (this.roundMode === -1) {
            if (player.tricks === 0) {
                player.score += 30
            } else if (player.tricks >= 1) {
                player.score += (-30 + 10 * (player.tricks - 1));
            }

        } else if (this.roundMode === -2) {
            if (player.tricks === 0) {
                player.score += 40
            } else if (player.tricks >= 1) {
                player.score += (-40 + 10 * (player.tricks - 1));
            }

        } else if (this.roundMode <= -3) {
            if (player.tricks === 0) {
                player.score += 50
            } else if (player.tricks >= 1) {
                player.score += (-50 + 10 * (player.tricks - 1));
            }
        }
    }


    static calculateScore(player) {
        if (player.bid === player.tricks && player.bid > 0) {
            player.score += (10 + player.bid ** 2);
        } else if (player.bid != player.tricks && 0 < player.bid < 5) {
            player.score += ((-5) * (Math.abs(tricks - bid)));
        } else if (player.bid != player.tricks && player.bid == 5) {
            player.score += ((-10) * Math.abs(player.tricks - player.bid));
        } else if (player.bid != player.tricks && player.bid == 6) {
            player.score += ((-15) * Math.abs(player.tricks - player.bid));
        } else if (player.bid != player.tricks && player.bid >= 7) {
            player.score += ((-20) * Math.abs(player.tricks - player.bid));
        }
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
    static showBid(playerIndex, bid) {
        let playerCardDiv = `#player${playerIndex}Card h4`;
        $(playerCardDiv).html(bid);
    }

    // makes the player's label bold while it's their turn
    static updateBoldLabel(playerIndex) {
        let playerLabels = [`#player1Card p`, `#player2Card p`, `#player3Card p`, `#player4Card p`];
        playerLabels.forEach(label => {
            $(label).removeClass("bold")
        })

        $(playerLabels[playerIndex - 1]).addClass("bold");
    }


    // --------------------- AI FUNCTIONS -------------------------- //


    static isCardInArray(array, value) {
        for (let i = 0; i < array.length; i++) {
            if (array[i].value === value) {
                return true;
            }
        };

        return false;
    }


    getTrumpSuitBid(player) {
        let clubs = player.cards.filter(card => card.suit === "1");
        let diamonds = player.cards.filter(card => card.suit === "2");
        let hearts = player.cards.filter(card => card.suit === "3");
        let spades = player.cards.filter(card => card.suit === "4");

        // figure out which suit is the most common
        let cards = [clubs, diamonds, hearts, spades].sort((a, b) => b.length - a.length);

        let mostFreqSuit = cards[0];
        let otherSuits = cards.slice(1, 4);

        // if the most common suit is less than 4 cards, just pass
        if (mostFreqSuit.length < 5) {
            // updating the pass count
            this.passCount++;
            return "pass";
        }

        let bid = 0;

        // get the score for the most common suit
        this.mostFreqSuitScorer.forEach(cardValue => {
            if (Game.isCardInArray(mostFreqSuit, cardValue[0])) {
                bid += cardValue[1];
            }
        });

        // get the score for the other suits
        otherSuits.forEach(suitArray => {
            this.otherSuitScorer.forEach(cardValue => {
                if (Game.isCardInArray(suitArray, cardValue[0])) {
                    bid += cardValue[1];
                }
            });
        })
        
        if (this.isTrumpSuitBidValid(Math.floor(bid), mostFreqSuit[0].suit)) {
            this.bidCount++;
            this.passCount = 0;

            // updating the highest bid and the trump suit
            this.highestBid = player.bid = Math.floor(bid);
            this.trumpSuit = mostFreqSuit[0].suit;
            
            return Math.floor(bid) + this.SUITS[mostFreqSuit[0].suit];

        } else {
             // updating the pass count
             this.passCount++;
             return "pass";
        }
    }
}