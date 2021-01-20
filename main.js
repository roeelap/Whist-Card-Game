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

    Game.toggleCardClicks();

    return [game, player1, player2, player3, player4];
}


// showing the player's hand
function showCards(player) {
    let output = "";
    let index = 0;
    player.cards.forEach(card => {
        output += `
            <div style:"z-index: ${index};">
                <img src="${card.getImage()}" class="cardImage" style="margin-left: -60px">
            </div>
        `;

        index++;
    });

    $("#player").html(output);

    document.querySelectorAll(".cardImage").forEach(cardImg => {
        cardImg.onclick = () => putCard(player, $(cardImg.parentElement).index(), cardImg);
    });
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
function isTrumpSuitBidValid(game, player, bidAmount, bidSuit) {
    // if the player passes - the pass button is the sixth button
    if (bidSuit === 6) {
        Game.showBid(player, "pass");
        return "pass";
    }

    //if the player tries to bid
    if (bidAmount < game.highestBid) {
        alert("Not a valid bid, please try again.");
        return false;
    } else if (bidAmount === game.highestBid) {
        if (bidSuit > game.trumpSuit) {
            game.highestBid = bidAmount;
            player.bid = bidAmount;
            game.trumpSuit = bidSuit;
            console.log("good bid");
            Game.showBid(player, bidAmount + game.SUITS[bidSuit]);
            return true;
        } else {
            alert("Not a valid bid, please try again.");
            return false;
        }
    } else {
        game.highestBid = bidAmount;
        player.bid = bidAmount;
        game.trumpSuit = bidSuit;
        Game.showBid(player, bidAmount + game.SUITS[bidSuit]);
        console.log("good bid");
        return true;
    }
}


function TrumpSuitBidRound(game, player1) {
    let passCount = 0;
    let bidCount = 0;

    // letting the player bid on the trump suit
    Game.toggleSuitButtons();
    $.each($("#bid1 .bidButton"), (index, bidButton) => {
        bidButton.onclick = function() {
            let bidAmount = parseInt($("#bidAmount").val());
            let bidSuit = $(bidButton).index();
            let choice = isTrumpSuitBidValid(game, player1, bidAmount, bidSuit)
            if (choice === "pass") {
                passCount += 1;
                Game.toggleSuitButtons();
            } else if (choice) {
                bidCount += 1;
                passCount = 0;
                Game.toggleSuitButtons();
            }
        }
    });

    if (passCount === 3 && bidCount >= 1) {
        return
    } else if (passCount === 4) {
        game.newRound();
        return
    }
}


// function regularBidRound(game, player1) {

// }


let [game, player1, player2, player3, player4] = newGame();
showCards(player1);
TrumpSuitBidRound(game, player1);



// letting the computers bid ont the trump suit


// let the players choose their bids
$.each($("#bid2 .bidButton"), (index, bidButton) => {
    bidButton.onclick = function() {
        let bid = parseInt(bidButton.value);
        if (isBidValid(game, player1, bid)) {;
            Game.toggleBidButtons();
        };
    }
});


