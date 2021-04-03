import { GameScene } from './scenes/game-scene';

export const GameConfig: Phaser.Types.Core.GameConfig = {
  title: 'Three in row',
  url: 'https://github.com/digitsensitive/phaser3-typescript',
  version: "0.1",
  type: Phaser.AUTO,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 600,
    height: 600,
  },
  parent: 'game',
  scene: [GameScene],
  backgroundColor: 0x333333,
  render: { pixelArt: false, antialias: true }
};