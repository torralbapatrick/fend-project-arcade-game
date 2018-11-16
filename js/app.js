let allEnemies = [...Array(3)].map((_, i) => new Enemy(-1, i+1));
const player = new Player(),
item = new Item();

const scoreElement = document.querySelector('.score'),
livesElement = document.querySelector('.lives'),
timerElement = document.querySelector('.timer'),
mainScreenElement = document.querySelector('.main-screen'),
playGameElement = document.querySelectorAll('.play-game-btn'),
canvasElement = document.querySelector('.canvas'),
statsElement = document.querySelector('.stats-panel'),
gameOverElement = document.querySelector('.game-over'),
exitElement = document.querySelector('.exit-btn'),
finalScoreElement = document.querySelector('.final-score');

/**
 * @description Adds listener to arrow keys
 * @param  {keycode} evt - Keyboard event keycode
 * @return {void}
 */
document.addEventListener('keyup', evt => {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    
	if (canvasElement.style.display === 'block' && statsElement.style.display === 'block') {
    	player.handleInput(allowedKeys[evt.keyCode]);
    }
});

/**
 * @description Hides the main screen and shows the game canvas if the play button is clicked
 * @return {void}
 */
for (playGameBtn of playGameElement) {
	playGameBtn.addEventListener('click', () => {
		mainScreenElement.style.display = 'none';
		gameOverElement.style.display = 'none';
		canvasElement.style.display = 'block';
		statsElement.style.display = 'block';
	});
}

/**
 * @description Hides the game canvas and shows the main screen if the exit button is clicked
 * @return {void}
 */
exitElement.addEventListener('click', () => {
	mainScreenElement.style.display = 'block';
	gameOverElement.style.display = 'none';
	canvasElement.style.display = 'none';
	statsElement.style.display = 'none';
});

/**
 * @description Swipe player controls for mobile from http://stackoverflow.com/a/2450976
 * @type {event}
 */
let startX = null, startY = null;
canvasElement.addEventListener('touchstart', evt => {
	if (evt.touches.length === 1) {
		// Just one finger touched
		startX = evt.touches.item(0).clientX;
		startY = evt.touches.item(0).clientY;
	} else {
		// If a second finger hit the screen, abort the touch
		start = null;
		startY = null;
	}
});

canvasElement.addEventListener('touchend', evt => {
	let offset = 100; // At least 100px are a swipe

	if (startX || startY) {
		let endX = evt.changedTouches.item(0).clientX;
		let endY = evt.changedTouches.item(0).clientY;

		// Left to right swipe
		if (endX > startX + offset) {
			player.handleInput('right');
		}

		// Right to left swipe
		if (endX < startX - offset ) {
			player.handleInput('left');
		}

		// Top to bottom swipe
		if (endY > startY + offset) {
			player.handleInput('down');
		}

		// Bottom to top swipe
		if (endY < startY - offset) {
			player.handleInput('up');
		}
	}
});

/**
 * @description Disables scrolling for mobile devices
 * @return {void}
 */
canvasElement.addEventListener('touchmove', evt => evt.preventDefault());