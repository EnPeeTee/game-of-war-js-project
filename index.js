const btnDeckDraw = document.getElementById("deck-draw");
const btnDeckNew = document.getElementById("deck-new");
const deckCardsRemaining = document.getElementById("deck-cards-remaining");

let deckID = "";
let scoreComputer = 0;
let scorePlayer = 0;


async function clickDeckNew() {
    const res = await fetch("https://apis.scrimba.com/deckofcards/api/deck/new/shuffle/")
    const data = await res.json()
    console.log(data);

    deckID = data.deck_id;
    deckCardsRemaining.textContent = `Cards remaining: ${data.remaining}`;
    btnDeckDraw.disabled = false;
};

async function clickDeckDraw() {
    const res = await fetch(`https://apis.scrimba.com/deckofcards/api/deck/${deckID}/draw/?count=2`)
    const data = await res.json()
    console.log(data.cards);

    const cardContainer = document.getElementById("deck-cards").children;
    const cardCodesArr = [];
    for ( let i = 0; i < cardContainer.length; i++ ) {
        cardContainer[i].innerHTML = `<img class="deck-card-img" src=${data.cards[i].image}>`;
        cardCodesArr.push(data.cards[i].code);
    };
    document.getElementById("game-announcement").textContent = gameMechanics(cardCodesArr);
    deckCardsRemaining.textContent = `Cards remaining: ${data.remaining}`;

    if (!data.remaining) {
        btnDeckDraw.disabled = true;
        document.getElementById("game-announcement").textContent = 
            scorePlayer > scoreComputer ? `The Player Wins The War!` : 
            scorePlayer < scoreComputer ? `The Computer Wins The War!` : `The Player And The Computer Got A Draw!`
    };
};

btnDeckNew.addEventListener( "click", clickDeckNew );

btnDeckDraw.addEventListener( "click", clickDeckDraw );

function gameMechanics(input) {
    let cardArr = input;
    const cardValue = cardArr.map( card => card.slice( 0, cardArr.length - 1).toLowerCase() );


    let cardOfPlayers = [];
    for ( let cardStrenght of cardValue) {
        switch (cardStrenght) {
            case "0":
                cardOfPlayers.push(10);
                break;
            case "j":
                cardOfPlayers.push(11);
                break;
            case "q":
                cardOfPlayers.push(12);
                break;
            case "k":
                cardOfPlayers.push(13);
                break;
            case "a":
                cardOfPlayers.push(14);
                break;
            default:    
                cardOfPlayers.push(parseInt(cardStrenght));
        };
    };

    return gameCalculateStrength(cardOfPlayers);
};

function gameCalculateStrength(cardOfPlayerArr) {
    const player1 = cardOfPlayerArr[1];
    const player2 = cardOfPlayerArr[0];

    if (player1 < player2) {
        scoreComputer++
        document.getElementById("score-computer").textContent = `Computer score: ${scoreComputer}`
        return "Computer wins!";
    }
    else if (player1 > player2) {
        scorePlayer++
        document.getElementById("score-player").textContent = `Your score: ${scorePlayer}`
        return "Player wins!";
    }
    else {
        return "War!";
    }
};