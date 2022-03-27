import { TILE_HEIGHT, TILE_WIDTH } from './constants.js';
import { ctx } from './index.js';

class Boundary {
  static width = TILE_WIDTH;
  static height = TILE_HEIGHT;

  constructor({ position }) {
    this.position = position;
    this.width = Boundary.width;
    this.height = Boundary.height;
  }

  draw() {
    ctx.fillStyle = 'red';
    ctx.fillRect(
      this.position.x,
      this.position.y,
      Boundary.width,
      Boundary.height,
    );
  }
}

export default Boundary;
