let display = document.getElementById('screen');
let buttons = Array.from(document.querySelectorAll('button')).filter(button => !button.hasAttribute('data-ignoreButton')); // Makes it ignore the buttons with the data-ignoreButton, like the history button
let wholeOperand = document.getElementById('whole-operand');
let historyContainer = document.getElementById('history-board');
let mathCollection = '';
let operationMap = { '+': '+', '-': '-', '/': '/', 'x': '*' }; // Allows the calc to contain "x" and have js see it as "*"

let calcHistory = [];
// Function adds all given answers+the whole operand to the history
function addToHistory(operand, string, answer) {
    if (localStorage.getItem('history')) {
        calcHistory = JSON.parse(localStorage.getItem('history'));
    }
    let entry = { operand: operand, string: string, answer: answer };
    calcHistory.unshift(entry);
    if (calcHistory.length > 20) {
        calcHistory.pop();
    }
    localStorage.setItem('history', JSON.stringify(calcHistory));
}

function setHistory() {
    // Load history from local storage
    if (localStorage.getItem('history')) {
        calcHistory = JSON.parse(localStorage.getItem('history'));
    } else {
        localStorage.setItem('history', JSON.stringify(calcHistory));
    }

    historyContainer.innerHTML = ''; // Clear the container
    calcHistory.forEach((entry, index) => {
        let historyObject = document.createElement('button');
        historyObject.className = 'history-object';
        historyObject.setAttribute('data-ignoreButton', 'true');
        historyObject.id = 'history-object-' + index;
        let title = document.createElement('h3');
        title.className = 'history-title';
        title.id = 'history-title-' + index;
        title.textContent = entry.operand;
        let answer = document.createElement('p');
        answer.className = 'history-answer';
        answer.id = 'history-answer-' + index;
        answer.textContent = entry.answer;
        historyObject.appendChild(title);
        historyObject.appendChild(answer);

        historyObject.addEventListener('click', function () {
            mathCollection += entry.string;
            wholeOperand.innerText = entry.operand.replace(/=/g, '');
            wholeOperand.setAttribute('data-contained', 'true');
            display.setAttribute('data-answered', 'false');
            display.innerText = '0';
            displayHistory();
        });

        historyContainer.appendChild(historyObject);
    });
}


setHistory();

// Adds event listeners to all buttons, and defines their behavior for the calculator
buttons.forEach(button => {
    button.addEventListener('click', (e) => {
        // Checks if the display contains an answer
        switch (display.getAttribute('data-answered')) {
            // If true, change the behavior of the buttons
            case 'true':
                switch (e.target.innerText) {
                    case '=':
                    case '+':
                    case '-':
                    case 'x':
                    case '/':
                    case ')':
                        // Makes these buttons do nothing
                        break;
                    case 'AC':
                    case 'DEL':
                        // Has these just reset the display
                        display.innerText = '0';
                        wholeOperand.innerText = '';
                        inputSequence = '';
                        display.setAttribute('data-answered', 'false');
                        break;
                    default:
                        // All other buttons reset the display and displays the pushed buttons value
                        display.innerText = e.target.innerText;
                        wholeOperand.innerText = '';
                        wholeOperand.innerText += e.target.innerText;
                        inputSequence = '';
                        inputSequence += e.target.innerText;
                        display.setAttribute('data-answered', 'false');
                        break;
                }
                break;
            // Otherwise, act as normal
            default:
                switch (e.target.innerText) {
                    // Defines the normal behavior of all buttons
                    case 'AC':
                        // Resets the display
                        display.innerText = '0';
                        mathCollection = '';
                        wholeOperand.innerText = '';
                        wholeOperand.setAttribute('data-contained', 'false');
                        inputSequence = '';
                        break;
                    case 'DEL':
                        // Deletes the last character
                        // Checks if the display would delete the last character, if so sets the display to 0
                        if (display.innerText.length == 1) {
                            display.innerText = '0';
                            if (display.getAttribute('data-answered') == 'true') {
                                return;
                            } else {
                                wholeOperand.innerText = '';
                                wholeOperand.setAttribute('data-contained', 'false');
                            }
                        } else {
                            // Otherwise, deletes the last character
                            display.innerText = display.innerText.slice(0, -1);
                            wholeOperand.innerText = wholeOperand.innerText.slice(0, -1);
                            inputSequence = inputSequence.slice(0, -1);
                        }
                        break;
                    case '+':
                    case '-':
                    case '/':
                    case 'x':
                        // Defines the behavior of the operation buttons
                        // Checks if the display would add an operation right after another operation or if theres no operand to work with, if so do nothing
                        if (wholeOperand.getAttribute('data-contained') == 'false' || mathCollection.slice(-1) == operationMap[e.target.innerText]) {
                            return
                        } else if (display.innerText == '0' && wholeOperand.innerText.length == 0) {
                            //if the display is 0 and it passed the previous if statements, just adds the operation to the whole operand. Meant for cases like "(3 + 3) x 3", where an operation follows a parenthesis.
                            mathCollection += operationMap[e.target.innerText];
                            wholeOperand.innerText += ' ' + e.target.innerText + ' ';
                        } else {
                            // Otherwise, adds the operation and the number to the display
                            mathCollection += display.innerText + operationMap[e.target.innerText];
                            display.innerText = '0';
                            wholeOperand.innerText += ' ' + e.target.innerText + ' ';
                            wholeOperand.setAttribute('data-contained', 'true');
                        }
                        break;
                    case ')':
                        // Defines the behavior of the closing parenthesis button
                        // Checks if theres no operand to work with, if so do nothing. Ensures math can't start with a closing parenthesis.
                        if (display.innerText === '0') {
                            return;
                        } else {
                            mathCollection += display.innerText + ')';
                            display.innerText = '0';
                            wholeOperand.innerText += e.target.innerText;
                            wholeOperand.setAttribute('data-contained', 'true')
                        }
                        break;
                    case '=':
                        // Defines the behavior of the equal button
                        // Checks if theres no operand to work with, if so do nothing
                        if (mathCollection.length == 0) {
                            inputSequence += '=';
                            checkEntry();
                            return
                        } else {
                            let lastNumber = display.innerText;
                            // Otherwise, evaluates the math

                            let regex = /^[\d+\-*/\(\).]+$/;

                            // Validates the expression contains only safe arithmetic characters before evaluating
                            if (!regex.test(mathCollection + display.innerText)) {
                                display.innerText = 'ERROR';
                                mathCollection = '';
                                wholeOperand.innerText = '';
                                display.setAttribute('data-answered', 'true');
                                return;
                            }
                            // Attempts to evaluate the math using math.js. If it fails, sets the display to 'ERROR'
                            try {
                                let answer = math.evaluate(mathCollection + display.innerText);
                                // Checks if the result is a finite number. If not, sets the display to 'ERROR'.
                                if (typeof answer === 'number' && isFinite(answer)) {
                                    let answerStr = answer.toFixed(3);
                                    answerStr = answerStr.replace(/(\.\d+?)0+$/, '$1').replace(/\.$/, '');
                                    answer = parseFloat(answerStr);
                                    display.innerText = answer;
                                    wholeOperand.innerText += ' = ';
                                    addToHistory(wholeOperand.innerText, mathCollection + lastNumber, answer);
                                    mathCollection = '';
                                    display.setAttribute('data-answered', 'true');
                                } else {
                                    display.innerText = 'ERROR';
                                    mathCollection = '';
                                    display.setAttribute('data-answered', 'true');
                                }
                            } catch (error) {
                                display.innerText = 'ERROR';
                                mathCollection = '';
                                display.setAttribute('data-answered', 'true');
                            }
                        }
                        break;
                    default:
                        // Defines the behavior of all other buttons
                        // Prevent adding a second decimal point to the current number
                        if (e.target.innerText === '.' && display.innerText.includes('.')) {
                            return;
                        }
                        // Checks if the display is 0, if so replaces it with the pushed button and adds it to the whole operand
                        if (display.innerText === '0') {
                            display.innerText = '';
                            display.innerText += e.target.innerText;
                            wholeOperand.innerText += e.target.innerText;
                            wholeOperand.setAttribute('data-contained', 'true')
                            inputSequence += e.target.innerText
                        } else {
                            // Otherwise, adds the pushed button to the display and the whole operand
                            display.innerText += e.target.innerText;
                            wholeOperand.innerText += e.target.innerText;
                            wholeOperand.setAttribute('data-contained', 'true')
                            inputSequence += e.target.innerText
                        }
                        break;
                }
                break;
        }
    })
})
let minuteHand = document.getElementById('MinuteHand');
let outerCircle = document.getElementById('OuterCircle');
let calcContainer = document.getElementById('calc-container');

function displayHistory() {
    setHistory();
    minuteHand.classList.add('rotate');
    outerCircle.classList.add('counter-rotate');
    setTimeout(() => {
        minuteHand.classList.remove('rotate');
        outerCircle.classList.remove('counter-rotate');
    }, 750);
    if (historyContainer.getAttribute('aria-expanded') == 'false') {
        historyContainer.setAttribute('aria-expanded', 'true');
        calcContainer.classList.add('slide-btns');
        historyContainer.classList.add('slide-history');
    } else {
        historyContainer.setAttribute('aria-expanded', 'false');
        calcContainer.classList.remove('slide-btns');
        historyContainer.classList.remove('slide-history');
    }
}

document.getElementById('history').addEventListener('click', displayHistory);
