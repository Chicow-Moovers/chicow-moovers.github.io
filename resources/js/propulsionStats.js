"use strict";

/**
 *  This script is intended entirely to demonstrate
 *  CSS-related functionality of the current layout.
 *
 *  IT WILL BE REPLACED.
 */

(async function()
{
    await JSHelper.Notifier.waitFor(JSHelper.GlobalEvents.PAGE_SETUP_COMPLETE);

    const statArea = document.querySelector(".propulsionStats");
    const canvas = document.querySelector(".propulsionStats canvas");
    const tiles = document.querySelectorAll(".propulsionStats .tiles .tile");

    // Display a message on the canvas
    const updateCtx = 
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
            }

            // Pause...
            await JSHelper.nextAnimationFrame();
        }
    });

    updateCtx();

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
