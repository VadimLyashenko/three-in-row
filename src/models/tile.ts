export class Tile extends Phaser.GameObjects.Rectangle {
  constructor(scene: any, x: number, y: number, width: number, height: number, fillColor: number) {
    super(scene, x, y, width, height, fillColor);

    var graphics = scene.make.graphics({
      lineStyle: {
        width: 10,
      },
    });

    // let mask_rect = this;
    // mask_rect.width = mask_rect.width - 4;
    // mask_rect.height = mask_rect.height - 4;
    // graphics.fillRectShape(mask_rect);
    // var mask = graphics.createGeometryMask();
    // this.setMask(mask);

    this.setOrigin(0 ,0);
    scene.add.existing(this);
  }

  shift: number;
}
