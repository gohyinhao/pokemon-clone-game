import Map from './Map.js';
import { townCollisions } from './data/collisions.js';
import { MAP_WIDTH_TILE_COUNT, MOVEMENT_SPEED } from './constants.js';
import Boundary from './Boundary.js';
import Player from './Player.js';
import { hasRectangularCollision } from './utils.js';
import {
  townImg,
  foregroundImg,
  playerUpImg,
  playerDownImg,
  playerLeftImg,
  playerRightImg,
} from './images.js';

/**
 * INIT
 */
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
canvas.width = 1024;
canvas.height = 576;

/**
 * BOUNDARY LOGIC
 */
const townCollisionsMap = [];
for (let i = 0; i < townCollisions.length; i += MAP_WIDTH_TILE_COUNT) {
  townCollisionsMap.push(townCollisions.slice(i, i + MAP_WIDTH_TILE_COUNT));
}

const boundaries = [];
const mapOffset = { x: -500, y: -380 };
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
const player = new Player({
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

const movableObjects = [background, foreground, ...boundaries];

function animate() {
  window.requestAnimationFrame(animate);
  background.draw();
  player.draw();
  // boundaries.forEach((boundary) => {
  //   boundary.draw();
  // });
  foreground.draw();

  const NO_MOVEMENT_RESULT = { direction: 'x', moveOffset: 0 };
  let movementResult = NO_MOVEMENT_RESULT;
  player.moving = false;
  if (keys.w.pressed && lastKeyPressed === 'w') {
    player.image = player.sprites.up;
    player.moving = true;
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
    player.moving = true;
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
    player.moving = true;
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
    player.moving = true;
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
animate();
