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
    "Alcubierre Drive": 500_000, 
}

// N
const FORCE_VALUES =
{
    EmDrive: 0.2,
    "Iodine RF Ion Thruster": 0.0012,
    VASIMR: 5,
    "SuperDraco - SpaceX": 71_000,
    "Arkjet - MR210": 0.25,
};