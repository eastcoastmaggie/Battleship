const gameboard = require("./gameboard");
const playerProto = {
    playerTurn() {
        return this.turn;
    },
    getTurn() {
        return this.turn;
    },
    setTurn(turnBool) {
        this.turn = turnBool;
    },
    makeAttack(x=null, y=null){
        if(this.turn){
            if (this.ai == false){
                return this.opponentBoard.receiveAttack(x, y);
            } else {
                // AI 
                let target = 'X';
                while (target =='X'){
                    x = Math.floor(Math.random()*10);
                    y = Math.floor(Math.random()*10);
                    target = this.opponentBoard.receiveAttack(x, y);
                }
               return target;
            }
        } else {
            return 'Error: not user\' turn';
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
