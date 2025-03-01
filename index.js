
function makeDecision(hand) {
    let score = evaluateHand(hand);
    let randomFactor = Math.random(); // Generates a random number between 0 and 1

    if (score >= 6 || (score >= 4 && randomFactor > 0.5)) {
        return 2; // Bet
    } else if (score >= 4 || ( randomFactor > 0.5)) {
        return 1; // Call/Check
    } else {
        return 0; // Fold
    }
}

function aiTurn() {
    console.log("AI: ", currentPlayer);
    let aiHand = [...players[currentPlayer].cards, ...visibleCommunityCards];
    let choice = makeDecision(aiHand);

    switch (choice) {
        case 0:
            playerFold();
            break;
        case 1:
            playerCallCheck();
            break;
        case 2:
            playerBet(100);
            break;
    }
    nextPlayer(aiTurn);
    updateUI();
}

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
        playerFold();
        nextPlayer(aiTurn);
        updateUI();
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

    updateUI();
});
