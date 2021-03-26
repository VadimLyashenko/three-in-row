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
    let canMove: boolean = true;
    let coord_y: number = -1;
    let coord_x: number = -1;

    let prev_y: number = -1;
    let prev_x: number = -1;

    console.table(this.tileGrid);

    this.tileGrid.map(function(row, y) {
      row.map(function(element, x) {
        element.setInteractive().on('pointerdown', function(){
          // console.log(`coord_y:${coord_y} coord_x:${coord_x} element.y:${element.y} element.x:${element.x}`);
          if (coord_y == -1&& coord_x == -1) {
            element.setStrokeStyle(2, 0x33ee33);
            coord_y = element.y;
            coord_x = element.x;
            prev_y = y;
            prev_x = x;
          } else {
            this.clearStroke();
            if (this.isNear(coord_y, coord_x, element.y, element.x) && canMove) {
              canMove = false;
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
                  let arr1 = [];
                  for (let i = 0; i < 600; i= i + 75) {
                    let arr2 = [];
                    let k: number = 0;
                    for (let j = 0; j < 600; j= j + 75) {
                      if (j != 525 && (this.findByCoord(this.tileGrid, i, j).fillColor == this.findByCoord(this.tileGrid, i, j + 75).fillColor)) {
                        k++;
                      } else {
                        switch(k) {
                          case 2: {
                            arr2.push({y: i, x: j - 150}, {y: i, x: j - 75}, {y: i, x: j});
                            break;
                          }
                          case 3: {
                            arr2.push({y: i, x: j - 225}, {y: i, x: j - 150}, {y: i, x: j - 75}, {y: i, x: j});
                            break;
                          }
                          case 4: {
                            arr2.push({y: i, x: j - 300}, {y: i, x: j - 225}, {y: i, x: j - 150}, {y: i, x: j - 75}, {y: i, x: j});
                            break;
                          }
                          case 5: {
                            arr2.push({y: i, x: j - 375}, {y: i, x: j - 300}, {y: i, x: j - 225}, {y: i, x: j - 150}, {y: i, x: j - 75}, {y: i, x: j});
                            break;
                          }
                          case 6: {
                            arr2.push({y: i, x: j - 450}, {y: i, x: j - 375}, {y: i, x: j - 300}, {y: i, x: j - 225}, {y: i, x: j - 150}, {y: i, x: j - 75}, {y: i, x: j});
                            break;
                          }
                          case 7: {
                            arr2.push({y: i, x: j - 525}, {y: i, x: j - 450}, {y: i, x: j - 375}, {y: i, x: j - 300}, {y: i, x: j - 225}, {y: i, x: j - 150}, {y: i, x: j - 75}, {y: i, x: j});
                            break;
                          }
                        }
                        k = 0;
                      }
                    }
                    arr1.push(arr2);
                  }
                  console.log(arr1);
                  // for(let j = 0; j < 600; j= j + 75){
                  //   for(let i = 0; i < 600; i= i + 75){
                  //     console.log(`i:${i} j:${j} color: ${this.findByCoord(this.tileGrid, i, j).fillColor}`);
                  //   }
                  // }
                  canMove = true;
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
          }
          console.log(`y: ${y} x: ${x}`);
        }, this);
      }, this);
    }, this);
  }

  private findByCoord(tileGrid: [][], y: number, x: number) {
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if (this.tileGrid[i][j].y == y && this.tileGrid[i][j].x == x) {
          return this.tileGrid[i][j];
        }
      }
    }
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
