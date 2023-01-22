import Phaser from 'phaser';
export default class{
    constructor() {

    }

    init() {
    }

    preload() {
      

    }

    create() {
        console.log('[Menu] create');
        this.addPlayButton();
    }
    addPlayButton(){
        let that = this;
        let button = new Phaser.GameObjects.Sprite(this, this.cameras.main.centerX,this.cameras.main.centerY,'button_play');
        this.add.existing(button);
        button.setInteractive();
        button.on('pointerdown', () => {
            that.scene.start('Game');
        });
    }
}
