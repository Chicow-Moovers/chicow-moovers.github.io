"use strict";

// Suggests /LibJS/Libs/JSHelper.js
// Requires /LibJS/Libs/StorageHelper.js

(async function()
{
    await JSHelper.Notifier.waitFor(JSHelper.GlobalEvents.PAGE_SETUP_COMPLETE);
    
    const themeSwitch = document.querySelector("button#changeTheme");
    const root = document.querySelector(":root");

    root.setAttribute("data-theme", StorageHelper.get("data-theme"));

    themeSwitch.addEventListener("click", async () =>
    {
        const currentTheme = root.getAttribute("data-theme");
        let newTheme = "light";

        if (currentTheme != "dark")
        {
            newTheme = "dark";
        }

        root.setAttribute("data-theme", newTheme);
        StorageHelper.put("data-theme", newTheme);

        // See https://medium.com/@mwichary/dark-theme-in-a-day-3518dde2955a
        root.classList.add("transitioning-color-theme");
        await JSHelper.waitFor(1000); // In milliseconds.

        root.classList.remove("transitioning-color-theme");
    });
})();
