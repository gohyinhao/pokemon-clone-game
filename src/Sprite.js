import { TACKLE_MOVEMENT_DIST } from './constants.js';
import { fireballImg } from './images.js';
import { getAttackMoveDialogue, triggerGetHitAnimation } from './utils.js';
import { ctx } from './index.js';

class Sprite {
  constructor({
    position,
    numOfFrames,
    sprites,
    isEnemy = false,
    animate = false,
    animationCycleCount = 10,
    rotation = 0,
    name,
  }) {
    this.position = position;
    this.image = sprites.down;
    this.frames = { max: numOfFrames, current: 0, elapsed: 0 };
    this.animate = animate;
    this.animationCycleCount = animationCycleCount;
    this.sprites = sprites;
    this.opacity = 1;
    this.health = 100;
    this.isEnemy = isEnemy;
    this.rotation = rotation;
    this.name = name;

    // assumption is that all sprites share same height and width
    // else will not work as intended
    this.width = this.image.width / numOfFrames;
    this.height = this.image.height;
    this.area = this.width * this.height;
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

  attack({ attack, recipient, renderedSprites }) {
    const dialogueBox = document.querySelector('#dialogue-box');
    dialogueBox.innerHTML = getAttackMoveDialogue(this.name, attack.name);
    dialogueBox.style.display = 'block';

    const targetHealthBarId = this.isEnemy
      ? '#player-health-bar'
      : '#enemy-health-bar';
    recipient.health -= attack.damage;

    switch (attack.name) {
      case 'Tackle':
        const movementDist = this.isEnemy
          ? -TACKLE_MOVEMENT_DIST
          : TACKLE_MOVEMENT_DIST;
        const timeline = gsap.timeline();
        timeline
          .to(this.position, {
            x: this.position.x - movementDist,
          })
          .to(this.position, {
            x: this.position.x + movementDist * 2,
            duration: 0.1,
            onComplete: () => {
              triggerGetHitAnimation(targetHealthBarId, recipient);
            },
          })
          .to(this.position, {
            x: this.position.x,
          });
        break;
      case 'Fireball':
        const fireball = new Sprite({
          position: {
            x: this.position.x,
            y: this.position.y,
          },
          sprites: {
            up: fireballImg,
            down: fireballImg,
            left: fireballImg,
            right: fireballImg,
          },
          numOfFrames: 4,
          animate: true,
          animationCycleCount: 10,
          rotation: this.isEnemy ? -2.5 : 1,
        });

        renderedSprites.splice(1, 0, fireball);
        gsap.to(fireball.position, {
          x: recipient.position.x,
          y: recipient.position.y,
          onComplete: () => {
            renderedSprites.splice(1, 1);
            triggerGetHitAnimation(targetHealthBarId, recipient);
          },
        });
        break;
    }
  }
}

export default Sprite;
