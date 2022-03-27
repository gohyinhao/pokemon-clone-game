import Map from './Map.js';
import Monster from './Monster.js';
import { battleBackgroundImg } from './images.js';
import { attacks } from './data/attacks.js';
import { monsters } from './data/monsters.js';

const battleBackground = new Map({
  position: { x: 0, y: 0 },
  image: battleBackgroundImg,
});
const draggle = new Monster(monsters.Draggle);
const emby = new Monster(monsters.Emby);

const attackCommands = document.querySelector('#attack-command-container');
emby.attacks.forEach((attack) => {
  const button = document.createElement('button');
  button.innerHTML = attack.name;
  attackCommands.append(button);
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
