import Map from './Map.js';
import Monster from './Monster.js';
import { battleBackgroundImg } from './images.js';
import { attacks } from './data/attacks.js';
import { monsters } from './data/monsters.js';
import { audio } from './data/audio.js';
import { getRandomItemFromArray, triggerBattleEndAnimation } from './utils.js';
import { animate, initMap } from './index.js';

const battleBackground = new Map({
  position: { x: 0, y: 0 },
  image: battleBackgroundImg,
});

let draggle;
let emby;
let battleAnimationId;
let renderedSprites = [];
let battleQueue = [];

export function initBattle() {
  audio.battle.play();

  document.querySelector('#battle-interface').style.display = 'block';
  document.querySelector('#dialogue-box').style.display = 'none';
  document.querySelector('#player-health-bar').style.width = '100%';
  document.querySelector('#enemy-health-bar').style.width = '100%';

  draggle = new Monster(monsters.Draggle);
  emby = new Monster(monsters.Emby);
  renderedSprites = [draggle, emby];
  battleQueue = [];

  const attackCommands = document.querySelector('#attack-command-container');
  attackCommands.innerHTML = '';
  emby.attacks.forEach((attack) => {
    const button = document.createElement('button');
    button.innerHTML = attack.name;
    attackCommands.append(button);
  });

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

        if (draggle.health > 0) {
          const randomEnemyAttack = getRandomItemFromArray(draggle.attacks);
          battleQueue.push(() =>
            draggle.attack({
              attack: randomEnemyAttack,
              recipient: emby,
              renderedSprites,
            }),
          );
          if (emby.health - randomEnemyAttack.damage <= 0) {
            battleQueue.push(() => emby.faint());
            battleQueue.push(() =>
              triggerBattleEndAnimation(
                cancelBattleAnimation,
                initMap,
                animate,
              ),
            );
          }
        } else {
          battleQueue.push(() => draggle.faint());
          battleQueue.push(() =>
            triggerBattleEndAnimation(cancelBattleAnimation, initMap, animate),
          );
        }
      });

      button.addEventListener('mouseenter', (e) => {
        const selectedButton = e.currentTarget;
        const selectedAttack = attacks[selectedButton.innerHTML];
        const attackTypeContainer = document.querySelector('#attack-type');
        attackTypeContainer.innerHTML = selectedAttack.type;
        attackTypeContainer.style.color = selectedAttack.color;
      });

      button.addEventListener('mouseleave', () => {
        const attackTypeContainer = document.querySelector('#attack-type');
        attackTypeContainer.innerHTML = 'Attack Type';
        attackTypeContainer.style.color = 'black';
      });
    });
}

export function animateBattle() {
  battleAnimationId = window.requestAnimationFrame(animateBattle);
  battleBackground.draw();

  renderedSprites.forEach((sprite) => sprite.draw());
}

export function cancelBattleAnimation() {
  window.cancelAnimationFrame(battleAnimationId);
  audio.battle.stop();
}

document.querySelector('#dialogue-box').addEventListener('click', (e) => {
  if (battleQueue.length > 0) {
    battleQueue[0]();
    battleQueue.shift();
  } else {
    e.currentTarget.style.display = 'none';
  }
});
