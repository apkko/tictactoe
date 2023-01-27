import Phaser from 'phaser';
export default class{
    constructor() {

    }

    init() {
        this.currentCount = 5;
        this.growSize = 0.7;
    }

    preload() {
      

    }

    create() {
        console.log('[Menu] create');
        this.textInfo = new Phaser.GameObjects.Text(this,this.cameras.main.centerX,this.cameras.main.centerY - 300,this.infoStr, {font: 'bold 30px Arial',fill: '#000000',wordWrap:{width:this.cameras.main.width*0.9 },align:'center'}); 
        this.textInfo.setOrigin(0.5, 0.5);
        this.add.existing(this.textInfo);
        this.addCountButtons();
        this.addSizeButtons();
        this.addPlayButton();
    }
    addPlayButton(){
        let that = this;
        let button = new Phaser.GameObjects.Sprite(this, this.cameras.main.centerX,this.cameras.main.centerY,'button_play');
        this.add.existing(button);
        button.setInteractive();
        button.on('pointerdown', () => {
            that.scene.start('Game',{winCellsLimit:this.currentCount,growSize:this.growSize});
        });
    }
    addCountButtons(){
        let that = this;
        let x = this.cameras.main.centerX - 200;
        let y = this.cameras.main.centerY;
        let text = new Phaser.GameObjects.Text(this,x,y,this.currentCount, {font: 'bold 25px Arial',fill: '#000000'}); 
        text.setOrigin(0.5, 0.5);
        this.add.existing(text);
        
        let upButton = new Phaser.GameObjects.Sprite(this, x,y - 50,'arrows');
        upButton.setFrame(0);
        this.add.existing(upButton);
        upButton.setInteractive();
        upButton.on('pointerdown', () => {
            that.currentCount +=1;
            that.currentCount = ( (that.currentCount > 10) ? 10 : that.currentCount );
            text.setText(that.currentCount);
            that.updateText();
        });
        
        let downButton = new Phaser.GameObjects.Sprite(this, x,y + 50,'arrows');
        downButton.setFrame(1);
        this.add.existing(downButton);
        downButton.setInteractive();
        downButton.on('pointerdown', () => {
            that.currentCount -=1;
            that.currentCount = ( (that.currentCount < 1) ? 1 : that.currentCount );
            text.setText(that.currentCount);
            that.updateText();
        });
    }
    addSizeButtons(){
        let that = this;
        let x = this.cameras.main.centerX + 200;
        let y = this.cameras.main.centerY;
        let text = new Phaser.GameObjects.Text(this,x,y,(this.growSize*100).toFixed(0), {font: 'bold 25px Arial',fill: '#000000'}); 
        text.setOrigin(0.5, 0.5);
        this.add.existing(text);
        
        let upButton = new Phaser.GameObjects.Sprite(this, x,y -50,'arrows');
        upButton.setFrame(0);
        this.add.existing(upButton);
        upButton.setInteractive();
        upButton.on('pointerdown', () => {
            that.growSize +=0.1;
            that.growSize = ( (that.growSize > 0.9) ? 0.9 : that.growSize );
            text.setText((that.growSize*100).toFixed(0));
            that.updateText();
        });
        
        let downButton = new Phaser.GameObjects.Sprite(this, x,y + 50,'arrows');
        downButton.setFrame(1);
        this.add.existing(downButton);
        downButton.setInteractive();
        downButton.on('pointerdown', () => {
            that.growSize -= 0.1;
            that.growSize = ( (that.growSize < 0.1) ? 0.1 : that.growSize );
            text.setText((that.growSize*100).toFixed(0));
            that.updateText();
        });
    }
    updateText(){
        this.textInfo.setText(this.infoStr);
    }
    get infoStr(){
        return  'Для победы необходимо выстроить в ряд '+this.currentCount+' клеток по горизонтали или по вертикали (диагональ в разработке). При заполнении '+(this.growSize*100).toFixed(0)+'% игрового поля оно расширяется.'
    }
}
