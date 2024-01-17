let display = document.getElementById('screen');
let buttons = document.querySelectorAll('button');
let wholeOpperand = document.getElementById('whole-opperand');
let mathCollection = '';
let operationMap = {'+': '+', '-': '-', '/': '/', 'x': '*'}; // Allows the calc to contain "x" and have js see it as "*"

buttons.forEach(button => {
    button.addEventListener('click', (e) => {
        // Checks if the display contains an answer
        switch (display.getAttribute('data-answered')) {
            // If true, change the behavior of the buttons
            case 'true':
                switch(e.target.innerText){
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
                switch(e.target.innerText){
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
                        if(display.innerText.length == 1){
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
                        } else if (display.innerText == '0') {
                            //if the display is 0 and it passed the previous if statements, just adds the operation to the whole opperand. Meant for cases like "(3 + 3) x 3", where an operation follows a parenthesis.
                            mathCollection += operationMap[e.target.innerText];
                            wholeOpperand.innerText += ' ' + e.target.innerText + ' ';
                        } else {
                            // Otherwise, adds the operation to the display
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
                        if(display.innerText === '0'){
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