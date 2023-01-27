import Phaser from 'phaser';
import Grid from '../modules/Grid';
import Player from '../modules/Player';
import Bot from '../modules/Bot';
export default class{
    constructor() {

    }

    init( data ) {
        this.winCellsLimit = data.winCellsLimit;
        this.growSize = data.growSize;
        this.users = [];
        this.turnOwner = null;
        this.turnPause = null;
    }

    preload() {
      

    }

    create() {
        console.log('[Game] create');
        this.game.emitter.removeAllListeners();
        /////Сетка
        this.grid = new Grid(this,this.cameras.main.centerX,this.cameras.main.centerY,3,3,this.growSize);
        this.add.existing(this.grid);
        
        this.turnOwnerText = new Phaser.GameObjects.Text(this,this.cameras.main.centerX,25, '', {font: 'bold 50px Arial',fill: 'black'}); 
        this.turnOwnerText.setOrigin(0.5, 0.5);
        this.add.existing(this.turnOwnerText);
        this.turnOwnerText.setVisible(false);
        ///Сообщение о победе
        this.winText = new Phaser.GameObjects.Text(this,this.cameras.main.centerX,this.cameras.main.height - 100, '', {font: 'bold 100px Arial',fill: '#00910E'}); 
        this.winText.setOrigin(0.5, 0.5);
        this.add.existing(this.winText);
        this.winText.setVisible(false);
        this.addMenuButton()
        ///////////////////////////////
        this.userPlayer = new Player(this);
        this.userBot = new Bot(this);
        this.users = [this.userPlayer,this.userBot];
        this.game.emitter.on('on_add_mark', this.onAddMark, this);
        this.start();
    }
    start(){
        this.turnStart();
    }
    addMenuButton(){
        let that = this;
        let button = new Phaser.GameObjects.Sprite(this, this.cameras.main.width - 100,50,'button_menu');
        this.add.existing(button);
        button.setInteractive();
        button.on('pointerdown', () => {
            that.scene.start('Menu');
        });
    }
    turnEnd(){
        
        ///Конец хода
        this.inputDisable();
        //this.turnPause = true;
        this.turnOwnerText.setVisible(false);
    }
    async turnStart(){
        ///Начало хода
        ///Если последний из массива юзер 
        if(!this.turnOwner){
            ////Задаем кто ходит первый (возхможно ранддом)
            this.turnOwner = this.users[0];
        }else if(this.users.indexOf(this.turnOwner) === this.users.length -1){
            this.turnOwner = this.users[0];
        }else this.turnOwner = this.users[this.users.indexOf(this.turnOwner) + 1];
        console.log('Ходит '+this.turnOwner.name)
        this.turnOwnerText.setText('Ходит '+this.turnOwner.name);
        this.turnOwnerText.setVisible(true);
        //this.turnPause = false;
        
        ///Если ход бота - он ходит
        if(!this.turnOwner.isPlayer){
            await this.wait(1000);
            await this.turnOwner.makeMove();
            
        }
        else
            this.inputEnable();
    }
    async onAddMark(cell,owner){
        
        this.turnEnd();
        
        await this.wait(250);
        ///Проверка на победу
        //console.log('cell',cell)
        if(this.checkWin(cell,owner)){
            this.win(owner);
        }else{
            await this.grid.grow();
            await this.wait(1000);
            /////Начало следущего хода
            await this.turnStart();
        }
    }
    checkWin(cell,owner){
        let limitCount = this.winCellsLimit;
        let maxNeigbors = [];
        maxNeigbors  = owner.getMaxNeigbors(cell);
        if(maxNeigbors.length >= limitCount){
            return true;
        }
        return false;
    }
    async win(winner){
        console.log('WIN');
        this.inputDisable();
        this.winText.setText(winner.name+' Победил!!!')
        this.winText.setVisible(true);
    }
    inputEnable(){
        this.grid.inputEnable();
    }
    inputDisable(){
        this.grid.inputDisable();
    }
    async wait(delay){
        let that = this;
        return new Promise((resolve) => {
            that.time.addEvent({
                delay: delay,
                callback: () => resolve(),
            });
        });
    }
}
