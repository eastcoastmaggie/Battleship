const gameboard = require("./gameboard");
const playerProto = {
    playerTurn() {
        return this.turn;
    },
    setTurn(turnBool) {
        this.turn = turnBool;
    },
    makeAttack(x=null, y=null){
        if(this.turn){
            if (this.ai == false){
                console.log(this.opponentBoard.getPlayerState())
                return {outcome: this.opponentBoard.receiveAttack(x, y), x: x, y: y};
            } else {
                // AI 
                let outcome = 'X';
                while (outcome =='X' || outcome == 'Already targeted' || outcome == 'No target found'){
                    let direction = -1;
                    if (this.lastHit != null){
                        // attempt a random direction or pick randomly
                        direction  = Math.floor(Math.random()*5);
                    }
                    switch (direction){
                        case -1:
                            console.log(`direction ${direction}`);
                            x = Math.floor(Math.random()*10);
                            y = Math.floor(Math.random()*10);
                            break;
                        case 0:
                            console.log(`direction ${direction}`);

                            // go to left from last hit
                            if (this.lastHit.x - 1 >= 0){
                                x =  this.lastHit.x - 1;
                                y = this.lastHit.y;
                                break;
                            }
                            case 1:
                                console.log(`direction ${direction}`);
                                // go up from last hit
                            if (this.lastHit.y -1 >= 0){
                                y = this.lastHit.y - 1;
                                x = this.lastHit.x;
                                break;
                            }
                        case 2:
                            console.log(`direction ${direction}`);

                            // go right from last hit
                            if (this.lastHit.x + 1 <= 9){
                                x = this.lastHit.x + 1;
                                y = this.lastHit.y;
                                break;
                            }
                        case 3:
                            console.log(`direction ${direction}`);

                            // go down from last hit 
                            if (this.lastHit.y + 1 <= 9){
                                y = this.lastHit.y + 1;
                                x = this.lastHit.x;
                                break;
                            }
                        default:
                            console.log(`direction ${direction}`);

                            x = Math.floor(Math.random()*10);
                            y = Math.floor(Math.random()*10);
                            break;
                    }     
                    console.log(`x: ${x} y: ${y}`);
                    outcome = this.opponentBoard.receiveAttack(x, y);

                }
                if (outcome == "Hit"){
                    this.lastHit = {x: x, y: y};
                } else if (outcome == "You sunk my battleship"){
                    this.lastHit = null;
                }
                let message = (this.lastHit != null) ? (`last hit: ${this.lastHit.x}, ${this.lastHit.y}`) : `last hit: ${this.lastHit}`;
                console.log(message);
                return {outcome: outcome, x: x, y: y};
            }
        } else {
            return 'Error: not user\'s turn';
        }
    },
    evaluateWin(){
        if(this.opponentBoard.shipRemaining()){
            return false;
        }
        else {return true;}
    }
};

const player = (playerBoard, opponentBoard, ai = false) => {
    let player = Object.create(playerProto, {
        turn : { 
            writable: true,
            value: true
        },
        lastHit : {
            writable: true,
            configurable:true,
            value: null
        },
        playerBoard : {
            writable: true,
            configurable:true,
            value: playerBoard
        },
        opponentBoard: {
            writable: true,
            configurable:true,
            value: opponentBoard
        },
        ai : {
            value: ai
        }
    });
    return player;
};

module.exports = player;
