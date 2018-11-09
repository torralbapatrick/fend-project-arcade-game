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
		this.sprite += 'char-boy.png';
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
		this.moving = true;
	}

	update(dt) {
		super.update();
		if (this.isOutOfBoundsY) {
			this.x = 2;
			this.y = 5;
			this.score += 100;
			document.querySelector('.score').innerText = this.score;
		}
	}

	checkCollisions(enemy) {
		if (this.y === enemy.y) {
			if (this.x >= enemy.x - 0.5 && this.x <= enemy.x + 0.5) {
				this.lives -= 1;
				document.querySelector('.lives').innerText = this.lives;

				// Check if the game is over
				if (this.lives === 0) {
					this.lives = 3;
					this.score = 0;
					document.querySelector('.score').innerText = this.score;
					document.querySelector('.lives').innerText = this.lives;
					window.alert('Game over!');
				}

				return true;
			}
		} else {
			return false;
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