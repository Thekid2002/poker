const suitMap = {
    0: "clubs",
    1: "diamonds",
    2: "hearts",
    3: "spades"
};

const valueMap = {
    1: "ace",
    2: "2",
    3: "3",
    4: "4",
    5: "5",
    6: "6",
    7: "7",
    8: "8",
    9: "9",
    10: "10",
    11: "jack",
    12: "queen",
    13: "king"
};

function createDeck() {
    let cards = [];
    for (let i = 0; i < 4; i++) {
        for (let j = 1; j <= 13; j++) {
            cards.push({ suit: suitMap[i], value: valueMap[j] });
        }
    }
    return shuffle(cards);
}

function shuffle(array) {
    let currentIndex = array.length, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
}
