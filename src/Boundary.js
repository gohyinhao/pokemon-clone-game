import { TILE_HEIGHT, TILE_WIDTH } from './constants.js';

class Boundary {
  static width = TILE_WIDTH;
  static height = TILE_HEIGHT;

  constructor({ position, ctx }) {
    this.position = position;
    this.ctx = ctx;
    this.width = Boundary.width;
    this.height = Boundary.height;
  }

  draw() {
    this.ctx.fillStyle = 'red';
    this.ctx.fillRect(
      this.position.x,
      this.position.y,
      Boundary.width,
      Boundary.height,
    );
  }
}

export default Boundary;
