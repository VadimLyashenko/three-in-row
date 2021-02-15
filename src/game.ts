import 'phaser';

let config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scene: {
    preload: preload,
    create: create,
    update: update
  },
  backgroundColor: 0x333333
};

  let game = new Phaser.Game(config);

  function preload ()
  {

  }

  function create ()
  {
    let rect = new Phaser.Geom.Rectangle(200, 200, 200, 200);
    let graphics = this.add.graphics();
    graphics.fillStyle('0xRRGGBB', 1)
    graphics.fillRectShape(rect);
  }

  function update ()
  {

  }