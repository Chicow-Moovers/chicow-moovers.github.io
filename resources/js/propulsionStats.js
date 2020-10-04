"use strict";

// Note: themeSwitch.js is rather over-commented. It may be helpful,
// it may not be...

// Function forward-declarations.
let handleTileGroup;
let StatTextDisplayManager, SimulationState;

// We use async here so we can use await inside this function...
const main = async function()
{
    // Wait for page load...
    await JSHelper.Notifier.waitFor(JSHelper.GlobalEvents.PAGE_SETUP_COMPLETE);

    let simulationState = null;


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
    const controls = document.querySelector(".controls");
    const startButton = document.querySelector(".controls #start");
    const stopButton = document.querySelector(".controls #stop");
    const multip      = document.querySelector(".controls #rate");
    const runningTray = document.querySelector(".controls #while-running");
    const pendingTray = document.querySelector(".controls #pre-start");

    // Hide the controls until the user has entered input.
    controls.style.display = "none";
    controls.classList.add("hidden");

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

    const ctx = canvas.getContext("2d");

    const handleInvalidCase = () =>
    {
        simulationState = null; // Invalidate our state obj.


        let time = (new Date()).getTime();

        ctx.save();

        ctx.fillStyle = "white";
        ctx.font = "bold 18pt courier, calibri, mono, monospace";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        let loadingText = "";

        for (let i = 0; i < 3; i++)
        {
            if (Math.tan(time / 1000 + i * Math.PI * 2 / 3) > 0)
            {
                loadingText += '.';
            }
            else
            {
                loadingText += ' ';
            }
        }

        let invalReason = "";

        if (statDisplayManager.getIsInvalid(statDisplayManager.keys.THRUST))
        {
            invalReason = "A PROPULSION SYSTEM";
        }
        else if (statDisplayManager.getIsInvalid(statDisplayManager.keys.DISTANCE))
        {
            invalReason = "A DESTINATION";
        }
        else if (statDisplayManager.getIsInvalid(statDisplayManager.keys.MASS))
        {
            invalReason = "AN OBJECT";
        }

        ctx.fillText(loadingText, ctx.canvas.width / 2, ctx.canvas.height / 2);


        ctx.fillText(`[ SELECT ${invalReason} ]`, ctx.canvas.width / 2, ctx.canvas.height / 2 - ctx.measureText("M.").width);

        ctx.restore();
    };

    const handleValidCase = () =>
    {
        if (simulationState == null)
        {
            const propName = propulsionOptions.getCurrentTileName();
            const thrust   = FORCE_VALUES[propName]       || 0;
            const vel      = FIXED_SPEEDS[propName] || 0;

            const objName = objectOption.getCurrentTileName();
            const mass = SAT_MASS[objName] || 0;

            const target = planetOption.getCurrentTileName();
            const dist = PLANET_DISTANCES[target];

            simulationState = new SimulationState(
                {
                    thrust: thrust,
                    vel: vel,
                    propLabel: propName,

                    mass: mass,
                    objName: objName,

                    dist: dist,
                }
            );
        }
        else
        {
            simulationState.setMult(multip.value);

            if (!stopped)
            {
                simulationState.step();
            }

            let progress = simulationState.getProgress();
            let dist = simulationState.getDistTraveled();
            let days = simulationState.getDays();

            if (progress >= 1)
            {
                stopped = true;
            }

            ctx.save();

            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, ctx.canvas.width * progress, ctx.canvas.height);

            ctx.fillStyle = "grey";
            ctx.font = "bold 18pt courier, calibri, mono, monospace";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";

            let textHeight = ctx.measureText("M.").width;

            ctx.fillText(fmtExp((days / 7).toExponential(2)) + " week(s) elapsed", ctx.canvas.width / 2, ctx.canvas.height / 2);
            ctx.fillText(fmtExp(dist.toExponential(2)) + " km traveled", ctx.canvas.width / 2, ctx.canvas.height / 2 - textHeight);
            ctx.fillText(Math.round(progress * 100 * 10) / 10 + "%", ctx.canvas.width / 2, ctx.canvas.height / 2 + textHeight);

            let dtWeek = (multip.value / 7).toExponential(2);
            ctx.font = "bold 14pt courier, calibri, mono, monospace";
            ctx.fillText(fmtExp(dtWeek) + " simulation-week(s) pass per second", ctx.canvas.width / 2, ctx.canvas.height / 2 + textHeight * 2);

            ctx.restore();
        }
    };

    let waitingForClick = false;
    let stopped = false;

    let showingControls = false;
    let showingRunningControls = false;

    let showControls = () =>
    {
        if (!showingControls)
        {
            controls.classList.remove("hidden");
            controls.style.display = "block";
            showingControls = true;
        }

        if (showingRunningControls && waitingForClick)
        {
            runningTray.classList.add("hidden");
            pendingTray.classList.remove("hidden");
            showingRunningControls = false;
        }
        
        if (!showingRunningControls && !waitingForClick && !stopped)
        {
            runningTray.classList.remove("hidden");
            pendingTray.classList.add("hidden");
            showingRunningControls = true;
        }
        
        if (stopped && showingRunningControls)
        {
            runningTray.classList.add("hidden");
            pendingTray.classList.remove("hidden");
            showingRunningControls = false;
        }
    };

    let hideControls = () =>
    {
        if (showingControls)
        {
            showingControls = false;
            controls.classList.add("hidden");
            pendingTray.classList.remove("hidden");
            runningTray.classList.add("hidden");
            controls.style.display = "none";
        }

    };

    startButton.addEventListener("click", () =>
    {
        if (stopped)
        {
            simulationState = null; // Reset.
        }

        waitingForClick = false;
        stopped = false;
        showControls();
    });

    stopButton.addEventListener("click", () =>
    {
        stopped = true;
        hideControls();
    });

    // Display the current status...
    const updateCtxLoop = 
    (async function()
    {
        while (true)
        {
            // Do we need to redraw?
            if (canvas.clientWidth != canvas.width || canvas.clientHeight != canvas.height)
            {
                canvas.width = canvas.clientWidth;
                canvas.height = canvas.clientHeight;
            }

            ctx.save();

            ctx.fillStyle = "black";
            ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

            ctx.restore();

            if (!statDisplayManager.isValid())
            {
                hideControls();

                handleInvalidCase();
                waitingForClick = true;
            }
            else if (!waitingForClick)
            {
                showControls();
                handleValidCase();
            }
            else
            {
                showControls();
            }

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
            text = fmtExp(value.toExponential(decimalPlaces));
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


    this.getIsInvalid = (display) =>
    {
        return !valid[display];
    };

    for (const display in this.keys)
    {
        this.update(display);
    }
});

SimulationState = (function(state)
{
    /*
    stat:
        thrust: thrust in N,
        vel: vel in km/s,
        propLabel: Name of the propellant,

        mass: mass in kg,
        objName: Name of the satellite/objecth,

        dist: distance to travel,
    */

    let distGone = 0;
    let started = false;
    let mult = 1;
    let dt = 0, mRel= 0;

    this.step = () =>
    {
        if (!started)
        {
            console.log(state);
            Setup(state.propLabel, state.mass, state.dist, state.thrust);
            started = true;
        }
        else
        {
            let tuple = GetProgress(mult);

            //console.log(tuple);

            progress = tuple[0];
            distGone = progress * state.dist;
            mRel = tuple[2];
            dt = tuple[1];
        }
    };

    this.setMult = (newMultiplier) =>
    {
        mult = newMultiplier;
    };

    this.getDistTraveled = () =>
    {
        return distGone;
    };

    this.getProgress = () =>
    {
        return distGone / state.dist;
    };

    this.getDays = () =>
    {
        return dt;
    };
});

function fmtExp(text)
{
    return text.replace(/e/g, " * 10^").replace(/[+]/g, "");
}


main();
