import Phaser from 'phaser';
export default class{
    constructor() {
    }

    init() {
    }

    preload() {
      
        //this.load.bitmapFont('impact_shadow_stroke','./assets/font/impact_shadow_stroke.png','./assets/font/impact_shadow_stroke.fnt');
        this.load.image('button_play','./assets/img/button_play.png');
        this.load.image('button_menu','./assets/img/button_menu.png');
        this.load.image('cell','./assets/img/cell.png');
        this.load.spritesheet('marks', './assets/img/marks.png', { frameWidth: 50, frameHeight: 50 });
        this.load.spritesheet('arrows', './assets/img/arrows.png', { frameWidth: 25, frameHeight: 25 });
        //this.load.audio('onclick', ['./assets/audio/onclick.ogg']);
    }

    create() {
        console.log('[Boot] create');
        this.game.emitter = new Phaser.Events.EventEmitter();
        this.scene.start('Menu');
    }
}
