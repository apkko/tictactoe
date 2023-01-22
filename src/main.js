import Phaser from 'phaser';
import config from './config';

// scenes
import Boot from './scenes/Boot';
import Menu from './scenes/Menu';
import Game from './scenes/Game';

class GameInstance extends Phaser.Game {
    constructor(config) {
        super(config);
        this.scene.add('Boot', Boot);
        this.scene.add('Menu', Menu);
        this.scene.add('Game', Game);
    }
}

window.onload = () => {
    let game = new GameInstance(config);
    game.scene.start('Boot');
};
