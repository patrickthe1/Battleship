class Ship {
    constructor(length) {
        this.length = length;
        this.hits = 0 
        
    }

    hit() {
        this.hits += 1
    }

    isSunk() {
        return this.hits >= this.length; // Check if the ship is sunk
    }
}

export default Ship;