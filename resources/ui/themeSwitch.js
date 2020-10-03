"use strict";

// Suggests /LibJS/Libs/JSHelper.js

(async function()
{
    await JSHelper.Notifier.waitFor(JSHelper.GlobalEvents.PAGE_SETUP_COMPLETE);
    
    const themeSwitch = document.querySelector("button#changeTheme");
    const root = document.querySelector(":root");

    themeSwitch.addEventListener("click", async () =>
    {
        const currentTheme = root.getAttribute("data-theme");

        if (currentTheme == "dark")
        {
            root.setAttribute("data-theme", "light");
        }
        else
        {
            root.setAttribute("data-theme", "dark");
        }

        // See https://medium.com/@mwichary/dark-theme-in-a-day-3518dde2955a
        root.classList.add("transitioning-color-theme");
        await JSHelper.waitFor(1000); // In milliseconds.

        root.classList.remove("transitioning-color-theme");
    });
})();
