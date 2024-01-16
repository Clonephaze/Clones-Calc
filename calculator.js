let display = document.getElementById('screen');
let buttons = document.querySelectorAll('button');
let wholeOpperand = document.getElementById('whole-opperand');
let mathCollection = '';
let operationMap = {'+': '+', '-': '-', '/': '/', 'x': '*'};

let inputSequence = "";

// function updateInputSequence(id) {
//     if (id === "equal") {
//         inputSequence += '=';
//         checkSecretCode();
//     } else {
//         inputSequence += id;
//     }
// }

function checkSecretCode() {
    console.log(inputSequence);
    if (inputSequence === "58008=") {
        console.log("Correct!");
        document.getElementById('screen').innerText = "( . )( . )";
        inputSequence = "";
    }
}

// document.querySelectorAll('button').forEach((button) => {
//     button.addEventListener('click', (event) => {
//         const id = event.target.id;
//         updateInputSequence(id);
//         checkSecretCode();
//     });
// });

buttons.forEach(button => {
    button.addEventListener('click', (e) => {
        if (display.getAttribute('data-answered') == 'true') {
            if (e.target.innerText == '=' || e.target.innerText == '+' || e.target.innerText == '-' || e.target.innerText == 'x' || e.target.innerText == '/' || e.target.innerText == ')') {
                return
            } else if (e.target.innerText == 'AC' || e.target.innerText == 'DEL') {
                display.innerText = '0';
                wholeOpperand.innerText = '';
                inputSequence = '';
                display.setAttribute('data-answered', 'false');
            } else {
                display.innerText = e.target.innerText;
                wholeOpperand.innerText = '';
                wholeOpperand.innerText += e.target.innerText;
                inputSequence = '';
                inputSequence += e.target.innerText;
                display.setAttribute('data-answered', 'false');
            }
        } else {
            switch(e.target.innerText){
                case 'AC':
                    display.innerText = '0';
                    mathCollection = '';
                    wholeOpperand.innerText = '';
                    wholeOpperand.setAttribute('data-contained', 'false');

                break;
                case 'DEL':
                    if(display.innerText.length == 1){
                        display.innerText = '0';
                        if (display.getAttribute('data-answered') == 'true') {
                            return;
                        } else {
                            wholeOpperand.innerText = '';
                            wholeOpperand.setAttribute('data-contained', 'false');
                        }
                    } else {
                        display.innerText = display.innerText.slice(0, -1);
                        wholeOpperand.innerText = wholeOpperand.innerText.slice(0, -1);
                        inputSequence = inputSequence.slice(0, -1);
                    }
                break;
                case '+':
                case '-':
                case '/':
                case 'x': 
                    if (wholeOpperand.getAttribute('data-contained') == 'false' || mathCollection.slice(-1) == operationMap[e.target.innerText]) {
                        return
                    } else if (display.innerText == '0') {
                        mathCollection += operationMap[e.target.innerText];
                        wholeOpperand.innerText += ' ' + e.target.innerText + ' ';
                    } else {
                        mathCollection += display.innerText + operationMap[e.target.innerText];
                        display.innerText = '0';
                        wholeOpperand.innerText += ' ' + e.target.innerText + ' ';
                        wholeOpperand.setAttribute('data-contained', 'true'); 
                    }
                break;
                case '=':
                    if (mathCollection.length == 0) {
                        inputSequence += '=';
                        checkSecretCode();
                        return
                    } else {
                        let regex = /^[\d+\-*/\(\).]+$/;


                        if (!regex.test(mathCollection + display.innerText)) {
                            display.innerText = 'ERROR';
                            mathCollection = '';
                            wholeOpperand.innerText = '';
                            display.setAttribute('data-answered', 'true');
                            return;
                        }
                        try {
                            let answer = eval(mathCollection + display.innerText);
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
                case ')':
                    if (display.innerText === '0') {
                        return;
                    } else {
                        mathCollection += display.innerText + ')';
                        display.innerText = '0';
                        wholeOpperand.innerText += e.target.innerText;
                        wholeOpperand.setAttribute('data-contained', 'true')
                    }
                break;
                default:
                    if(display.innerText === '0'){
                        display.innerText = '';
                        display.innerText += e.target.innerText;
                        wholeOpperand.innerText += e.target.innerText;
                        wholeOpperand.setAttribute('data-contained', 'true')
                        inputSequence += e.target.innerText
                    } else {
                        display.innerText += e.target.innerText;
                        wholeOpperand.innerText += e.target.innerText;
                        wholeOpperand.setAttribute('data-contained', 'true')
                        inputSequence += e.target.innerText
                    }
                break;
            }
        }
    })
})