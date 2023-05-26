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