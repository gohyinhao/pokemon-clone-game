import Sprite from './Sprite.js';

class Player extends Sprite {
  constructor({ sprites, ...attributes }) {
    super({ ...attributes, image: sprites.down });
    this.sprites = sprites;
  }
}

export default Player;
