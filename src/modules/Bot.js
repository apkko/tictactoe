import Phaser from 'phaser';
import User from './User';
export default class extends User{
    constructor(scene){
        super(scene,false,0);
        this.name= 'Бот';
    }
    makeMove(){
        let limitCount = this.scene.winCellsLimit;
        ////////вычисляем на какую клетку делать ход
        
        let cells = this.scene.grid.getEmplyCells();
        let cell = cells[this.randomInteger(0, cells.length - 1)];
        
        ///
        //let emptyCells = this.scene.grid.getEmplyCells();
        let bestMove = this.getBestMove();
        let opponentBestMove = this.scene.userPlayer.getBestMove();
        //console.log('bestMove.count',bestMove.count)
        //console.log('opponentBestMove.count',opponentBestMove.count)
        //console.log('limitCount',limitCount)
        if(bestMove.count == limitCount){
            cell = bestMove.cell;
        }else if(opponentBestMove.count == limitCount){
            cell = opponentBestMove.cell;
        }else if(bestMove.count > 0){
            cell = bestMove.cell;
        }
        this.markCell(cell);
    }
    
    
}
