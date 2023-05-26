var ship;
var asteroids = [];
var lasers = [];
var gameStarted = false;
var gameOver = false;
var lives = 3;
var score = 0;
var stars = [];
let icounter = 3;
var asteroidCount = 5;
var fullAuto = false;

function setup() {
  createCanvas(700, 500);
  frameRate(60);
  ship = new Ship();
  for (var i = 0; i < asteroidCount; i++) {
    asteroids.push(new Asteroid());
  }
  for (var i = 0; i < 10; i++) {
    stars.push(new Star());
  }
}

function draw() {
  background(0);
  for (var i = 0; i < stars.length; i++) {
    stars[i].render();
  }

  //game start screen
  if (!gameStarted) {
    textAlign(CENTER, CENTER);
    fill(255);
    textSize(15);
    text("asteroids", width / 2, height / 2);
    textSize(10);
    text("click anywhere to begin", width / 2, height / 2 + 20);
  }

  //game end screen
  else if (gameOver) {
    textAlign(CENTER, CENTER);
    fill(255);
    textSize(15);
    text("game over", width / 2, height / 2 - 20);
    textSize(13);
    text(
      "score: " + score + " | difficulty: " + (asteroidCount - 4),
      width / 2,
      height / 2
    );
    textSize(10);
    text("click anywhere to play again", width / 2, height / 2 + 20);
  }

  //in game
  else {
    if (frameCount % 60 == 0 && icounter > 0) {
      icounter--;
    }
    if (icounter <= 0) {
      ship.isInvincible = false;
    }
    if (ship.isInvincible) {
      textSize(10);
      textAlign(CENTER, CENTER);
      text("invincible for " + icounter + " more seconds", width / 2, 20);
    }
    textAlign(CENTER, CENTER);
    text("difficulty: " + (asteroidCount - 4), width - 30, 10);
    if (asteroids.length == 0) {
      asteroidCount++;
      ship.isInvincible = true;
      icounter = 3;
      for (var i = 0; i < asteroidCount; i++) {
        asteroids.push(new Asteroid());
      }
    }
    textAlign(LEFT, LEFT);
    text("lives: " + lives, 5, 10);
    text("score: " + score, 5, 23);
    if (fullAuto) {
      text("full auto: ENABLED (toggle with f)", 5, height - 10);
    } else {
      text("full auto: DISABLED (toggle with f)", 5, height - 10);
    }

    for (var i = 0; i < asteroids.length; i++) {
      if (ship.hits(asteroids[i])) {
        if (!ship.isInvincible) {
          lives -= 1;
          icounter = 3;
          ship.isInvincible = true;
        }

        //invincible timer
        if (lives <= 0) {
          gameOver = true;
        }
      }

      asteroids[i].render();
      asteroids[i].update();
      asteroids[i].edges();
    }

    for (var i = lasers.length - 1; i >= 0; i--) {
      lasers[i].render();
      lasers[i].update();
      if (lasers[i].offscreen()) {
        lasers.splice(i, 1);
      } else {
        for (var j = asteroids.length - 1; j >= 0; j--) {
          if (lasers[i].hits(asteroids[j])) {
            if (asteroids[j].r > 15) {
              var newAsteroids = asteroids[j].breakup();
              asteroids = asteroids.concat(newAsteroids);
            } else {
            }
            asteroids.splice(j, 1);
            lasers.splice(i, 1);
            score += 100;
            break;
          }
        }
      }
    }

    if (ship.isInvincible) {
      ship.renderBubble();
    }
    ship.render();
    ship.turn();
    ship.update();
    ship.edges();

    if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) {
      ship.setRotation(0.1);
      ship.boostingRight(true);
    }
    if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) {
      ship.setRotation(-0.1);
      ship.boostingLeft(true);
    }
    if (keyIsDown(UP_ARROW) || keyIsDown(87)) {
      ship.boosting(true);
    }
    if (fullAuto) {
      if (keyIsDown(32)) {
        lasers.push(new Laser(ship.pos, ship.heading));
      }
    }
  }
}









