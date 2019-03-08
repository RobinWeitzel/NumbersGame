let state; // Tells if the next symbol should be a number or an operation

const drawSixNumbers = () => {
    const availableNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 25, 50, 75, 100];
    const results = [];

    while (results.length < 6) {
        const draw = availableNumbers[Math.floor(Math.random() * availableNumbers.length)];

        if (draw > 10 && results.indexOf(draw) >= 0) { // We want large numbers at most once
            continue;
        }

        results.push(draw);
    }

    return results;
};

const drawTarget = (chosenNumbers) => {
    const possibleOperators = ["+", "-", "*", "/"];
    let helperArray, number, operator;
    let bracketsCounter = 0;
    let result;
    const numberOfOperations = Math.ceil(3 + Math.random()*2);
    do {
        helperArray = chosenNumbers.slice();
        pathToSolution = "";
        for (let i = 0; i < numberOfOperations; i++) {
            let bracketStart = "";
            let bracketEnd = "";
            let counter = 0;
            let help = bracketsCounter;

            if (Math.random() < 0.3 / bracketsCounter) {
                bracketStart = "(";
                bracketsCounter++;
            }

            while (counter < help) {
                if (Math.random() < 0.25 * bracketsCounter) {
                    bracketEnd += ")";
                    bracketsCounter--;
                }
                counter++;
            }

            pathToSolution += bracketStart + helperArray.pop();

            if (i >= numberOfOperations - 1) {
                for (let j = 0; j < bracketsCounter; j++) {
                    bracketEnd += ")";
                }
                bracketsCounter = 0;
                pathToSolution += bracketEnd;
            } else {
                pathToSolution += bracketEnd + possibleOperators[Math.floor(Math.random() * possibleOperators.length)];
            }
        }
        result = parseInt(eval(pathToSolution));
    } while (result < 100 || result > 1000)

    return result;
}

function startGame() {
    const numbers = drawSixNumbers();
    const target = drawTarget(numbers);

    document.getElementById('target').innerHTML = target;

    const numberDivs = document.querySelectorAll('.number');

    for (i = 0; i < numbers.length; i++) {
        numberDivs[i].innerHTML = numbers[i];
    }

    clear();
    document.getElementById('whiteboard').style.color = "black";
    document.getElementById('start').innerHTML = "CLEAR";
    startCountdown();
}

function clear() {
    const numberDivs = document.querySelectorAll('.number');

    for (i = 0; i < numberDivs.length; i++) {
        if (numberDivs[i].classList.contains('active')) {
            numberDivs[i].classList.remove('active');
        }
    }

    document.getElementById('whiteboard').innerHTML = "";
    state = "number";
}

function startClick() {
    if (document.getElementById('start').innerHTML === "START") {
        startGame();
    } else {
        clear();
    }
}

function numberClick(element) {
    if (element.classList.contains('active') || state !== "number") {
        return;
    }
    state = "operation";

    const number = element.innerHTML;
    const whiteboardContent = document.getElementById('whiteboard').innerHTML;
    element.classList.add('active');
    document.getElementById('whiteboard').innerHTML = whiteboardContent + number;
}

function operationClick(operation) {
    if (state !== "operation" || document.querySelectorAll('.number.active').length === 6) {
        return;
    }
    state = "number";

    const whiteboardContent = document.getElementById('whiteboard').innerHTML;
    document.getElementById('whiteboard').innerHTML = whiteboardContent + operation;
}

function createClock(seconds) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttributeNS(null, 'width', '100');
    svg.setAttributeNS(null, 'height', '100');

    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');

    circle.setAttributeNS(null, 'cx', '50');
    circle.setAttributeNS(null, 'cy', '50');
    circle.setAttributeNS(null, 'r', '40');
    circle.setAttributeNS(null, 'stroke-width', '3');
    circle.setAttributeNS(null, 'fill', 'white');
    if (seconds > 10) {
        circle.setAttributeNS(null, 'stroke', 'black');
    } else {
        circle.setAttributeNS(null, 'stroke', 'red');
    }

    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    const degrees = seconds / 30 * Math.PI;
    const x2 = 50 - Math.round(Math.sin(degrees) * 35);
    const y2 = 50 - Math.round(Math.cos(degrees) * 35);

    line.setAttributeNS(null, 'x1', '50');
    line.setAttributeNS(null, 'y1', '50');
    line.setAttributeNS(null, 'x2', x2);
    line.setAttributeNS(null, 'y2', y2);
    line.setAttributeNS(null, 'stroke-width', '3');
    if (seconds > 10) {
        line.setAttributeNS(null, 'stroke', 'black');
    } else {
        line.setAttributeNS(null, 'stroke', 'red');
    }

    const clock = document.getElementById('clock');
    while (clock.firstChild) {
        clock.removeChild(clock.firstChild);
    }

    svg.appendChild(circle);
    svg.append(line);
    clock.appendChild(svg);
}

function startCountdown() {
    let counter = 60;
    let interval = setInterval(h => {
        createClock(counter--);
        if (counter < 0) {
            clearInterval(interval);
            endGame();
        }
    }, 1000);
}

function endGame() {
    state = undefined;

    const whiteboardContent = document.getElementById('whiteboard').innerHTML;
    const result = eval(whiteboardContent);

    document.getElementById('whiteboard').innerHTML = whiteboardContent + "=" + result;

    if (result == document.getElementById('target').innerHTML) {
        document.getElementById('whiteboard').style.color = "green";
    } else {
        document.getElementById('whiteboard').style.color = "red";
    }

    document.getElementById('start').innerHTML = "START";
}

createClock(60);