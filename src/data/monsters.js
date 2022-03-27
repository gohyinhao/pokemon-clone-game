import {
  ENEMY_MONSTER_X_OFFSET,
  ENEMY_MONSTER_Y_OFFSET,
  OWN_MONSTER_X_OFFSET,
  OWN_MONSTER_Y_OFFSET,
} from '../constants.js';
import { draggleImg, embyImg } from '../images.js';
import { attacks } from './attacks.js';

export const monsters = {
  Emby: {
    position: {
      x: OWN_MONSTER_X_OFFSET,
      y: OWN_MONSTER_Y_OFFSET,
    },
    image: embyImg,
    numOfFrames: 4,
    isEnemy: false,
    animate: true,
    animationCycleCount: 30,
    name: 'Emby',
    attacks: [attacks.Tackle, attacks.Fireball],
  },
  Draggle: {
    position: {
      x: ENEMY_MONSTER_X_OFFSET,
      y: ENEMY_MONSTER_Y_OFFSET,
    },
    image: draggleImg,
    numOfFrames: 4,
    isEnemy: true,
    animate: true,
    animationCycleCount: 30,
    name: 'Draggle',
    attacks: [attacks.Tackle, attacks.Fireball],
  },
};
