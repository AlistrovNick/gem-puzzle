const X = ' ';

let field;
let emptyTilePosition = {};

const shuffleElements = (arr) => {
    for (let i = arr.length; i > 0; i--) {
        let randomIndex = Math.floor(Math.random() * i);
        let temp = arr[i - 1];
        arr[i - 1] = arr[randomIndex];
        arr[randomIndex] = temp;
    }
}

const generateField = (size = 4) => {
    const elements = Array.from(Array(size * size).keys());
    elements[0] = X;
    shuffleElements(elements);
    field = new Array(size);
    for (let i = 0; i < size; i++) {
        let row = new Array(size);
        for (let j = 0; j < size; j++) {
            row[j] = elements[i * size + j];
            if (row[j] === X) {
                emptyTilePosition.x = j;
                emptyTilePosition.y = i;
            }
        }
        field[i] = row;
    }
}

const setField = (newField) => {
    field = newField;
    for (let i = 0; i < newField.length; i++) {
        for (let j = 0; j < newField[i].length; j++) {
            if (newField[i][j] === X) {
                emptyTilePosition.x = j;
                emptyTilePosition.y = i;
                return;
            }            
        }        
    }
}

const moveLeft = () => {
    if (emptyTilePosition.x === 0) {
        return false;
    }
    field[emptyTilePosition.y][emptyTilePosition.x] = field[emptyTilePosition.y][emptyTilePosition.x - 1];
    field[emptyTilePosition.y][emptyTilePosition.x - 1] = X;
    emptyTilePosition.x = emptyTilePosition.x - 1;
    return true;
}

const moveRight = () => {
    if (emptyTilePosition.x === field[0].length - 1) {
        return false;
    }
    field[emptyTilePosition.y][emptyTilePosition.x] = field[emptyTilePosition.y][emptyTilePosition.x + 1];
    field[emptyTilePosition.y][emptyTilePosition.x + 1] = X;
    emptyTilePosition.x = emptyTilePosition.x + 1;
    return true;
}

const moveUp = () => {
    if (emptyTilePosition.y === 0) {
        return false;
    }
    field[emptyTilePosition.y][emptyTilePosition.x] = field[emptyTilePosition.y - 1][emptyTilePosition.x];
    field[emptyTilePosition.y - 1][emptyTilePosition.x] = X;
    emptyTilePosition.y = emptyTilePosition.y - 1;
    return true;
}

const moveDown = () => {
    if (emptyTilePosition.y === field.length - 1) {
        return false;
    }
    field[emptyTilePosition.y][emptyTilePosition.x] = field[emptyTilePosition.y + 1][emptyTilePosition.x];
    field[emptyTilePosition.y + 1][emptyTilePosition.x] = X;
    emptyTilePosition.y = emptyTilePosition.y + 1;
    return true;
}

const isGameFinished = () => {
    let currentValue = 0;
    for (let i = 0; i < field.length; i++) {
        for (let j = 0; j < field[i].length; j++) {
            if (field[i][j] !== X) {
                if (field[i][j] !== currentValue + 1) {
                    return false;
                } else {
                    currentValue++;
                }
            }
        }        
    }
    return true;
}

export default {
    getField: () => field,
    setField: setField,
    getEmptyTilePosition: () => emptyTilePosition,
    generateField: generateField,
    moveDown: moveDown,
    moveLeft: moveLeft,
    moveRight: moveRight,
    moveUp: moveUp,
    isGameFinished: isGameFinished
};