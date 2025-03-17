import Gameboard from './gameBoard.js';

class Player {
    constructor(name) {
        this.name = name; // Set the player's name
        this.gameboard = new Gameboard(); // Create a new gameboard for the player
    }

    attack(opponent, coordinates) {
        return opponent.gameboard.receiveAttack(coordinates); // Attack the opponent's gameboard
    }

    placeShip(ship, coordinates) {
        this.gameboard.placeShip(ship, coordinates); // Place a ship on the player's gameboard
    }
}

// Export the Player class for use in other modules
export default Player
