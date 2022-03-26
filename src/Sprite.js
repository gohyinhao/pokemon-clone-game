class Sprite {
  constructor({
    ctx,
    position,
    numOfFrames,
    sprites,
    animate = false,
    animationCycleCount = 10,
  }) {
    this.ctx = ctx;
    this.position = position;
    this.image = sprites.down;
    this.frames = { max: numOfFrames, current: 0, elapsed: 0 };
    this.animate = animate;
    this.animationCycleCount = animationCycleCount;
    this.sprites = sprites;
    this.sprites.down.onload = () => {
      // assumption is that all sprites share same height and width
      // else will not work as intended
      this.width = this.image.width / numOfFrames;
      this.height = this.image.height;
      this.area = this.width * this.height;
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

    if (!this.animate) {
      return;
    }

    this.frames.elapsed++;
    if (this.frames.elapsed === this.animationCycleCount) {
      this.frames.elapsed = 0;
      this.frames.current = (this.frames.current + 1) % this.frames.max;
    }
  }
}

export default Sprite;
