# Acade Game Project (Frogger Clone)

This is a project for Front End Nanodegree Program by [Udacity](https://www.udacity.com/). The starter project had some art assets and game engine (engine.js & resources.js). I needed to implement the basic functionality of the project using Object-Oriented JavasScript based on the project [rubric](https://review.udacity.com/#!/rubrics/15/view). This required modifying the HTML, CSS and JavaScript files, but primarily the app.js file.

## Table of Contents

* [Installation](#installation)
* [Gameplay](#gameplay)
* [Controls](#controls)
* [Items](#items)
* [Dependencies](#dependencies)
* [TODO](#todo)

## Installation

1. Download the GithHub zip file or clone the repository.
	* [zip file](https://github.com/torralbapatrick/fend-project-arcade-game/archive/master.zip)
	* [git clone](https://github.com/torralbapatrick/fend-project-arcade-game)
2. Open index.html file.
3. Or you can play the game [here](https://torralbapatrick.github.io/fend-project-arcade-game/).

## Gameplay

The objective of the game is to guide each character to the river. The player starts at the bottom of the screen, and moving forward contains a pavement with bugs, speeding along horizontally. The player will lose a life if got hit by a bug or if the time runs out. The game starts with three lives, and losing them results in the end of the game, or "game over". Every forward steps scores 10 points, and every character that reaches the river scores 100 points. 50 points are also rewarded per each unused 1/2 of time. Also, there are items in the game, each has a different effect and spawns randomly in the map.

## Controls

* Arrow Up / Swipe Up - Move the player up
* Arrow Down / Swipe Down - Move the player down
* Arrow Left / Swipe Left - Move the player left
* Arrow Right / Swipe Right - Move the player right

## Items

* Heart - Adds 1 life (3 lives max)
* Blue Gem - Freezes the enemy for 3 seconds
* Green Gem - Slows the enemy for 3 seconds
* Orange Gem - Multiplies the points by 2 for 3 seconds
* Star - Plus 500 points
* Rock - Will block your path (not an item)

## Dependencies

* [Bootstrap](https://getbootstrap.com/)
* [Font Awesome](https://fontawesome.com/)
* [Google Font Bangers](https://fonts.google.com/specimen/Bangers)
* [Google Font Monserrat](https://fonts.google.com/specimen/Montserrat)
* [Swipe Controls](https://stackoverflow.com/a/45648960)

## TODO

* Add sound fx and background music
* Add animation
* Add levels