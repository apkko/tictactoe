import Phaser from 'phaser';
export default class extends Phaser.GameObjects.Container {
    
    constructor(scene,x,y,xPos,yPos,size){
        super(scene, x, y);
        this.scene = scene;
        this.size = size;
        this.xPos = xPos;
        this.yPos = yPos;
        this.markOwner = null;
        this.isMarked = false;
        this.create();
    }
    create(){
        let calor = 0xFFFFFF;
        
        this.bg = new Phaser.GameObjects.Sprite(this.scene, 0,0, 'cell');
        
        this.bg.displayWidth = this.size;
        this.bg.displayHeight = this.size;
        
        this.border = new Phaser.GameObjects.Rectangle(this.scene,0,0,this.size,this.size,0x000000,0.5);
        this.border.setStrokeStyle(2, 0x722D00);
        
        this.markImage = new Phaser.GameObjects.Sprite(this.scene, 0,0, 'marks');
        this.markImage.displayWidth = this.size;
        this.markImage.displayHeight = this.size;
        this.markImage.setVisible(false);
        
        //this.bg.setInteractive({ useHandCursor: true });
        this.bg.on('pointerdown', () => {
            this.onClick();
        });
        this.add(this.bg);
        this.add(this.border);
        this.add(this.markImage);
        this.markImage.setScale(0);
        this.setScale(0);
        //this.setVisible(false);
    }

    isEmpty(){
        if(!this.isMarked){
            return true;
        }
    }
    async onClick(){
        await this.setMark(true);
    }
    async setMark(isPlayer){
        
        if(!this.isMarked){
            let frame = 1;
            if(isPlayer){
                frame = 0;
                this.markOwner = 'PLAYER';
            }else{
                this.markOwner = 'BOT';
            }
            this.isMarked = true;
            this.markImage.setFrame(frame);
            this.markImage.setVisible(true);
            this.scene.game.events.emit('on_add_mark',this,isPlayer);
            this.showMark();
        }
    }
    async appearance() {
        let that = this;
        return new Promise((resolve) => {
            that.scene.tweens.add({
                targets: that,
                scale: 1,
                duration: 100,
                ease: Phaser.Math.Easing.Back.Out,
                //ease :Phaser.Math.Easing.Linear,
                onStart:function(){
                    //that.setVisible(true);
                },
                onComplete: () => resolve(),
            });
        });
    }
    async showMark(){
        let that = this;
        return new Promise((resolve) => {
            that.scene.tweens.add({
                targets: that.markImage,
                scale: 1,
                duration: 250,
                ease: Phaser.Math.Easing.Back.Out,
                //ease :Phaser.Math.Easing.Linear,
                onStart:function(){
                    //that.setVisible(true);
                },
                onComplete: () => resolve(),
            });
        });
    }
    inputEnable(){
        this.bg.setInteractive({ useHandCursor: true });
    }
    inputDisable(){
        this.bg.disableInteractive();
    }
    
    
}
