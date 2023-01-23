import Phaser from 'phaser';
import Grid from '../modules/Grid';
export default class{
    constructor() {

    }

    init() {
    }

    preload() {
      

    }

    create() {
        console.log('[Game] create');
        this.grid = new Grid(this,this.cameras.main.centerX,this.cameras.main.centerY,3,3,3);
        this.add.existing(this.grid);
    }
}
