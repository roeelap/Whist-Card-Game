    import Game from './game.js'
    import Player from './player.js'


function newGame() {
    const player1 = new Player(1);
    const player2 = new Player(2);
    const player3 = new Player(3);
    const player4 = new Player(4);

    const game = new Game([player1, player2, player3, player4]);

    game.newRound();
    
    game.players.forEach(player => {
        player.sortCards();
    });

    return [game, player1, player2, player3, player4];
}


// checks if the trump suit bid is valid
function isTrumpSuitBidValid(game, bidAmount, bidSuit) {
    // if the player passes - the pass button is the sixth button
    if (bidSuit === 6) {
        game.passCount += 1;
        return "pass";
    }

    //if the player tries to bid
    if (bidAmount < game.highestBid) {
        alert("Not a valid bid, please try again.");
        return false;
    } else if (bidAmount === game.highestBid) {
        if (bidSuit > game.trumpSuit) {
            console.log("good bid");
            return true;
        } else {
            alert("Not a valid bid, please try again.");
            return false;
        }
    } else {
        console.log("good bid");
        return true;
    }
}


function trumpSuitBidRound(game) {
    if (game.turn === 1) {
        Game.toggleSuitButtons();
    } else if (game.turn === 2 || 3 || 4) {
        console.log("cpu's turn");
    }

    // checking if 3 player passed and 1 bid || OR || the 4 players have passed
    if (game.passCount === 3 && game.bidCount >= 1) {
        console.log("phase complete");
        return tricksBidRound(game);
    } else if (game.passCount === 4) {
        game.newRound();
        return;
    }
}


function player1SuitBid(game, bidButton) {
    let bidAmount = parseInt($("#bidAmount").val());
    let bidSuit = $(bidButton).index();
    let choice = isTrumpSuitBidValid(game, bidAmount, bidSuit)

    if (choice === "pass") {
        // updating the pass count
        game.passCount++;

        // removing the suit buttons
        Game.toggleSuitButtons();

        // showing the player's bid
        Game.showBid(game.players[0], choice);

        //updating the turn and letting the cpu act
        game.nextTurn();
        return trumpSuitBidRound(game);

    } else if (choice) {
        // updating the bid and pass counts
        game.bidCount++;
        game.passCount = 0;

        // updating the highest bid and the trump suit
        game.highestBid = game.players[0].bid = bidAmount;
        game.trumpSuit = bidSuit;

        // if no one will bid higher, player1 will be the first to play a card
        game.firstPlayerToPlay = 1;

        // removing the suit buttons
        Game.toggleSuitButtons();

        // showing the player's bid
        Game.showBid(game.players[0], bidAmount + game.SUITS[bidSuit]);

         //updating the turn and letting the cpu act
        game.nextTurn();
        return trumpSuitBidRound(game);
    }
}


function isTrickBidValid(game, bid) {
    if (game.trickBidsMade !== 3 || 0) {
        return true;
    } else if (game.trickBidsMade === 3) {
        if (game.totalBids + bid === 13) {
            return false;
        } else {
            return true;
        }
    } else if (game.trickBidsMade === 0) {
        if (bid < game.highestBid) {
            return false;
        } else {
            return true;
        }
    }
}


function tricksBidRound(game) {
    if (game.turn === 1) {
        Game.toggleBidButtons();
    } else if (game.turn === 2 || 3 || 4) {
        console.log("cpu's turn");
        game.trickBidsMade++;
    }

    if (game.trickBidsMade === 4) {
        $("#roundMode").html(`<td><strong>${game.getRoundMode()}</strong></td>`);
        return gameRound(game);
    }
}


function player1TricksBid(game, bidButton) {
    let bid = parseInt(bidButton.value);

    if (isTrickBidValid(game, bid)) {
        // updating the player's bid
        game.players[0].bid = bid;

        // updating the total bids of the round
        game.totalBids += bid;
        $("#totalBids").html(`<td><strong>Total Bids: </strong>${game.totalBids}</td>`);

        // removing the bid buttons
        Game.toggleBidButtons();

        // showing the player's bid on the game board
        Game.showBid(game.players[0], bid);

        // updating the number of tricks that has been made
        game.trickBidsMade++;

        // updating the turn and letting the cpu act
        game.nextTurn();
        return tricksBidRound(game);
    };
}


function isCardValid(game, player, card) {
    // if it's the first player's turn
    if (Object.keys(game.thrownCards).length === 0) {
        return true;
    }

    // the suit of the first card played
    playedSuit = Object.values(game.thrownCards)[0].suit;
    // if the suit if the same
    if (card.suit === playedSuit) {
        return true;
    } else {
        // checking if the player has cards of the same suit
        player.cards.forEach(card => {
            if (card.suit ===  playedSuit) {
                alert("Not A Valid Card");
                return false;
            } else {
                return true;
            }
        });
    }
}


function gameRound(game) {
    // if it's player1's turn
    if (game.turn === 1) {
        Game.toggleCardClicks();
    }

    // if it's the cpu's turn
    else if (game.turn === 2 || 3 || 4) {
        console.log("cpu's turn");
    }

    // if 4 players put a card down
    if (Object.keys(game.thrownCards).length === 4) {
        // figure out the winning card and the starting player of the next putdown
        game.thrownCards = {};
    }

    // if the players have run out of cards
    if (game.players.every(player => player.cards.length === 0)) {
        // calculate score for each player
        if (player.bid === 0) {
            game.calculateScoreForBid0(player);
        } else {
            Game.calculateScore(player);
        }

        game.newRound();
    }
}


// function for when the player wants to throw a card
function putCard(game, player, index, cardImg=null) {
    // check if the player can put the card down
    if (isCardValid(game, player, player.cards[index])) {
        // putting the clicked card on the game board
        let img = player.cards[index].getImage();
        let playerCardId = `#player${player.index}Card .usedCardImage`;
        $(playerCardId).attr("src", img);

        // removing the card from the player's hand
        game.thrownCards[player] = player.cards.splice(index, 1);
        $(cardImg.parentElement).remove();

        // toggling the card clicks if the player is player1
        if (player.index === 1) {
            Game.toggleCardClicks();
        }

        // next turn
        game.nextTurn();
        return gameRound(game);
    }
}


$(document).ready(() => {
    // creating a new game
    let [game, player1, player2, player3, player4] = newGame();
    game.showCards(game);
    Game.toggleCardClicks();
    
    // onclick events for the suit buttons
    $.each($("#bid1 .bidButton"), (index, bidButton) => {
        bidButton.onclick = () => {player1SuitBid(game, bidButton)};
    });
    
    // onclick events for the bid buttons
    $.each($("#bid2 .bidButton"), (index, bidButton) => {
        bidButton.onclick = () => {player1TricksBid(game, bidButton)};
    });

    // onclick events for the card images
    document.querySelectorAll(".cardImage").forEach(cardImg => {
        cardImg.onclick = function() {
            let cardIndex = $(cardImg.parentElement).index()
            putCard(this, this.players[0], cardIndex, cardImg);
        };
    });


    //starting the trump suit bid round
    trumpSuitBidRound(game);
});
