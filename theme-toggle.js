const themeButtons = document.querySelectorAll('.theme-toggle input');

themeButtons.forEach((themeButton) => {
   themeButton.addEventListener('change', function() {
       document.documentElement.setAttribute('data-theme', this.value);
       localStorage.setItem('themeChoice', this.value);
   });
});

function setTheme() {
    //check the localstorage for a saved theme in "themeChoice", if none is found check for "prefers-color-scheme"
    let themeChoice = localStorage.getItem("themeChoice");
    const switchLight = document.getElementById("theme-toggle-1");
    const switchExtraLight = document.getElementById("theme-toggle-2");
    const switchDark = document.getElementById("theme-toggle-3");

    if (themeChoice) {
        switch (themeChoice) {
            case "light": 
                document.documentElement.setAttribute("data-theme", "light");
                switchLight.setAttribute("checked", "checked")
                switchExtraLight.removeAttribute("checked")
                switchDark.removeAttribute("checked")
                break;
            case "extraLight":
                document.documentElement.setAttribute("data-theme", "extraLight");
                switchLight.removeAttribute("checked")
                switchExtraLight.setAttribute("checked", "checked")
                switchDark.removeAttribute("checked")
                break;
            case "dark":
                document.documentElement.setAttribute("data-theme", "dark");
                switchLight.removeAttribute("checked")
                switchExtraLight.removeAttribute("checked")
                switchDark.setAttribute("checked", "checked")
                break;
        }
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        // Use the preferred color scheme
        document.documentElement.setAttribute("data-theme", "dark");
        switchLight.removeAttribute("checked");
        switchExtraLight.removeAttribute("checked");
        switchDark.setAttribute("checked", "checked");
    } else {
        document.documentElement.setAttribute("data-theme", "light");
    }
}

setTheme();