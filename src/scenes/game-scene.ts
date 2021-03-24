import { Tile } from '../models/tile';
import { colors } from '../colors';

export class GameScene extends Phaser.Scene {

  constructor() {
    super({
      key: 'GameScene'
    });
  }

  private tileGrid: Tile[][];

  init ()
  {
    this.tileGrid = [];
    for (let y = 0; y < 8; y++) {
      this.tileGrid[y] = [];
      for (let x = 0; x < 8; x++) {
        this.tileGrid[y][x] = this.addTile(x, y);
      }
    }
  }

  private addTile(x: number, y: number): Tile {
    // let randColor = Math.floor(Math.random()*16777215);
    let randColor = colors[Phaser.Math.RND.between(0, colors.length - 1)];
    return new Tile(this, x * 75, y * 75, 75, 75, randColor);
  }

  preload ()
  {

  }

  create ()
  {

  }

  update ()
  {

  }
}
