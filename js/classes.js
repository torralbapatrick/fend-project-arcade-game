/**
 * @fileOverview Classes for handling the game logic
 * @author {Patrick Torralba} torralbapatrick15@gmail.com
 */

// Main class
class Entity {
	/**
	 * @description Sets the initial position and image directory
	 * @return {void}
	 */
	constructor() {
		this.sprite = 'images/';
		this.resetPosition();
	}

	/**
	 * @description Set the initial position at the middle of the canvas
	 * @return {void}
	 */
	resetPosition() {
		this.x = 2; 
		this.y = 5;
	}

	/**
	 * @description This function initially draws the image (see engine.js)
	 * @return {void}
	 */
	render() {
		ctx.drawImage(Resources.get(this.sprite), this.x * 101, this.y * 75);
	}

	/**
	 * @description For smooth animation (see engine.js)
	 * @param  {delta time} dt - Constant value for everyone (regardless of how fast their computer is)
	 * @return {void}
	 */
	update(dt) {
		this.isOutOfBoundsX = this.x > 5;
		this.isOutOfBoundsY = this.y < 1;
	}

	/**
	 * @description Returns a random integer
	 * @param  {number} max - The highest possible number
	 * @param  {number} min - The lowest possible number
	 * @return {number}
	 */
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
		this.moveLeft = false, this.moveRight = false, this.moveUp = false, this.moveDown = false;
		this.hasOrangeGem = false;
		this.blocksCovered = [];
		this.checkHighscore();
	}

	update(dt) {
		super.update();
		this.checkWinner();
	}

	/**
	 * @description Handles player controls
	 * @param  {number} input - Keyboard event keycode
	 * @return {void}
	 */
	handleInput(input) {
		switch (input) {
			case 'left':
				this.x = this.x > 0 ? this.x - 1 : this.x;
				this.moveLeft = true;
				this.moveRight = false;
				this.moveUp = false;
				this.moveDown = false;
				break;
			case 'up':
				this.y = this.y > 0 ? this.y - 1 : this.y;
				this.moveLeft = false;
				this.moveRight = false;
				this.moveUp = true;
				this.moveDown = false;
				this.checkCoveredBlocks();
				break;
			case 'right':
				this.x = this.x < 4 ? this.x + 1 : this.x;
				this.moveLeft = false;
				this.moveRight = true;
				this.moveUp = false;
				this.moveDown = false;
				break;
			case 'down':
				this.y = this.y < 5 ? this.y + 1 : this.y;
				this.moveLeft = false;
				this.moveRight = false;
				this.moveUp = false;
				this.moveDown = true;
				break;
			default:
				break;
		}
	}

	/**
	 * @description Checks if the player reaches the water
	 * @return {void}
	 */
	checkWinner() {
		if (this.isOutOfBoundsY) {
			// Add 50 points per each unused 1/2 of time
			if (this.seconds > 5) {
				this.addPoints(50);
			}

			super.resetPosition(); // Reset player position
			this.setTimer(); // Reset timer
			this.addPoints(90); // Add 100 points when the player wins or reaches the water
			this.blocksCovered = []; // Reset blocks covered

			// Change the character everytime the player wins
			this.charCounter += 1;
			if (this.charCounter >= this.allCharacters.length) {
				this.charCounter = 0;
			}
			this.sprite = 'images/' + this.allCharacters[this.charCounter];
		}
	}

	/**
	 * @description Checks if the player collides with an enemy or an item
	 * @param  {object} entity
	 * @return {boolean}
	 */
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
					// Check item
					if (item.sprite.includes('rock')) {
						// Rock obstacle
						if (this.moveLeft) {
							this.x += 1;
						} else if (this.moveRight) {
							this.x -= 1;
						} else if (this.moveUp) {
							this.y += 1;
						} else if (this.moveDown) {
							this.y -= 1;
						}
					} else {
						if (item.sprite.includes('blue')) {
							// Freeze the enemy for 3 seconds
							enemy.setSpeed(0, 3000);
						} else if (item.sprite.includes('green')) {
							// Slows the enemy for 3 seconds
							enemy.setSpeed(0.5, 3000);
						} else if (item.sprite.includes('orange')) {
							// Multiply points for 3 seconds
							this.multiplyPoints();
						} else if (item.sprite.includes('star')) {
							// Add 500 bonus points
							this.addPoints(500);
						} else if (item.sprite.includes('heart')) {
							// Adds 1 life
							if (this.lives < 3) {
								this.lives += 1;
								livesElement.innerHTML += `<li><i class="fas fa-heart"></i></li> `;
							}
						}

						item.resetPosition();
					}
					
					return true;
				}
			} else {
				return false;
			}
		}
	}

	/**
	 * @description Add points
	 * @param {number} points
	 */
	addPoints(points) {
		this.hasOrangeGem ? this.score += points * 2 : this.score += points;
		scoreElement.innerText = `Score: ${this.score}`;
	}

	/**
	 * @description Checks the Y axis. If it's not been covered or stepped on, add 10 points
	 * @return {void}
	 */
	checkCoveredBlocks() {
		this.covered = false;

		for (this.block of this.blocksCovered) {
			if (this.y === this.block) {
				this.covered = true;
			}
		}

		if (!this.covered) {
			this.addPoints(10);
		}
		this.blocksCovered.push(this.y);
	}

	/**
	 * @description Multiply points by 2 for 3 seconds
	 * @return {void}
	 */
	multiplyPoints() {
		this.hasOrangeGem = true;

		window.setTimeout(() => {
			this.hasOrangeGem = false;
			console.log(this.hasOrangeGem);
		}, 3000);
	}

	/**
	 * @description Decrease player lives by 1
	 * @return {void}
	 */
	decreaseLives() {
		this.lives -= 1;
		livesElement.removeChild(livesElement.children[0]);

		// Check if the game is over
		if (this.lives === 0) {
			this.stopTimer();
			this.checkHighscore();

			finalScoreElement.innerText = this.score;
			gameOverElement.style.display = 'block';
			canvasElement.style.display = 'none';
			statsElement.style.display = 'none';
		}

		// Reset blocks covered
		this.blocksCovered = [];
	}

	/**
	 * @description Checks the highscore
	 * @return {void}
	 */
	checkHighscore() {
		this.highscore = window.localStorage.getItem('highscore');

		if (this.highscore !== null) {
			if (this.score > this.highscore) {
				this.highscore = this.score;
				window.localStorage.setItem('highscore', this.score);
				document.querySelector('.new-highscore').style.display = 'block';
			} else {
				document.querySelector('.new-highscore').style.display = 'none';
			}
		} else {
			window.localStorage.setItem('highscore', this.score);
		}

		document.querySelector('.highscore').innerText = `Highscore: ${this.highscore}`;
	}

	/**
	 * @description Resets player values
	 * @return {void}
	 */
	resetValues() {
		super.resetPosition();
		item.resetPosition();
		allEnemies = [...Array(3)].map((_, i) => new Enemy(-1, i+1));

		this.charCounter = 0;
		this.sprite = 'images/' + this.allCharacters[this.charCounter];
		this.score = 0;
		this.lives = 3;
		this.setTimer();

		scoreElement.innerText = `Score: ${this.score}`;
		for (let i = 0; i < this.lives; i++) {
			livesElement.innerHTML += `<li><i class="fas fa-heart"></i></li> `;
		}
	}

	/**
	 * @description Sets the timer for 10 seconds
	 */
	setTimer() {
		clearInterval(this.timer);
		this.seconds = 10;
		document.querySelector('.timer').innerText = this.seconds;

		this.timer = window.setInterval(() => {
			this.seconds -= 1;

			if (this.seconds <= 0) {
				super.resetPosition();
				this.decreaseLives();
				this.seconds = 10;
			}

			timerElement.innerText = this.seconds;
		}, 1000);
	}

	/**
	 * @description Stops the timer
	 * @return {void}
	 */
	stopTimer() {
		clearInterval(this.timer);
	}
}

// Enemy class
class Enemy extends Entity {
	constructor(x, y) {
		super();
		this.sprite += 'enemy-bug.png';
		this.x = x;
		this.y = y;
		this.speed = super.randomInt(4, 1); // Returns a random integer from 1 - 4
	}

	update(dt) {
		super.update();

		// Check if the enemy is out of bounds
		if (this.isOutOfBoundsX) {
			this.x = -1;
			this.speed = super.randomInt(4, 1);
		} else {
			// Sets the enemy's speed to random
			this.x += dt * this.speed;
		}
	}

	/**
	 * @description Sets the enemy's speed
	 * @param {number} speed - The speed of the enemy
	 * @param {number} time - The desired time
	 */
	setSpeed(speed, time) {
		this.enemySpeed = [];
        this.speedCounter = 0;

        for(enemy of allEnemies) {
            this.enemySpeed.push(enemy.speed);
            enemy.speed = speed;
        }

        setTimeout(() => {
            for(enemy of allEnemies) {
                enemy.speed = this.enemySpeed[this.speedCounter];
                this.speedCounter += 1;
            }
        }, time);
	}
}

// Item class
class Item extends Entity {
	constructor() {
		super();
		this.allItems = ['gem-blue.png', 'gem-green.png', 'gem-orange.png', 'Star.png', 'Heart.png', 'Rock.png'];
		this.itemCounter = 0;
		this.sprite += this.allItems[this.itemCounter];
		this.resetPosition();
	}

	update(dt) {
		super.update();
		this.spawnItem(dt, 7);
	}

	/**
	 * @description Hides the item at the beginning of the game
	 * @return {void}
	 */
	resetPosition() {
		super.resetPosition();
		this.x = -1;
		this.y = -1;
		this.seconds = 1;
	}

	/**
	 * @description Spawns a random item in random location for a desired time
	 * @param  {number} dt - Delta time
	 * @param  {number} spawnTime - The desired spawn time
	 * @return {void}
	 */
	spawnItem(dt, spawnTime) {
		this.seconds += dt;

		if (Math.floor(this.seconds) % spawnTime === 0) {
			this.itemCounter = super.randomInt(6, 0);
			this.sprite = 'images/' + this.allItems[this.itemCounter];
			this.x = super.randomInt(5, 0);
			this.y = super.randomInt(3, 1);
			this.seconds = 1;
		}
	}
}
