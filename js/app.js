const player = new Player(),
allEnemies = [...Array(3)].map((_, i) => new Enemy(0, i+1)),
item = new Item();

const scoreElement = document.querySelector('.score'),
livesElement = document.querySelector('.lives'),
timerElement = document.querySelector('.timer'),
mainScreenElement = document.querySelector('.main-screen'),
playGameElement = document.querySelector('.play-game-btn'),
canvasElement = document.querySelector('.canvas'),
statsElement = document.querySelector('.stats-panel');

document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

playGameElement.addEventListener('click', function() {
	mainScreenElement.style.display = 'none';
	canvasElement.style.display = 'block';
	statsElement.style.display = 'block';
});