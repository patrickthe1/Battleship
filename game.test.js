import Game from './game';
import Ship from './ship';

describe('Game', () => {
    let game;
    let ship1;
    let ship2;

    beforeEach(() => {
        game = new Game('Player 1', 'Player 2'); // Create a new game
        ship1 = new Ship(3); // Create a new ship of length 3 for Player 1
        ship2 = new Ship(2); // Create a new ship of length 2 for Player 2
        
        // Place ship1 on Player 1's board (currentPlayer starts as player1)
        game.placeShip(ship1, [0, 0]); 
        
        // After the above, currentPlayer is now player2
        // Place ship2 on Player 2's board
        game.placeShip(ship2, [1, 1]); 
        
        // Reset currentPlayer to player1 for tests
        game.currentPlayer = game.player1;
        game.opponent = game.player2;
    });

    test('should create a game with two players', () => {
        expect(game.player1.name).toBe('Player 1'); // Check Player 1's name
        expect(game.player2.name).toBe('Player 2'); // Check Player 2's name
        expect(game.currentPlayer).toBe(game.player1); // Check that Player 1 starts first
    });

    test('should allow players to place ships', () => {
        expect(game.player1.gameboard.board[0][0]).toBe(ship1); // Check ship1 is placed correctly
        expect(game.player2.gameboard.board[1][1]).toBe(ship2); // Check ship2 is placed correctly
    });

    test('should allow Player 1 to attack Player 2', () => {
        const result = game.attack([1, 1]); // Player 1 attacks Player 2's ship
        expect(result).toBe('hit'); // Check that the result is a hit
        expect(ship2.hits).toBe(1); // Check that ship2's hit count is updated
    });

    test('should switch turns after an attack', () => {
        game.attack([1, 1]); // Player 1 attacks
        expect(game.currentPlayer).toBe(game.player2); // Check that the current player is now Player 2
    });

    test('should declare a winner when all their opponent\'s ship\'s are sunk', () => {
        // First, let's make sure we understand the ship positions:
        // ship1 (length 3) is at [0,0], [0,1], [0,2] on Player 1's board
        // ship2 (length 2) is at [1,1], [1,2] on Player 2's board
        
        // Player 1 attacks ship2 at [1,1]
        game.attack([1, 1]);
        
        // Player 2 attacks ship1 at [0,0]
        game.attack([0, 0]);
        
        // Player 1 attacks ship2 at [1,2] - this should sink ship2
        
        
        const result = game.attack([1, 2]);;
        
       
        expect(result).toBe('Player 1 wins!');
    });
});