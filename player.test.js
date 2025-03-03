// path/to/player.test.js
import Ship from './ship';
import Gameboard from './gameBoard';
import Player from './player';

describe('Player', () => {
    let player;
    let opponent;
    let ship;

    beforeEach(() => {
        player = new Player('Player 1'); // Create a new player
        opponent = new Player('Player 2'); // Create an opponent player
        ship = new Ship(3); // Create a new ship of length 3
    });

    test('should create a player with a name and a gameboard', () => {
        expect(player.name).toBe('Player 1'); // Check the player's name
        expect(player.gameboard).toBeInstanceOf(Gameboard); // Check that the player has a gameboard
    });

    test('should place a ship on the player\'s gameboard', () => {
        player.placeShip(ship, [2, 3]); // Place the ship at coordinates (2, 3)
        expect(player.gameboard.board[2][3]).toBe(ship); // Check the ship is placed correctly
        expect(player.gameboard.board[2][4]).toBe(ship); // Check the next cell in the ship's length
        expect(player.gameboard.board[2][5]).toBe(ship); // Check the next cell in the ship's length
    });

    test('should attack the opponent\'s gameboard and register a hit', () => {
        opponent.placeShip(ship, [2, 3]); // Place a ship on the opponent's gameboard
        const result = player.attack(opponent, [2, 3]); // Attack the opponent's ship
        expect(result).toBe('hit'); // Check that the result is a hit
        expect(ship.hits).toBe(1); // Check that the ship's hit count is updated
    });

    test('should attack the opponent\'s gameboard and register a miss', () => {
        const result = player.attack(opponent, [0, 0]); // Attack an empty cell
        expect(result).toBe('miss'); // Check that the result is a miss
        expect(opponent.gameboard.missedAttacks).toContainEqual([0, 0]); // Check that the missed attack is recorded
    });
});