import Phaser from 'phaser';
import Cell from './Cell';
export default class extends Phaser.GameObjects.Container {
    constructor(scene,x,y,countX,countY,winLength){
        super(scene, x, y);
        this.scene = scene;
        this.countX = countX;
        this.countY = countY;
        this.winLength = winLength;
        ////
        this.startCountX = this.countX;
        this.startCountY = this.countY;
        this.cells = [];
        this.turnOwnerPlayer = true;
        this.create();
    }
    async create(){
        
        await this.updateCells();
        //this.scene.game.emitter.on('on_select_cell_number', this.onSelectCellNumber, this);
        //await this.wait(500);
        //await this.grow();

        //await this.wait(1000);
        //this.grow();
        
        this.winText = new Phaser.GameObjects.Text(this.scene,0,-500, '', {font: 'bold 100px Arial',fill: 'white'}); 
        this.winText.setOrigin(0.5, 0.5);
        this.add(this.winText);
        this.winText.setVisible(false);
        
        this.scene.game.events.on('on_add_mark', this.onAddMark, this);
        this.start();
    }
    start(){
        this.inputEnable();
    }
    async updateCells(){
        let cellsSize = 50;
        let xPosStart =  (this.startCountX - this.countX)/2; 
        let yPosStart =  (this.startCountY - this.countY)/2; 
        for(let yPos = yPosStart ; yPos < (this.countY + yPosStart); yPos ++){
            for(let xPos = xPosStart; xPos < (this.countX + xPosStart); xPos ++){
                let cell = this.getCellByPos(xPos,yPos);
                if(!cell){
                    let y = - (((this.countY + yPosStart*2)* ( cellsSize ))/2 - cellsSize/2) + (yPos*(cellsSize));
                    let x = - (((this.countX + xPosStart*2) * ( cellsSize  ))/2 - cellsSize/2) + (xPos*(cellsSize));
                    cell = new Cell(this.scene,x,y,xPos,yPos,cellsSize);
                    this.add(cell);
                    this.cells.push(cell);
                    await cell.appearance();
                }
                
            }
        }
  
    }
    async grow(){
        this.inputDisable()
        this.countY +=2;
        this.countX +=2;
        await this.updateCells();
        this.inputEnable();
    }
    async onAddMark(cell,isPlayer){
        this.inputDisable();
        await this.wait(250);
        ///Проверка на победу
        //console.log('cell',cell)
        
        let playerType = isPlayer ? 'PLAYER' : 'BOT';
        let horCount = this.getHorisontalMarkedCells(cell.xPos,playerType).length;
        let verCount = this.getVerticalMarkedCells(cell.yPos,playerType).length;
        if( (horCount == this.winLength) || (verCount == this.winLength) ){
            this.win(playerType);
            //console.log('VICTORI!');
        }else{
            //console.log(' horCount verCount this.countX this.countY',horCount,verCount,this.countX,this.countY)
            ///Если поставил игрок отключаем управление и ждем когда сходит бот
            

            /////Проверка на увеличение размера
            if(this.getEmplyCells().length < (this.cells.length*0.3))
                await this.grow();
            await this.wait(1000);


            ///Если ходил игрок - ходит бот
            if(isPlayer)
                await this.botMove();
            else
                this.inputEnable();
        }
        
    }
    async win(winner){
        this.inputDisable();
        this.winText.setText(winner+' is WIN!')
        this.winText.setVisible(true);
    }
    async playerMove(cell){
        if(this.turnOwnerPlayer){
            await cell.setMark(true);
        }
            
    }
    async botMove(){
        let moves = [];
        let cells = this.getEmplyCells();
        let cell = false;
        let xPosStart =  (this.startCountX - this.countX)/2; 
        let yPosStart =  (this.startCountY - this.countY)/2; 
        for(let xPos = xPosStart ; xPos < (this.countX + xPosStart); xPos ++){
            let horCount = this.getHorisontalMarkedCells(xPos,'PLAYER').length;
            let horNotMarked = this.getHorisontalNotMarkedCells(xPos,'PLAYER');
            console.log('horCount horNotMarked',horCount,horNotMarked.length)
            if( ((horCount + 1) == this.winLength) && (horNotMarked.length == 1) ){
                /*
                moves.push({
                    cell:horNotMarked[0],
                })
                */
                cell = horNotMarked[0];
            }
        }
        for(let yPos = yPosStart ; yPos < (this.countY + yPosStart); yPos ++){
            let verCount = this.getVerticalMarkedCells(yPos,'PLAYER').length;
            let verNotMarked = this.getVerticalNotMarkedCells(yPos,'PLAYER');
            console.log('verCount horNotMarked',verCount,verNotMarked.length)
            if( ((verCount + 1) == this.winLength) && (verNotMarked.length == 1) ){
                /*
                moves.push({
                    cell:horNotMarked[0],
                })
                */
                cell = verNotMarked[0];
            }
        }
        
        //let verCount = this.getVerticalMarkedCells(cell.yPos,'PLAYER').length;
        
        while(!cell){
            cell = cells[this.randomInteger(0, cells.length - 1)];
            ////Какието проверки можно стоит ли ставить сюда метку
        }
        await cell.setMark(false);
    }
    getEmplyCells(){
        let cells = [];
        for(let i in this.cells){
            if(this.cells[i].isEmpty())
                cells.push(this.cells[i]);
        }
        return cells;
    }
    getCellByPos(xPos,yPos){
        for(let i in this.cells){
            if( (this.cells[i].xPos == xPos) && (this.cells[i].yPos == yPos) )
                return this.cells[i];
        }
        return false;
    }
    async wait(delay){
        let that = this;
        return new Promise((resolve) => {
            that.scene.time.addEvent({
                delay: delay,
                callback: () => resolve(),
            });
        });
    }
    getNeighborHorisontalMarkedCells(neighborLength){
        let cells = [];
        for(let i in this.cells){
            if()
           if( (this.cells[i].xPos == xPos )&& (this.cells[i].isMarked) && (this.cells[i].markOwner == owner))
               cells.push(this.cells[i]);
       } 
        return cells;
    }
    getHorisontalNotMarkedCells(xPos,owner){
        let cells = [];
        for(let i in this.cells){
           if( (this.cells[i].xPos == xPos )&& (!this.cells[i].isMarked))
               cells.push(this.cells[i]);
       } 
        return cells;
    }
    getVerticalNotMarkedCells(yPos,owner){
        let cells = [];
        for(let i in this.cells){
           if( (this.cells[i].yPos == yPos )&& (!this.cells[i].isMarked))
               cells.push(this.cells[i]);
       } 
        return cells;
    }
    getHorisontalMarkedCells(xPos,owner){
        let cells = [];
        for(let i in this.cells){
           if( (this.cells[i].xPos == xPos )&& (this.cells[i].isMarked) && (this.cells[i].markOwner == owner))
               cells.push(this.cells[i]);
       } 
        return cells;
    }
    getVerticalMarkedCells(yPos,owner){
        let cells = [];
        for(let i in this.cells){
            //console.log('this.cells[i].yPos yPos',this.cells[i].yPos,yPos)
            //console.log('this.cells[i].markOwner owner',this.cells[i].markOwner,owner)
            //console.log('this.cells[i].isMarked',this.cells[i].isMarked)
           if( (this.cells[i].yPos == yPos ) && (this.cells[i].isMarked) && (this.cells[i].markOwner == owner))
               cells.push(this.cells[i]);
       } 
        return cells;
    }
    getHorisontalMarkedCellsForCell(cell,owner){
        let cells = [];
        for(let i in this.cells){
           if( (this.cells[i].xPos == cell.xPos ) && (this.cells[i] !== cell) && (this.cells[i].isMarked) && (this.cells[i].markOwner == owner))
               cells.push(this.cells[i]);
       } 
        return cells;
    }
    getVerticalMarkedCellsForCell(cell){
        let cells = [];
        for(let i in this.cells){
           if( (this.cells[i].yPos == cell.yPos ) && (this.cells[i] !== cell)  && (this.cells[i].isMarked) && (this.cells[i].markOwner == owner))
               cells.push(this.cells[i]);
       } 
        return cells;
    }
    inputEnable(){
        this.cells.forEach(function(cell){
            cell.inputEnable();
        })
    }
    inputDisable(){
        this.cells.forEach(function(cell){
            cell.inputDisable();
        })
    }
    randomInteger(min, max) {
        var rand = min - 0.5 + Math.random() * (max - min + 1)
        rand = Math.round(rand);
        return Number(rand);
    }

}
