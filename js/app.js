const player = new Player(),
allEnemies = [...Array(3)].map((_, i) => new Enemy(0, i+1)),
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

document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

for (playGameBtn of playGameElement) {
	playGameBtn.addEventListener('click', function() {
		mainScreenElement.style.display = 'none';
		gameOverElement.style.display = 'none';
		canvasElement.style.display = 'block';
		statsElement.style.display = 'block';
	});
}

exitElement.addEventListener('click', function() {
	mainScreenElement.style.display = 'block';
	gameOverElement.style.display = 'none';
	canvasElement.style.display = 'none';
	statsElement.style.display = 'none';
});


// Swipe player controls for mobile
let startX = null, startY = null;
canvasElement.addEventListener('touchstart', function(e){
	if (e.touches.length === 1) {
		// Just one finger touched
		startX = e.touches.item(0).clientX;
		startY = e.touches.item(0).clientY;
	} else {
		// If a second finger hit the screen, abort the touch
		start = null;
		startY = null;
	}
});

canvasElement.addEventListener('touchend', function(e){
	let offset = 100; // At least 100px are a swipe
	if (startX || startY) {
		let endX = e.changedTouches.item(0).clientX;
		let endY = e.changedTouches.item(0).clientY;

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