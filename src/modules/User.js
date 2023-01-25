import Phaser from 'phaser';

export default class{
    constructor(scene,isPlayer,markType){
        this.scene = scene;
        this.isPlayer = isPlayer;
        this.markType = markType;
        this.markedCells = [];
    }
    markCell(cell){
        ////Проверяем чей ход - если ход этого экзкмпляра то ставим марку
        if(this.scene.turnOwner === this)
            cell.setMark(this);    
    }
    getMaxNeigbors(cell){
        ///Получаем максимальное количество соседствующих маркированных клеток
        let horCells = this.getHorizontalCells(cell);
        //console.log('horCells',horCells);
        let verCells = this.getVerticalCells(cell);
        //console.log('verCells',verCells);
        let horNeigbors = [];
        let verNeigbors = [];
        this.getHorizontalNeigbors(horCells,cell,horNeigbors);
        //console.log('horNeigbors',horNeigbors);
        this.getVerticalNeigbors(verCells,cell,verNeigbors);
        //console.log('verNeigbors',verNeigbors);
        let maxNeigbors = horNeigbors;
        if(verNeigbors.length > maxNeigbors.length)
            maxNeigbors = verNeigbors;
        return maxNeigbors;
        
    }
    getHorizontalNeigbors(cells,cell,neigbors){
        this.addToArrayIfUnique(cell,neigbors);
        for(let i in cells){
            ///Ищим соседние клетки и соседей соседей
            if( (( cells[i].xPos == (cell.xPos + 1) ) || ( cells[i].xPos == (cell.xPos - 1) )) && (!this.inArray(cells[i],neigbors)) ){
                //console.log('h:cells[i].xPos,cells[i].yPos',cells[i].xPos,cells[i].yPos)
                //console.log('h:cell.xPos,cell.yPos',cell.xPos,cell.yPos)
                
                this.getHorizontalNeigbors(cells,cells[i],neigbors);
            }
        }  
        return;
    }
    getVerticalNeigbors(cells,cell,neigbors){
        this.addToArrayIfUnique(cell,neigbors);
        for(let i in cells){
            ///Ищим соседние клетки и соседей соседей
            if( (( cells[i].yPos == (cell.yPos + 1) ) || ( cells[i].yPos == (cell.yPos - 1) )) && (!this.inArray(cells[i],neigbors))){
                //console.log('v:cells[i].xPos,cells[i].yPos',cells[i].xPos,cells[i].yPos)
                //console.log('v:cell.xPos,cell.yPos',cell.xPos,cell.yPos)
                this.getVerticalNeigbors(cells,cells[i],neigbors);
            }
        }  
        return;
    }
    /*
    getHorizontalNeigborsForCell(cells,cell){
        let neigbors = [];
        for(let i in cells){
            ///Ищим соседние клетки
            if( ( cells[i].xPos == (cell.xPos + 1) ) || ( cells[i].xPos == (cell.xPos - 1) ))
                neigbors.push(cells[i]);
        }  
        return neigbors;
    }
    getVerticalNeigborsForCell(cells,cell){
        let neigbors = [];
        for(let i in cells){
            ///Ищим соседние клетки
            if( ( cells[i].yPos == (cell.yPos + 1) ) || ( cells[i].yPos == (cell.yPos - 1) ))
                neigbors.push(cells[i]);
        }  
        return neigbors;
    }
    */
    getHorizontalCells(cell){
        let cells = [];
        for(let i in this.markedCells){
            if(this.markedCells[i].yPos === cell.yPos)
                cells.push(this.markedCells[i]);
        }  
        return cells;
    }
    getVerticalCells(cell){
        let cells = [];
        for(let i in this.markedCells){
            if(this.markedCells[i].xPos === cell.xPos)
                cells.push(this.markedCells[i]);
        }  
        return cells;
    }
    getBestMove(){
        ////////вычисляем на какую клетку делать ход
        let count  = 0;
        let cell = null;
        let emptyCells = this.getAnyNeigborsEmpty();
        //console.log('emptyCells',emptyCells)
        for(let i in emptyCells){
            this.markedCells.push(emptyCells[i]);
            let neigbors = this.getMaxNeigbors(emptyCells[i]);
            if(count < neigbors.length){
                count = neigbors.length;
                cell = emptyCells[i];
            }
           // console.log('neigbors neigbors.length',neigbors,neigbors.length)
            this.markedCells.splice(this.markedCells.length -1,1);
        }
        return {cell:cell,count:count}
    }
    getAnyNeigborsEmpty(){
        let allNeigborsCells = [];
        for(let i in this.markedCells){
            let neigborsCells =  this.scene.grid.getNeigborsEmptyCells(this.markedCells[i]);
            //console.log('neigborsCells',neigborsCells)
            for(let j in neigborsCells){
                this.addToArrayIfUnique(neigborsCells[j],allNeigborsCells);
            }
            
        }
        return allNeigborsCells;
    }
    addToArrayIfUnique(obj,array){
        let isInArray = false;
        for(let i in array){
            if(array[i] === obj)
                isInArray = true;
        }  
        if(!isInArray)
            array.push(obj);
    }
    inArray(obj,array){
        for(let i in array){
            if(array[i] === obj)
                return true;
        }  
        return false;
    }
    randomInteger(min, max) {
        var rand = min - 0.5 + Math.random() * (max - min + 1)
        rand = Math.round(rand);
        return Number(rand);
    }
}
