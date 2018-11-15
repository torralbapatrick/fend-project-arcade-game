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