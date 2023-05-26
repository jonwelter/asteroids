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

function Ship() {
  this.pos = createVector(width / 2, height / 2);
  this.r = 15;
  this.heading = 0;
  this.rotation = 0;
  this.vel = createVector(0, 0);
  this.isBoosting = false;
  this.isLeftBoosting = false;
  this.isRightBoosting = false;
  this.isInvincible = true;

  this.boosting = function (b) {
    this.isBoosting = b;
  };

  this.boostingLeft = function (b) {
    this.isLeftBoosting = b;
  };
  this.boostingRight = function (b) {
    this.isRightBoosting = b;
  };

  this.update = function () {
    if (this.isBoosting) {
      this.boost();
      this.renderFire();
    }
    if (this.isLeftBoosting) {
      this.renderLeftFire();
    }
    if (this.isRightBoosting) {
      this.renderRightFire();
    }
    this.pos.add(this.vel);
    this.vel.mult(0.99);
  };

  this.boost = function () {
    var force = p5.Vector.fromAngle(this.heading);
    force.mult(0.1);
    this.vel.add(force);
  };

  this.hits = function (asteroid) {
    var d = dist(this.pos.x, this.pos.y, asteroid.pos.x, asteroid.pos.y);
    return d < this.r + asteroid.r;
  };

  this.render = function () {
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.heading + PI / 2);
    fill(0);
    stroke(255);
    triangle(-this.r, this.r, this.r, this.r, 0, -this.r);
    rect(-this.r + this.r / 7, this.r + 5, (3 * this.r) / 4, this.r / 3);
    rect(this.r / 4 - this.r / 7, this.r + 5, (3 * this.r) / 4, this.r / 3);
    pop();
  };

  this.renderFire = function () {
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.heading + PI / 2);
    stroke(255);
    fill(255, 0, 0);
    rect(-this.r + this.r / 7, this.r + 5, (3 * this.r) / 4, this.r / 3);
    rect(this.r / 4 - this.r / 7, this.r + 5, (3 * this.r) / 4, this.r / 3);
    pop();
  };
  this.renderLeftFire = function () {
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.heading + PI / 2);
    stroke(255);
    fill(255, 100, 0);
    rect(this.r / 4 - this.r / 7, this.r + 5, (3 * this.r) / 4, this.r / 3);
    pop();
  };
  this.renderRightFire = function () {
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.heading + PI / 2);
    stroke(255);
    fill(255, 100, 0);
    rect(-this.r + this.r / 7, this.r + 5, (3 * this.r) / 4, this.r / 3);
    pop();
  };

  this.renderBubble = function () {
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.heading + PI / 2);
    noFill();
    stroke(255);
    ellipse(this.r - this.r / 2 - 8, this.r - 8, 60);
    pop();
  };

  this.edges = function () {
    if (this.pos.x > width + this.r) {
      this.pos.x = -this.r;
    } else if (this.pos.x < -this.r) {
      this.pos.x = width + this.r;
    }

    if (this.pos.y > height + this.r) {
      this.pos.y = -this.r;
    } else if (this.pos.y < -this.r) {
      this.pos.y = height + this.r;
    }
  };

  this.setRotation = function (a) {
    this.rotation = a;
  };

  this.turn = function (angle) {
    this.heading += this.rotation;
  };
}

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

function Asteroid(pos, r) {
  if (pos) {
    this.pos = pos.copy();
  } else {
    this.pos = createVector(random(width), random(height));
  }

  if (r) {
    this.r = r * 0.5;
  } else {
    this.r = random(15, 50);
  }

  this.vel = p5.Vector.random2D();
  this.total = floor(random(5, 10));
  this.offset = [];
  for (var i = 0; i < this.total; i++) {
    this.offset[i] = random(-this.r * 0.5, this.r * 0.5);
  }

  this.update = function () {
    this.pos.add(this.vel);
  };

  this.render = function () {
    push();
    noFill();
    stroke(255);
    translate(this.pos.x, this.pos.y);
    beginShape();
    for (var i = 0; i < this.total; i++) {
      var angle = map(i, 0, this.total, 0, 2 * PI);
      var r = this.r + this.offset[i];
      var x = r * cos(angle);
      var y = r * sin(angle);
      vertex(x, y);
    }
    endShape(CLOSE);
    pop();
  };

  this.breakup = function () {
    var newA = [];
    newA[0] = new Asteroid(this.pos, this.r);
    newA[1] = new Asteroid(this.pos, this.r);
    return newA;
  };

  this.edges = function () {
    if (this.pos.x > width + this.r) {
      this.pos.x = -this.r;
    } else if (this.pos.x < -this.r) {
      this.pos.x = width + this.r;
    }

    if (this.pos.y > height + this.r) {
      this.pos.y = -this.r;
    } else if (this.pos.y < -this.r) {
      this.pos.y = height + this.r;
    }
  };
}

function Laser(spos, angle) {
  this.pos = createVector(spos.x, spos.y);
  this.vel = p5.Vector.fromAngle(angle);
  this.vel.mult(10);

  this.update = function () {
    this.pos.add(this.vel);
  };

  this.render = function () {
    push();
    stroke(255, 0, 0);
    strokeWeight(3);
    point(this.pos.x, this.pos.y);
    pop();
  };

  this.hits = function (asteroid) {
    var d = dist(this.pos.x, this.pos.y, asteroid.pos.x, asteroid.pos.y);
    return d < asteroid.r;
  };

  this.offscreen = function () {
    if (this.pos.x > width || this.pos.x < 0) {
      return true;
    }

    if (this.pos.y > height || this.pos.y < 0) {
      return true;
    }
    return false;
  };
}

function Star() {
  fill(255);
  this.render = function () {
    ellipse(random() * width, random() * height, 2, 2);
  };
}
