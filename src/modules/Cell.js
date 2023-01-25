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
        
        this.border = new Phaser.GameObjects.Rectangle(this.scene,0,0,this.size,this.size,0x000000,0);
        this.border.setStrokeStyle(2, 0x000000);
        
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
        this.scene.game.events.emit('on_cell_click',this);
        //await this.setMark(true);
    }
    async setMark(user){
        
        if(!this.isMarked){
            this.isMarked = true;
            this.markOwner = user;
            this.markOwner.markedCells.push(this);
            let frame = this.markOwner.markType;
            this.markImage.setFrame(frame);
            this.markImage.setVisible(true);
            this.scene.game.events.emit('on_add_mark',this,this.markOwner);
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
