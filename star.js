function Star() {
  fill(255);
  this.render = function () {
    ellipse(random() * width, random() * height, 2, 2);
  };
}