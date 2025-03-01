let players = [];
let communityCards = [];
let pot = 0;
let communityCardsShown = 0;
let dealerIndex = null;
let currentPlayer = 0;
let stakeholder = 0;
let rounds = 0;
const smallBlind = 50;
const bigBlind = 100;

function initPlayers() {
    for (let i = 0; i < 5; i++) {
        players.push({
            cash: 1000,
            bet: 0,
            role: "",
            allIn: false,
            cards: [],
            isHuman: i === 0,
            folded: false,
            container: document.getElementById(`player-${i + 1}`),
            cashElement: document.getElementById(`player-${i + 1}-cash`),
            betElement: document.getElementById(`player-${i + 1}-bet`),
            cardElement: document.getElementById(`player-${i + 1}-cards`),
            actionElement: document.getElementById(`player-${i + 1}-action`),
            roleElement: document.getElementById(`player-${i + 1}-role`),
        });
    }
    dealerIndex = Math.floor(Math.random() * players.length);
    assignRoles();
}

function assignRoles() {
    dealerIndex = (dealerIndex + 1) % players.length;
    let smallBlindIndex = (dealerIndex + 1) % players.length;
    let bigBlindIndex = (dealerIndex + 2) % players.length;

    players.forEach(player => player.role = "");
    players[dealerIndex].role = "dealer";
    players[smallBlindIndex].role = "small blind";
    players[bigBlindIndex].role = "big blind";
    
    currentPlayer = (dealerIndex + 3) % players.length;
    stakeholder = currentPlayer;
}

function postBlinds() {
    let smallBlindPlayer = (dealerIndex + 1) % players.length;
    let bigBlindPlayer = (dealerIndex + 2) % players.length;
    
    players[smallBlindPlayer].bet = smallBlind;
    players[bigBlindPlayer].bet = bigBlind;
    players[smallBlindPlayer].cash -= smallBlind;
    players[bigBlindPlayer].cash -= bigBlind;
    
    pot += smallBlind + bigBlind;
}

function dealCards() {
    let deck = createDeck();
    players.forEach(player => player.cards = deck.splice(0, 2));
    communityCards = deck.splice(0, 5);
}

function getHighestBet() {
    return Math.max(...players.map(player => player.bet));
}

function playerBet(amount) {
    let player = players[currentPlayer];
    if (amount > player.cash) amount = player.cash;
    player.cash -= amount;
    player.bet += amount;
    pot += amount;
    player.action = "Bet";
}

function playerCallCheck() {
    let player = players[currentPlayer];
    let highestBet = getHighestBet();
    let callAmount = highestBet - player.bet;
    
    if (callAmount > player.cash) {
        playerAllIn();
    } else if (callAmount > 0) {
        playerBet(callAmount);
        player.action = "Call";
    } else {
        player.action = "Check";
    }
}

function playerAllIn() {
    let player = players[currentPlayer];
    pot += player.cash;
    player.bet += player.cash;
    player.cash = 0;
    player.allIn = true;
    player.action = "All In";
}

function playerFold() {
    let player = players[currentPlayer];
    player.folded = true;
    player.action = "Fold";
}

function nextPlayer() {
    currentPlayer = (currentPlayer + 1) % players.length;

    if (players[currentPlayer].folded || players[currentPlayer].allIn) {
        return nextPlayer();
    }

    if (!players[currentPlayer].isHuman) {
        return aiTurn();
    }
    
    if (currentPlayer === stakeholder) {
        rounds++;
        if (rounds > 1) {
            revealCommunityCards();
        }
    }
}

function revealCommunityCards() {
    if (communityCardsShown < 5) {
        let revealCount = communityCardsShown === 0 ? 3 : 1;
        communityCardsShown += revealCount;
    }
    if (communityCardsShown === 5) determineWinner();
}

function determineWinner() {
    let remainingPlayers = players.filter(p => !p.folded);
    let bestHand = Math.max(...remainingPlayers.map(p => evaluateHand(p.cards.concat(communityCards))));
    let winners = remainingPlayers.filter(p => evaluateHand(p.cards.concat(communityCards)) === bestHand);
    let winnings = Math.floor(pot / winners.length);
    winners.forEach(p => p.cash += winnings);
    resetRound();
}

function resetRound() {
    players.forEach(player => {
        player.bet = 0;
        player.folded = false;
        player.allIn = false;
        if (player.cash === 0) player.eliminated = true;
    });
    players = players.filter(player => !player.eliminated);
    pot = 0;
    communityCardsShown = 0;
    setTimeout(() => newRound(), 5000);
}

function newRound() {
    assignRoles();
    postBlinds();
    dealCards();
    nextPlayer();
}