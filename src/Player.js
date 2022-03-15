class Player {
  static ANIMATION_CYCLE_COUNT = 10;

  constructor({ ctx, position, numOfFrames, sprites }) {
    this.ctx = ctx;
    this.position = position;
    this.image = sprites.down;
    this.frames = { max: numOfFrames, current: 0, elapsed: 0 };
    this.moving = false;
    this.sprites = sprites;
    this.sprites.down.onload = () => {
      // assumption is that all sprites share same height and width
      // else will not work as intended
      this.width = this.image.width / numOfFrames;
      this.height = this.image.height;
    };
  }

  draw() {
    this.ctx.drawImage(
      this.image,
      this.frames.current * this.width,
      0,
      this.width,
      this.height,
      this.position.x,
      this.position.y,
      this.width,
      this.height,
    );

    if (!this.moving) {
      return;
    }

    this.frames.elapsed++;
    if (this.frames.elapsed === Player.ANIMATION_CYCLE_COUNT) {
      this.frames.elapsed = 0;
      this.frames.current = (this.frames.current + 1) % this.frames.max;
    }
  }
}

export default Player;
