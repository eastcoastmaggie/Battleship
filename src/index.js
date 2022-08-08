import './stylesheet.css';
const gameboard = require("./gameboard");
const player = require("./player"); 

const tileWidth = 40;
const body = document.querySelector('body');
const winDialog = document.querySelector('#win-message');        
const ships = [{name:"Carrier", size: 5},{name:"Battleship", size: 4},{name:"Cruiser", size: 3},{name:"Submarine", size: 3}, {name:"Destroyer", size: 2} ];


let playerBoard = gameboard(10, 10);
let opponentBoard = gameboard(10, 10);
let playerBoardDiv = document.createElement('div');
let opponentBoardDiv = document.createElement('div');
let user = player(playerBoard, opponentBoard);
let computer = player(opponentBoard, playerBoard, true);

let dragging = false;


function delay(milliseconds){
    return new Promise(resolve => {
        setTimeout(resolve, milliseconds);
    });
}

const drawStartBtn = function(){
    const startBtn = document.createElement('button');
    startBtn.setAttribute('id', 'start-btn');
    startBtn.addEventListener('click', startGame);
    startBtn.textContent = 'Start';
    startBtn.disabled = true;
    body.appendChild(startBtn);
}
const removeStartBtn = function(){
    body.removeChild(body.querySelector('#start-btn'));
}

const startGame = function(){
    removeStartBtn();
    removeShipListeners();
    drawOpponentBoard(opponentBoard);
    setOpponentBoard();
}
 
const drawShips = function(){
    const shipContainer = document.querySelector('#ship-container');

    for (let ship of ships){
        let shipDiv = document.createElement('div');
        shipDiv.setAttribute('data-ship', ship.name);
        shipDiv.setAttribute('data-size', ship.size);
        shipDiv.classList.add('ship');
        shipDiv.setAttribute('data-orientation', 'horizontal');
        shipDiv.style.width = ((ship.size * tileWidth) + ((ship.size-1) * 3)) +'px';
        shipDiv.style.height = tileWidth + 'px';
        shipDiv.addEventListener('mousedown', onClick);
        shipContainer.appendChild(shipDiv);
    }
}
const setOpponentBoard = function(){
    for (let i in ships){
        opponentBoard.randomizeShipPlacement(ships[i].size, i);
    }
}
const removeShipListeners = function(){
    let shipDivs = body.querySelectorAll('.ship');
    for (let ship of shipDivs){
        let newShip = ship.cloneNode(true);
        newShip.classList.add('new');
        ship.parentNode.replaceChild(newShip, ship);
    }

}
const drawBoard = function(boardArray, boardContainer, addAListener = false) {
    boardContainer.classList.add('board');

    // console.log(boardArray);
    for (let x = 0; x < boardArray.length; x++){
        for(let y = 0; y < boardArray[x].length; y++){
            let boardTile = document.createElement('div');
            boardTile.classList.add('tile');
            boardTile.setAttribute('data-x', x);
            boardTile.setAttribute('data-y', y);
            boardTile.style.gridColumn = x+1;
            boardTile.style.gridRow = y+1;
            if (addAListener == true){
                boardTile.addEventListener('click', playTurn); 
            }
            
            //boardTile.textContent = `${x}, ${y}`;
            boardContainer.appendChild(boardTile);
        }
    }
    return boardContainer;
}
const drawPlayerBoard = function(board){
    const playerContainer = document.querySelector('#user-gameboard');
    const boardArray = board.getPlayerState();
    playerContainer.appendChild(drawBoard(boardArray, playerBoardDiv));

}
const drawOpponentBoard = function(board) {
    const opponentContainer = document.querySelector('#opponent-gameboard');
    const boardArray = board.getOpponentState();
    opponentContainer.appendChild(drawBoard(boardArray, opponentBoardDiv, true));
}
const attack =function(target = null){
    
    if (user.playerTurn() == true){
    
        let outcome = user.makeAttack(target.dataset.x, target.dataset.y).outcome;
        // add a peg to target
        if(outcome != 'No target found'){
            
        
            let peg = document.createElement('div');
                peg.classList.add('peg');
               if (outcome == 'Miss'){
                    peg.classList.add('miss'); 
                    // end user turn
                    user.setTurn(false);
                    computer.setTurn(true);

                } else if (outcome == "Hit" || outcome == 'You sunk my battleship'){ 
                    peg.classList.add('hit');}
                target.appendChild(peg);
            // remove listener from target
            target.removeEventListener('click', playTurn);
        }
    } else {
        let result = computer.makeAttack();
        let peg = document.createElement('div');
        peg.classList.add('peg');
    
        if (result.outcome == 'Miss'){
            peg.classList.add('miss'); 
            user.setTurn(true);
            computer.setTurn(false);
        } else if (result.outcome == 'Hit' || result.outcome == 'You sunk my battleship'){ peg.classList.add('hit');}
        
        let tile = playerBoardDiv.querySelector(`[data-x='${result.x}'][data-y='${result.y}']`);
        tile.appendChild(peg);
    }
}

const playTurn = async function(){
    // player attacks first
    if(user.playerTurn()){
        attack(this);
        // evaluate game state
        if(user.evaluateWin()){
            //add overlay
            //show win message
            winDialog.textContent = 'You Win!';
        }
    }
    
    // opponent attack  
    while(computer.playerTurn()){
       await delay(500);
        attack();
        // evaluate game state
        console.log(computer.evaluateWin());
    }
    if(computer.evaluateWin()){
        winDialog.textContent = 'Computer Wins!';
    }
    if(computer.evaluateWin() || user.evaluateWin()){
        let resetButton = document.createElement('button');
            resetButton.setAttribute('id', 'reset-btn');
            resetButton.addEventListener('click', function() {location.reload()});
            resetButton.textContent = 'Play again?'
            winDialog.appendChild(resetButton);
            winDialog.style.display = 'inline';
            document.querySelector('#win-message-underlay').style.display = 'inline';

    }

}

const onClick = function(e){
    const moveDelta = 0;
    let target = e.currentTarget;
    let currentX = target.getBoundingClientRect().left;
    let currentY = target.getBoundingClientRect().top;
    const boardContainer = playerBoardDiv;
    const boardBounds = boardContainer.getBoundingClientRect();
    function moveAt(x, y) {

        target.style.left = x - target.offsetWidth / 2 + 'px';
        target.style.top = y - target.offsetHeight / 2 + 'px';
    }       
    function onMouseMove(e) {
        if(dragging == false){
            // prep styling and position
            target.style.position = 'absolute';
            target.style.zIndex = 100;
            // move it out of any current parents directly into body
            // to make it positioned relative to the body
            document.body.append(target);
        }
        dragging = true;
        moveAt(e.pageX, e.pageY);
    }
    function getNearestTileElement(x, y){
       
        // check if ship is on board
        try{
            if (boardBounds.left < (x + target.offsetWidth) && (x + target.offsetWidth) < boardBounds.right 
             && boardBounds.top < (y + target.offsetHeight) && (y + target.offsetHeight) < boardBounds.bottom
              ){
                // calculate which tile to place ship, 
                // 2 is added to the tileWidth to account for boarder and gap
                const closestTileX = Math.round((x - boardBounds.left) / (tileWidth + 2));
                const closestTileY = Math.round((y - boardBounds.top) / (tileWidth + 2));
                
                return boardContainer.querySelector(`[data-x="${closestTileX}"][data-y="${closestTileY}"]`);
            } else {
                throw( "No nearest element.");
            }
        }
        catch(err){
            console.log(err);
            if (err == "No nearest element."){
                return null;
            } 
        }
    }
    function evaluateShipPosition(){
         //  determine if ship already on board    
         if (boardBounds.right > currentX && boardBounds.left < currentX
            && boardBounds.top < currentY && boardBounds.bottom > currentY ){
                return true;
            }
            else return false;
    }

    function snapShipToBoard(element, rotate = false){
        let direction = target.getAttribute('data-orientation');
        try{
            if(element != null){
                if (evaluateShipPosition()){
                    try {
                        let tileStart = getNearestTileElement(currentX, currentY);
                        let move = false;
                        if (rotate){
                            direction = (target.getAttribute('data-orientation') == 'horizontal') ? 'vertical' : 'horizontal'; 
                            move = playerBoard.moveShip(Number(target.getAttribute('data-size')),  Number(tileStart.getAttribute('data-x')),  Number(tileStart.getAttribute('data-y')), 
                            direction, Number(element.getAttribute('data-x')), Number(element.getAttribute('data-y')), target.getAttribute('data-orientation'));
                        } else {
                            move = playerBoard.moveShip(Number(target.getAttribute('data-size')),  Number(tileStart.getAttribute('data-x')),  Number(tileStart.getAttribute('data-y')), 
                            target.getAttribute('data-orientation'), Number(element.getAttribute('data-x')), Number(element.getAttribute('data-y')));     
                        }
                        if (move){
                            target.style.left = (element.getBoundingClientRect().x + window.scrollX) + 'px';
                            target.style.top = (element.getBoundingClientRect().y + + window.scrollY) + 'px';
                        } else {
                            throw "Ship does not fit"
                        }            
                    }
                    catch (err){
                        
                        resetMove(getNearestTileElement(currentX, currentY), direction);
                    }
                }  else { 
                    // snap test the ship to grid if the ship could be placed at position
                    if(playerBoard.placeShip(Number(target.getAttribute('data-size')), 
                    Number(element.getAttribute('data-x')), Number(element.getAttribute('data-y')), target.getAttribute('data-orientation')) == true){                        
                        target.style.left = (element.getBoundingClientRect().x + window.scrollX) + 'px';
                        target.style.top = (element.getBoundingClientRect().y + + window.scrollY) + 'px';
                    }
                    else {
                        throw "Ship does not fit"
                    }
                }
            } else { 
            throw "cannot place ship on board.";
            }
        }
        catch (err){
            // check if ship was on board and move failed return to position
            if( evaluateShipPosition() ){
                let direction = target.getAttribute('data-orientation');
                if (rotate == true){
                    direction = target.getAttribute('data-orientation') == 'horizontal' ? 'vertical' : 'horizontal';
                }   console.log(getNearestTileElement(currentX, currentY));
                    resetMove(getNearestTileElement(currentX, currentY), direction);
            } else{
            removeFromBoard();
            }
            console.log(err);  
        }
    }
    // if cannot place new piece than remove from board
    function removeFromBoard(){
        dragging == false;
        target.style.position = 'relative';
        target.style.left = '10px';
        target.style.top = '5px';
        document.querySelector('#ship-container').appendChild(target);
        
        
        console.log(`${boardBounds.right + tileWidth}px`);

    }

    function resetMove(element, direction){

        // if the item was rotated, rotate back
        if (target.getAttribute('data-orientation') != direction){
            let width = target.style.width;
            let height = target.style.height;
            target.style.width = height;
            target.style.height = width;
            target.setAttribute('data-orientation', direction);        
        } else {
            target.style.left = (element.getBoundingClientRect().x + window.scrollX) + 'px';
            target.style.top = (element.getBoundingClientRect().y + + window.scrollY) + 'px';
        }
    }
    // if didn't move than rotate
    function rotateOnClick (){
        let width = target.style.width;
        let height = target.style.height;
        target.style.width = height;
        target.style.height = width;
        if (target.getAttribute('data-orientation') == 'horizontal'){
            target.setAttribute('data-orientation', 'vertical');
        } else {
            target.setAttribute('data-orientation', 'horizontal')
        }
        const closestTile = getNearestTileElement(target.getBoundingClientRect().x, target.getBoundingClientRect().y);
        snapShipToBoard(closestTile, true);
    }
    function evaluateReady(){
        if (playerBoard.ships.length == ships.length){
            
            return true;
        }
        else return false;
    }
    // move the ship on mousemove
    document.addEventListener('mousemove', onMouseMove);
    // stop moving ship, remove unneeded handlers
    document.onmouseup = function() {
        
        if(dragging != true){
            rotateOnClick();
        } else {
            const closestTile = getNearestTileElement(target.getBoundingClientRect().x, target.getBoundingClientRect().y);
            snapShipToBoard(closestTile);
        }
        document.removeEventListener('mousemove', onMouseMove);
        dragging = false;
        document.onmouseup = null;
        document.onmousemove = null;
        if (evaluateReady()){
            document.querySelector('#start-btn').disabled = false;
        }
    }   
}
const play = function(){

let dragging = false;
    winDialog.style.display = 'none';
    drawPlayerBoard(playerBoard);
    drawShips();
    drawStartBtn();
}
play();
