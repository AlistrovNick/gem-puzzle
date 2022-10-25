import game from './gameField.js';

const LOCAL_STORAGE_SAVE = 'gem_puzzle_save';
const RESTART_BTN_TEXT = 'restart';
const SAVE_BTN_TEXT = 'save';
const RESULTS_BTN_TEXT = 'results';
const CLOSE_BTN_TEXT = 'close';
const SOUND_CLICK_PATH = './assets/sounds/click.wav';

const volume = {
    on: './assets/img/volume.svg',
    off: './assets/img/volume-mute.svg'
}

const results = [
    {
        name: 'psyh',
        time: 25,
        moves: 36
    },
    {
        name: 'Mikalai',
        time: 60,
        moves: 36
    },
    {
        name: 'Anna',
        time: 63,
        moves: 40
    },
    {
        name: 'Alex',
        time: 68,
        moves: 62
    },
    {
        name: 'Andrey',
        time: 77,
        moves: 100
    },
    {
        name: 'Stas',
        time: 133,
        moves: 89
    },
    {
        name: 'Dmitry',
        time: 73,
        moves: 101
    },
    {
        name: 'Sergei',
        time: 59,
        moves: 45
    },
    {
        name: 'Dimon',
        time: 73,
        moves: 110
    },
    {
        name: 'Jura',
        time: 62,
        moves: 59
    }
];
let fieldSize = 4;
let isGamedFinished = false;
let timerId;
let gameDuration = 0;
let countMoves = 0;
let isVolumeMuted = false;

const createButton = (caption) => {
    const button = document.createElement('button');
    button.classList.add('btn');
    button.innerText = caption;
    return button;
}

const createRadioButton = (caption, group, id, value, isChecked) => {
    const input = document.createElement('input');
    input.setAttribute('type', 'radio');
    input.setAttribute('name', group);
    input.setAttribute('id', id);
    input.setAttribute('value', value);
    input.checked = isChecked;
    input.classList.add('radioBtn');
    const label = document.createElement('label');
    label.setAttribute('for', id);
    label.classList.add('btn', 'radioBtnLabel');
    label.textContent = caption;
    return [input, label];
}

const createTableRow = (data) => {
    const row = document.createElement('div');
    row.classList.add('table__row');
    for (let i = 0; i < data.length; i++) {
        const ceil = document.createElement('div');
        ceil.classList.add('table__ceil');
        ceil.textContent = data[i];
        row.appendChild(ceil);
    }
    return row;
}

const createTable = (table) => {
    const tableElement = document.createElement('div');
    tableElement.classList.add('table');
    const tableCaptionElement = document.createElement('h2');
    tableCaptionElement.classList.add('table__caption');
    tableCaptionElement.textContent = table.caption;
    tableElement.appendChild(tableCaptionElement);
    const tableContentElement = document.createElement('div');
    tableContentElement.classList.add('table__content');
    const headersElement = createTableRow(table.headers);
    headersElement.classList.add('table__headers');
    tableContentElement.appendChild(headersElement);
    for (let i = 0; i < table.rows.length; i++) {
        const contentRow = createTableRow(table.rows[i]);
        tableContentElement.appendChild(contentRow);
    }
    tableElement.appendChild(tableContentElement);
    return tableElement;
}

const createTableData = () => {
    const data = {};
    data.headers = ['position', 'name', 'time', 'moves'];
    data.caption = 'Top Players';
    let sortedResults = results.sort((row1, row2) => row1.time - row2.time)
    if (sortedResults.length > 10) {
        sortedResults = sortedResults.slice(0, 10);
    }
    const rows = sortedResults.map((result, i) => {
        const row = [];
        row.push(i + 1);
        row.push(result.name);
        const [minutes, seconds] = parseTime(result.time);
        row.push(`${minutes}:${seconds}`);
        row.push(result.moves);
        return row;
    });
    data.rows = rows;
    return data;
}

const parseTime = (seconds) => {
    const minutesValue = String(Math.floor(seconds / 60)).padStart(2, '0');
    const secondsValue = String((seconds % 60)).padStart(2, '0');
    return [minutesValue, secondsValue];
}

const renderTime = (seconds = 0) => {
    const [minutesValue, secondsValue] = parseTime(seconds);
    const timer = document.querySelector('.timer');
    timer.querySelector('.timer__minutes').textContent = minutesValue;
    timer.querySelector('.timer__seconds').textContent = secondsValue;
};

const createTimer = () => {
    const timerElement = document.createElement('div');
    timerElement.classList.add('timer');
    const minutesElement = document.createElement('span');
    minutesElement.classList.add('timer__minutes');
    const separetorElement = document.createElement('span');
    separetorElement.classList.add('timer__separetor');
    separetorElement.textContent = ':';
    const secondsElement = document.createElement('span');
    secondsElement.classList.add('timer__seconds');
    timerElement.appendChild(minutesElement);
    timerElement.appendChild(separetorElement);
    timerElement.appendChild(secondsElement);
    return timerElement;
}

const createMoves = () => {
    const movesLabelElement = document.createElement('span');
    movesLabelElement.classList.add('moves__label');
    movesLabelElement.textContent = 'moves';
    const movesSeparatorElement = document.createElement('span');
    movesSeparatorElement.classList.add('moves__separator');
    movesSeparatorElement.textContent = ':';
    const movesValueElement = document.createElement('span');
    movesValueElement.classList.add('moves__value');
    const movesElement = document.createElement('div');
    movesElement.classList.add('moves');
    movesElement.appendChild(movesLabelElement);
    movesElement.appendChild(movesSeparatorElement);
    movesElement.appendChild(movesValueElement);
    return movesElement;
}

const renderMoves = (count) => {
    const moves = document.querySelector('.moves').querySelector('.moves__value').textContent = count;
}

const createImageButton = (src) => {
    const input = document.createElement('input');
    input.setAttribute('type', 'image');
    input.setAttribute('src', src);
    input.classList.add('volume');
    return input;
}

const createControlPannel = () => {
    const controlPannelElement = document.createElement('div');
    controlPannelElement.classList.add('control-pannel');
    const saveBtn = createButton(SAVE_BTN_TEXT);
    saveBtn.addEventListener('click', handleSaveBtnClick);
    const restartBtn = createButton(RESTART_BTN_TEXT);
    restartBtn.addEventListener('click', handleRestartBtnClick);
    controlPannelElement.appendChild(saveBtn);
    controlPannelElement.appendChild(restartBtn);
    return controlPannelElement;
}

const createControlPannelContainer = () => {
    const controlPannelContainerElement = document.createElement('div');
    controlPannelContainerElement.classList.add('control-pannel__container');
    return controlPannelContainerElement;
}

const createContainer = () => {
    const containerElement = document.createElement('div');
    containerElement.classList.add('container');
    return containerElement;
}

const createField = () => {
    const fieldElement = document.createElement('div');
    fieldElement.classList.add('field');
    for (let i = 0; i < fieldSize; i++) {
        const rowElement = document.createElement('div');
        rowElement.classList.add('field__row');
        for (let j = 0; j < fieldSize; j++) {
            const tileElement = document.createElement('div');
            tileElement.classList.add('field__tile', 'tile');
            const tileContentElement = document.createElement('div');
            tileContentElement.classList.add('tile__content');
            tileElement.appendChild(tileContentElement);
            rowElement.appendChild(tileElement);
        }
        fieldElement.appendChild(rowElement);
    }
    return fieldElement;
}

const renderField = () => {
    const fieldElement = document.querySelector('.field');
    const field = game.getField();
    for (let i = 0; i < fieldSize; i++) {
        for (let j = 0; j < fieldSize; j++) {
            const tileElement = fieldElement.querySelectorAll('.tile')[i * fieldSize + j];
            if (field[i][j] === ' ') {
                tileElement.classList.add('tile_empty');
            } else {
                tileElement.classList.remove('tile_empty');
                tileElement.querySelector('.tile__content').textContent = field[i][j];
            }
        }
    }

}

const setDragAndDropEventToTiles = () => {
    const tiles = document.querySelectorAll('.tile');
    const emptyX = game.getEmptyTilePosition().x;
    const emptyY = game.getEmptyTilePosition().y;
    for (let i = 0; i < tiles.length; i++) {
        const x = i % fieldSize;
        const y = Math.floor(i / fieldSize);
        if (game.getField()[y][x] === ' ') {
            tiles[i].addEventListener('dragover', handleDragTileOver);
            tiles[i].addEventListener('drop', handleDropTile);
        } else {
            tiles[i].removeEventListener('dragover', handleDragTileOver);
            tiles[i].removeEventListener('drop', handleDropTile);
            if ((x === emptyX && (y === emptyY - 1 || y === emptyY + 1)) ||
                (y === emptyY && (x === emptyX - 1 || x === emptyX + 1))) {
                tiles[i].setAttribute('draggable', true);
                tiles[i].addEventListener('dragstart', handleDragTile);
            } else {
                tiles[i].removeAttribute('draggable');
                tiles[i].removeEventListener('dragstart', handleDragTile);
            }
        }
    }
}

const createFieldContainer = () => {
    const fieldContainerElement = document.createElement('div');
    fieldContainerElement.classList.add('field__container');
    return fieldContainerElement;
}

const startTimer = () => {
    const timerId = setInterval(() => {
        gameDuration++;
        renderTime(gameDuration);
    }, 1000);
    return timerId;
}

const stopTimer = () => {
    clearInterval(timerId);
    timerId = null;
}

const resetGameField = () => {
    game.generateField(fieldSize);
    renderField();
    isGamedFinished = false;
}

const resetGameDuration = () => {
    stopTimer();
    gameDuration = 0;
    renderTime(gameDuration);
}

const resetCountMoves = () => {
    countMoves = 0;
    renderMoves(countMoves);
}

const saveResult = () => {
    const result = {};
    result.name = 'You';
    result.time = gameDuration;
    result.moves = countMoves;
    results.push(result);
}

const createCloseButtonsForModal = () => {
    const modalButtonsContainer = document.createElement('div');
    modalButtonsContainer.classList.add('modal__buttons');
    const closeBtn = createButton(CLOSE_BTN_TEXT);
    closeBtn.addEventListener('click', closeModal);
    modalButtonsContainer.appendChild(closeBtn);
    return modalButtonsContainer;
}

const createMessage = (title, text) => {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    const messageTitleElement = document.createElement('h2');
    messageTitleElement.classList.add('message__title');
    messageTitleElement.textContent = title;
    const messageTextElement = document.createElement('p');
    messageTextElement.classList.add('message__text');
    messageTextElement.textContent = text;
    messageElement.appendChild(messageTitleElement);
    messageElement.appendChild(messageTextElement);
    return messageElement;
}

const showCongratsMessage = () => {
    const title = 'Congratulation';
    const [minutesValue, secondsValue] = parseTime(gameDuration);
    const text = `Hooray! You solved the puzzle in ${minutesValue}:${secondsValue} and ${countMoves} moves!`;
    const messageElement = createMessage(title, text);
    const modal = document.querySelector('.modal');
    const modalContent = modal.querySelector('.modal__content');
    const modalButtonsContainer = createCloseButtonsForModal();
    modalContent.appendChild(messageElement);
    modalContent.appendChild(modalButtonsContainer);
    modal.classList.add('active');
}

const moveTile = (tileElement) => {
    if (!timerId) {
        timerId = startTimer();
    }
    const tileElements = document.querySelectorAll('.tile');
    let index = 0;
    while (tileElement !== tileElements[index]) {
        index++;
    }
    const tileX = index % fieldSize;
    const tileY = Math.floor(index / fieldSize);
    const emptyX = game.getEmptyTilePosition().x;
    const emptyY = game.getEmptyTilePosition().y;
    if (!((tileX === emptyX && (tileY === emptyY - 1 || tileY === emptyY + 1)) ||
        (tileY === emptyY && (tileX === emptyX - 1 || tileX === emptyX + 1)))) {
        return;
    }
    let isMoved = false;
    if (tileX === emptyX) {
        if (tileY === emptyY - 1) {
            isMoved = game.moveUp();
        } else {
            isMoved = game.moveDown();
        }
    } else {
        if (tileX === emptyX - 1) {
            isMoved = game.moveLeft();
        } else {
            isMoved = game.moveRight();
        }
    }
    if (isMoved) {
        if (!isVolumeMuted) {
            const audio = new Audio(SOUND_CLICK_PATH);
            audio.play();
        }
        countMoves++;
        const tileContent = tileElement.querySelector('.tile__content').textContent;
        tileElement.querySelector('.tile__content').textContent = ' ';
        tileElement.classList.add('tile_empty');
        tileElements[emptyY * fieldSize + emptyX].querySelector('.tile__content').textContent = tileContent;
        tileElements[emptyY * fieldSize + emptyX].classList.remove('tile_empty');
        renderMoves(countMoves);
        isGamedFinished = game.isGameFinished();
        if (isGamedFinished) {
            stopTimer();
            saveResult();
            setTimeout(() => showCongratsMessage(), 500);
        }
        setDragAndDropEventToTiles();
    }
}

function handleFieldClick(e) {
    if (isGamedFinished) {
        return;
    }
    const tileElement = e.target.closest('.tile:not(.tile_empty)');
    if (!tileElement) {
        return;
    }
    moveTile(tileElement);
}

function handleSaveBtnClick() {
    const savedSettings = {
        field: game.getField(),
        isGamedFinished: isGamedFinished,
        gameDuration: gameDuration,
        countMoves: countMoves
    };
    localStorage.setItem(LOCAL_STORAGE_SAVE, JSON.stringify(savedSettings));
}

function handleRestartBtnClick() {
    resetGameDuration();
    resetCountMoves();
    resetGameField();
}

function handleChangeSizeClick(e) {
    fieldSize = e.target.value;
    const fieldElement = createField();
    fieldElement.addEventListener('click', handleFieldClick);
    const fieldContainer = document.querySelector('.field__container');
    fieldContainer.querySelector('.field').remove();
    fieldContainer.appendChild(fieldElement);
    resetGameField();
    resetGameDuration();
    resetCountMoves();
    setDragAndDropEventToTiles();
}

function handleResultBtnClick() {
    const modalLayout = document.querySelector('.modal');
    const tableData = createTableData();
    const tableElement = createTable(tableData);
    tableElement.classList.add('modal__table');
    const modalButtonsContainer = createCloseButtonsForModal();
    const modalContent = modalLayout.querySelector('.modal__content');
    modalContent.appendChild(tableElement);
    modalContent.appendChild(modalButtonsContainer);
    modalLayout.classList.add('active');
}

function handleDragTile(e) {
    e.target.classList.add('moved__tile');
}

function handleDropTile(e) {
    const movedTile = document.querySelector('.moved__tile');
    movedTile.classList.remove('moved__tile');
    moveTile(movedTile);
}

function handleDragTileOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
}

function closeModal() {
    const modal = document.querySelector('.modal');
    const modalContent = modal.querySelector('.modal__content');
    while (modalContent.children.length > 0) {
        modalContent.children[0].remove();
    }
    modal.classList.remove('active');
}

function handleModalClose(e) {
    console.log(e);
    if (!e.target.classList.contains('modal')) {
        return;
    }
    closeModal();
}

function handleVolumeClick(e) {
    const newSrc = isVolumeMuted ? volume.on : volume.off;
    e.target.src = newSrc;
    isVolumeMuted = !isVolumeMuted;
}

const initControlPannelLayout = () => {
    const controlPannelElement = createControlPannel();
    const controlPannelContainerElement = createControlPannelContainer();
    controlPannelContainerElement.appendChild(controlPannelElement);
    return controlPannelContainerElement;
}

const initFieldLayout = () => {
    const fieldElement = createField();
    fieldElement.addEventListener('click', handleFieldClick);
    const fieldContainerElement = createFieldContainer();
    fieldContainerElement.appendChild(fieldElement);
    return fieldContainerElement;
}

const initStatisticPannelLayout = () => {
    const statisticPannelLayout = document.createElement('div');
    statisticPannelLayout.classList.add('statistic');
    const timerElement = createTimer();
    const movesElement = createMoves();
    statisticPannelLayout.appendChild(timerElement);
    statisticPannelLayout.appendChild(movesElement);
    return statisticPannelLayout;
}

const initAdditionalSettingsLayout = () => {
    const additionalSettingsLayout = document.createElement('div');
    additionalSettingsLayout.classList.add('additional-settings');
    const resultsBtn = createButton(RESULTS_BTN_TEXT);
    resultsBtn.addEventListener('click', handleResultBtnClick);
    const volumeBtn = createImageButton(volume.on);
    volumeBtn.addEventListener('click', handleVolumeClick);
    additionalSettingsLayout.appendChild(resultsBtn);
    additionalSettingsLayout.appendChild(volumeBtn);
    return additionalSettingsLayout;
}

const initSizeControlsLayout = () => {
    const sizeControlsLayout = document.createElement('div');
    sizeControlsLayout.classList.add('size-controls');
    for (let i = 3; i <= 8; i++) {
        const isChecked = i === fieldSize ? true : false;
        const [input, label] = createRadioButton(`${i}x${i}`, 'game-size', `size-${i}`, i, isChecked);
        input.addEventListener('change', handleChangeSizeClick);
        sizeControlsLayout.appendChild(input);
        sizeControlsLayout.appendChild(label);
    }
    return sizeControlsLayout;
}

const createModalLayout = () => {
    const modalLayout = document.createElement('div');
    modalLayout.classList.add('modal');
    const modalContent = document.createElement('div');
    modalContent.classList.add('modal__content', 'container');
    modalLayout.appendChild(modalContent);
    return modalLayout;
}

const initValues = () => {
    const savedSettings = localStorage.getItem(LOCAL_STORAGE_SAVE);
    if (savedSettings) {
        const settingsJSON = JSON.parse(savedSettings);
        fieldSize = settingsJSON.field.length;
        game.setField(settingsJSON.field);
        isGamedFinished = settingsJSON.isGameFinished;
        gameDuration = settingsJSON.gameDuration;
        countMoves = settingsJSON.countMoves;
    } else {
        game.generateField(fieldSize);
    }

}

const renderGame = () => {
    renderField();
    renderTime(gameDuration);
    renderMoves(countMoves);
}

const init = () => {
    initValues();
    const controlPannelLayout = initControlPannelLayout();
    const fieldLayout = initFieldLayout();
    const statisticPannelLayout = initStatisticPannelLayout();
    const additionalSettingsLayout = initAdditionalSettingsLayout();
    const sizeControlsLayout = initSizeControlsLayout();
    const containerElement = createContainer();
    containerElement.appendChild(controlPannelLayout);
    containerElement.appendChild(fieldLayout);
    containerElement.appendChild(statisticPannelLayout);
    containerElement.appendChild(additionalSettingsLayout);
    containerElement.appendChild(sizeControlsLayout);
    const modalLayout = createModalLayout();
    modalLayout.addEventListener('click', handleModalClose);
    document.body.appendChild(modalLayout);
    document.body.appendChild(containerElement);
    setDragAndDropEventToTiles();
    renderGame();
}

init();