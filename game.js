import Player from './player';

class Game {
    constructor(player1Name, player2Name) {
        this.player1 = new Player(player1Name);
        this.player2 = new Player(player2Name);
        this.currentPlayer = this.player1; // Start with player 1
        this.opponent = this.player2; // Set opponent to player 2
    }

    switchTurn() {
        // Switch the current player and opponent
        if (this.currentPlayer === this.player1) {
            this.currentPlayer = this.player2;
            this.opponent = this.player1;
        } else {
            this.currentPlayer = this.player1;
            this.opponent = this.player2;
        }
    }

    attack(coordinates) {
        // Store who the attacker is before we potentially switch turns
        const attacker = this.currentPlayer;
        
        const result = this.currentPlayer.attack(this.opponent, coordinates);
        
        // Check for win condition using the attacker's name
        if (this.opponent.gameboard.allShipsSunk()) {
            return `${attacker.name} wins!`;
        }
        
        this.switchTurn();
        return result;
    }

    placeShip(ship, coordinates) {
        // The key issue: we need to specify which player's board to place the ship on
        if (this.currentPlayer === this.player1) {
            this.player1.placeShip(ship, coordinates);
        } else {
            this.player2.placeShip(ship, coordinates);
        }
        
        // Switch turns after placing a ship
        this.switchTurn();
    }
}

// Export the Game class for use in other modules
export default Game; 