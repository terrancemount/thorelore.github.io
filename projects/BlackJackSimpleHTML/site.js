
'use strict';

const SUITS = ["Spades", "Hearts", "Diamonds", "Clubs"];
const FACES = ["Ace", "Two", "Three", 
                "Four", "Five", "Six", 
                "Seven", "Eight", "Nine", 
                "Ten", "Jack", "Queen", 
                "King"];
const NUMBER_OF_DECKS = 1;

let gameStarted = false,
    gameOver = false,
    playerWon = false,
    draw = false,
    dealerCards = [],
    playerCards = [],
    dealerScore = 0,
    playerScore = 0,
    deck = [];


let textArea = document.getElementById("text_area");
let newGameButton = document.getElementById("new_game_button");
let hitButton = document.getElementById("hit_button");
let stayButton = document.getElementById("stay_button");


//hide the hit and stay button at the begining of play
hitButton.style.display = 'none';
stayButton.style.display = 'none';
showStatus();

newGameButton.addEventListener('click', () => {
   //setup the game area
   newGameButton.style.display = 'none';
   hitButton.style.display = 'inline';
   stayButton.style.display = 'inline';

    //set up status varables
    gameStarted = true;
    gameOver = false;
    playerWon = false;
    draw = false;

    if(deck == undefined || deck.length < NUMBER_OF_DECKS * .33 * 52)
        deck = generateDecks();

    //this is not the correct order for dealing but it still works
    dealerCards = [getNextCard(), getNextCard()];
    playerCards = [getNextCard(), getNextCard()];
    updateDealerScore();
    updatePlayerScore();
    //check if the player won
    if(playerScore == 21){
        playerWon = true;
        gameOver = true;
    }
    showStatus();

});


hitButton.addEventListener('click', () => {
    playerCards.push(getNextCard());
    checkForEndOfGame();
});

stayButton.addEventListener('click', () => {
    gameOver = true;
    checkForEndOfGame();
});

//this will check for the end of game
function checkForEndOfGame(){
    //update the players score before checking for bust
    updatePlayerScore();

    //check if player busted
    if(playerScore > 21){
        gameOver = true;
        playerWon = false;
        draw = false;
    }

    //if player has hit stay or busted then gameOver flag will be true
    else if(gameOver){

        //updateDealerScores(); shouldn't need this here, was done when pressing the new button.
        while(dealerScore < playerScore && dealerScore < 21){
                dealerCards.push(getNextCard());
                updateDealerScore();
        }
        
        //check for dealer bust
        if(dealerScore > 21 || dealerScore < playerScore){
            playerWon = true;
        }
        else if(dealerScore > playerScore){
            playerWon = false;
        }
        else { //dealerScore == playerScore
            draw = true;
        }
    }
    //else the player is continuing to play

    showStatus();

}

//this is the primary method that is looped through during play
function showStatus(){
    //if game has not started then print welcome to blackjack and exit
    if(!gameStarted){
        textArea.innerText = "Welcome to Blackjack!";
        return;
    }

    //set the dealer string but only show the score and card if the game is over
    let dealerCardString = '';
    if(gameOver){
        dealerCards.forEach(card => dealerCardString += getCardString(card) + '\n');
    }
    else{
        dealerCardString = `${getCardString(dealerCards[0])}\n***********\n`;
    }
    let playerCardString = '';
    playerCards.forEach(card => playerCardString += getCardString(card) + '\n');

    //set the game board
    textArea.innerText = 
        `Dealer has:
         ${dealerCardString}(score: ${gameOver?dealerScore:"**"})


         Player has:
         ${playerCardString}(score: ${playerScore})
        `;

    //check if gameOver flag was set by button press
    if(gameOver){
        if(playerWon){
            textArea.innerText += "\nYOU WIN!";
        }
        else if(draw){
            textArea.innerHTML += "\nDRAW";
        }
        else{
            textArea.innerText += "\nDEALER WINS";
        }
        
        //setup the game area
        newGameButton.style.display = 'inline';
        hitButton.style.display = 'none';
        stayButton.style.display = 'none';
    }
}

//makes an array with 0 to 51 integers in it and return array
function generateDecks(){
    let decks = [];

    for(let deck = 0; deck < NUMBER_OF_DECKS; deck++){
        for(let suit = 0; suit < SUITS.length; suit++){
            for(let face = 0; face < FACES.length; face++){
                decks.push({
                    suit: SUITS[suit],
                    face: FACES[face]
                });
            }
        }
    }
    shuffelArray(decks);
    return decks;
}

//gets the next card of get
function getNextCard(){
    return deck.shift(); 
}

//shuffel the deck
function shuffelArray(array){
    for(let i = array.length - 1; i > 0; i--){
        let j = Math.trunc(Math.random()* i);
        
        //swap the two cards in the cards array
        let temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

//get string representation of the card
function getCardString(card){
    return `${card.face} of ${card.suit}`;
}

//update the the dealers score
function updateDealerScore(){
    dealerScore = getScore(dealerCards);
}


//update the players score
function updatePlayerScore(){
    playerScore = getScore(playerCards);
}

function getScore(cards){
    let score = 0;
    let hasAce = false;

    cards.forEach(card =>{
        if(card.face === 'Ace')
            hasAce = true;
        score += getCardNumericValue(card);
    });

    //check if there is atleast one ace and less then 21.  Note only one ace can be converted to 11. Two would be 22 and a bust.
    if(hasAce && score + 10 <= 21)
        score += 10;
    
    //return the resulting score
    return score;
}

//converts the string for the face in the card object
function getCardNumericValue(card){
    switch(card.face){
        case 'Ace':
            return 1;
        case 'Two':
            return 2;
        case 'Three':
            return 3;
        case 'Four':
            return 4;
        case 'Five':
            return 5;
        case 'Six':
            return 6;
        case 'Seven':
            return 7;
        case 'Eight':
            return 8;
        case 'Nine':
            return 9;
        default:
            return 10;
    }
}