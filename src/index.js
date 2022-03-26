import Map from './Map.js';
import { townCollisions } from './data/collisions.js';
import { battleZonesData } from './data/battleZones.js';
import {
  BATTLE_TRIGGER_PERCENTAGE,
  ENEMY_MONSTER_X_OFFSET,
  ENEMY_MONSTER_Y_OFFSET,
  MAP_WIDTH_TILE_COUNT,
  MOVEMENT_SPEED,
  OWN_MONSTER_X_OFFSET,
  OWN_MONSTER_Y_OFFSET,
  PLAYER_AREA_AND_BATTLE_ZONE_OVERLAP_FACTOR,
} from './constants.js';
import Boundary from './Boundary.js';
import Sprite from './Sprite.js';
import {
  getOverlappingArea,
  hasRectangularCollision,
  triggerBattleFlashAnimation,
} from './utils.js';
import {
  townImg,
  foregroundImg,
  playerUpImg,
  playerDownImg,
  playerLeftImg,
  playerRightImg,
  battleBackgroundImg,
  draggleImg,
  embyImg,
} from './images.js';

/**
 * INIT
 */
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
canvas.width = 1024;
canvas.height = 576;

// map offset to position player initial starting point
const mapOffset = { x: -500, y: -380 };

/**
 * BATTLE ZONE LOGIC
 */
const battleZonesMap = [];
for (let i = 0; i < battleZonesData.length; i += MAP_WIDTH_TILE_COUNT) {
  battleZonesMap.push(battleZonesData.slice(i, i + MAP_WIDTH_TILE_COUNT));
}
const battleZones = [];
battleZonesMap.forEach((row, rowIndex) => {
  row.forEach((symbol, colIndex) => {
    if (symbol) {
      battleZones.push(
        new Boundary({
          ctx,
          position: {
            x: colIndex * Boundary.width + mapOffset.x,
            y: rowIndex * Boundary.height + mapOffset.y,
          },
        }),
      );
    }
  });
});

/**
 * BOUNDARY LOGIC
 */
const townCollisionsMap = [];
for (let i = 0; i < townCollisions.length; i += MAP_WIDTH_TILE_COUNT) {
  townCollisionsMap.push(townCollisions.slice(i, i + MAP_WIDTH_TILE_COUNT));
}
const boundaries = [];
townCollisionsMap.forEach((row, rowIndex) => {
  row.forEach((symbol, colIndex) => {
    if (symbol) {
      boundaries.push(
        new Boundary({
          ctx,
          position: {
            x: colIndex * Boundary.width + mapOffset.x,
            y: rowIndex * Boundary.height + mapOffset.y,
          },
        }),
      );
    }
  });
});

const background = new Map({
  position: { x: mapOffset.x, y: mapOffset.y },
  image: townImg,
  ctx,
});
const foreground = new Map({
  position: { x: mapOffset.x, y: mapOffset.y },
  image: foregroundImg,
  ctx,
});
const battleBackground = new Map({
  position: { x: 0, y: 0 },
  image: battleBackgroundImg,
  ctx,
});
const player = new Sprite({
  ctx,
  position: {
    x: canvas.width / 2 - playerUpImg.width / 8,
    y: canvas.height / 2 - playerUpImg.height / 2,
  },
  sprites: {
    up: playerUpImg,
    down: playerDownImg,
    left: playerLeftImg,
    right: playerRightImg,
  },
  numOfFrames: 4,
});
const draggle = new Sprite({
  ctx,
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
  animate: true,
  animationCycleCount: 30,
});
const emby = new Sprite({
  ctx,
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
  animate: true,
  animationCycleCount: 30,
});

const keys = {
  w: {
    pressed: false,
  },
  a: {
    pressed: false,
  },
  s: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
};

let lastKeyPressed = '';
window.addEventListener('keydown', (e) => {
  switch (e.key) {
    case 'w':
      keys.w.pressed = true;
      lastKeyPressed = 'w';
      break;
    case 'a':
      keys.a.pressed = true;
      lastKeyPressed = 'a';
      break;
    case 's':
      keys.s.pressed = true;
      lastKeyPressed = 's';
      break;
    case 'd':
      keys.d.pressed = true;
      lastKeyPressed = 'd';
      break;
    default:
  }
});

window.addEventListener('keyup', (e) => {
  switch (e.key) {
    case 'w':
    case 'a':
    case 's':
    case 'd':
      keys[e.key].pressed = false;
      break;
    default:
  }
});

const movableObjects = [background, foreground, ...boundaries, ...battleZones];

const battleState = {
  initiated: false,
};

function animate() {
  const animationId = window.requestAnimationFrame(animate);
  background.draw();
  // boundaries.forEach((boundary) => {
  //   boundary.draw();
  // });
  // battleZones.forEach((zone) => zone.draw());
  player.draw();
  foreground.draw();

  player.animate = false;
  if (battleState.initiated) {
    return;
  }

  /**
   * check if battle should be activated
   */
  if (keys.w.pressed || keys.a.pressed || keys.s.pressed || keys.d.pressed) {
    for (const battleZone of battleZones) {
      if (
        hasRectangularCollision(player, battleZone) &&
        getOverlappingArea(player, battleZone) >
          player.area * PLAYER_AREA_AND_BATTLE_ZONE_OVERLAP_FACTOR &&
        Math.random() < BATTLE_TRIGGER_PERCENTAGE
      ) {
        window.cancelAnimationFrame(animationId);

        battleState.initiated = true;
        triggerBattleFlashAnimation(animateBattle);
        break;
      }
    }
  }

  const NO_MOVEMENT_RESULT = { direction: 'x', moveOffset: 0 };
  let movementResult = NO_MOVEMENT_RESULT;
  if (keys.w.pressed && lastKeyPressed === 'w') {
    player.image = player.sprites.up;
    player.animate = true;
    movementResult = { direction: 'y', moveOffset: MOVEMENT_SPEED };
    for (const boundary of boundaries) {
      if (
        hasRectangularCollision(player, {
          ...boundary,
          position: {
            x: boundary.position.x,
            y: boundary.position.y + MOVEMENT_SPEED,
          },
        })
      ) {
        movementResult = NO_MOVEMENT_RESULT;
        break;
      }
    }
  } else if (keys.a.pressed && lastKeyPressed === 'a') {
    player.image = player.sprites.left;
    player.animate = true;
    movementResult = { direction: 'x', moveOffset: MOVEMENT_SPEED };
    for (const boundary of boundaries) {
      if (
        hasRectangularCollision(player, {
          ...boundary,
          position: {
            x: boundary.position.x + MOVEMENT_SPEED,
            y: boundary.position.y,
          },
        })
      ) {
        movementResult = NO_MOVEMENT_RESULT;
        break;
      }
    }
  } else if (keys.s.pressed && lastKeyPressed === 's') {
    player.image = player.sprites.down;
    player.animate = true;
    movementResult = { direction: 'y', moveOffset: -MOVEMENT_SPEED };
    for (const boundary of boundaries) {
      if (
        hasRectangularCollision(player, {
          ...boundary,
          position: {
            x: boundary.position.x,
            y: boundary.position.y - MOVEMENT_SPEED,
          },
        })
      ) {
        movementResult = NO_MOVEMENT_RESULT;
        break;
      }
    }
  } else if (keys.d.pressed && lastKeyPressed === 'd') {
    player.image = player.sprites.right;
    player.animate = true;
    movementResult = { direction: 'x', moveOffset: -MOVEMENT_SPEED };
    for (const boundary of boundaries) {
      if (
        hasRectangularCollision(player, {
          ...boundary,
          position: {
            x: boundary.position.x - MOVEMENT_SPEED,
            y: boundary.position.y,
          },
        })
      ) {
        movementResult = NO_MOVEMENT_RESULT;
        break;
      }
    }
  }

  if (movementResult.moveOffset !== 0) {
    movableObjects.forEach(
      (object) =>
        (object.position[movementResult.direction] +=
          movementResult.moveOffset),
    );
  }
}
// animate();

function animateBattle() {
  window.requestAnimationFrame(animateBattle);
  battleBackground.draw();
  draggle.draw();
  emby.draw();
}
animateBattle();
