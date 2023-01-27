import Phaser from 'phaser';
import User from './User';
export default class extends User{
    constructor(scene){
        super(scene,true,1);
        this.name= 'Игрок';
        this.scene.game.emitter.on('on_cell_click', this.onCellClick, this);
    }
    onCellClick(cell){
        this.markCell(cell);
    }
}
