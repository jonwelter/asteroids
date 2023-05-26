function keyReleased() {
  ship.setRotation(0);
  ship.boosting(false);
  ship.boostingRight(false);
  ship.boostingLeft(false);
}

function keyPressed() {
  if (!fullAuto) {
    if (keyCode == 32) {
      lasers.push(new Laser(ship.pos, ship.heading));
    }
  }
  if (key == "f") {
    fullAuto = !fullAuto;
  }
}

function mouseClicked() {
  gameStarted = true;

  if (gameOver) {
    asteroids.length = 1;
    asteroidCount = 5;
    for (var i = 0; i < asteroidCount - 1; i++) {
      asteroids.push(new Asteroid());
    }
    lives = 3;
    score = 0;
    ship = new Ship();
    lasers = [];
    gameOver = false;
  }
}