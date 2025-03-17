import Ship from './ship.js';
import Gameboard from './gameBoard.js';
import Player from './player.js';
import Game from './game.js';

// Test Ship
console.log('\n--- Ship Tests ---');
const testShip = new Ship(3);
console.log('Initial state:', testShip);
testShip.hit();
console.log('After one hit:', testShip);
console.log('Is sunk?', testShip.isSunk());
testShip.hit();
testShip.hit();
console.log('After three hits:', testShip);
console.log('Is sunk?', testShip.isSunk());

// Test Gameboard
console.log('\n--- Gameboard Tests ---');
const board = new Gameboard();
console.log('Empty board created:', board.board.length, 'x', board.board[0].length);
const ship1 = new Ship(3);
board.placeShip(ship1, [0, 0], 'horizontal');
console.log('Ship placed at [0,0]:', board.board[0][0] === ship1);
const attackResult = board.receiveAttack([0, 0]);
console.log('Attack at [0,0] result:', attackResult);
console.log('Ship hit count:', ship1.hits);
console.log('All ships sunk?', board.allShipsSunk());

// Test Player
console.log('\n--- Player Tests ---');
const player1 = new Player('Player 1');
const player2 = new Player('Player 2');
const shipPlayer = new Ship(2);
player2.placeShip(shipPlayer, [1, 1]);
console.log('Player 2 has ship at [1,1]:', player2.gameboard.board[1][1] === shipPlayer);
const attackPlayerResult = player1.attack(player2, [1, 1]);
console.log('Player 1 attacks Player 2 at [1,1] result:', attackPlayerResult);
console.log('Ship hit count:', shipPlayer.hits);

// Test Game
console.log('\n--- Game Tests ---');
const game = new Game('Test Player 1', 'Test Player 2');
const gameShip1 = new Ship(3);
const gameShip2 = new Ship(2);
game.placeShip(gameShip1, [0, 0], game.player1);
game.placeShip(gameShip2, [1, 1], game.player2);
console.log('Current player:', game.currentPlayer.name);
const gameAttackResult = game.attack([1, 1]);
console.log('Attack result:', gameAttackResult);
console.log('Game ship hit count:', gameShip2.hits);
console.log('Current player after attack:', game.currentPlayer.name); 