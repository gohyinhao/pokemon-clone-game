class Map {
  constructor({ position, image, ctx }) {
    this.position = position;
    this.image = image;
    this.ctx = ctx;
  }

  draw() {
    this.ctx.drawImage(this.image, this.position.x, this.position.y);
  }
}

export default Map;
