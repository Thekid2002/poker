import { Card } from "./card";

export class Player {
    static players: Player[] = [];
    static currentPlayer: i32 = 0;
    
    cash: i32 = 0;
    bet: i32 = 0;
    action: string = "";
    allIn: bool = false;
    folded: bool = false;
    role: string = "";
    cards: Card[] = [];
    isHuman: bool = false;

    constructor(cash: i32, action: string, cards: Card[], isHuman: bool) {
        this.cash = cash;
        this.action = action;
        this.cards = cards;
        this.isHuman = isHuman;
    }

    playerBet(amount: i32): void {
        let player = Player.players[Player.currentPlayer];
        if (amount > player.cash) amount = player.cash;
        player.cash -= amount;
        player.bet += amount;
        pot += amount;
        player.action = "Bet";
    }

    playerCallCheck(): void {
        let player = Player.players[Player.currentPlayer];
        let highestBet = getHighestBet(Player.players);
        let callAmount = highestBet - player.bet;
        
        if (callAmount > player.cash) {
            this.playerAllIn();
        } else if (callAmount > 0) {
            this.playerBet(callAmount);
            player.action = "Call";
        } else {
            player.action = "Check";
        }
    }

    playerAllIn(): void {
        let player = Player.players[Player.currentPlayer];
        pot += player.cash;
        player.bet += player.cash;
        player.cash = 0;
        player.allIn = true;
        player.action = "All In";
    }

    playerFold(): void {
        let player = Player.players[Player.currentPlayer];
        player.folded = true;
        player.action = "Fold";
    }
}

function getHighestBet(players: Player[]): i32 {
    let highestBet = 0;
    for (let i = 0; i < players.length; i++) {
        if (players[i].bet > highestBet) {
            highestBet = players[i].bet;
        }
    }
    return highestBet;
}