

document.addEventListener("DOMContentLoaded", () => {
    const foldButton = document.getElementById("fold-button");
    const callCheckButton = document.getElementById("call-check-button");
    const betButton = document.getElementById("bet-button");

    initializePlayers();
    newRound()

    foldButton.addEventListener("click", () => {
        if (currentPlayer !== 0) {
            alert("You can only fold on your turn!");
            return;
        }
        alert("You folded!");
        resetRound();
    });

    callCheckButton.addEventListener("click", () => {
        if (currentPlayer !== 0) {
            alert("You can only call/check on your turn!");
            return;
        }
        playerCallCheck();
        nextPlayer(aiTurn);
        updateUI();
    });

    betButton.addEventListener("click", () => {
        if (currentPlayer !== 0) {
            alert("You can only bet on your turn!");
            return;
        }

        let betAmount = parseInt(prompt("Enter bet amount:"));
        if (!isNaN(betAmount) && betAmount > 0) {
            playerBet(betAmount);
        }
        nextPlayer(aiTurn);
        updateUI();
    });

    function aiTurn() {
        let highestBet = getHighestBet();
        let callAmount = highestBet - players[currentPlayer].bet;
        if (callAmount > 0 && players[currentPlayer].cash >= callAmount) {
            players[currentPlayer].bet += callAmount;
            players[currentPlayer].cash -= callAmount;
            pot += callAmount;
        }
        nextPlayer(aiTurn);
        updateUI();
    }

    updateUI();
});
