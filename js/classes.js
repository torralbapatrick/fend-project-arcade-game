class Entity {
	constructor() {
		this.sprite = 'images/';
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
}

class Player extends Entity {
	constructor() {
		super();
		this.allCharacters = ['char-boy.png', 'char-cat-girl.png', 'char-horn-girl.png', 'char-pink-girl.png', 'char-princess-girl.png'];
		this.charCounter = 0;
		this.sprite += this.allCharacters[this.charCounter];
		this.score = 0;
		this.lives = 3;
	}

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

	update(dt) {
		super.update();
		if (this.isOutOfBoundsY) {
			this.x = 2;
			this.y = 5;
			this.score += 100;
			document.querySelector('.score').innerText = this.score;

			// Change the character when the player wins
			this.charCounter += 1;
			if (this.charCounter >= this.allCharacters.length) {
				this.charCounter = 0;
			}
			this.sprite = 'images/' + this.allCharacters[this.charCounter];
		}
	}

	checkCollisions(entity) {
		if (entity === enemy) {
			if (this.y === enemy.y) {
				if (this.x >= enemy.x - 0.5 && this.x <= enemy.x + 0.5) {
					this.lives -= 1;
					document.querySelector('.lives').innerText = this.lives;

					// Check if the game is over
					if (this.lives === 0) {
						this.lives = 3;
						this.score = 0;
						this.sprite = 'images/' + this.allCharacters[0];

						document.querySelector('.score').innerText = this.score;
						document.querySelector('.lives').innerText = this.lives;
						window.alert('Game over!');
					}

					return true;
				}
			} else {
				return false;
			}
		} else {
			if (this.y === item.y) {
				if (this.x >= item.x - 0.5 && this.x <= item.x + 0.5) {
					this.score += 20;
					document.querySelector('.score').innerText = this.score;

					return true;
				}
			} else {
				return false;
			}
		}
		
	}
}

class Enemy extends Entity {
	constructor(x, y) {
		super();
		this.sprite += 'enemy-bug.png';
		this.x = x;
		this.y = y;
		this.randomInt = Math.floor(Math.random() * 4) + 1; // Returns a random integer from 1 - 4
	}

	update(dt) {
		super.update();
		if (this.isOutOfBoundsX) {
			this.x = -1;
			this.randomInt = Math.floor(Math.random() * 4) + 1;
		} else {
			this.x += dt * this.randomInt;

		}
	}
}

class Item extends Entity {
	constructor() {
		super();
		this.sprite += 'gem-blue.png';
		this.x = -1;
		this.y = -1;
		this.seconds = 1;
	}

	update(dt) {
		super.update();
		this.seconds += dt;

		if (Math.floor(this.seconds) % 10 === 0) {
			this.randomX = Math.floor(Math.random() * 5);
			this.randomY = Math.floor(Math.random() * 3) + 1;
			this.x = this.randomX;
			this.y = this.randomY;
			this.seconds = 1;
		}
	}
}