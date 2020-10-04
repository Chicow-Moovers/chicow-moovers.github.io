"use strict";

// Note: themeSwitch.js is rather over-commented. It may be helpful,
// it may not be...

// We use async here so we can use await inside this function...
(async function()
{
    // Wait for page load...
    await JSHelper.Notifier.waitFor(JSHelper.GlobalEvents.PAGE_SETUP_COMPLETE);

    // Get elements using CSS query-selectors.
    const statArea = document.querySelector(".propulsionStats");
    const canvas = document.querySelector(".propulsionStats canvas");
    const tiles = document.querySelectorAll(".propulsionStats .tiles .tile");

    // Display the current status...
    const updateCtxLoop = 
    (async function()
    {
        const ctx = canvas.getContext("2d");

        while (true)
        {
            // Do we need to redraw?
            if (canvas.clientWidth != canvas.width || canvas.clientHeight != canvas.height)
            {
                canvas.width = canvas.clientWidth;
                canvas.height = canvas.clientHeight;

                ctx.save();

                ctx.font = "18pt serif";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";

                ctx.strokeText("Testing", ctx.canvas.width / 2, ctx.canvas.height / 2);

                ctx.restore();
            }

            let time = (new Date()).getTime(); // Milliseconds
            ctx.fillRect(x, y, width, height);

            // Pause...
            await JSHelper.nextAnimationFrame();
        }
    });

    updateCtxLoop(); // Loop, loop, loop. But lets us run everything below here first.

    let activeTile = null; // Initially, no active tile.

    // Allow tiles to be selected/unselected.
    for (const tile of tiles)
    {
        tile.addEventListener("click", () =>
        {
            if (tile == activeTile)
            {
                activeTile = null;
                tile.classList.remove("selected");
            }
            else
            {
                if (activeTile)
                {
                    activeTile.classList.remove("selected");
                }

                tile.classList.add("selected");
                activeTile = tile;
            }
        });
    }
})();
