export const audio = {
  map: new Howl({
    src: '../assets/audio/map.wav',
    html5: true,
    volume: 0.5,
    loop: true,
  }),
  initBattle: new Howl({
    src: '../assets/audio/initBattle.wav',
    html5: true,
    volume: 0.1,
  }),
  battle: new Howl({
    src: '../assets/audio/battle.mp3',
    html5: true,
    volume: 0.2,
    loop: true,
  }),
  tackleHit: new Howl({
    src: '../assets/audio/tackleHit.wav',
    html5: true,
    volume: 0.1,
  }),
  fireballHit: new Howl({
    src: '../assets/audio/fireballHit.wav',
    html5: true,
    volume: 0.1,
  }),
  initFireball: new Howl({
    src: '../assets/audio/initFireball.wav',
    html5: true,
    volume: 0.1,
  }),
  victory: new Howl({
    src: '../assets/audio/victory.wav',
    html5: true,
    volume: 1,
  }),
  gameOver: new Howl({
    src: '../assets/audio/gameOver.wav',
    html5: true,
    volume: 1,
  }),
};
