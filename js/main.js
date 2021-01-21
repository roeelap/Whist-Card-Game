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


// function for when the player wants to throw a card
function putCard(game, player, index, cardImg=null) {
    // putting the clicked card on the game board
    let img = player.cards[index].getImage();
    let playerCardId = `#player${player.index}Card .usedCardImage`;
    $(playerCardId).attr("src", img);

    // removing the card from the player's hand
    game.thrownCards[player] = player.cards.splice(index, 1);
    $(cardImg.parentElement).remove();
    console.log(game.thrownCards);
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

    if (game.passCount === 3 && game.bidCount >= 1) {
        return;
    } else if (game.passCount === 4) {
        game.newRound();
    }
}


function player1SuitBid(game, bidButton) {
    let bidAmount = parseInt($("#bidAmount").val());
    let bidSuit = $(bidButton).index();
    let choice = isTrumpSuitBidValid(game, bidAmount, bidSuit)
    if (choice === "pass") {
        game.passCount++;
        Game.toggleSuitButtons();
        game.nextTurn();
        return trumpSuitBidRound(game);
    } else if (choice) {
        game.bidCount++;
        game.passCount = 0;
        game.highestBid = game.players[0].bid = bidAmount;
        game.trumpSuit = bidSuit;
        game.firstPlayerToPlay = 1;
        Game.toggleSuitButtons();
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
}


function player1TricksBid(game, bidButton) {
    let bid = parseInt(bidButton.value);
    if (isTrickBidValid(game, bid)) {
        game.players[0].bid = bid
        game.totalBids += bid;
        Game.toggleBidButtons();
        game.trickBidsMade++;
        game.nextTurn();
        return tricksBidRound(game);
    };
}


$(document).ready(() => {
    let [game, player1, player2, player3, player4] = newGame();
    game.showCards(game);
    Game.toggleCardClicks();

    $.each($("#bid1 .bidButton"), (index, bidButton) => {
        bidButton.onclick = () => {player1SuitBid(game, bidButton)};
    });
    trumpSuitBidRound(game);

    $.each($("#bid2 .bidButton"), (index, bidButton) => {
        bidButton.onclick = () => {player1TricksBid(game, bidButton)};
    });
    tricksBidRound(game);
});
