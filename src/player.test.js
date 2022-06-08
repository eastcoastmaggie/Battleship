const player = require('./player');
const gameboard = require('./gameboard');

test('Player\'s turn',() => {
    let playerOne = player();
    playerOne.setTurn(true);
    expect(playerOne.playerTurn()).toBe(true);
});
test('Not Player\'s turn',() => {
    let playerOne = player();
    playerOne.setTurn(false);
    expect(playerOne.playerTurn()).toBe(false);
});
test('Player cannot make a move if not their turn',() => {
    let playerOneBoard = gameboard(10, 10);
    let playerTwoboard = gameboard(10, 10);
    let playerOne = player(playerOneBoard, playerTwoboard);
    playerOne.setTurn(false);
    expect(playerOne.makeAttack(1, 1)).toBe('Error: not user\' turn');
});
test('Player attacks Opponent and misses',() => {
    let playerOneBoard = gameboard(10, 10);
    let playerTwoboard = gameboard(10, 10);
    let playerOne = player(playerOneBoard, playerTwoboard);
    playerOne.setTurn(true);
    expect(playerOne.makeAttack(1, 1)).toBe('Miss');
});
test('Player attacks Opponent and hits',() => {
    let playerOneBoard = gameboard(10, 10);
    let playerTwoboard = gameboard(10, 10);
    playerTwoboard.placeShip(3, 1, 1, 'vertical');
    let playerOne = player(playerOneBoard, playerTwoboard);
    playerOne.setTurn(true);
    expect(playerOne.makeAttack(1, 1)).toBe('Hit');
});
test('AI attack and miss',() => {
    let playerOneBoard = gameboard(10, 10);
    let playerTwoboard = gameboard(10, 10);
    let playerOne = player(playerOneBoard, playerTwoboard, true);
    playerOne.setTurn(true);
    expect(playerOne.makeAttack()).toBe('Miss');
});
test('AI attack and hit',() => {
    let playerOneBoard = gameboard(10, 10);
    let playerTwoboard = gameboard(10, 10);
    let playerOne = player(playerOneBoard, playerTwoboard, true);
    playerTwoboard.placeShip(10, 0, 0, 'vertical');
    playerTwoboard.placeShip(10, 1, 0, 'vertical');
    playerTwoboard.placeShip(10, 2, 0, 'vertical');
    playerTwoboard.placeShip(10, 3, 0, 'vertical');
    playerTwoboard.placeShip(10, 4, 0, 'vertical');
    playerTwoboard.placeShip(10, 5, 0, 'vertical');
    playerTwoboard.placeShip(10, 6, 0, 'vertical');
    playerTwoboard.placeShip(10, 7, 0, 'vertical');
    playerTwoboard.placeShip(10, 8, 0, 'vertical');
    playerTwoboard.placeShip(10, 9, 0, 'vertical');
    playerOne.setTurn(true);
    expect(playerOne.makeAttack()).toBe('Hit');
});