import Player from './player.js';

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
        // Attack the opponent's board
        const result = this.currentPlayer.attack(this.opponent, coordinates);
        
        // Check for win condition only if the result indicates a ship was hit and potentially sunk
        if (result === 'hit' || result === 'sunk') {
            if (this.opponent.gameboard.allShipsSunk()) {
                return `${this.currentPlayer.name} wins!`;
            }
        }
        
        // Only switch turns after checking win condition and if the attack wasn't already attacked
        if (result !== 'already attacked') {
            this.switchTurn();
        }
        
        return result;
    }

    // This method accepts a player parameter to specify which player's board to place the ship on
    placeShip(ship, coordinates, player = null) {
        // If player is specified, place ship on that player's board
        if (player) {
            player.placeShip(ship, coordinates);
        } else {
            // Otherwise use currentPlayer
            this.currentPlayer.placeShip(ship, coordinates);
        }
    }
}

// Export the Game class for use in other modules
export default Game; 