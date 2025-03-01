
function updateUI() {
    document.getElementById("pot").innerHTML = `Pot: ${pot}`;
    players.forEach(player => {
        player.cashElement.innerHTML = `Cash: ${player.cash}`;
        player.betElement.innerHTML = `Bet: ${player.bet}`;
        player.actionElement.innerHTML = `Action: ${player.action ?? ""}`;
        player.roleElement.innerHTML = `Role: ${player.role}`;
        if(player.isHuman) {
            player.cards.forEach(card => {
                let img = document.createElement("img");
                img.src = `playing-cards/${card.suit}/${card.value}.png`;
                img.width = 70;
                img.classList.add("card");
                player.cardElement.appendChild(img);
            }
            );
        }
    });
}

function getPlayerCards() {
    let img1 = document.createElement("img");
    img1.src = `playing-cards/${players[0].cards[0].suit}/${players[0].cards[0].value}.png`;
    img1.width = 70;
    img1.classList.add("card");

    let img2 = document.createElement("img");
    img2.src = `playing-cards/${players[0].cards[1].suit}/${players[0].cards[1].value}.png`;
    img2.width = 70;
    img2.classList.add("card");

    return [img1, img2];
}

function showAllHands() {
    players.forEach(player => {
        if(!player.folded && players.indexOf(player) !== 0) {
            let img1 = document.createElement("img");
            img1.src = `playing-cards/${player.cards[0].suit}/${player.cards[0].value}.png`;
            img1.width = 70;
            img1.classList.add("card");

            let img2 = document.createElement("img");
            img2.src = `playing-cards/${player.cards[1].suit}/${player.cards[1].value}.png`;
            img2.width = 70;
            img2.classList.add("card");

            player.cardElement.appendChild(img1);
            player.cardElement.appendChild(img2);
        }
    });
}

function getCommunityCards() {
    let images = [];
    let count = 0;

    if (communityCardsShown === 0) count = 3; // Flop
    else if (communityCardsShown === 3) count = 1; // Turn
    else if (communityCardsShown === 4) count = 1; // River

    for (let i = 0; i < count; i++) {
        let img = document.createElement("img");
        img.src = `playing-cards/${communityCards[0].suit}/${communityCards[0].value}.png`;
        img.width = 60;
        img.classList.add("card");
        images.push(img);
        visibleCommunityCards.push(communityCards[0]);
        communityCards.shift();
        communityCardsShown++;
    }

    return images;
}


function showCommunityCards() {
    for (let i = 0; i < communityCards.length; i++) {
        let img = document.createElement("img");
        img.src = `playing-cards/${communityCards[i].suit}/${communityCards[i].value}.png`;
        img.width = 60;
        img.classList.add("card");
        document.getElementById("community-cards").appendChild(img);
    }
}