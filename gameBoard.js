// class Gameboard {
//     constructor(){
//         this.board = this.createBoard(); //Create 10x10 board
//         this.ships = [];
//         this.missedAttacks = []
//     }

//     createBoard(){
//         return Array.from({length: 10}, () => Array(10).fill(null));
//     }

//     placeShip(ship, coordinates, orientation = 'horizontal') {
//         const [x, y] = coordinates;
        
//         // Check if the ship can be placed
//         for (let i = 0; i < ship.length; i++) {
//             let checkX = x;
//             let checkY = y;
            
//             if (orientation === 'horizontal') {
//                 checkY += i;
//             } else {
//                 checkX += i;
//             }
            
//             // Check if out of bounds
//             if (checkX >= 10 || checkY >= 10) {
//                 throw new Error('Ship cannot be placed here! Out of bounds.');
//             }
            
//             // Check if cell is already occupied
//             if (this.board[checkX][checkY] !== null) {
//                 throw new Error('Ship cannot be placed here! Overlapping ships.');
//             }
//         }
        
//         // Place the ship on the board
//         for (let i = 0; i < ship.length; i++) {
//             let placeX = x;
//             let placeY = y;
            
//             if (orientation === 'horizontal') {
//                 placeY += i;
//             } else {
//                 placeX += i;
//             }
            
//             this.board[placeX][placeY] = ship; // Place ship in the board
//         }
        
//         this.ships.push(ship); // Add ship to the ships array
//     }

//     receiveAttack(coordinates) {
//         const [x, y] = coordinates;
        
//         // Check if this position has already been attacked
//         const alreadyAttacked = this.missedAttacks.some(
//             coords => coords[0] === x && coords[1] === y
//         );
        
//         if (alreadyAttacked) {
//             return 'already attacked';
//         }
        
//         if (this.board[x][y] !== null) {
//             // Hit the ship
//             this.board[x][y].hit();
            
//             // Record the hit position
//             this.missedAttacks.push(coordinates);
            
//             // Check if the ship is sunk
//             if (this.board[x][y].isSunk()) {
//                 return 'sunk';
//             }
            
//             return 'hit';
//         } else {
//             // Record the missed attack
//             this.missedAttacks.push(coordinates);
//             return 'miss';
//         }
//     }

//     allShipsSunk() {
//         return this.ships.every(ship => ship.isSunk()); // Check if all ships are sunk
//     }

    
// }

// export default Gameboard;

class Gameboard {
    constructor(){
        this.board = this.createBoard(); //Create 10x10 board
        this.ships = [];
        this.missedAttacks = [];
        this.hitAttacks = []; // ADDED: Array to store hit positions - Renamed from hitPositions to hitAttacks to align with script.js potentially
    }

    createBoard(){
        return Array.from({length: 10}, () => Array(10).fill(null));
    }

    placeShip(ship, coordinates, orientation = 'horizontal') {
        const [x, y] = coordinates;

        // Check if the ship can be placed
        for (let i = 0; i < ship.length; i++) {
            let checkX = x;
            let checkY = y;

            if (orientation === 'horizontal') {
                checkY += i;
            } else {
                checkX += i;
            }

            // Check if out of bounds
            if (checkX >= 10 || checkY >= 10) {
                throw new Error('Ship cannot be placed here! Out of bounds.');
            }

            // Check if cell is already occupied
            if (this.board[checkX][checkY] !== null) {
                throw new Error('Ship cannot be placed here! Overlapping ships.');
            }
        }

        // Place the ship on the board
        for (let i = 0; i < ship.length; i++) {
            let placeX = x;
            let placeY = y;

            if (orientation === 'horizontal') {
                placeY += i;
            } else {
                placeX += i;
            }

            this.board[placeX][placeY] = ship; // Place ship in the board
        }

        this.ships.push(ship); // Add ship to the ships array
    }

    receiveAttack(coordinates) {
        const [x, y] = coordinates;

        // Check if this position has already been attacked (check both missedAttacks and hitAttacks)
        const alreadyAttacked = [...this.missedAttacks, ...this.hitAttacks] // MODIFIED: Check both arrays
            .some(coords => coords[0] === x && coords[1] === y);

        if (alreadyAttacked) {
            return 'already attacked';
        }

        if (this.board[x][y] !== null) {
            // Hit the ship
            this.board[x][y].hit();

            // Record the hit position - in the CORRECT array!
            this.hitAttacks.push(coordinates); // MODIFIED: Push to hitAttacks array

            // Check if the ship is sunk
            if (this.board[x][y].isSunk()) {
                return 'sunk';
            }

            return 'hit';
        } else {
            // Record the missed attack
            this.missedAttacks.push(coordinates);
            return 'miss';
        }
    }

    allShipsSunk() {
        return this.ships.every(ship => ship.isSunk()); // Check if all ships are sunk
    }
}

export default Gameboard;