"use strict";

// Note: themeSwitch.js is rather over-commented. It may be helpful,
// it may not be...

// Function forward-declarations.
let handleTileGroup;

// We use async here so we can use await inside this function...
const main = async function()
{
    // Wait for page load...
    await JSHelper.Notifier.waitFor(JSHelper.GlobalEvents.PAGE_SETUP_COMPLETE);

    // Get elements using CSS query-selectors.
    const statArea = document.querySelector(".propulsionStats");
    const canvas = document.querySelector(".propulsionStats canvas");
    const tiles = document.querySelectorAll(".propulsionStats .tiles .tile");

    const propulsionOptions = handleTileGroup("propulsionChoice");
    const planetOption = handleTileGroup("planetChoice");
    const objectOption = handleTileGroup("objectChoice");

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

            //let time = (new Date()).getTime(); // Milliseconds
            //ctx.fillRect(x, y, width, height);

            // Pause...
            await JSHelper.nextAnimationFrame();
        }
    });


    updateCtxLoop(); // Loop, loop, loop. But lets us run everything below here first.
};

///  Handle a single group of .tiles
/// This group should have classes `.tiles` and
/// [groupClassNS].
///  Allow users to select one in a group
/// of tiles.
///
/// Returns an object with methods:
///     getCurrentTileName() ----> Returns the "name"
///         attribute of the current tile.
///     setSelectedTile(name) ----> Select the tile with attr name=[name].
handleTileGroup = (groupClassNS) =>
{
    // Note: `.tiles${groupClassNS} .tile` is equivalent to ".tiles" + groupClassNS + " .tile".
    const tiles = document.querySelectorAll(`.tiles.${groupClassNS} .tile`);
    let tilesByName = {};

    let activeTilename = null;

    const handleTile = (tileElem) =>
    {
        const name = tileElem.getAttribute("name");

        if (!name)
        {
            throw new Error("All .tile elements must have a name attribute!" +
            " Consider setting name='something' on element: " + tileElem.outerHTML);
        }

        tilesByName[name] = tileElem;

        tileElem.addEventListener("click", () =>
        {
            if (name == activeTilename)
            {
                activeTilename = null;
                tileElem.classList.remove("selected");
            }
            else
            {
                if (activeTilename in tilesByName)
                {
                    let activeTile = tilesByName[activeTilename];

                    activeTile.classList.remove("selected");
                }

                tileElem.classList.add("selected");
                activeTilename = name;
            }
        });
    };

    // Allow tiles to be selected/unselected.
    for (const tile of tiles)
    {
        handleTile(tile);
    }

    const result =
    {
        "getCurrentTileName": () =>
        {
            return activeTilename;
        },

        "setSelectedTile": (name) =>
        {
            if (name in tilesByName)
            {
                activeTilename = name;
            }
            else
            {
                activeTilename = null;
            }
        },
    };



    return result;
};


main();
