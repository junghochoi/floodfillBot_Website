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

var dim;
var dim = dim;
var dim = dim;
// var start_table = new Array (dim);
// for (var row = 0; row < dim; row++) {
//     start_table[row] = new Array (dim);
// }
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
    if (row < dim - 1)
        test_colour_flood (row + 1, col, colour);
    if (row > 0)
        test_colour_flood (row - 1, col, colour);
    if (col < dim - 1)
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
    for (var row = 0; row < dim; row++) 
        for (var col = 0; col < dim; col++) 
            if (game_table[row][col].flooded)
                flood_element (row, col, colour);

    /* Set flooded = true for all the neighbouring boxes with the same
       colour. */
    for (var row = 0; row < dim; row++)
        for (var col = 0; col < dim; col++)
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
    for (var row = 0; row < dim; row++) {
        for (var col = 0; col < dim; col++) {
            if (! game_table[row][col].flooded) {
                return false;
            }
        }
    }
    return true;
}




/* Create a random colour for "create_table". */

function random_colour ()
{
    var colour_no = Math.floor (Math.random () * 6);
    return colours[colour_no];
}

/* The "state of play" is stored in game_table. */

var game_table;
// = new Array (dim);
// for (var row = 0; row < dim; row++) {
//     game_table[row] = new Array (dim);
//     for (var col = 0; col < dim; col++) {
//         game_table[row][col] = new Object ();
//     }
// }

/* Create the initial random table. */

function create_table ()
{
    moves = -1;
    finished = false;
    var game_table_element = get_by_id ("game-table-tbody");
    for (var row = 0; row < dim; row++) {
        var tr = create_node ("tr", game_table_element);
        for (var col = 0; col < dim; col++) {
            var td = create_node ("td", tr);
            var colour = random_colour ();
            td.className = "piece " + colour;
            game_table[row][col].colour = colour;
            // start_table[row][col] = colour;
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
    console.clear();
    var d = Number(get_by_id("dimension").value);
    if (d < 3 || d > 15) {
        alert("Dimension Field must in [3,15]");
        return;
    }
    dim = d;

    game_table = new Array (d);
    for (var row = 0; row < d; row++) {
        game_table[row] = new Array (d);
        for (var col = 0; col < d; col++) {
            game_table[row][col] = new Object ();
        }
    }
    
    clear (get_by_id ("game-table-tbody"));
    if (get_by_id("game-answer") != null)  clear (get_by_id ("game-answer"));
   
    clear (get_by_id ("timer"));
    clear (get_by_id("automate"));
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
    console.log("test");
    // let numTable = [[0,2,3],
    //                 [4,5,0],
    //                 [4,5,0]];
    // let initialGrid = new GridState(numTable, null, null, 0);
    
    // console.log(heuristicColorsLeft(new GridState(numTable, null, null, 0)));
    // console.log(numTable.containsGrid([1,2,3]));
}
const  automateAnswer = async(answer) =>{
    let colorButtons = document.getElementsByClassName("button");


    const delay = ms => new Promise(res => setTimeout(res, ms));

    for (color of answer){
        await delay(500);
        colorButtons[color-1].click();
    }
}
function answerSetup(){

    
    if (get_by_id("game-answer") != null && get_by_id("game-answer").hasChildNodes()){
        alert("Answer Already Found. Make a new Game")
        return;
    }
    
    let numTable = translateTable();    
    let initialColor = numTable[0][0]
    numTable[0][0] = 0;
    
    initialGrid = new GridState(numTable, null, null, 0).makeMove(initialColor);

    var value = Number(get_by_id("time-limit").value) < 2 ? 3 : Number(get_by_id("time-limit").value);
    

    var limit = value < 3 ? 3 : value;
    

    var start = new Date().getTime();
    console.log("Search Started ...")
    answerGrid = AStar(initialGrid, heuristicAreaLeft, filtering=true, timeLimit = limit);
    answerKey = answerGrid.getAnswer();
    var end = new Date().getTime()
    

 
    
    
    
    
    var tdTimer = get_by_id("timer");
    tdTimer.innerHTML = "Time Elapsed: " + (end-start)/1000;
    var tdAutomate = get_by_id("automate");
    var automateBtn = create_node("button", tdAutomate); automateBtn.innerHTML = "Automate Answer";
    automateBtn.addEventListener('click', function(){automateAnswer(answerKey)}, false);
    
    var answerTR = get_by_id("game-answer");
    // -----
    // var answerTable = create_node("table", get_by_id("game"));
    // answerTable.classList.add("tables");
    // answerTable.id="game-answer";
    // var answerTR = create_node("tr", answerTable);

    answerTR.classList.add("tables");
    for (var color of answerKey){
        var td = create_node("td", answerTR);

        var colorString;
        if (color==1) colorString = "blue";
        else if (color==2) colorString = "red";
        else if (color==3) colorString = "green";
        else if (color==4) colorString = "yellow";
        else if (color==5) colorString = "pink";
        else if (color==6) colorString = "purple";

        td.className="piece " + colorString;

        
    }
    // console.log("The Answer Grid", answerGrid);
    // console.log(answerGrid.getAnswer());
    if (answerKey.length > 25){
        console.log("No path found in time Limit: Look at Website\nNumber of Steps: " + answerKey.length)
    }else{
        console.log("Answer found - Look at Website\nNumber of Steps: " + answerKey.length);
    }
    
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
    
    filtering = false,
    
    timeLimit = Number.MAX_SAFE_INTEGER,
    cutoff = Number.MAX_SAFE_INTEGER,
    counter = {
        numEnqueues: 0,
        numExtends: 0
    }
){
    let frontier = new PriorityQueue()
    frontier.enqueue(initialState, initialState.getPathLength() + heuristicFunction(initialState))
    let extended = new Array(0);

    var bestNode;
    let shortestPath = Number.MAX_SAFE_INTEGER;
    var start = new Date().getTime();
    while (!frontier.isEmpty() && (new Date().getTime() - start)/1000 < timeLimit){
        qElement = frontier.dequeue();
        extNode = qElement.element;
        counter.numExtends += 1;
        
        if (shortestPath <= 25) break;
        if (extNode.getPathLength() >= shortestPath) continue;
        if(extNode.isGoalState()){
            shortestPath = extNode.getPathLength();
            bestNode = extNode;
            console.log("Goal State Found, path length = ", shortestPath, ", time elapsed = ", (new Date().getTime() - start)/1000);
            
            // return extNode;
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
    return bestNode;
}

window.onload = function(){
    this.new_game();
}