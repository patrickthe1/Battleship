import Gameboard from "./gameBoard";
import Ship from "./ship";

describe('Gameboard', () => {
    let gameboard;
    let ship;

    beforeEach(() => {
        gameboard = new Gameboard(); // Create a new gameboard before each test
        ship = new Ship(3); // Create a new ship of length 3
    });

    test('should create a gameboard with a 10x10 grid',() => {
        expect(gameboard.board.length).toBe(10); // Check the number of rows
        expect(gameboard.board[0].length).toBe(10); // Check the number of columns
        expect(gameboard.board.flat().every(cell => cell === null)).toBe(true); // Check all cells are null
    })

    test('should place a ship on the board', () => {
        gameboard.placeShip(ship, [2, 3]); // Place the ship at coordinates (2, 3)
        expect(gameboard.board[2][3]).toBe(ship); // Check the ship is placed correctly
        expect(gameboard.board[2][4]).toBe(ship); // Check the next cell in the ship's length
        expect(gameboard.board[2][5]).toBe(ship); // Check the next cell in the ship's length
    });

    test('should not allow placing a ship in an invalid position', () => {
        gameboard.placeShip(ship, [2, 3]); // Place the ship at coordinates (2, 3)
        const anotherShip = new Ship(2); // Create another ship of length 2
        expect(() => {
            gameboard.placeShip(anotherShip, [2, 4]); // Attempt to place the second ship overlapping the first
        }).toThrow('Ship cannot be placed here!'); // Expect an error to be thrown
    })

    test('should register a hit when attacking a ship', () => {
        gameboard.placeShip(ship, [2, 3]); // Place the ship at coordinates (2, 3)
        const result = gameboard.receiveAttack([2, 3]); // Attack the ship
        expect(result).toBe('hit'); // Check that the result is a hit
        expect(ship.hits).toBe(1); // Check that the ship's hit count is updated
    });

    test('should register a miss when attacking an empty cell', () => {
        const result = gameboard.receiveAttack([0, 0]); // Attack an empty cell
        expect(result).toBe('miss'); // Check that the result is a miss
        expect(gameboard.missedAttacks).toContainEqual([0, 0]); // Check that the missed attack is recorded
    });

    test('should report if all ships are sunk', () => {
        const ship1 = new Ship(2);
        const ship2 = new Ship(3);
        gameboard.placeShip(ship1, [0, 0]);
        gameboard.placeShip(ship2, [1, 0]);
        
        // Attack all parts of ship1
        gameboard.receiveAttack([0, 0]);
        gameboard.receiveAttack([0, 1]);
        
        // Attack all parts of ship2
        gameboard.receiveAttack([1, 0]);
        gameboard.receiveAttack([1, 1]);
        gameboard.receiveAttack([1, 2]);
        
        expect(gameboard.allShipsSunk()).toBe(true); // Check that all ships are sunk
    });
})