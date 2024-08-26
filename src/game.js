import { sleep } from './util.js'
import { getHanoiSolutions } from './hanoi.js'

const towers = document.querySelectorAll('.tower');
let towerContent = [[], [], []];
let size = 3;
let discs;
const sleepTime = 300;
let speed = 100;

const DISC_COLORS = ['#264653', '#2a9d8f', '#e9c46a', '#f4a261', '#e76f51', '#3a86ff'];

const startWidth = 90;
const newGameBtn = document.getElementById('newGameBtn');
const discSelect = document.getElementById('discSelect');
const speedRange = document.getElementById('speedRange');
const btnSolve = document.getElementById('btnSolve');
let currentTower;
let originTower;

const buildTowers = (towers) => {
    towers.forEach(tower => {
        const stem = document.createElement('div');
        stem.className = 'stem';
        const plate = document.createElement('div');
        plate.className = 'plate';
        tower.innerHTML = '';
        tower.appendChild(stem);
        tower.appendChild(plate);
    })
}

start();

function start() {
    towerContent = [[], [], []];

    buildTowers(towers);
    for (let i = 0; i < size; i++) {
        let tower = document.createElement('div');
        tower.classList.add('disc');
        tower.draggable = true;
        tower.style.backgroundColor = DISC_COLORS[i];
        tower.style.width = (startWidth - 15 * i) + 'px';
        towerContent[0].push(tower);
    }

    towerContent[0].forEach(t => {
        towers[0].innerHTML = t.outerHTML + towers[0].innerHTML;
    })

    for (let i = 0; i < towers.length; i++) {
        towers[i].classList.add('t' + i);
        towers[i].addEventListener('dragenter', dragenter);
        towers[i].addEventListener('dragover', dragover);
    }

    discs = document.querySelectorAll('.disc');

    discs.forEach(disc => {
        disc.addEventListener('dragstart', dragstart);
        disc.addEventListener('dragend', dragend);
    })
}

function dragenter() {
    if (!originTower) {
        originTower = this;
    }
}

function dragover() {
    currentTower = this;
}

function dragstart() {
    this.classList.add('is-dragging');
}

function dragend() {
    let originTowerIndex = originTower.classList[1][1];
    let currentTowerIndex = currentTower.classList[1][1];
    this.classList.remove('is-dragging');

    moveTower(originTowerIndex, currentTowerIndex, this);

    originTower = undefined;
    originTowerIndex = undefined;
}

let moveCount = 0;
const moveCountElement = document.getElementById('moveCount');
function moveTower(originTowerIndex, currentTowerIndex, disc) {
    if (isDroppable(originTowerIndex, currentTowerIndex, disc)) {
        towerContent[currentTowerIndex].push(towerContent[originTowerIndex].pop());
        originTower.removeChild(disc);
        currentTower.prepend(disc);

        moveCount++;
        moveCountElement.textContent = moveCount;
    }
}

function isDroppable(originTowerIndex, currentTowerIndex, disc) {
    let top = isOnTop(originTowerIndex, disc);
    let topDiscIsLess = isDiscLessThan(currentTowerIndex, disc);

    return top && topDiscIsLess;
}

function isOnTop(originTowerIndex, disc) {
    let size = towerContent[originTowerIndex].length;
    return disc.style.width === towerContent[originTowerIndex][size - 1].style.width;
}

function isDiscLessThan(currentTowerIndex, disc) {
    let size = towerContent[currentTowerIndex].length;

    if (!towerContent[currentTowerIndex][size - 1]) {
        return true;
    } else {
        let sizeTop = disc.style.width.substring(0, disc.style.width.indexOf('p'))
        let sizeBottom = towerContent[currentTowerIndex][size - 1].style.width.substring(0, towerContent[currentTowerIndex][size - 1].style.width.indexOf('p'));

        return Number(sizeTop) < Number(sizeBottom);
    }
}

function moveTopDisc(originTowerIndex, destinyTowerIndex) {
    originTower = towers[originTowerIndex];
    currentTower = towers[destinyTowerIndex];
    let disc = getTopDisc(originTowerIndex);
    moveTower(originTowerIndex, destinyTowerIndex, disc);
}

function getTopDisc(towerIndex) {
    let size = towerContent[towerIndex].length;

    let sizeDisc = towerContent[towerIndex][size - 1].style.width;
    let indexDisc = -1;
    discs.forEach((el, index) => {
        if (el.style.width === sizeDisc) {
            indexDisc = index;
        }
    })
    return discs[indexDisc];
}

async function moves(movements) {
    for (let i = 0; i < movements.length; i++) {
        const element = movements[i];;
        moveTopDisc(element.origin, element.destiny);
        await sleep(5 * sleepTime - 14 * speed);
    }
}

function resetScore() {
    moveCount = 0;
    moveCountElement.textContent = moveCount;
}

class Game {
    newGame = () => {
        speedRange.addEventListener('input', event => {
            speed = event.target.value;
        })

        newGameBtn.addEventListener('click', () => {
            size = discSelect.selectedIndex + 1;
            start();
            resetScore();
        })

        btnSolve.onclick = function () {
            const movements = getHanoiSolutions(size);
            moves(movements);
        }
    }
}

export default Game;
