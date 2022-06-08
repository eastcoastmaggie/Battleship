const ship = require('./ship');

test('ship of size 3 has length of 3',() => {
    expect(ship(3).getSize()).toBe(3);
});
test('ship has hits at position 2', () =>{
    let battleship = ship(4);
    battleship.hit();
    expect(battleship.getDamage()).toEqual(1);
});
test('test if ship is still afloat with 2 hits', () =>{
    let battleship = ship(3);
    battleship.hit();
    battleship.hit();
    expect(battleship.isSunk()).toEqual(false);
});
test('test if ship is sunk with 3 hits', () =>{
    let battleship = ship(3);
    battleship.hit();
    battleship.hit();
    battleship.hit();
    expect(battleship.isSunk()).toEqual(true);
});