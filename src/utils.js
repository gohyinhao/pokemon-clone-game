import { BATTLE_FLASH_DURATION, BATTLE_FLASH_REPEAT } from './constants.js';

export const hasRectangularCollision = (rect1, rect2) => {
  return (
    rect1.position.x + rect1.width >= rect2.position.x &&
    rect1.position.x <= rect2.position.x + rect2.width &&
    rect1.position.y + rect1.height >= rect2.position.y &&
    rect1.position.y <= rect2.position.y + rect2.height
  );
};

/**
 * function assumes there is collision
 * can check for collision using hasRectangularCollision method
 */
export const getOverlappingArea = (rect1, rect2) => {
  const firstRectLeftPosition = rect1.position.x;
  const firstRectRightPosition = rect1.position.x + rect1.width;
  const secondRectLeftPosition = rect2.position.x;
  const secondRectRightPosition = rect2.position.x + rect2.width;

  const largestLeftPosition = Math.max(
    firstRectLeftPosition,
    secondRectLeftPosition,
  );
  const smallestRightPosition = Math.min(
    firstRectRightPosition,
    secondRectRightPosition,
  );

  const overlappingAreaWidth = smallestRightPosition - largestLeftPosition;

  const firstRectTopPosition = rect1.position.y;
  const firstRectBottomPosition = rect1.position.y + rect1.height;
  const secondRectTopPosition = rect2.position.y;
  const secondRectBottomPosition = rect2.position.y + rect2.height;

  const largestTopPosition = Math.max(
    firstRectTopPosition,
    secondRectTopPosition,
  );
  const smallestBottomPosition = Math.min(
    firstRectBottomPosition,
    secondRectBottomPosition,
  );

  const overlappingAreaHeight = smallestBottomPosition - largestTopPosition;

  return overlappingAreaWidth * overlappingAreaHeight;
};

export const triggerBattleFlashAnimation = (animateBattleFunc) => {
  gsap.to('#battle-flash', {
    opacity: 1,
    repeat: BATTLE_FLASH_REPEAT,
    yoyo: true,
    duration: BATTLE_FLASH_DURATION,
    onComplete() {
      gsap.to('#battle-flash', {
        opacity: 1,
        duration: BATTLE_FLASH_DURATION,
        onComplete() {
          animateBattleFunc();
          gsap.to('#battle-flash', {
            opacity: 0,
            duration: BATTLE_FLASH_DURATION,
          });
        },
      });
    },
  });
};

export const triggerGetHitAnimation = (healthBarId, recipient) => {
  gsap.to(healthBarId, {
    width: recipient.health + '%',
  });

  gsap.to(recipient.position, {
    x: recipient.position.x + 10,
    repeat: 5,
    yoyo: true,
    duration: 0.08,
  });

  gsap.to(recipient, {
    opacity: 0,
    repeat: 5,
    yoyo: true,
    duration: 0.08,
  });
};

export const getAttackMoveDialogue = (monsterName, attackName) => {
  return `${monsterName} used ${attackName}`;
};

/**
 * get random int from 0 to max number (exclusive)
 */
export const getRandomInt = (maxNumber) => {
  return Math.floor(Math.random() * maxNumber);
};

export const getRandomItemFromArray = (arr) => {
  return arr[getRandomInt(arr.length)];
};
