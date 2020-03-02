class GridState{
    
    constructor(colorGrid, parent, lastAction, pathLength){
        this.colorGrid = colorGrid;
        this.parent= parent;
        this.lastAction = lastAction;
        this.pathLength = pathLength;
        this.playerChoice = colorGrid[0][0];
    }


    // printColorGrid(){
    //     let line = "";
    //     for(var i = 0; i < grid.length; i++){
    //         for(var j = 0; j < grid[i].length; j++){
    //             line += grid[i][j] + " ";
    //         }
    //         console.log(line);
    //     }
    // }
    // test_colour_flood (grid,row, col, colour){
    //     if (grid[row][col].flooded)
    //         return;
    //     if (grid[row][col].colour == colour) {
    //         grid[row][col].flooded = true;
    //         /* Recurse to make sure that we get any connected neighbours. */
    //         this.flood_neighbours (grid, row, col, colour);
    //     }
    // }

    // flood_neighbours (grid, row, col, colour){
    //     if (row < n_rows - 1)
    //         this.test_colour_flood (grid, row + 1, col, colour);
    //     if (row > 0)
    //         this.test_colour_flood (grid, row - 1, col, colour);
    //     if (col < n_cols - 1)
    //         this.test_colour_flood (grid, row, col + 1, colour);
    //     if (col > 0)
    //         this.test_colour_flood (grid, row, col - 1, colour);
    // }
    // flood_element (grid, row, col, colour){
    //     grid[row][col].colour = colour;
    //     grid[row][col].element.className = "piece "+colour;
    // }
    // flood(colour){

    //     // Change Color of Initial Player

    //     let nextGrid = this.copyColorGrid();
    //     for(var row=0; row < n_rows; row++)
    //         for(var col = 0; col < n_cols; col++)
    //             if(nextGrid[row][col].flooded)
    //                 this.flood_element(nextGrid, row, col, colour);
    //     // Change color of neighbors
    //     for (var row = 0; row < n_rows; row++)
    //         for (var col = 0; col < n_cols; col++)
    //             if (nextGrid[row][col].flooded)
    //                 this.flood_neighbours (nextGrid, row, col, colour);

    //     return nextGrid;

        
    // }

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
        console.log(playerPos)
        
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



        const index = nextActions.indexOf(self.lastAction);
        nextActions.splice(index, 1);
        
        for(var i = 0; i < nextActions.length; i++){
            let color = nextActions[i];
            let s1 = this.flood(color);
            newStates.push(s1)
        }
        return newStates;
    }

 
    all_flooded (){
        for (var row = 0; row < n_rows; row++) {
            for (var col = 0; col < n_cols; col++) {
                if (! game_table[row][col].flooded) {
                    return false;
                }
            }
        }
        return true;
    }

}