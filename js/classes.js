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
		this.moveLeft = false, this.moveRight = false, this.moveUp = false, this.moveDown = false;
		this.checkHighscore();
		this.hasOrangeGem = false;
		this.blocksCovered = [];
	}

	update(dt) {
		super.update();

		// Check if the player reaches the water
		if (this.isOutOfBoundsY) {
			// Add 50 points per each unused 1/2 of time
			if (this.seconds > 5) {
				this.addPoints(50);
			}

			super.resetPosition(); // Reset player position
			this.setTimer(); // Reset timer
			this.addPoints(90); // Add 100 points when the player wins or reaches the water
			this.blocksCovered = [];

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
							this.addPoints(500);
						} else if (item.sprite.includes('heart')) {
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

	addPoints(points) {
		this.hasOrangeGem ? this.score += points * 2 : this.score += points;

		scoreElement.innerText = `Score: ${this.score}`;
	}

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

	multiplyPoints() {
		this.hasOrangeGem = true;

		window.setTimeout(() => {
			this.hasOrangeGem = false;
			console.log(this.hasOrangeGem);
		}, 3000);
	}

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

		this.blocksCovered = [];
	}

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

		if (this.isOutOfBoundsX) {
			this.x = -1;
			this.speed = super.randomInt(4, 1);
		} else {
			this.x += dt * this.speed; // Sets the enemy's speed to random
		}
	}

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
		this.allItems = ['gem-blue.png', 'gem-green.png', 'gem-orange.png', 'star.png', 'heart.png', 'rock.png'];
		this.itemCounter = 0;
		this.sprite += this.allItems[this.itemCounter];
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
		this.spawnItem(dt, 7); // Spawn an item every 7 seconds
	}

	spawnItem(dt, spawnTime) {
		this.seconds += dt;

		// Spawn a random item in random location
		if (Math.floor(this.seconds) % spawnTime === 0) {
			this.itemCounter = super.randomInt(6, 0);
			this.sprite = 'images/' + this.allItems[this.itemCounter];
			this.x = super.randomInt(5, 0);
			this.y = super.randomInt(3, 1);
			this.seconds = 1;
		}
	}
}