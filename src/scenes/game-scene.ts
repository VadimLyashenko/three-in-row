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

    // let pointer = this.input.activePointer;
    let coord_y: number = -1;
    let coord_x: number = -1;

    let prev_y: number = -1;
    let prev_x: number = -1;

    this.tileGrid.map(function(row, y) {
      row.map(function(element, x) {
        element.setInteractive().on('pointerdown', function(){
          // console.log(`coord_y:${coord_y} coord_x:${coord_x} element.y:${element.y} element.x:${element.x}`);
          if (coord_y == -1&& coord_x == -1){
            element.setStrokeStyle(2, 0x33ee33);
            coord_y = element.y;
            coord_x = element.x;
            prev_y = y;
            prev_x = x;
          } else {
            this.clearStroke();
            if (this.isNear(coord_y, coord_x, element.y, element.x)) {
              // console.log('near');
              this.add.tween({
                targets: this.tileGrid[prev_y][prev_x],
                y: element.y,
                x: element.x, 
                ease: 'Linear',
                duration: 300,
                repeat: 0,
                yoyo: false,
                onComplete: () => {
                }
              });
              this.add.tween({
                targets: element,
                y: this.tileGrid[prev_y][prev_x].y,
                x: this.tileGrid[prev_y][prev_x].x,
                ease: 'Linear',
                duration: 300,
                repeat: 0,
                yoyo: false,
                onComplete: () => {
                }
              });
              coord_y = -1;
              coord_x = -1;
              prev_y = -1;
              prev_x = -1;
            } else {
              element.setStrokeStyle(2, 0x33ee33);
              coord_y = element.y;
              coord_x = element.x;
              prev_y = y;
              prev_x = x;
            }
          // console.log(`prev_y:${prev_y} prev_x:${prev_x}`);
          }
          console.log(`y: ${y} x: ${x}`);
        }, this);
      }, this);
    }, this);
  }

  private addTile(x: number, y: number): Tile {
    let randColor = colors[Phaser.Math.RND.between(0, colors.length - 1)];
    return new Tile(this, x * 75, y * 75, 71, 71, randColor);
  }

  private clearStroke(): void {
    this.tileGrid.map(function(e) {
      e.map(function(t) {
        t.setStrokeStyle(0);
      });
    });
  }

  private isNear(coord_y: number, coord_x: number, y: number, x: number): boolean {
    if ((x == coord_x + 75 || x == coord_x - 75) && y == coord_y) {
      return true;
    }
    else if ((y == coord_y + 75 || y == coord_y - 75) && x == coord_x) {
      return true;
    } else {
      return false;
    }
  }

  preload ()
  {

  }

  update ()
  {
    // console.log()
  }
}
