const shipProto = {
    getSize() {
        return this.size;
    },
    getDamage() {
        return this.damage;
    },
    hit() {
        this.damage += 1;
    },
    isSunk() {
        if(this.getDamage() == this.size) {
            return true;
        } else {
            return false;
        }
    }
};

const ship = (shipSize) => {
    let ship = Object.create(shipProto, {
        size : { 
            writable: false,
            configurable: false,
            value: shipSize
        },
        damage : {
            writable: true,
            configurable:true,
            value: 0
        }
    });
    return ship;
};

module.exports = ship;