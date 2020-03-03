
class GridState{
    
    constructor(colorGrid, parent, lastAction, pathLength){
        this.colorGrid = colorGrid;
        this.dimension = colorGrid.length;
        this.parent= parent;
        this.lastAction = lastAction;
        this.pathLength = pathLength;
        
    }




    getPathLength(){
        return this.pathLength;
    }

    copyGrid(){
        let dim = this.colorGrid.length;
        let copyGrid = new Array(dim);
        for (var row =0; row < this.colorGrid.length; row++){
            copyGrid[row] = new Array(this.colorGrid[row].length);
            for(var col = 0; col < this.colorGrid[row].length; col++){
                copyGrid[row][col] = this.colorGrid[row][col];
            }
            
        }
            
           
        return copyGrid;
    }

    getPlayerPos(){
        let positions = new Array(0);
        for (var row = 0; row < this.colorGrid.length; row++){
            for (var col = 0; col < this.colorGrid[row].length; col++){
                if (this.colorGrid[row][col] == 0){
                    positions.push({ row: row, col: col});
                }
            }
        }
        return positions;
    }
    makeMove(color){
        let directions = [
            {y: 0, x:1},
            {y: 1, x:0},
            {y: 0, x:-1},
            {y: -1, x:0}
        ]

        let newGrid = this.copyGrid();
      
        let playerPos = this.getPlayerPos()
        
        
        while (playerPos.length >0){
            let position = playerPos.pop();
            for (var d of directions){
                
                // console.log(position.row, position.col);
                // console.log(d.y, d.x);
                let newRow = position.row + d.y;
                let newCol = position.col + d.x;
     
                if(newRow < 0 || newCol < 0 || newRow >= newGrid.length || newCol >= newGrid.length )
                    continue;
                if (newGrid[newRow][newCol]==color){
                    newGrid[newRow][newCol] = 0;
                    playerPos.push({row:newRow,col:newCol});
                }

            }
        }

        let newPathLength = this.pathLength!==null ? this.pathLength+1 : 0;
        return new GridState(newGrid, this, color, newPathLength);

    }

    generateNextStates(){
        let newStates = new Array(0);
        let nextActions = [1,2,3,4,5,6];



        const index = nextActions.indexOf(this.lastAction);
        // Last Action here is negative 1;
        // console.log("Last Action: ", index);
        if (index>-1){
            nextActions.splice(index, 1);
            
        }
        // console.log(nextActions);
        
        
        for(var i = 0; i < nextActions.length; i++){
            let color = nextActions[i];
            let s1 = this.makeMove(color);

            // TODO: make a no change function
            if (this.moveChanged(s1.getColorGrid()))
                newStates.push(s1)
        }
        return newStates;
    }

 
    isGoalState(){
        let color = this.colorGrid[0][0];

        for (var row = 0; row < this.colorGrid.length; row++) {
            for (var col = 0; col < this.colorGrid[row].length; col++) {
                if (this.colorGrid[row][col]!=color) {
                    return false;
                }
            }
        }
        return true;
    }

    getParent(){
        return this.parent;
    }

    moveChanged(grid){
        for(var row = 0; row < this.colorGrid.length; row++){
            for (var col = 0; col < this.colorGrid[row].length; col++){
                if (this.colorGrid[row][col] != grid[row][col]){
                    return true;
                }
            }
        }

        return false;
    }
    getColorGrid(){
        return this.colorGrid;
    }
    getLastAction(){
        return this.lastAction;
    }

    getAnswer(){
        let path = new Array(0);
        path.push(this.getLastAction());
        parent = this.getParent();

        while(parent!== null){
            if (parent.getLastAction() !== null){
                path.push(parent.getLastAction());
                
            }
            parent=parent.getParent();
                
        }
        path.reverse().splice(0,1);
        return path;
    }

    

}