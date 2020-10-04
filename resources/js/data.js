"use strict";

// In km
const PLANET_DISTANCES =
{
    Mercury:	91_691_000,
    Venus:  	41_400_000,
    Mars:   	78_340_000,
    Jupiter:	628_730_000,
    Saturn: 	1_275_000_000,
    Uranus: 	2_723_950_000,
    Neptune:	4_351_400_000,
    Pluto:  	7_500_000_000,
    Moon:   	384_400,
};

// km /s
const FIXED_SPEEDS =
{
    "Alcubierre Drive": 500_000_000, 
}

// N
const FORCE_VALUES =
{
    EmDrive: 0.2,
    "Iodine RF Ion Thruster": 0.0012,
    VASIMR: 5,
    "Solar Sail": 0.000058,
    "Arkjet - MR210": 0.25,
};

const PROPULSION_TYPES = (function()
{
    let result = [];

    for (const name in FORCE_VALUES)
    {
        result[name] = true;
    }

    for (const name in FIXED_SPEEDS)
    {
        result[name] = true;
    }

    return result;
})();

// In kg
const SAT_MASS =
{
    "Cube Sat": 1.33,
    "Voyager 1": 733,
    "GSAT-11": 5_854,
    "New Glenn": 13_000,
    "Saturn V": 140_000,
    "SpaceX' Interplanetary Transport System": 2_400_000,
};

const TILE_ICON_URLS = {};