
let players = [];
let communityCards = [];
let pot = 0;
let currentPlayer = 0; 
let communityCardsShown = 0;
let visibleCommunityCards = [];
let roles = [" ", "small blind", "big blind"];

 function initializePlayers() {
     let dealer = Math.floor(Math.random() * 5);
    for (let i = 0; i < 5; i++) {
        players.push({
            cash: 1000,
            bet: 0,
            container: document.getElementById(`player-${i + 1}`),
            cashElement: document.getElementById(`player-${i + 1}-cash`),
            betElement: document.getElementById(`player-${i + 1}-bet`),
            cardElement: document.getElementById(`player-${i + 1}-cards`),
            actionElement: document.getElementById(`player-${i + 1}-action`),
            roleElement: document.getElementById(`player-${i + 1}-role`),
            role: i === dealer ? "dealer" : roles[(i - dealer + 5) % 5] ?? "",
            cards: [],
            folded: false,
        })
        players[i].roleElement.innerHTML = `Role: ${players[i].role}`;

        if(players[i].role === "dealer") {
            currentPlayer = i;
        }

        if(players[i].role === "small blind") {
            players[i].cash -= 50;
            players[i].bet = 50;
            pot += 50;
        }

        if(players[i].role === "big blind") {
            players[i].cash -= 100;
            players[i].bet = 100;
            pot += 100;
        }

        players[i].cashElement.innerHTML = `Cash: ${players[i].cash}`;
    }

}

function deal(players) {
    let deck = createDeck();
    for (let i = 0; i < players.length; i++) {
        players[i].cards = deck.splice(0, 2);
    }
    return deck.splice(0, 5);
}

function getHighestBet() {
    return Math.max(...players.map(player => player.bet));
}

function playerBet(amount) {
    if (amount > 0 && players[currentPlayer].cash >= amount) {
        players[currentPlayer].bet += amount;
        players[currentPlayer].cash -= amount;
        players[currentPlayer].actionElement.innerHTML = "Action: Bet";
        pot += amount;
    }
}

function playerCallCheck() {
    let highestBet = getHighestBet();
    let callAmount = highestBet - players[currentPlayer].bet;
    if (callAmount > 0 && players[currentPlayer].cash >= callAmount) {
        players[currentPlayer].bet += callAmount;
        players[currentPlayer].cash -= callAmount;
        players[currentPlayer].actionElement.innerHTML = "Action: Call";
        pot += callAmount;
    }else {
        players[currentPlayer].actionElement.innerHTML = "Action: Check";
    }
}

function playerFold() {
     players[currentPlayer].container.classList.add("folded");
     players[currentPlayer].actionElement.innerHTML = "Fold";
     players[currentPlayer].folded = true;
}

function nextPlayer(aiTurn) {
     let remainingPlayers = players.filter(player => !player.folded);
    if(remainingPlayers.length === 1) {
        determineWinner();
        return;
    }
    players[currentPlayer].container.classList.remove("active");
    currentPlayer = (currentPlayer + 1) % players.length;
    if(players[currentPlayer].folded) {
        nextPlayer(aiTurn);
        return;
    }
    players[currentPlayer].container.classList.add("active");

    if (currentPlayer !== 0) {
        setTimeout(aiTurn, 1000);
    } else if (communityCardsShown < 5) {
        let community = getCommunityCards();
        for (let i = 0; i < community.length; i++) {
            document.getElementById("community-cards").appendChild(community[i]);
        }
        if(communityCards.length === 0) {
            determineWinner();
        }
    }
}

function evaluateHand(cards) {
    let suits = {};
    let values = {};
    let straight = false;
    let flush = false;
    let royalFlush = false;
    let straightFlush = false;
    let fourOfAKind = false;
    let threeOfAKind = false;
    let pairs = 0;

    cards.forEach(card => {
        if (suits[card.suit]) {
            suits[card.suit]++;
        } else {
            suits[card.suit] = 1;
        }

        if (values[card.value]) {
            values[card.value]++;
        } else {
            values[card.value] = 1;
        }
    });

    let uniqueValues = Object.keys(values).length;
    let uniqueSuits = Object.keys(suits).length;

    if (uniqueValues === 5) {
        let sortedValues = Object.keys(values).sort((a, b) => a - b);
        if (sortedValues[4] - sortedValues[0] === 4) {
            straight = true;
            if (uniqueSuits === 1) {
                straightFlush = true;
                if (sortedValues[4] === 13) {
                    royalFlush = true;
                }
            }
        }
    }

    for (let value in values) {
        if (values[value] === 4) {
            fourOfAKind = true;
        } else if (values[value] === 3) {
            threeOfAKind = true;
        } else if (values[value] === 2) {
            pairs++;
        }
    }

    if (uniqueSuits === 1) {
        flush = true;
    }

    if (royalFlush) {
        return 10;
    } else if (straightFlush) {
        return 9;
    } else if (fourOfAKind) {
        return 8;
    } else if (pairs === 1 && threeOfAKind) {
        return 7;
    } else if (flush) {
        return 6;
    } else if (straight) {
        return 5;
    } else if (threeOfAKind) {
        return 4;
    } else if (pairs === 2) {
        return 3;
    } else if (pairs === 1) {
        return 2;
    } else {
        return 1;
    }
}

function determineWinner() {
     showAllHands();

     let remainingPlayers = players.filter(player => !player.folded);
    let playerHands = remainingPlayers.map(player => {
        return evaluateHand(player.cards.concat(communityCards));
    });

    let winningHand = Math.max(...playerHands);
    let winningPlayers = playerHands.map((hand, index) => {
        if (hand === winningHand) {
            return index;
        }
    }).filter(index => index !== undefined);

    let winnings = Math.floor(pot / winningPlayers.length);
    winningPlayers.forEach(index => {
        players[index].cash += winnings;
        players[index].container.classList.add("winner");
    });

    setTimeout(resetRound, 10000);

    updateUI();
}

function resetRound() {
    players.forEach(player => {
        player.bet = 0;
        player.container.classList.remove("winner");
        player.container.classList.remove("active");
        if(player.folded) {
            player.container.classList.remove("folded");
        }
        player.actionElement.innerHTML = "";
        player.cardElement.innerHTML = "";
        player.cards = [];
        player.folded = false;
        if(player.cash === 0) {
            player.eliminated = true;
            player.container.classList.add("eliminated");
        }
    });
    players = players.filter(player => !player.eliminated);
    pot = 0;
    currentPlayer = 0;
    communityCardsShown = 0;
    document.getElementById("community-cards").innerHTML = "";
    updateUI();
    setTimeout(newRound(), 10000);
}


function newRound() {
    communityCards = deal(players);
    let images = getPlayerCards();

    players[0].cardElement.appendChild(images[0]);
    players[0].cardElement.appendChild(images[1]);
    nextPlayer(aiTurn);
    return true;
}