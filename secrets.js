let inputSequence = "";

function checkEntry() {
    switch (inputSequence) {
        case "58008=":
            console.log("Correct!");
            document.getElementById('screen').innerText = "( . )( . )";
            inputSequence = "";
        break;
        case "120=":
            console.log("Correct!");
            document.getElementById('screen').innerText = "Hey there!";
            inputSequence = "";
        break;
        case "022298=":
            console.log("Correct!");
            document.getElementById('screen').innerText = "I love you Ciara!";
            inputSequence = "";
        break;
        case "=":
            console.log("Correct!");
            document.getElementById('screen').innerText = "0..";
            inputSequence = "0..";
        break;
        case "0..=":
            console.log("Correct!");
            document.getElementById('screen').innerText = "0!";
            inputSequence = "0!";
        break;
        case "0!=":
            console.log("Correct!");
            document.getElementById('screen').innerText = "It's 0! Knock it off!";
            inputSequence = "";
        break;
        case "993=":
            console.log("Correct!");
            document.getElementById('screen').innerText = "Egg";
            inputSequence = "";
        break;
        case "07734=":
            console.log("Correct!");
            document.getElementById('screen').innerText = "hELLO";
            inputSequence = "";
        break;
        case "707=":
            console.log("Correct!");
            document.getElementById('screen').innerText = "L0L";
            inputSequence = "";
        break;

        default:
            console.log("Incorrect!");
        break;
    }
}