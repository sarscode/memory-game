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
}

// display shuffled cards on load and reload
document.addEventListener('DOMContentLoaded', startGame);

// Resets game
const reset = document.querySelector('.restart');
reset.addEventListener('click', startGame);

// start game
function startGame() {
  // shuffle cards on new game
  shuffleCards();
  // reset timer to default
  clearInterval(timeStamp);
  // resets number of moves
  moves.textContent = 0;
  // display default time
  time.textContent = '0 mins : 0 secs';
  // reset stars
  stars.forEach(star => {
    star.className = 'fas fa-star';
  });
}

// Stores opened cards
let openedCards = [];

function click(event) {
  const card = event.target;
  if (card.classList.contains('card')) {
    openCard(card);
  }
}

deck.addEventListener('click', click);

function openCard(card) {
  card.classList.add('open', 'show');
  openedCards.push(card);
  // console.log(openedCards);
  if (openedCards.length === 2) {
    checkOpenedCards();
    countMoves();
  }
}

// Disable click
function disableCards() {
  deck.removeEventListener('click', click);
}

// Enable click
function enableCards() {
  deck.addEventListener('click', click);
}

function checkOpenedCards() {
  // disable cards temporarily to avoid multiple clicks
  disableCards();
  const firstCardOpened = openedCards[0].firstElementChild,
    secondCardOpened = openedCards[1].firstElementChild;
  if (secondCardOpened.className === firstCardOpened.className) {
    matchCards();
  } else {
    unmatchCards(firstCardOpened, secondCardOpened);
  }
  setTimeout(enableCards, 1100);
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
  if (matchedCards.length === 16) {
    setTimeout(completed, 1000);
  }
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
  if (count === 1) {
    startTimer();
  }
  return (moves.textContent = count);
}

const star = document.querySelectorAll('.fas.fa-star');
const stars = Array.from(star);

let starsCount;
/* Player rating */
function ratePlayer(count) {
  if (count > 12 && count < 15) {
    stars[stars.length - 1].className = 'far fa-star';
    starsCount = 2;
  }
  if (count >= 15) {
    stars[stars.length - 2].className = 'far fa-star';
    starsCount = 1;
  }
}

let second, minute, hour, timeStamp;
const time = document.querySelector('.time');

// calculate game time
function startTimer() {
  second = 0;
  minute = 0;
  hour = 0;
  timeStamp = setInterval(() => {
    time.textContent = `${minute} mins : ${second} secs`;
    second++;
    if (second === 60) {
      minute++;
      second = 0;
    }
    if (minute === 60) {
      startGame();
    }
  }, 1000);
}

const modal = document.querySelector('.modal');

function completed() {
  openModal();
  let starRating = document.querySelector('.stars').innerHTML;
  clearInterval(timeStamp);

  // total moves
  document.getElementById('moves').textContent = countMoves();
  // total time taken
  document.getElementById('total-time').textContent = time.textContent;
  document.getElementById('rating').innerHTML =
    starsCount === 1
      ? `🏅 ${starsCount} star`
      : starsCount === 2
        ? `🏅🏅 ${starsCount} stars`
        : `🏅🏅🏅 ${starsCount} stars`;
  const playAgainBtn = document.querySelector('.play-again');

  playAgainBtn.addEventListener('click', () => {
    startGame();
    modal.classList.remove('open-modal');
  });
}

function openModal() {
  modal.classList.add('open-modal');
}
