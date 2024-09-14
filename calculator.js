let display = document.getElementById('screen');
let buttons = Array.from(document.querySelectorAll('button')).filter(button => !button.hasAttribute('data-ignoreButton')); // Makes it ignore the buttons with the data-ignoreButton, like the history button
let wholeOpperand = document.getElementById('whole-opperand');
let historyContainer = document.getElementById('history-board');
let mathCollection = '';
let operationMap = { '+': '+', '-': '-', '/': '/', 'x': '*' }; // Allows the calc to contain "x" and have js see it as "*"

let history = [];
// Function adds all given answers+the whole opperand to the history
function addToHistory(operand, string, answer) {
    if (localStorage.getItem('history')) {
        history = JSON.parse(localStorage.getItem('history'));
    }
    let entry = { operand: operand, string: string, answer: answer };
    history.unshift(entry);
    if (history.length > 20) {
        history.pop();
    }
    localStorage.setItem('history', JSON.stringify(history));
}

function setHistory() {
    // Load history from local storage
    if (localStorage.getItem('history')) {
        history = JSON.parse(localStorage.getItem('history'));
    } else {
        localStorage.setItem('history', JSON.stringify(history));
    }

    historyContainer.innerHTML = ''; // Clear the container
    history.forEach((entry, index) => {
        // Create a new scope for each iteration
        (function (entry) {
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

            // Add an event listener to the button
            historyObject.addEventListener('click', function () {
                mathCollection += entry.string;
                wholeOpperand.innerText = entry.operand.replace(/=/g, '');
                wholeOpperand.setAttribute('data-contained', 'true');
                display.setAttribute('data-answered', 'false');
                display.innerText = '0';
                displayHistory();
            });

            historyContainer.appendChild(historyObject);
        })(entry);
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
                        wholeOpperand.innerText = '';
                        inputSequence = '';
    display.setAttribute('data-answered', 'false');
                        break;
                    default:
                        // All other buttons reset the display and displays the pushed buttons value
                        display.innerText = e.target.innerText;
                        wholeOpperand.innerText = '';
                        wholeOpperand.innerText += e.target.innerText;
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
                        wholeOpperand.innerText = '';
                        wholeOpperand.setAttribute('data-contained', 'false');
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
                                wholeOpperand.innerText = '';
                                wholeOpperand.setAttribute('data-contained', 'false');
            }
                        } else {
                            // Otherwise, deletes the last character
                display.innerText = display.innerText.slice(0, -1);
                            wholeOpperand.innerText = wholeOpperand.innerText.slice(0, -1);
                            inputSequence = inputSequence.slice(0, -1);
            }
            break;
        case '+':
        case '-':
        case '/':
        case 'x':
                        // Defines the behavior of the operation buttons
                        // Checks if the display would add an operation right after another operation or if theres no opperand to work with, if so do nothing
                        if (wholeOpperand.getAttribute('data-contained') == 'false' || mathCollection.slice(-1) == operationMap[e.target.innerText]) {
                            return
                        } else if (display.innerText == '0' && wholeOpperand.innerText.length == 0) {
                            //if the display is 0 and it passed the previous if statements, just adds the operation to the whole opperand. Meant for cases like "(3 + 3) x 3", where an operation follows a parenthesis.
                            mathCollection += operationMap[e.target.innerText];
                            wholeOpperand.innerText += ' ' + e.target.innerText + ' ';
                        } else {
                            // Otherwise, adds the operation and the number to the display
                            mathCollection += display.innerText + operationMap[e.target.innerText];
                            display.innerText = '0';
                            wholeOpperand.innerText += ' ' + e.target.innerText + ' ';
                            wholeOpperand.setAttribute('data-contained', 'true');
                        }
            break;
        case ')':
                        // Defines the behavior of the closing parenthesis button
                        // Checks if theres no opperand to work with, if so do nothing. Ensures math can't start with a closing parenthesis.
                        if (display.innerText === '0') {
                            return;
                        } else {
                            mathCollection += display.innerText + ')';
                display.innerText = '0';
                            wholeOpperand.innerText += e.target.innerText;
                            wholeOpperand.setAttribute('data-contained', 'true')
            }
            break;
        case '=':
                        // Defines the behavior of the equal button
                        // Checks if theres no opperand to work with, if so do nothing
                        if (mathCollection.length == 0) {
                            inputSequence += '=';
                            checkEntry();
                            return
                        } else {
                            let lastNumber = display.innerText;
                            // Otherwise, evaluates the math

                            let regex = /^[\d+\-*/\(\).]+$/;

                            // Checks if the string being passed along is valid math and nothing else. If it fails, sets the display to 'ERROR' and cuts the function before evaluation. Ensures nobody can set the display manually to something malicious and try to evaluate it. ALWAYS BE CAUTIOUS USING EVAL() IN YOUR CODE.
                            if (!regex.test(mathCollection + display.innerText)) {
                                display.innerText = 'ERROR';
                                mathCollection = '';
                                wholeOpperand.innerText = '';
                                display.setAttribute('data-answered', 'true');
                                return;
                            }
                            // Attempts to evaluate the math. If it fails, sets the display to 'ERROR'
                            try {
                                let answer = eval(mathCollection + display.innerText);
                                // Checks if the string being passed along is a pure number. If not it sets the display to 'ERROR'.
                                if (typeof answer === 'number') {
                                    let answerStr = answer.toFixed(3);
                                    answerStr = answerStr.replace(/(\.\d+?)0+$/, '$1').replace(/\.$/, '');
                                    answer = parseFloat(answerStr);
                                    display.innerText = answer;
                                    wholeOpperand.innerText += ' = ';
                                    addToHistory(wholeOpperand.innerText, mathCollection + lastNumber, answer);
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
                        // Checks if the display is 0, if so replaces it with the pushed button and adds it to the whole opperand 
                        if (display.innerText === '0') {
                            display.innerText = '';
                            display.innerText += e.target.innerText;
                            wholeOpperand.innerText += e.target.innerText;
                            wholeOpperand.setAttribute('data-contained', 'true')
                            inputSequence += e.target.innerText
                        } else {
                            // Otherwise, adds the pushed button to the display and the whole opperand
                            display.innerText += e.target.innerText;
                            wholeOpperand.innerText += e.target.innerText;
                            wholeOpperand.setAttribute('data-contained', 'true')
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
	@@ -241,15 +161,14 @@ function displayHistory() {
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
