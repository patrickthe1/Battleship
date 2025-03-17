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
        
        // Place ships on the respective player's boards directly
        game.placeShip(ship1, [0, 0], game.player1); 
        game.placeShip(ship2, [1, 1], game.player2);
        
        // Ensure currentPlayer is player1 for tests
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
        game.attack([0, 0]); // Player 1 attacks an empty cell (miss)
        expect(game.currentPlayer).toBe(game.player2); // Check that the current player is now Player 2

        game.attack([0, 1]); // Player 2 attacks an empty cell (miss)
        expect(game.currentPlayer).toBe(game.player1); // Check that the current player is now Player 1
    });

    test('should declare a winner when all their opponent\'s ships are sunk', () => {
        // Player 1 attacks ship2 at [1,1]
        game.attack([1, 1]);
        
        // Player 2 attacks (should miss)
        game.attack([0, 1]);
        
        // Player 1 attacks ship2 at [1,2] - this should sink ship2 and win
        const result = game.attack([1, 2]);
        
        expect(result).toBe('Player 1 wins!');
    });
});