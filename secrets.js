let inputSequence = "";

function updateInputSequence(id) {
    if (id === "equal") {
        inputSequence = "";
    } else {
        inputSequence += id;
    }
}

function checkSecretCode() {
    console.log(inputSequence);
    if (inputSequence === "58008=") {
        console.log("Correct!");
        document.getElementById('screen').innerText = "( . )( . )";
    }
}

document.querySelectorAll('button').forEach((button) => {
    button.addEventListener('click', (event) => {
        const id = event.target.id;
        updateInputSequence(id);
        checkSecretCode();
    });
});
