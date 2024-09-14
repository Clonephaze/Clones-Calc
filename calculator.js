"use strict";
// Constants
const MAX_HISTORY_LENGTH = 20;
const OPERATION_MAP = { '+': '+', '-': '-', '/': '/', 'x': '*' };
// DOM elements
const display = document.getElementById('screen');
const buttons = Array.from(document.querySelectorAll('button')).filter(button => !button.hasAttribute('data-ignoreButton'));
const wholeOperand = document.getElementById('whole-opperand');
const historyContainer = document.getElementById('history-board');
const minuteHand = document.getElementById('MinuteHand');
const outerCircle = document.getElementById('OuterCircle');
const calcContainer = document.getElementById('calc-container');
// State
let mathExpression = '';
let calculatorHistory = JSON.parse(localStorage.getItem('calculatorHistory') || '[]');
// Helper functions
function addToHistory(operand, expression, answer) {
    const entry = { operand, expression, answer };
    calculatorHistory.unshift(entry);
    if (calculatorHistory.length > MAX_HISTORY_LENGTH) {
        calculatorHistory.pop();
    }
    localStorage.setItem('calculatorHistory', JSON.stringify(calculatorHistory));
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
    }
    else {
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
    if (mathExpression.length === 0 && display.innerText === '0')
        return;
    let fullExpression = mathExpression + display.innerText;
    fullExpression = fullExpression.replace(/x/g, '*'); // Replace 'x' with '*' for multiplication
    const regex = /^[\d+\-*/().]+$/;
    if (!regex.test(fullExpression)) {
        display.innerText = 'ERROR';
        clearDisplay();
        return;
    }
    try {
        const answer = Function(`'use strict'; return (${fullExpression})`)();
        if (isFinite(answer)) {
            const formattedAnswer = parseFloat(answer.toFixed(3));
            display.innerText = formattedAnswer.toString();
            wholeOperand.innerText += ' = ';
            addToHistory(wholeOperand.innerText, fullExpression, formattedAnswer);
            mathExpression = '';
            display.setAttribute('data-answered', 'true');
        }
        else {
            throw new Error('Invalid result');
        }
    }
    catch (error) {
        display.innerText = 'ERROR';
        clearDisplay();
    }
}
// Event handlers
function handleButtonClick(e) {
    const target = e.target;
    const buttonText = target.innerText;
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
            }
            else {
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
            if (display.innerText !== '0' && !isNaN(Number(display.innerText.slice(-1)))) {
                mathExpression += display.innerText + '*';
                wholeOperand.innerText += ' x ';
            }
            mathExpression += '(';
            wholeOperand.innerText += '(';
            display.innerText = '0';
            break;
        case ')':
            mathExpression += display.innerText + ')';
            wholeOperand.innerText += display.innerText + ')';
            display.innerText = '0';
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
    calculatorHistory.forEach((entry, index) => {
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
        answer.textContent = entry.answer.toString();
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
const historyButton = document.getElementById('history');
if (historyButton) {
    historyButton.addEventListener('click', displayHistory);
}
// Initialize history
setHistory();
