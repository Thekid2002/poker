import { Player } from "./player";
let players: Player[] = [];
let communityCards: i32[] = [];
let pot: i32 = 0;
let communityCardsShown: i32 = 0;
let dealerIndex: i32 = -1;
let currentPlayer: i32 = 0;
let stakeholder: i32 = 0;
let rounds: i32 = 0;
const smallBlind: i32 = 50;
const bigBlind: i32 = 100;

function initPlayers(): void {
    for (let i: i32 = 0; i < 5; i++) {
        let player = new Player(1000, "", []);
        player.isHuman = i == 0;
        players.push(player);
    }
    dealerIndex = Mathf.floor(Math.random() * players.length);
    assignRoles();
}

function assignRoles(): void {
    dealerIndex = (dealerIndex + 1) % players.length;
    let smallBlindIndex: i32 = (dealerIndex + 1) % players.length;
    let bigBlindIndex: i32 = (dealerIndex + 2) % players.length;

    for (let i: i32 = 0; i < players.length; i++) {
        players[i].role = "";
    }
    players[dealerIndex].role = "dealer";
    players[smallBlindIndex].role = "small blind";
    players[bigBlindIndex].role = "big blind";
    
    currentPlayer = (dealerIndex + 3) % players.length;
    stakeholder = currentPlayer;
}

function postBlinds(): void {
    let smallBlindPlayer: i32 = (dealerIndex + 1) % players.length;
    let bigBlindPlayer: i32 = (dealerIndex + 2) % players.length;
    
    players[smallBlindPlayer].bet = smallBlind;
    players[bigBlindPlayer].bet = bigBlind;
    players[smallBlindPlayer].cash -= smallBlind;
    players[bigBlindPlayer].cash -= bigBlind;
    
    pot += smallBlind + bigBlind;
}

function dealCards(): void {
    let deck: i32[] = createDeck();
    for (let i: i32 = 0; i < players.length; i++) {
        players[i].cards = deck.splice(0, 2);
    }
    communityCards = deck.splice(0, 5);
}

function getHighestBet(): i32 {
    let highestBet: i32 = 0;
    for (let i: i32 = 0; i < players.length; i++) {
        if (players[i].bet > highestBet) {
            highestBet = players[i].bet;
        }
    }
    return highestBet;
}

function nextPlayer(): void {
    currentPlayer = (currentPlayer + 1) % players.length;

    if (players[currentPlayer].folded || players[currentPlayer].allIn) {
        nextPlayer();
        return;
    }

    if (!players[currentPlayer].isHuman) {
        aiTurn();
        return;
    }
    
    if (currentPlayer == stakeholder) {
        rounds++;
        if (rounds > 1) {
            revealCommunityCards();
        }
    }
}

function revealCommunityCards(): void {
    if (communityCardsShown < 5) {
        let revealCount: i32 = communityCardsShown == 0 ? 3 : 1;
        communityCardsShown += revealCount;
    }
    if (communityCardsShown == 5) determineWinner();
}

function determineWinner(): void {
    let remainingPlayers: Player[] = players.filter(p => !p.folded);
    let bestHand: i32 = 0;
    for (let i: i32 = 0; i < remainingPlayers.length; i++) {
        let handValue: i32 = evaluateHand(remainingPlayers[i].cards.concat(communityCards));
        if (handValue > bestHand) {
            bestHand = handValue;
        }
    }
    let winners: Player[] = remainingPlayers.filter(p => evaluateHand(p.cards.concat(communityCards)) == bestHand);
    let winnings: i32 = Mathf.floor(pot / winners.length);
    for (let i: i32 = 0; i < winners.length; i++) {
        winners[i].cash += winnings;
    }
    resetRound();
}

function resetRound(): void {
    for (let i: i32 = 0; i < players.length; i++) {
        players[i].bet = 0;
        players[i].folded = false;
        players[i].allIn = false;
        if (players[i].cash == 0) {
            players[i].eliminated = true;
        }
    }
    players = players.filter(player => !player.eliminated);
    pot = 0;
    communityCardsShown = 0;
    setTimeout(() => newRound(), 5000);
}

function newRound(): void {
    assignRoles();
    postBlinds();
    dealCards();
    nextPlayer();
}

function createDeck(): i32[] {
    // Implementation of deck creation
    return [];
}

function aiTurn(): void {
    // Implementation of AI turn
}