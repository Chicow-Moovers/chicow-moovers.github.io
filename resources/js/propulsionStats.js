"use strict";

// Note: themeSwitch.js is rather over-commented. It may be helpful,
// it may not be...

// Function forward-declarations.
let handleTileGroup;
let StatTextDisplayManager;

// We use async here so we can use await inside this function...
const main = async function()
{
    // Wait for page load...
    await JSHelper.Notifier.waitFor(JSHelper.GlobalEvents.PAGE_SETUP_COMPLETE);


    const fillTileGroups = (classNS, data) =>
    {
        const parent = document.querySelector(`.tiles.${classNS}`);

        for (const name in data)
        {
            const tile = document.createElement("div");

            tile.classList.add("tile");
            tile.setAttribute("name", name);

            const img = document.createElement("img");
            img.src = TILE_ICON_URLS[name] || "./resources/ui/favicon.svg";

            const description = document.createElement("div");
            description.textContent = name;

            tile.appendChild(img);
            tile.appendChild(description);

            parent.appendChild(tile);
        }
    };

    fillTileGroups("propulsionChoice", PROPULSION_TYPES);
    fillTileGroups("planetChoice", PLANET_DISTANCES);
    fillTileGroups("objectChoice", SAT_MASS);

    // Get elements using CSS query-selectors.
    const statArea = document.querySelector(".propulsionStats");
    const canvas = document.querySelector(".propulsionStats canvas");
    const tiles = document.querySelectorAll(".propulsionStats .tiles .tile");

    const propulsionOptions = handleTileGroup("propulsionChoice");
    const planetOption = handleTileGroup("planetChoice");
    const objectOption = handleTileGroup("objectChoice");

    const statDisplayManager = new StatTextDisplayManager();

    // Update informational displays.
    planetOption.setOnChange((planet) =>
    {
        let dist = PLANET_DISTANCES[planet];
        statDisplayManager.update(statDisplayManager.keys.DISTANCE, dist, 2); //... 
    });

    objectOption.setOnChange((object) =>
    {
        let mass = SAT_MASS[object];
        statDisplayManager.update(statDisplayManager.keys.MASS, mass, 2);
    });

    propulsionOptions.setOnChange((object) =>
    {
        let key = statDisplayManager.keys.THRUST;

        if (FIXED_SPEEDS[object])
        {
            statDisplayManager.update(key, 'N/A -- Provides fixed ' + FIXED_SPEEDS[object] + " km / s speed");
            return;
        }

        let thrust = FORCE_VALUES[object];
        statDisplayManager.update(key, thrust, 2);
    });

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

            }

            ctx.save();

            ctx.font = "18pt serif";
            ctx.textAlign = "left";
            ctx.textBaseline = "top";

            ctx.strokeText("Testing", ctx.canvas.width / 2, ctx.canvas.height / 2);

            ctx.restore();

            //let time = (new Date()).getTime(); // Milliseconds
            //ctx.fillRect(x, y, width, height);

            // Pause...
            await JSHelper.nextAnimationFrame();
        }
    });


    updateCtxLoop();
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
handleTileGroup = (groupClassNS, onchange) =>
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

            if (onchange)
            {
                onchange(activeTilename, tileElem);
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

        "setOnChange": (listener) =>
        {
            onchange = listener;
        }
    };



    return result;
};

StatTextDisplayManager = (function()
{
    this.keys = 
    {
        THRUST: "THRUST",
        DISTANCE: "DISTANCE",
        MASS: "MASS",
    };

    const valid =
    {

    };

    const displays = 
    {
        THRUST: document.querySelector(".stats #thrust"),
        DISTANCE: document.querySelector(".stats #distance"),
        MASS: document.querySelector(".stats #mass"),
    }

    const displayLabels =
    {
        THRUST: "Thrust (N): ",
        DISTANCE: "Total Distance (km): ",
        MASS: "Object Mass (kg): ",
    };

    this.update = (display, value, decimalPlaces) =>
    {
        let text = value;

        if (decimalPlaces !== undefined && value !== undefined)
        {
            text = value.toExponential(decimalPlaces).replace(/e/g, " * 10^").replace(/[+]/g, "");
        }

        if (value === undefined || value === null)
        {
            text = "...";
            valid[display] = false;
        }
        else
        {
            valid[display] = true;
        }


        displays[display].textContent = displayLabels[display] + text;
    };

    this.isValid = () =>
    {
        for (const display in this.keys)
        {
            if (!valid[display])
            {
                return false;
            }
        }

        return true;
    };

    for (const display in this.keys)
    {
        this.update(display);
    }
});


main();
