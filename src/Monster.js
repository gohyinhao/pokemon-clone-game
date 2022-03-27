import Sprite from './Sprite.js';
import { TACKLE_MOVEMENT_DIST } from './constants.js';
import { fireballImg } from './images.js';
import { getAttackMoveDialogue, triggerGetHitAnimation } from './utils.js';

class Monster extends Sprite {
  constructor({ name, isEnemy = false, ...attributes }) {
    super(attributes);
    this.name = name;
    this.health = 100;
    this.isEnemy = isEnemy;
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

export default Monster;
