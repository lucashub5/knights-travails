import Horse from './comp/chess-knight.svg';
import { Node, Board } from './graphs.js'
import './comp/style.css'

const output = document.querySelector('.output');
const sizeInput = document.getElementById('bar');
const sizeLabel = document.getElementById('sizeLabel');
const guide = document.getElementById('guide-user');
let instance = false;
const path = [];
let size = sizeInput.value;

const btnRestart = document.getElementById('btn');

btnRestart.addEventListener('click', loadBoard);
sizeInput.addEventListener('input', loadBoard);
loadBoard();

function loadBoard() {
    guide.textContent = 'Select a position for the knight.';
    instance = false;
    btnRestart.style.display = 'none';

    size = sizeInput.value;
    sizeLabel.textContent = `Size: ${size}x${size}`;
    const board = document.createElement('div');
    board.classList.add('custom-grid');

    document.documentElement.style.setProperty('--grid-size', size);
    for (let i=0; i < size; i++) {
        for (let j=0; j < size; j++) {
            const locker = document.createElement('div');
            locker.classList.add('lockers');

            if((j - i) % 2 != 0) {
                locker.style.backgroundColor = 'rgb(187, 187, 187)';
            }
            else {
                locker.style.backgroundColor = 'rgb(137, 137, 137)';
            }
            const position = `[${j},${size - 1 - i}]`;

            locker.setAttribute('position', position);

            board.appendChild(locker);
            locker.addEventListener('click', horsePosition);
        }
    }

    output.innerHTML = '';
    output.appendChild(board);
}

function horsePosition(event) {
    const locker = event.currentTarget;
    const positionDiv = document.createElement('div');
    positionDiv.id = 'position-horse';

    if (!instance) {
        const horseImage = document.createElement('img');
        horseImage.src = Horse;
        horseImage.alt = 'Horse';
        positionDiv.appendChild(horseImage);
    
        locker.innerHTML = '';
        locker.appendChild(positionDiv);

        guide.textContent = 'Select the final position.';

        instance = true;

        path[0] = JSON.parse(locker.getAttribute('position'));
    } else {
        locker.appendChild(positionDiv);
        path[1] = JSON.parse(locker.getAttribute('position'));
        calculate();
        guide.textContent = 'These are the results.';
    }
}

function calculate() {
    const board = new Board(size);
    const paths = board.knightMoves(path[0],path[1]);  
    
    for (let i=0; i < paths.length; i++) {
        let color = 256 % i
        const randomColor = `rgb(${Math.floor(Math.random() * 128)}, ${Math.floor(Math.random() * 128)}, ${Math.floor(Math.random() * 128)})`;
        for (let j = 1; j < paths[i].length - 1; j++) {
            const divPath = document.querySelector(`[position="[${paths[i][j]}]"]`);
            const paintPath = document.createElement('div');
            paintPath.classList.add('paint-path');
            paintPath.style.backgroundColor = randomColor;
            paintPath.style.setProperty('--font-size', (300 / size * 0.8) + 'px');
            paintPath.textContent = j;

            paintPath.addEventListener('mouseover', function(event) {
                const eventHover = event.target.dataset.hoverPath;

                const selectPaths = document.querySelectorAll('.paint-path');
                selectPaths.forEach(element => {
                    const elementHover = element.dataset.hoverPath;;
                    if (eventHover !== elementHover) {
                    element.style.display = 'none';
                    } else {
                        element.style.color = 'white';
                    }
                });

            });

            paintPath.addEventListener('mouseout', function() {
                const selectPaths = document.querySelectorAll('.paint-path');
                selectPaths.forEach(element => {
                    element.style.display = 'block';
                    element.style.color = 'transparent';
                });
            });

            const lockers = document.querySelectorAll('.lockers');

            lockers.forEach(lock => {
                lock.removeEventListener('click', horsePosition);
            });

            paintPath.dataset.hoverPath = i;

            btnRestart.style.display = 'block';

            divPath.appendChild(paintPath);
        }
    }
}