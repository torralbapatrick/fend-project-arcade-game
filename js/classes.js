// Main class
class Entity {
	constructor() {
		this.sprite = 'images/';
		this.resetPosition();
	}

	// Set the initial position at the middle of the canvas
	resetPosition() {
		this.x = 2; 
		this.y = 5;
	}

	render() {
		ctx.drawImage(Resources.get(this.sprite), this.x * 101, this.y * 83);
	}

	update(dt) {
		this.isOutOfBoundsX = this.x > 5;
		this.isOutOfBoundsY = this.y < 1;
	}

	randomInt(max, min) {
		this.randomInt = Math.floor(Math.random() * max) + min;
		return this.randomInt;
	}
}

// Player class
class Player extends Entity {
	constructor() {
		super();
		this.allCharacters = ['char-boy.png', 'char-cat-girl.png', 'char-horn-girl.png', 'char-pink-girl.png', 'char-princess-girl.png'];
		this.charCounter = 0;
		this.sprite += this.allCharacters[this.charCounter];
		this.score = 0;
		this.lives = 3;
		this.setTimer();
	}

	update(dt) {
		super.update();

		// Check if the player reaches the water
		if (this.isOutOfBoundsY) {
			super.resetPosition(); // Reset player position
			this.setTimer(); // Reset timer
			this.addPoints(100); // Add 100 points when the player wins or reaches the water

			// Change the character when the player wins
			this.charCounter += 1;
			if (this.charCounter >= this.allCharacters.length) {
				this.charCounter = 0;
			}
			this.sprite = 'images/' + this.allCharacters[this.charCounter];
		}
	}

	// Player controls
	handleInput(input) {
		switch (input) {
			case 'left':
				this.x = this.x > 0 ? this.x - 1 : this.x;
				break;
			case 'up':
				this.y = this.y > 0 ? this.y - 1 : this.y;
				break;
			case 'right':
				this.x = this.x < 4 ? this.x + 1 : this.x;
				break;
			case 'down':
				this.y = this.y < 5 ? this.y + 1 : this.y;
				break;
			default:
				break;
		}
	}

	checkCollisions(entity) {
		if (entity === enemy) {
			if (this.y === enemy.y) { // Check if the player and the enemy is in the same Y axis
				if (this.x >= enemy.x - 0.5 && this.x <= enemy.x + 0.5) { // Check if the player collides with an enemy
					super.resetPosition();
					this.setTimer();
					this.decreaseLives();

					return true;
				}
			} else {
				return false;
			}
		} else {
			if (this.y === item.y) { // Check if the player and the item is in the same Y axis
				if (this.x >= item.x - 0.5 && this.x <= item.x + 0.5) { // Check if the player collides with an item
					item.resetPosition();
					this.addPoints(20);

					return true;
				}
			} else {
				return false;
			}
		}
	}

	addPoints(points) {
		this.score += points;
		scoreElement.innerText = this.score;
	}

	decreaseLives() {
		this.lives -= 1;
		livesElement.innerText = this.lives;

		// Check if the game is over
		if (this.lives === 0) {
			this.resetValues();
		}			
	}

	resetValues() {
		super.resetPosition();
		item.resetPosition();

		this.charCounter = 0;
		this.sprite = 'images/' + this.allCharacters[this.charCounter];
		this.score = 0;
		this.lives = 3;
		this.setTimer();

		scoreElement.innerText = this.score;
		livesElement.innerText = this.lives;
		window.alert('Game over!');
	}

	setTimer() {
		clearInterval(this.clock);
		this.seconds = 10;
		document.querySelector('.timer').innerText = this.seconds;

		this.clock = window.setInterval(() => {
			this.seconds -= 1;

			if (this.seconds <= 0) {
				this.decreaseLives();
				this.seconds = 10;
			}

			timerElement.innerText = this.seconds;
		}, 1000);
	}
}

// Enemy class
class Enemy extends Entity {
	constructor(x, y) {
		super();
		this.sprite += 'enemy-bug.png';
		this.x = x;
		this.y = y;
		this.randomInt = super.randomInt(4, 1); // Returns a random integer from 1 - 4
	}

	update(dt) {
		super.update();

		if (this.isOutOfBoundsX) {
			this.x = -1;
			this.randomInt = super.randomInt(4, 1);
		} else {
			this.x += dt * this.randomInt; // Sets the enemy's speed to random
		}
	}
}

// Item class
class Item extends Entity {
	constructor() {
		super();
		this.sprite += 'gem-blue.png';
		this.resetPosition();
	}

	// Hide the item at the beginning of the game
	resetPosition() {
		super.resetPosition();
		this.x = -1;
		this.y = -1;
		this.seconds = 1;
	}

	update(dt) {
		super.update();
		this.seconds += dt;

		// Spawn an item in random location every 6 seconds
		if (Math.floor(this.seconds) % 6 === 0) {
			this.x = super.randomInt(5, 0);
			this.y = super.randomInt(3, 1);
			this.seconds = 1;
		}
	}
}