/*
Naruth Kongurai
CSE 154
Section: AO
This is a JS file that is used to operate the basic controls of the webpage, such as randomly
shuffiling the tiles, creating new set of tiles for a puzzle game, and setting features like
ability to change border colors and styles on specific tiles that are movable.
*/

(function() {
    
    "use strict";
    
    // Shortcut function to reduce redundent element calling
    var $ = function(id) { return document.getElementById(id); };
    var qsa = function(sel) { return document.querySelectorAll(sel); };        
    
    // Module global variables, allowing for easy customization of gameplay
    var NUMBER_OF_ROWS_AND_COLUMNS = 4;
    var EMPTY_TILE_POS_X = 3;
    var EMPTY_TILE_POS_Y = 3;
    var WIDTH_HEIGHT_OF_TILE = 100;
    
    window.onload = function() {
        $("shufflebutton").onclick = shuffle;
        createTiles();
    };
    
    // Generate tiles and appending them to a Div element. Movable tiles will be highlighted when
    // the user moves the mouse over them and vice versa. If click, a movable tile will relocate to
    // where the empty tile is positioned at.
    function createTiles() {
        var divName = "puzzlearea";
        var tileNumber = 1;
        for (var i = 0; i < NUMBER_OF_ROWS_AND_COLUMNS; i++) {
            for (var j = 0; j < NUMBER_OF_ROWS_AND_COLUMNS; j++) {

                var tileElement = document.createElement("div");
                tileElement.classList.add("tile");
                
                var top = WIDTH_HEIGHT_OF_TILE * i;     // x value
                var left = WIDTH_HEIGHT_OF_TILE * j;    // y value
                
                // Set the tile's position and its background position
                tileElement.style.top = top + "px";
                tileElement.style.left = left + "px";
                tileElement.style.backgroundPosition = -left + "px " + -top + "px";
                
                tileElement.innerHTML = "<span>" + tileNumber++ + "</span>"; // Update tile number
  
                tileElement.onmouseover = highlightTile;    // Highlight tiles that are moveable 
                tileElement.onmouseout = unHighlightTile;   // Unhighlight those that cannot be moved
                tileElement.onclick = moveTile; //  Movable tiles can be moved upon clicking them
                
                // Append tile to target div, skipping last (Empty) tile
                var lastTile = NUMBER_OF_ROWS_AND_COLUMNS - 1;
                if (!(i == lastTile && j == lastTile)) {
                    $(divName).appendChild(tileElement);
                }
            }
        }
    }
    
    // Returns a tile's left position (without Pixel unit). Assumes that the tile is not null.
    function getLeftPosition(tile) {
        return parseInt(tile.style.left);
    }
    
    // Returns a tile's top position (without Pixel unit). Assumes that the tile is not null.
    function getTopPosition(tile) {
        return parseInt(tile.style.top);
    }
    
    // Shuffles all tiles using an algorithm that repeatedly moves neighboring tiles to new spots,
    // raising the level of difficulty to the game
    function shuffle() {
        for (var i = 0; i < 1000; i++) {
            var neighbors = findAllNeighbors();
            var randomNumber = parseInt(Math.random() * neighbors.length);
            var selectedTile = neighbors[randomNumber];
            moveTileHelper(selectedTile);
        }
    }
    
    // Return a list of neighboring tiles that are adjacent to where the empty tile is positioned
    // at (which may not be at the same spot each time the function is called). The returned list
    // will never be empty, for there will always be empty tile is guaranteed to be adjacent to
    // other tiles.
    function findAllNeighbors() {
        var neighbors = [];
        var tiles = qsa("#puzzlearea div");
        for (var i = 0; i < tiles.length; i++) {
            var currentTile = tiles.item(i);
            var left = getLeftPosition(currentTile);
            var top = getTopPosition(currentTile);
            // If the current tile is movable, that means it is a neighbor of the empty tile
            if (isMovable(left, top)) {
                neighbors.push(currentTile);
            }
        }
        return neighbors;
    }
    
    // Moves a given tile to a new location that is empty if it can be moved.
    function moveTile() {
        moveTileHelper(this);
    }
    
    // Helper function that takes in a parameter "tile" and checks if the current tile can be moved.
    // If so, move the tile to a new empty location and update where the empty tile is now located.
    function moveTileHelper(tile) {
        var left = getLeftPosition(tile);
        var top = getTopPosition(tile);
        if (isMovable(left, top)) { // Move the tile to new position (if movable)
            tile.style.left = EMPTY_TILE_POS_X * WIDTH_HEIGHT_OF_TILE + "px";
            tile.style.top = EMPTY_TILE_POS_Y * WIDTH_HEIGHT_OF_TILE + "px";
            EMPTY_TILE_POS_X = left / WIDTH_HEIGHT_OF_TILE;
            EMPTY_TILE_POS_Y = top / WIDTH_HEIGHT_OF_TILE;
        }
    }
    
    // Highlight the tile if it can moved.
    function highlightTile() {
        var left = getLeftPosition(this);
        var top = getTopPosition(this);
        if (isMovable(left, top)) { // Highlight the tile (if movable)
            this.classList.add("highlight");
        }
    }
    
    // Unhighlight the tile if it cannot be moved.
    function unHighlightTile() {
        this.classList.remove("highlight");
    }
    
    // Returns true if next to current tile is the location of the empty tile and false otherwise.
    function isMovable(x, y) {
        var currentEmptyTileX = EMPTY_TILE_POS_X * WIDTH_HEIGHT_OF_TILE;
        var currentEmptyTileY = EMPTY_TILE_POS_Y * WIDTH_HEIGHT_OF_TILE;
    
        //  LS: x - WIDTH_HEIGHT_OF_TILE == currentEmptyTileX
        //  RS: x + WIDTH_HEIGHT_OF_TILE == currentEmptyTileX
        if (y == currentEmptyTileY && 
                (x - WIDTH_HEIGHT_OF_TILE == currentEmptyTileX  ||
                x + WIDTH_HEIGHT_OF_TILE == currentEmptyTileX)) {
            return true;
        }
        
        //  Top:    y - WIDTH_HEIGHT_OF_TILE == currentEmptyTileY
        //  Bottom: y + WIDTH_HEIGHT_OF_TILE == currentEmptyTileY
        if (x == currentEmptyTileX &&
                (y - WIDTH_HEIGHT_OF_TILE == currentEmptyTileY  ||
                y + WIDTH_HEIGHT_OF_TILE == currentEmptyTileY)) {
            return true;
        }
        
        return false;
    }
    
})();