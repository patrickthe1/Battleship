// Import our game classes
import Ship from './ship.js';
import Gameboard from './gameBoard.js';
import Player from './player.js';
import Game from './game.js';

// DOM elements
const playerBoardElement = document.getElementById('player-board');
const computerBoardElement = document.getElementById('computer-board');
const gameStatusElement = document.getElementById('game-status');
const startGameButton = document.getElementById('start-game');
const resetGameButton = document.getElementById('reset-game');
const rotateShipButton = document.getElementById('rotate-ship');
const randomPlacementButton = document.getElementById('random-placement');
const shipsContainer = document.getElementById('ships-container');
const playerShipsList = document.getElementById('player-ships');
const computerShipsList = document.getElementById('computer-ships');
const hitStatusElement = document.getElementById('hit-status');

// Game state variables
let game;
let currentShipIndex = 0;
let isHorizontal = true;
let shipsToPlace = [
    { name: 'Carrier', length: 5 },
    { name: 'Battleship', length: 4 },
    { name: 'Cruiser', length: 3 },
    { name: 'Submarine', length: 3 },
    { name: 'Destroyer', length: 2 }
];
let placedShips = [];
let gameActive = false;
let isPlayerTurn = true;
let computerShips = [];
let playerTurnLock = false;

// Initialize the game
function initGame() {
    game = new Game('Player', 'Computer');
    
    // Clear the boards
    playerBoardElement.innerHTML = '';
    computerBoardElement.innerHTML = '';
    
    // Create the boards
    createBoard(playerBoardElement, true);
    createBoard(computerBoardElement, false);
    
    // Setup initial game state
    startGameButton.disabled = true;
    resetGameButton.disabled = false;
    gameStatusElement.textContent = `Place your ${shipsToPlace[0].name} (${shipsToPlace[0].length} cells)`;
    
    // Clear ships lists
    playerShipsList.innerHTML = '';
    computerShipsList.innerHTML = '';
    
    // Reset placement state
    currentShipIndex = 0;
    isHorizontal = true;
    placedShips = [];
    gameActive = false;
    isPlayerTurn = true;
    computerShips = [];
    playerTurnLock = false;
    
    // Create ships for placement
    createShipsForPlacement();
    
    // Reset placement controls visibility
    shipsContainer.style.display = 'flex';
    rotateShipButton.style.display = 'block';
    randomPlacementButton.style.display = 'block';
    hitStatusElement.textContent = '';
    
    // Reset board highlights
    updateBoardHighlights();
}

// Create a 10x10 board
function createBoard(boardElement, isPlayerBoard) {
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = i;
            cell.dataset.col = j;
            
            // Add event listeners based on the board type
            if (isPlayerBoard) {
                cell.addEventListener('mouseover', handleShipPlacementHover);
                cell.addEventListener('mouseout', handleShipPlacementOut);
                cell.addEventListener('click', handleShipPlacement);
            } else {
                cell.addEventListener('click', handleAttack);
            }
            
            boardElement.appendChild(cell);
        }
    }
}

// Create ship elements for placement
function createShipsForPlacement() {
    shipsContainer.innerHTML = '';
    
    shipsToPlace.forEach((ship, index) => {
        const shipElement = document.createElement('div');
        shipElement.classList.add('ship-for-placement');
        if (index === currentShipIndex) {
            shipElement.classList.add('selected');
        }
        
        for (let i = 0; i < ship.length; i++) {
            const segment = document.createElement('div');
            segment.classList.add('ship-segment');
            shipElement.appendChild(segment);
        }
        
        shipElement.addEventListener('click', () => {
            // Select this ship for placement
            document.querySelectorAll('.ship-for-placement').forEach(el => {
                el.classList.remove('selected');
            });
            shipElement.classList.add('selected');
            currentShipIndex = index;
            gameStatusElement.textContent = `Place your ${shipsToPlace[index].name} (${shipsToPlace[index].length} cells)`;
        });
        
        shipsContainer.appendChild(shipElement);
    });
}

// Helper function to check if ship placement is valid
function isValidPlacement(row, col, length, isHorizontal) {
    // Check if ship is within bounds
    if (isHorizontal && col + length > 10) return false;
    if (!isHorizontal && row + length > 10) return false;
    
    // Check if ship overlaps with other ships
    for (let i = 0; i < length; i++) {
        let checkRow = row;
        let checkCol = col;
        
        if (isHorizontal) {
            checkCol += i;
        } else {
            checkRow += i;
        }
        
        const cell = playerBoardElement.querySelector(`[data-row="${checkRow}"][data-col="${checkCol}"]`);
        if (cell.classList.contains('ship-cell')) {
            return false; // Overlaps with another ship
        }
    }
    
    return true;
}

// Handle ship placement hover
function handleShipPlacementHover(event) {
    // Skip if all ships are placed or game has started
    if (currentShipIndex >= shipsToPlace.length || gameActive) return;
    
    const row = parseInt(event.target.dataset.row);
    const col = parseInt(event.target.dataset.col);
    const shipLength = shipsToPlace[currentShipIndex].length;
    
    const isValid = isValidPlacement(row, col, shipLength, isHorizontal);
    
    // Highlight cells for ship placement
    for (let i = 0; i < shipLength; i++) {
        let highlightRow = row;
        let highlightCol = col;
        
        if (isHorizontal) {
            highlightCol += i;
        } else {
            highlightRow += i;
        }
        
        // Skip cells outside the board
        if (highlightRow >= 10 || highlightCol >= 10) continue;
        
        const cell = playerBoardElement.querySelector(`[data-row="${highlightRow}"][data-col="${highlightCol}"]`);
        if (cell) {
            cell.classList.add(isValid ? 'valid-placement' : 'invalid-placement');
        }
    }
}

// Handle ship placement mouse out
function handleShipPlacementOut(event) {
    // Remove all placement highlights
    document.querySelectorAll('.valid-placement, .invalid-placement').forEach(cell => {
        cell.classList.remove('valid-placement', 'invalid-placement');
    });
}

// Handle ship placement click
function handleShipPlacement(event) {
    // Skip if all ships are placed or game has started
    if (currentShipIndex >= shipsToPlace.length || gameActive) return;
    
    const row = parseInt(event.target.dataset.row);
    const col = parseInt(event.target.dataset.col);
    const shipLength = shipsToPlace[currentShipIndex].length;
    
    if (!isValidPlacement(row, col, shipLength, isHorizontal)) {
        gameStatusElement.textContent = 'Invalid placement. Try again.';
        return;
    }
    
    // Create a ship and place it on the player's board
    const ship = new Ship(shipLength);
    try {
        game.placeShip(ship, [row, col], game.player1, isHorizontal ? 'horizontal' : 'vertical');
        
        // Update the UI to show the placed ship
        for (let i = 0; i < shipLength; i++) {
            let placeRow = row;
            let placeCol = col;
            
            if (isHorizontal) {
                placeCol += i;
            } else {
                placeRow += i;
            }
            
            const cell = playerBoardElement.querySelector(`[data-row="${placeRow}"][data-col="${placeCol}"]`);
            cell.classList.add('ship-cell');
        }
        
        // Add ship to placed ships and update UI
        placedShips.push({ 
            ship: ship, 
            name: shipsToPlace[currentShipIndex].name 
        });
        
        // Remove the placed ship from the ships container
        const shipElements = document.querySelectorAll('.ship-for-placement');
        shipElements[currentShipIndex].style.display = 'none';
        
        // Move to the next ship
        currentShipIndex++;
        
        // If there are more ships to place, select the next one
        if (currentShipIndex < shipsToPlace.length) {
            shipElements.forEach(el => el.classList.remove('selected'));
            if (shipElements[currentShipIndex]) {
                shipElements[currentShipIndex].classList.add('selected');
            }
            gameStatusElement.textContent = `Place your ${shipsToPlace[currentShipIndex].name} (${shipsToPlace[currentShipIndex].length} cells)`;
        } else {
            // All ships placed
            gameStatusElement.textContent = 'All ships placed! Click Start Game to begin.';
            startGameButton.disabled = false;
            
            // Place computer ships randomly
            placeComputerShipsRandomly();
        }
    } catch (error) {
        console.error(error);
        gameStatusElement.textContent = 'Error placing ship. Try again.';
    }
}

// Handle attack on computer board
function handleAttack(event) {
    // Only allow attacks if game is active and it's the player's turn
    if (!gameActive || !isPlayerTurn || playerTurnLock) {
        if (!isPlayerTurn) {
            hitStatusElement.textContent = "Wait for the computer's move to complete!";
        }
        return;
    }
    
    const row = parseInt(event.target.dataset.row);
    const col = parseInt(event.target.dataset.col);
    
    // Skip if cell already attacked
    if (event.target.classList.contains('hit') || event.target.classList.contains('miss')) {
        hitStatusElement.textContent = 'You already attacked this position!';
        return;
    }
    
    // Lock player actions during attack processing
    playerTurnLock = true;
    
    // Player attacks
    const result = game.attack([row, col]);
    
    // Update UI based on result
    if (result === 'hit') {
        event.target.classList.add('hit');
        hitStatusElement.textContent = 'Hit!';
    } else if (result === 'miss') {
        event.target.classList.add('miss');
        hitStatusElement.textContent = 'Miss!';
    } else if (result === 'sunk') {
        event.target.classList.add('hit');
        hitStatusElement.textContent = 'You sunk an enemy ship!';
    } else if (result.includes('wins')) {
        event.target.classList.add('hit');
        hitStatusElement.textContent = 'You hit the last ship!';
        gameStatusElement.textContent = result;
        endGame();
        return;
    }
    
    // Update ship status displays
    updateShipStatusLists();
    
    // Switch to computer's turn
    isPlayerTurn = false;
    updateBoardHighlights();
    gameStatusElement.textContent = "Computer's turn...";
    
    // Computer's turn - simulate a delay
    setTimeout(() => {
        computerAttack();
    }, 1000);
}

// Computer AI attack
function computerAttack() {
    // Skip if game is not active
    if (!gameActive) return;
    
    let row, col;
    let validAttack = false;
    
    // Simple AI: Choose a random cell that hasn't been attacked yet
    while (!validAttack) {
        row = Math.floor(Math.random() * 10);
        col = Math.floor(Math.random() * 10);
        
        // Check if the cell has already been attacked
        const cell = playerBoardElement.querySelector(`[data-row="${row}"][data-col="${col}"]`);
        if (!cell.classList.contains('hit') && !cell.classList.contains('miss')) {
            validAttack = true;
        }
    }
    
    // Computer attacks player
    const result = game.attack([row, col]);
    
    // Get the cell that was attacked
    const cell = playerBoardElement.querySelector(`[data-row="${row}"][data-col="${col}"]`);
    
    // Update UI based on result
    if (result === 'hit') {
        cell.classList.add('hit');
        gameStatusElement.textContent = 'Computer hit your ship! Your turn.';
    } else if (result === 'miss') {
        cell.classList.add('miss');
        gameStatusElement.textContent = 'Computer missed! Your turn.';
    } else if (result === 'sunk') {
        cell.classList.add('hit');
        gameStatusElement.textContent = 'Computer sunk one of your ships! Your turn.';
    } else if (result.includes('wins')) {
        cell.classList.add('hit');
        gameStatusElement.textContent = result;
        endGame();
        return;
    }
    
    // Update ship status displays
    updateShipStatusLists();
    
    // Switch back to player's turn
    isPlayerTurn = true;
    updateBoardHighlights();
    playerTurnLock = false;
}

// Update board highlights based on whose turn it is
function updateBoardHighlights() {
    // Remove existing active-board class
    playerBoardElement.classList.remove('active-board');
    computerBoardElement.classList.remove('active-board');
    
    if (gameActive) {
        // Add active-board class to the current player's target board
        if (isPlayerTurn) {
            computerBoardElement.classList.add('active-board');
        } else {
            playerBoardElement.classList.add('active-board');
        }
    }
}

// End the game
function endGame() {
    gameActive = false;
    playerTurnLock = false;
    startGameButton.disabled = true;
    hitStatusElement.textContent = 'Game over! Click Reset Game to play again.';
    
    // Remove board highlights
    playerBoardElement.classList.remove('active-board');
    computerBoardElement.classList.remove('active-board');
    
    // Final update of ship status
    updateShipStatusLists();
}

// Place computer ships randomly
function placeComputerShipsRandomly() {
    // Clear previous computer ships
    computerShips = [];
    game.player2.gameboard.board = game.player2.gameboard.createBoard();
    game.player2.gameboard.ships = [];
    
    // Place each ship type
    for (const shipInfo of shipsToPlace) {
        let placed = false;
        let attempts = 0;
        const maxAttempts = 100;
        
        while (!placed && attempts < maxAttempts) {
            attempts++;
            
            // Create a new ship
            const ship = new Ship(shipInfo.length);
            
            // Generate random position and orientation
            const row = Math.floor(Math.random() * 10);
            const col = Math.floor(Math.random() * 10);
            const orientation = Math.random() > 0.5 ? 'horizontal' : 'vertical';
            
            // Check if the placement is valid
            let isValid = true;
            
            // Check if ship is within bounds
            if ((orientation === 'horizontal' && col + shipInfo.length > 10) || 
                (orientation === 'vertical' && row + shipInfo.length > 10)) {
                isValid = false;
                continue;
            }
            
            // Check for overlaps with existing ships
            for (let i = 0; i < shipInfo.length; i++) {
                let checkRow = row;
                let checkCol = col;
                
                if (orientation === 'horizontal') {
                    checkCol += i;
                } else {
                    checkRow += i;
                }
                
                if (game.player2.gameboard.board[checkRow][checkCol] !== null) {
                    isValid = false;
                    break;
                }
            }
            
            // If valid, place the ship
            if (isValid) {
                try {
                    game.placeShip(ship, [row, col], game.player2, orientation);
                    computerShips.push({
                        ship: ship,
                        name: shipInfo.name
                    });
                    placed = true;
                } catch (error) {
                    console.error("Error placing computer ship:", error);
                }
            }
        }
        
        if (!placed) {
            console.error(`Failed to place computer ship: ${shipInfo.name}`);
        }
    }
    
    // Verify all ships were placed
    console.log(`Placed ${computerShips.length} computer ships:`, computerShips);
    if (computerShips.length !== shipsToPlace.length) {
        console.warn(`Warning: Not all computer ships were placed. Expected ${shipsToPlace.length}, got ${computerShips.length}`);
    }
}

// Random placement button handler
randomPlacementButton.addEventListener('click', () => {
    // Skip if game has started
    if (gameActive) return;
    
    // Reset the board
    playerBoardElement.querySelectorAll('.cell').forEach(cell => {
        cell.classList.remove('ship-cell');
    });
    
    // Clear current ships
    game.player1.gameboard.board = game.player1.gameboard.createBoard();
    game.player1.gameboard.ships = [];
    
    // Reset placement state
    placedShips = [];
    currentShipIndex = 0;
    
    // Show all ships in the container
    document.querySelectorAll('.ship-for-placement').forEach((ship, index) => {
        ship.style.display = '';
        ship.classList.remove('selected');
        if (index === 0) {
            ship.classList.add('selected');
        }
    });
    
    // Randomly place ships
    let allPlaced = true;
    
    shipsToPlace.forEach((shipInfo, index) => {
        const ship = new Ship(shipInfo.length);
        let placed = false;
        
        for (let attempts = 0; attempts < 100 && !placed; attempts++) {
            // Generate random position and orientation
            const row = Math.floor(Math.random() * 10);
            const col = Math.floor(Math.random() * 10);
            const orientation = Math.random() > 0.5 ? 'horizontal' : 'vertical';
            
            // Check if the placement is valid using our validation function
            if ((orientation === 'horizontal' && col + shipInfo.length > 10) || 
                (orientation === 'vertical' && row + shipInfo.length > 10)) {
                continue;
            }
            
            // Check for overlaps with existing ships
            let valid = true;
            for (let i = 0; i < shipInfo.length; i++) {
                let checkRow = row;
                let checkCol = col;
                
                if (orientation === 'horizontal') {
                    checkCol += i;
                } else {
                    checkRow += i;
                }
                
                const cell = playerBoardElement.querySelector(`[data-row="${checkRow}"][data-col="${checkCol}"]`);
                if (cell.classList.contains('ship-cell')) {
                    valid = false;
                    break;
                }
            }
            
            if (!valid) continue;
            
            try {
                game.placeShip(ship, [row, col], game.player1, orientation);
                
                // Update UI to show the placed ship
                for (let i = 0; i < shipInfo.length; i++) {
                    let placeRow = row;
                    let placeCol = col;
                    
                    if (orientation === 'horizontal') {
                        placeCol += i;
                    } else {
                        placeRow += i;
                    }
                    
                    const cell = playerBoardElement.querySelector(`[data-row="${placeRow}"][data-col="${placeCol}"]`);
                    cell.classList.add('ship-cell');
                }
                
                placedShips.push({ ship: ship, name: shipInfo.name });
                
                // Hide the placed ship in the container
                const shipElements = document.querySelectorAll('.ship-for-placement');
                shipElements[index].style.display = 'none';
                
                placed = true;
            } catch (error) {
                // If placement fails, the loop will try again
                console.log('Failed to place ship randomly, trying again');
            }
        }
        
        if (!placed) {
            allPlaced = false;
        }
    });
    
    if (allPlaced) {
        currentShipIndex = shipsToPlace.length;
        gameStatusElement.textContent = 'All ships placed randomly! Click Start Game to begin.';
        startGameButton.disabled = false;
        
        // Place computer ships randomly
        placeComputerShipsRandomly();
    } else {
        gameStatusElement.textContent = 'Could not place all ships randomly. Please try again or place manually.';
    }
});

// Rotate ship button handler
rotateShipButton.addEventListener('click', () => {
    isHorizontal = !isHorizontal;
    document.querySelectorAll('.ship-for-placement').forEach(ship => {
        ship.classList.toggle('vertical');
    });
});

// Start game button handler
startGameButton.addEventListener('click', () => {
    // Validate all ships are placed
    if (currentShipIndex < shipsToPlace.length) {
        gameStatusElement.textContent = 'Place all your ships before starting the game!';
        return;
    }
    
    // Start the game
    gameActive = true;
    isPlayerTurn = true;
    playerTurnLock = false;
    startGameButton.disabled = true;
    
    // Hide placement controls
    shipsContainer.style.display = 'none';
    rotateShipButton.style.display = 'none';
    randomPlacementButton.style.display = 'none';
    
    // Update game status
    gameStatusElement.textContent = 'Game started! Your turn - attack the enemy fleet.';
    hitStatusElement.textContent = 'Click on the enemy board to attack';
    
    // Update ship status lists
    updateShipStatusLists();
    
    // Update board highlights
    updateBoardHighlights();
});

// Reset game button handler
resetGameButton.addEventListener('click', () => {
    initGame();
});

// Update ship status lists
function updateShipStatusLists() {
    // Clear lists
    playerShipsList.innerHTML = '';
    computerShipsList.innerHTML = '';
    
    // Update player ships
    placedShips.forEach(shipInfo => {
        const listItem = document.createElement('li');
        const statusDiv = document.createElement('div');
        statusDiv.classList.add('ship-status');
        
        const label = document.createElement('span');
        label.classList.add('ship-status-label');
        label.textContent = shipInfo.name;
        
        const indicator = document.createElement('span');
        indicator.classList.add('ship-status-indicator');
        indicator.classList.add(shipInfo.ship.isSunk() ? 'sunk' : 'active');
        
        statusDiv.appendChild(label);
        statusDiv.appendChild(indicator);
        listItem.appendChild(statusDiv);
        playerShipsList.appendChild(listItem);
    });
    
    // Update computer ships
    computerShips.forEach(shipInfo => {
        const listItem = document.createElement('li');
        const statusDiv = document.createElement('div');
        statusDiv.classList.add('ship-status');
        
        const label = document.createElement('span');
        label.classList.add('ship-status-label');
        label.textContent = shipInfo.name;
        
        const indicator = document.createElement('span');
        indicator.classList.add('ship-status-indicator');
        indicator.classList.add(shipInfo.ship.isSunk() ? 'sunk' : 'active');
        
        statusDiv.appendChild(label);
        statusDiv.appendChild(indicator);
        listItem.appendChild(statusDiv);
        computerShipsList.appendChild(listItem);
    });
}

// Initialize the game on page load
document.addEventListener('DOMContentLoaded', initGame); 