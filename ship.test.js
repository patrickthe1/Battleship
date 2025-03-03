import Ship from './ship'

describe('Ship', () => {
    let ship;

    beforeEach(()=> {
        ship = new Ship(3) // Create a new ship of length 3 before each test
    })

    test('should create a ship with the coreect length', () => {
        expect(ship.length).toBe(3);
        expect(ship.hits).toBe(0);
    });

    test('should increase hit count when hit', () => {
        ship.hit();
        expect(ship.hits).toBe(1); // After one hit, hits should be 1
    });


    test('should be sunk when hits equal length', () => {
        ship.hit();
        ship.hit();
        ship.hit(); // Hit the ship 3 times
        expect(ship.isSunk()).toBe(true); // The ship should be sunk
    });

    test('should not be sunk when hits are less than length', () => {
        ship.hit();
        expect(ship.isSunk()).toBe(false); // The ship should not be sunk
    });
});
