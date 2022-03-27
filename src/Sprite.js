import { ctx } from './index.js';

class Sprite {
  constructor({
    position,
    numOfFrames,
    image,
    animate = false,
    animationCycleCount = 10,
    rotation = 0,
  }) {
    this.position = position;
    this.image = image;
    this.image.src = image.src;
    this.frames = { max: numOfFrames, current: 0, elapsed: 0 };
    this.animate = animate;
    this.animationCycleCount = animationCycleCount;
    this.opacity = 1;
    this.rotation = rotation;

    // assumption is that all sprites share same height and width
    // else will not work as intended
    this.image.onload = () => {
      this.width = this.image.width / numOfFrames;
      this.height = this.image.height;
      this.area = this.width * this.height;
    };
  }

  draw() {
    ctx.save();
    ctx.translate(
      this.position.x + this.width / 2,
      this.position.y + this.height / 2,
    );
    ctx.rotate(this.rotation);
    ctx.translate(
      -this.position.x - this.width / 2,
      -this.position.y - this.height / 2,
    );
    ctx.globalAlpha = this.opacity;
    ctx.drawImage(
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
    ctx.restore();

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
