import Map from './Map.js';
import {
  ENEMY_MONSTER_X_OFFSET,
  ENEMY_MONSTER_Y_OFFSET,
  OWN_MONSTER_X_OFFSET,
  OWN_MONSTER_Y_OFFSET,
} from './constants.js';
import Sprite from './Sprite.js';
import { battleBackgroundImg, draggleImg, embyImg } from './images.js';
import { attacks } from './data/attacks.js';

const battleBackground = new Map({
  position: { x: 0, y: 0 },
  image: battleBackgroundImg,
});
const draggle = new Sprite({
  position: {
    x: ENEMY_MONSTER_X_OFFSET,
    y: ENEMY_MONSTER_Y_OFFSET,
  },
  sprites: {
    up: draggleImg,
    down: draggleImg,
    left: draggleImg,
    right: draggleImg,
  },
  numOfFrames: 4,
  isEnemy: true,
  animate: true,
  animationCycleCount: 30,
  name: 'Draggle',
});
const emby = new Sprite({
  position: {
    x: OWN_MONSTER_X_OFFSET,
    y: OWN_MONSTER_Y_OFFSET,
  },
  sprites: {
    up: embyImg,
    down: embyImg,
    left: embyImg,
    right: embyImg,
  },
  numOfFrames: 4,
  isEnemy: false,
  animate: true,
  animationCycleCount: 30,
  name: 'Emby',
});

const renderedSprites = [draggle, emby];
export function animateBattle() {
  window.requestAnimationFrame(animateBattle);
  battleBackground.draw();

  renderedSprites.forEach((sprite) => sprite.draw());
}

const battleQueue = [];

document
  .querySelectorAll('.attack-command-container>button')
  .forEach((button) => {
    button.addEventListener('click', (e) => {
      const selectedButton = e.currentTarget;
      const selectedAttack = attacks[selectedButton.innerHTML];
      emby.attack({
        attack: selectedAttack,
        recipient: draggle,
        renderedSprites,
      });

      battleQueue.push(() =>
        draggle.attack({
          attack: attacks.Tackle,
          recipient: emby,
          renderedSprites,
        }),
      );
    });
  });

document.querySelector('#dialogue-box').addEventListener('click', (e) => {
  if (battleQueue.length > 0) {
    battleQueue[0]();
    battleQueue.shift();
  } else {
    e.currentTarget.style.display = 'none';
  }
});
