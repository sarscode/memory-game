'use strict';

const cardList = document.querySelectorAll('.card');

const deck = document.querySelector('.deck');

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function shuffleCards() {
  // Clears all open cards by default
  cardList.forEach(card => card.classList.remove('open', 'show', 'match'));
  // converting cardList to an Array
  const cardListArray = Array.from(cardList);

  const cards = [];
  shuffle(cardListArray).map(card => cards.push(card));
  // append shuffled cards
  cards.forEach(card => deck.appendChild(card));

  // resets number of moves
  moves.textContent = 0;
}

// display shuffled cards on load and reload
document.addEventListener('DOMContentLoaded', shuffleCards);

// Resets game
const reset = document.querySelector('.restart');
reset.addEventListener('click', shuffleCards);

// Stores opened cards
let openedCards = [];

deck.addEventListener('click', event => {
  const card = event.target;
  if (card.classList.contains('card')) {
    openCard(card);
  }
});

function openCard(card) {
  card.classList.add('open', 'show');
  openedCards.push(card);
  // console.log(openedCards);
  if (openedCards.length === 2) {
    checkOpenedCards();
  }
}

function checkOpenedCards() {
  const firstCardOpened = openedCards[0].firstElementChild,
    secondCardOpened = openedCards[1].firstElementChild;
  if (secondCardOpened.className === firstCardOpened.className) {
    matchCards();
    countMoves();
  } else {
    unmatchCards(firstCardOpened, secondCardOpened);
    countMoves();
  }
}

// stores matched cards
const matchedCards = [];

function matchCards() {
  const first = openedCards[0];
  const second = openedCards[1];
  matchedCards.push(first, second);
  openedCards[0].classList.add('match');
  openedCards[1].classList.add('match');
  openedCards = [];
}

function unmatchCards(firstCardOpened, secondCardOpened) {
  const first = firstCardOpened.parentElement.classList,
    second = secondCardOpened.parentElement.classList;
  first.add('unmatched');
  second.add('unmatched');

  // to persist the open cards for some seconds before close
  setTimeout(() => {
    first.remove('unmatched', 'show', 'open');
    second.remove('unmatched', 'show', 'open');
    openedCards = [];
  }, 1100);
}

const moves = document.querySelector('.moves');

function countMoves() {
  let count = Number(moves.textContent);
  count += 1;
  ratePlayer(count);
  return (moves.textContent = count);
}

const star = document.querySelectorAll('.fas.fa-star');
const stars = Array.from(star);

/* Player rating */
function ratePlayer(count) {
  console.log(stars);
  if (count > 8 && count <= 15) {
    stars[stars.length - 1].className = 'far fa-star';
  }
  if (count >= 16) {
    stars[stars.length - 2].className = 'far fa-star';
  }
}
