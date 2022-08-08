const gameboard = require('./gameboard');

test('gameboard getState 10 x 10 empty board',() => {
    expect(gameboard(10, 10).getPlayerState()).toEqual(Array(10).fill(Array(10).fill(null)));
});
test('place ship of size 3 on board at (4,6)',() => {
    let board = gameboard(10, 10);
    let testArray = Array.from({length: 10}, _ =>new Array(10).fill(null));
    board.placeShip(3, 4, 1, 'vertical');
    testArray[4][1] = 0;
    testArray[4][2] = 0;
    testArray[4][3] = 0;
    expect(board.getPlayerState()).toEqual(testArray);
});
test('move placed ship size 3 on board at (4,4)',() => {
    let board = gameboard(10, 10);
    let testArray = Array.from({length: 10}, _ =>new Array(10).fill(null));
    board.placeShip(3, 4, 1, 'vertical');
    board.moveShip(3, 4, 1, 'vertical', 4, 4);
    testArray[4][4] = 0;
    testArray[4][5] = 0;
    testArray[4][6] = 0;
    expect(board.getPlayerState()).toEqual(testArray);
});
test('do not place ship if it does not fit on board',() => {
    let board = gameboard(10, 10);
    let testArray = Array.from({length: 10}, _ =>new Array(10).fill(null));
    board.placeShip(3, 4, 1, 'vertical');
    testArray[4][1] = 0;
    testArray[4][2] = 0;
    testArray[4][3] = 0;
    board.placeShip(5, 8, 5, 'horizontal');
    expect(board.getPlayerState()).toEqual(testArray);
});
test('Do not place ship where one already exists',() => {
    let board = gameboard(10, 10);
    let testArray = Array.from({length: 10}, _ =>new Array(10).fill(null));
    board.placeShip(3, 4, 1, 'vertical');
    board.placeShip(4, 2, 1, 'horizontal');
    testArray[4][1] = 0;
    testArray[4][2] = 0;
    testArray[4][3] = 0;
    expect(board.getPlayerState()).toEqual(testArray);
});
test('receiveAttack should update board to X where no ship is placed',() => {
    let board = gameboard(10, 10);
    let testArray = Array.from({length: 10}, _ =>new Array(10).fill(null));
    board.placeShip(3, 6, 2, 'horizontal');
    testArray[6][2] = 0;
    testArray[7][2] = 0;
    testArray[8][2] = 0;
    testArray[9][2] = 'X';
    board.receiveAttack(9, 2);
    expect(board.getPlayerState()).toEqual(testArray);
});

test('receiveAttack should update Opponent board to X where no ship is placed',() => {
    let board = gameboard(10, 10);
    let testArray = Array.from({length: 10}, _ =>new Array(10).fill(null));
    board.placeShip(3, 6, 2, 'horizontal');
    testArray[9][2] = 'X';
    board.receiveAttack(9, 2);
    expect(board.getOpponentState()).toEqual(testArray);
});
test('receiveAttack should update board to H where a ship is',() => {
    let board = gameboard(10, 10);
    let testArray = Array.from({length: 10}, _ =>new Array(10).fill(null));
    board.placeShip(4, 6, 2, 'horizontal');
    testArray[6][2] = 0;
    testArray[7][2] = 0;
    testArray[8][2] = 0;
    testArray[9][2] = 'H';
    board.receiveAttack(9, 2);
    expect(board.getPlayerState()).toEqual(testArray);
});
test('receiveAttack should update board to H where a ship is',() => {
    let board = gameboard(10, 10);
    board.placeShip(4, 6, 2, 'horizontal');
    expect(board.receiveAttack(9, 2)).toBe("Hit");
});
test('receiveAttack should sink ship if fully damaged',() => {
    let board = gameboard(10, 10);
    board.placeShip(4, 4, 4, 'vertical');
    board.receiveAttack(4, 4);
    board.receiveAttack(4, 5);
    board.receiveAttack(4, 6);
    
    expect(board.receiveAttack(4, 7)).toEqual("You sunk my battleship");
});
test('no ships remaining',() => {
    let board = gameboard(10, 10);
    board.placeShip(4, 4, 4, 'vertical');
    board.receiveAttack(4, 4);
    board.receiveAttack(4, 5);
    board.receiveAttack(4, 6);
    board.receiveAttack(4, 7)
    
    expect(board.shipRemaining()).toEqual(false);
});
test('not all ships are sunk',() => {
    let board = gameboard(10, 10);
    board.placeShip(4, 4, 4, 'vertical');
    board.placeShip(3, 1, 1, 'horizontal');
    board.receiveAttack(4, 4);
    board.receiveAttack(4, 5);
    board.receiveAttack(4, 6);
    board.receiveAttack(4, 7)
    
    expect(board.shipRemaining()).toEqual(true);
});
test('place ships randomly',() => {
    let board = gameboard(10, 10);
    board.randomizeShipPlacement(4);
    board.randomizeShipPlacement(5);
    board.randomizeShipPlacement(3);
    board.randomizeShipPlacement(3);
    board.randomizeShipPlacement(2);
    console.log(board.getPlayerState());
    
    expect(board.shipRemaining()).toEqual(true);
});