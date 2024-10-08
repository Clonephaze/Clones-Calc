// DOM elements
const display = document.getElementById('screen');
const buttons = Array.from(document.querySelectorAll('button')).filter(button => !button.hasAttribute('data-ignoreButton'));
const wholeOperand = document.getElementById('whole-opperand');
const historyContainer = document.getElementById('history-board');
const minuteHand = document.getElementById('MinuteHand');
const outerCircle = document.getElementById('OuterCircle');
const calcContainer = document.getElementById('calc-container');

// Constants
const MAX_HISTORY_LENGTH = 20;
const OPERATION_MAP = { '+': '+', '-': '-', '/': '/', 'x': '*' };

// State variables
let mathExpression = '';
let history = JSON.parse(localStorage.getItem('history')) || [];

// Helper functions
function addToHistory(operand, expression, answer) {
    const entry = { operand, expression, answer };
    history.unshift(entry);
    if (history.length > MAX_HISTORY_LENGTH) {
        history.pop();
    }
    localStorage.setItem('history', JSON.stringify(history));
}

function clearDisplay() {
    display.innerText = '0';
    mathExpression = '';
    wholeOperand.innerText = '';
    wholeOperand.setAttribute('data-contained', 'false');
    display.setAttribute('data-answered', 'false');
}

function updateDisplay(value) {
    if (display.innerText === '0' || display.getAttribute('data-answered') === 'true') {
        display.innerText = value;
    } else {
        display.innerText += value;
    }
    wholeOperand.innerText += value;
    wholeOperand.setAttribute('data-contained', 'true');
    display.setAttribute('data-answered', 'false');
}

function handleOperation(operation) {
    if (wholeOperand.getAttribute('data-contained') === 'false' || mathExpression.slice(-1) === OPERATION_MAP[operation]) {
        return;
    }
    mathExpression += display.innerText + OPERATION_MAP[operation];
    display.innerText = '0';
    wholeOperand.innerText += ` ${operation} `;
    wholeOperand.setAttribute('data-contained', 'true');
}

function calculateResult() {
    if (mathExpression.length === 0) return;

    const fullExpression = mathExpression + display.innerText;
    const regex = /^[\d+\-*/().]+$/;

    if (!regex.test(fullExpression)) {
        display.innerText = 'ERROR';
        clearDisplay();
        return;
    }

    try {
        let answer = Function(`'use strict'; return (${fullExpression})`)();
        if (typeof answer === 'number' && isFinite(answer)) {
            answer = parseFloat(answer.toFixed(3));
            display.innerText = answer;
            wholeOperand.innerText += ' = ';
            addToHistory(wholeOperand.innerText, fullExpression, answer);
            mathExpression = '';
            display.setAttribute('data-answered', 'true');
        } else {
            throw new Error('Invalid result');
        }
    } catch (error) {
        display.innerText = 'ERROR';
        clearDisplay();
    }
}

// Event handlers
function handleButtonClick(e) {
    const buttonText = e.target.innerText;

    if (display.getAttribute('data-answered') === 'true' && !['AC', 'DEL', '='].includes(buttonText)) {
        clearDisplay();
    }

    switch (buttonText) {
        case 'AC':
            clearDisplay();
            break;
        case 'DEL':
            if (display.innerText.length === 1) {
                display.innerText = '0';
                wholeOperand.innerText = wholeOperand.innerText.slice(0, -1);
            } else {
                display.innerText = display.innerText.slice(0, -1);
                wholeOperand.innerText = wholeOperand.innerText.slice(0, -1);
            }
            break;
        case '+':
        case '-':
        case '/':
        case 'x':
            handleOperation(buttonText);
            break;
        case '(':
            mathExpression += '(';
            wholeOperand.innerText += '(';
            break;
        case ')':
            if (display.innerText !== '0') {
                mathExpression += display.innerText + ')';
                wholeOperand.innerText += ')';
                display.innerText = '0';
            }
            break;
        case '=':
            calculateResult();
            break;
        default:
            updateDisplay(buttonText);
    }
}

// Set up event listeners
buttons.forEach(button => button.addEventListener('click', handleButtonClick));

function setHistory() {
    historyContainer.innerHTML = '';
    history.forEach((entry, index) => {
        const historyObject = document.createElement('button');
        historyObject.className = 'history-object';
        historyObject.setAttribute('data-ignoreButton', 'true');
        historyObject.id = `history-object-${index}`;

        const title = document.createElement('h3');
        title.className = 'history-title';
        title.id = `history-title-${index}`;
        title.textContent = entry.operand;

        const answer = document.createElement('p');
        answer.className = 'history-answer';
        answer.id = `history-answer-${index}`;
        answer.textContent = entry.answer;

        historyObject.appendChild(title);
        historyObject.appendChild(answer);

        historyObject.addEventListener('click', () => {
            mathExpression = entry.expression;
            wholeOperand.innerText = entry.operand.replace(/=/g, '');
            wholeOperand.setAttribute('data-contained', 'true');
            display.setAttribute('data-answered', 'false');
            display.innerText = '0';
            displayHistory();
        });

        historyContainer.appendChild(historyObject);
    });
}

function displayHistory() {
    setHistory();
    minuteHand.classList.add('rotate');
    outerCircle.classList.add('counter-rotate');
    setTimeout(() => {
        minuteHand.classList.remove('rotate');
        outerCircle.classList.remove('counter-rotate');
    }, 750);

    const isExpanded = historyContainer.getAttribute('aria-expanded') === 'true';
    historyContainer.setAttribute('aria-expanded', (!isExpanded).toString());
    calcContainer.classList.toggle('slide-btns', !isExpanded);
    historyContainer.classList.toggle('slide-history', !isExpanded);
}

document.getElementById('history').addEventListener('click', displayHistory);

// Initialize history
setHistory();
