import { ctx } from './index.js';

class Map {
  constructor({ position, image }) {
    this.position = position;
    this.image = image;
  }

  draw() {
    ctx.drawImage(this.image, this.position.x, this.position.y);
  }
}

export default Map;
