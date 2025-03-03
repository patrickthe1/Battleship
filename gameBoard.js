class Gameboard {
    constructor(){
        this.board = this.createBoard(); //Create 10x10 board
        this.ships = [];
        this.missedAttacks = []
    }

    createBoard(){
        return Array.from({length: 10}, () => Array(10).fill(null));
    }

    placeShip(ship, coordinates) {
        const [x,y] = coordinates;
        // Check if the ship can be placed (this is a simplified version, further validation needed)
        for (let i = 0; i < ship.length; i++) {
            if (this.board[x][y + i] !== null) {
                throw new Error('Ship cannot be placed here!'); // Overlapping ships
            }
        }
         // Place the ship on the board
         for (let i = 0; i < ship.length; i++) {
            this.board[x][y + i] = ship; // Place ship in the board
        }
        this.ships.push(ship); // Add ship to the ships array
    }

    receiveAttack(coordinates){
        const[x,y] = coordinates;
        if(this.board[x][y] !== null) {
            this.board[x][y].hit();// Hit the ship
            return 'hit';
        } else {
            this.missedAttacks.push(coordinates); // Record the missed attack
            return 'miss';
        }
    }

    allShipsSunk() {
        return this.ships.every(ship => ship.isSunk()); // Check if all ships are sunk
    }

    
}

export default Gameboard;