if(Array.prototype.equals)
    console.warn("Overriding existing Array.prototype.equals. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code.");
// attach the .equals method to Array's prototype to call it on any array


Array.prototype.equals = function (array) {
    // if the other array is a falsy value, return
    if (!array)
        return false;

    // compare lengths - can save a lot of time 
    if (this.length != array.length)
        return false;

    for (var i = 0, l=this.length; i < l; i++) {
        // Check if we have nested arrays
        if (this[i] instanceof Array && array[i] instanceof Array) {
            // recurse into the nested arrays
            if (!this[i].equals(array[i]))
                return false;       
        }           
        else if (this[i] != array[i]) { 
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;   
        }           
    }       
    return true;
}
Array.prototype.containsGrid = function(grid){
    for(var i = 0; i < this.length; i++){
        if (this[i] instanceof Array )
            if (this[i].equals(grid)) return true;
    }
    return false;
}

Array.prototype.indexOfGrid = function(grid){
    for(var i = 0; i < this.length; i++){
        if (this[i].equals(grid)) return i;
    }
    return -1;
}
// Hide method from for-in loops
Object.defineProperty(Array.prototype, "equals", {enumerable: false});

var dim = 14;
var n_rows = dim;
var n_cols = dim;
var start_table = new Array (n_rows);
for (var row = 0; row < n_rows; row++) {
    start_table[row] = new Array (n_cols);
}
var colours = "blue red green yellow pink purple".split (/\s+/);

/* DOM functions. */

function create_node (type, parent)
{
    var new_node = document.createElement (type);
    parent.appendChild (new_node);
    return new_node;
}

function append_text (parent, text)
{
    var text_node = document.createTextNode (text);
    clear (parent);
    parent.appendChild(text_node);
}

function get_by_id (id)
{
    var element = document.getElementById (id);
    return element;
}

function clear (element)
{
    while (element.lastChild)
        element.removeChild (element.lastChild);
}

/* Flood fill game. */

var moves;
var max_moves = 25;
var finished;

/* Alter one element of the game table to be flooded. */

function flood_element (row, col, colour)
{
    game_table[row][col].colour = colour;
    game_table[row][col].element.className = "piece "+colour;
}
function flood_neighbours (row, col, colour){
    if (row < n_rows - 1)
        test_colour_flood (row + 1, col, colour);
    if (row > 0)
        test_colour_flood (row - 1, col, colour);
    if (col < n_cols - 1)
        test_colour_flood (row, col + 1, colour);
    if (col > 0)
        test_colour_flood (row, col - 1, colour);
}
function flood (colour, initial)
{
    if (finished)
        return;
    var old_colour = game_table[0][0].colour;
    if (! initial && colour == old_colour)
        return;
    moves++;
    append_text (get_by_id ("moves"), moves);
    /* Change the colour of all the flooded elements. */
    for (var row = 0; row < n_rows; row++) 
        for (var col = 0; col < n_cols; col++) 
            if (game_table[row][col].flooded)
                flood_element (row, col, colour);

    /* Set flooded = true for all the neighbouring boxes with the same
       colour. */
    for (var row = 0; row < n_rows; row++)
        for (var col = 0; col < n_cols; col++)
            if (game_table[row][col].flooded)
                flood_neighbours (row, col, colour);
    if (all_flooded ()) {
        finished = true;
        if (moves <= max_moves) {
            alert ("You win.");
        } else {
            alert ("Finished, at last!");
        }
    } else if (moves == max_moves) {
        alert ("You lost.");
    }
}

function test_colour_flood (row, col, colour)
{
    if (game_table[row][col].flooded)
        return;
    if (game_table[row][col].colour == colour) {
        game_table[row][col].flooded = true;
        /* Recurse to make sure that we get any connected neighbours. */
        flood_neighbours (row, col, colour);
    }
}

function all_flooded ()
{
    for (var row = 0; row < n_rows; row++) {
        for (var col = 0; col < n_cols; col++) {
            if (! game_table[row][col].flooded) {
                return false;
            }
        }
    }
    return true;
}



function help ()
{
    alert ("Press the circle buttons to flood fill the image\n"+
           "with the colour from the top left corner. Fill the\n"+
           "entire image with the same colour in twenty-five or\n"+
           "fewer flood fills.");
}

/* Create a random colour for "create_table". */

function random_colour ()
{
    var colour_no = Math.floor (Math.random () * 6);
    return colours[colour_no];
}

/* The "state of play" is stored in game_table. */

var game_table = new Array (n_rows);
for (var row = 0; row < n_rows; row++) {
    game_table[row] = new Array (n_cols);
    for (var col = 0; col < n_cols; col++) {
        game_table[row][col] = new Object ();
    }
}

/* Create the initial random table. */

function create_table ()
{
    moves = -1;
    finished = false;
    var game_table_element = get_by_id ("game-table-tbody");
    for (var row = 0; row < n_rows; row++) {
        var tr = create_node ("tr", game_table_element);
        for (var col = 0; col < n_cols; col++) {
            var td = create_node ("td", tr);
            var colour = random_colour ();
            td.className = "piece " + colour;
            game_table[row][col].colour = colour;
            start_table[row][col] = colour;
            game_table[row][col].element = td;
            game_table[row][col].flooded = false;
        }
    }
    /* Mark the first element of the table as flooded. */
    game_table[0][0].flooded = true;
    /* Initialize the adjacent elements with the same colour to be flooded
       from the outset. */
    flood (game_table[0][0].colour, true);
    append_text (get_by_id("max-moves"), max_moves);
}

function copyGrid(){
    var copyGrid = new Array(this.colorGrid.length);
    for (var row =0; row < this.colorGrid.length; row++)
        copyGrid[row] = this.colorGrid[row]
    return copyGrid;
}

function new_game ()
{
    clear (get_by_id ("game-table-tbody"));
    create_table ();
}

// Our stuff


function translateTable(){
    let translateTable = new Array(game_table.length);
    for (var i = 0; i < game_table.length; i++){
        translateTable[i]= new Array(game_table.length);
    }

   
   

    for (var row = 0; row < translateTable.length; row++){
        for(var col = 0; col < game_table.length; col++){
      
            
            if (game_table[row][col].colour=="blue"){
                translateTable[row][col] = 1;
            }
            if (game_table[row][col].colour=="red"){
                translateTable[row][col] = 2;
            }
            if (game_table[row][col].colour=="green"){
                translateTable[row][col] = 3;
            }
            if (game_table[row][col].colour=="yellow"){     
                translateTable[row][col] = 4;
            }
            if (game_table[row][col].colour=="pink"){
                translateTable[row][col] = 5;
            }
            if (game_table[row][col].colour=="purple"){
                translateTable[row][col] = 6;
            }
            
        }
    }

  
    return translateTable;


}


function test(){
    let numTable = [[0,2,3],
                    [4,5,0],
                    [4,5,0]];
    let initialGrid = new GridState(numTable, null, null, 0);
    
    // console.log(heuristicColorsLeft(new GridState(numTable, null, null, 0)));
    // console.log(numTable.containsGrid([1,2,3]));
}
function answerSetup(){
   
   // Translating 2d Object Array into 2d Integer Array
   // This is so that copying grid states is possible



    let numTable = translateTable();
    // let numTable = [[0, 0, 0, 0, 0, 0, 0, 0, 2, 6, 4, 1, 6, 1],
    //          [2, 6, 6, 1, 3, 2, 1, 6, 2, 0, 1, 2, 5, 5],
    //          [5, 1, 1, 3, 5, 3, 6, 3, 6, 0, 2, 2, 4, 3],
    //          [1, 4, 5, 6, 1, 4, 4, 1, 1, 0, 1, 3, 4, 6],
    //          [3, 4, 5, 1, 1, 4, 1, 6, 1, 0, 5, 4, 5, 5],
    //          [1, 1, 4, 6, 5, 2, 3, 2, 1, 0, 4, 5, 6, 1],
    //          [2, 4, 6, 2, 3, 6, 3, 4, 6, 0, 3, 2, 6, 6],
    //          [5, 6, 4, 2, 5, 6, 1, 6, 3, 0, 1, 2, 4, 6],
    //          [2, 5, 1, 3, 4, 2, 4, 1, 6, 5, 6, 1, 1, 2],
    //          [2, 2, 6, 3, 3, 5, 5, 3, 2, 4, 4, 1, 6, 5],
    //          [6, 3, 2, 4, 1, 2, 2, 4, 1, 6, 1, 1, 5, 2],
    //          [4, 6, 6, 6, 2, 5, 2, 4, 6, 2, 1, 2, 3, 3],
    //          [4, 4, 1, 6, 2, 2, 5, 6, 2, 1, 2, 2, 1, 4],
    //          [1, 1, 4, 6, 5, 3, 5, 1, 5, 5, 2, 5, 6, 6]];

    
    let initialColor = numTable[0][0]
    numTable[0][0] = 0;
    
    initialGrid = new GridState(numTable, null, null, 0).makeMove(initialColor);

    // var start = new Date().getTime();
    // answerGrid = AStar(initialGrid, heuristicBottomRight, goalBottomRight, avoidBackTrack = false, filtering=true);
    // finalGrid = AStar(answerGrid, heuristicColorsLeft, goalFlooded, avoidBackTrack=false, filtering=true);
    // var end = new Date().getTime()


    // var start = new Date().getTime();
    // console.log("Started...")
    // answerGrid = AStar(initialGrid, heuristicBottomRight, goalBottomRight, avoidBackTrack = false, filtering=true);
    // finalGrid = AStar(answerGrid, heuristicColorsLeft, goalFlooded, avoidBackTrack=false, filtering=true);
    // var end = new Date().getTime()
    var start = new Date().getTime();
    console.log("Started...")
    answerGrid = AStar(initialGrid, heuristicAreaLeft, avoidBackTrack = false, filtering=true);
    
    var end = new Date().getTime()
    
    console.log("The Answer Grid", answerGrid);
    console.log(answerGrid.getAnswer());
    console.log("Time: " + (end-start)/1000);

}

function goalFlooded(gridState){
    let color = gridState.colorGrid[0][0];

        for (var row = 0; row < gridState.colorGrid.length; row++) {
            for (var col = 0; col < gridState.colorGrid[row].length; col++) {
                if (gridState.colorGrid[row][col]!=color) {
                    return false;
                }
            }
        }
        return true;
}
function goalBottomRight(gridState){
    return gridState.colorGrid[gridState.dimension-1][gridState.dimension-1] == 0;
}

function heuristicZero(gridState){
    return 0;
}
function heuristicAreaLeft(gridState){
    return gridState.dimension * gridState.dimension - gridState.getPlayerPos().length;
}
function heuristicBottomRight(gridState){
    
    let dim = gridState.dimension;
   

    let minDistance = Number.MAX_SAFE_INTEGER;
    let playerPos = gridState.getPlayerPos();
    

    for(var pos of playerPos){
        
        minDistance = Math.min((dim - pos.row) + (dim - pos.col), minDistance);
    }
    return minDistance;
}

function heuristicColorsLeft(gridState){
    // for (var row = 0; row < gridState.dim; row++){
    //     for (var col = 0; row < gridState.dim; col++){
    //         if (gridState[row][col] == 0) break;
    //         if 

    //     }
    // }
    
    let numColors = 0;
    colors = [1,2,3,4,5,6]

   
    for (var c of colors){
        for (var row of gridState.colorGrid){
            if (row.indexOf(c) > -1){
                // colors.splice(colors.indexOf(c),1);
                numColors+=1;
                
                break;
            }
        }
    }
    return numColors;
}

function heuristicCombine(gridState){
    return Math.max(heuristicBottomRight(gridState), heuristicColorsLeft(gridState));
}
function AStar (
    initialState,
    heuristicFunction,
    // isGoalState,
    avoidBackTrack = false,
    filtering = false,
    cutoff = Number.MAX_SAFE_INTEGER,
    counter = {
        numEnqueues: 0,
        numExtends: 0
    }
){
    let frontier = new PriorityQueue()
    frontier.enqueue(initialState, initialState.getPathLength() + heuristicFunction(initialState))
    extended = new Array(0);

    while (!frontier.isEmpty()){
        qElement = frontier.dequeue();
        extNode = qElement.element;
        counter.numExtends += 1;

        // console.log(extNode);
        // if (isGoalState(extNode)){
        //     return extNode;
        // }

        if(extNode.isGoalState()){
            return extNode;
        }

            

        
        
        var enqueue;
        
        
       
        if (filtering){
            if (!extended.containsGrid(extNode.colorGrid)){
                extended.push(extNode.colorGrid);
                enqueue = extNode.generateNextStates();
            } else{
                // console.log("Filtered")
                continue;
            }
        } else{
            enqueue = extNode.generateNextStates();
        }
        

        // if (avoidBackTrack){
            
        //     // console.log(extNode.getParent());
        //     if(extNode.getParent() !== null){
        //         const index = enqueue.containsGrid(extNode.getParent().colorGrid);
            
        //         if (index > -1) {
        //             // console.log("avoid backtrack feature works");
        //             enqueue.splice(index, 1);
        //         }
        //     }
        // }

        if (cutoff!=Number.MAX_SAFE_INTEGER){
            for (var node of enqueue){
                if (node.getPathLength() > cutoff){
                    const index = enqueue.indexOf(5);
                    if (index > -1) {
                        array.splice(index, 1);
                    }
                }
                    
            }
        }

        counter.numEnqueues += enqueue.length;
        for (var node of enqueue){
            frontier.enqueue(node,node.getPathLength()+heuristicFunction(node));
        }
        
    }
    return null;
   

    

    // initialGrid = new GridState(game_table, null, null, 0);
    // console.log(initialGrid);
    // nextStates = initialGrid.generateNextStates();
    // console.log(nextStates);




}
