"use strict";

// Suggests /LibJS/Libs/JSHelper.js
// Requires /LibJS/Libs/StorageHelper.js
// ^ See comment in `index.html` about ES6 modules. 
//    JavaScript does support `import` statements...

// Initialize the theme-switching element.
// Note: `async` lets us use the `await` statement.
//       See https://javascript.info/async ?
async function setup()
{
    // Note: JSHelper.GlobalEvents.PAGE_SETUP_COMPLETE
    //     is just a string with a value like "page_setup_complete". The
    //     Notifier is just a convenient way of waiting for custom events.

    // At the bottom of `index.html`, we have
    // JSHelper.Notifier.notify(JSHelper.GlobalEvents.PAGE_SETUP_COMPLETE)
    // Here, we wait for that to happen so we don't try to use the themeSwitch
    // before it has been created!
    await JSHelper.Notifier.waitFor(JSHelper.GlobalEvents.PAGE_SETUP_COMPLETE);
    
    //  Get themeSwitch and root using CSS selectors. Note that `:root` is
    // the same thing as `html`. `:root` is used here because that's the
    // CSS selector we're using in main.css. 
    //
    //   document.querySelector("button#changeTheme") gives us the FIRST
    // button on the page with an ID of "changeTheme".
    const themeSwitch = document.querySelector("button#changeTheme");
    const root = document.querySelector(":root");

    // Here, we just set attributes. 
    // Say root looked like this before these lines: <html> ... stuff ... </html>
    root.setAttribute("data-theme", StorageHelper.get("data-theme"));
    themeSwitch.setAttribute("title", "Toggle dark mode.");
    // It would now look something like this: <html data-theme=whatever_storagehelper_gave_us> ... </html>
    // We also change themeSwitch: <button title="Toggle dark mode." ...
    //  title is for screen readers & the popup dialog that appears when users
    //  hover their mouse over the button.

    // When a user clicks on themeSwitch...
    themeSwitch.addEventListener("click", 
    /// We're going to run this function (again, async lets us use await):
    async () =>
    {
        // Get whatever the data-theme attribute's value is on html. E.g.
        // sets currentTheme to `dark` if root looks like:
        // <html data-theme="dark">...</html>
        const currentTheme = root.getAttribute("data-theme");

        let newTheme = "light";

        if (currentTheme != "dark")
        {
            newTheme = "dark";
        }

        root.setAttribute("data-theme", newTheme);
        StorageHelper.put("data-theme", newTheme); // Save the user's setting. This uses either cookies or localstorage. !!! Do we need a popup that says we use cookies? !!!

        // This idea taken from
        // https://medium.com/@mwichary/dark-theme-in-a-day-3518dde2955a
        root.classList.add("transitioning-color-theme"); // Start transition effects in CSS!!!
        await JSHelper.waitFor(1000); // Wait one second, then....

        root.classList.remove("transitioning-color-theme"); // we are no longer transitioning.
    });
}

setup();
