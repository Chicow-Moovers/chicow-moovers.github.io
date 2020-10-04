let time;
let deltaTime;
let thrustForce;
let mass;
let mrel;
let destinationDistance;
let maxSpeed;
let progress;
let totalDistance;
let travelDistance;
let previousTime;
let propulsionType;
let velocity;
let stopped;
let lastRes, startTime;
let fullDelta;
const c = 299800000;

// Occurs on play
var Setup = (propulsion, m, distKm, thrust) => {
        time = 0
        previousTime = 0;
        startTime = 0;
        propulsionType = propulsion;
        mass = m;
        velocity = 0;
        travelDistance = 0;
        stopped = false;
/* */
        //Distance units in METERS, very important
        destinationDistance = distKm * 1000;
        totalDistance = distKm;
        thrustForce = thrust || 0;

        fullDelta = 0;
};

var GetProgress = (multiplier) => {
        if (stopped)
        {
            return lastRes;
        }

        time = new Date().getTime() / 1000; // 1 month*multiplier's worth of seconds. [Note] The month part confuses me...

        if (!startTime)
        {
            startTime = time;
        }

        if (!previousTime)
        {
            previousTime = time;
        }

        deltaTime = (time - previousTime) * multiplier * 60 * 60 * 24;

        if (propulsionType != "Alcubierre Drive"){
                mrel = mass/Math.sqrt(1-Math.pow(velocity,2) / Math.pow(c,2));
                velocity += thrustForce/mrel * deltaTime;
                travelDistance += velocity * deltaTime;

                //console.log(mrel + "; " + velocity + "; " + travelDistance);
        }
        else {
                travelDistance += 500000000;
        }

        progress = travelDistance/1000/totalDistance;
        previousTime = time;

        if (progress >= 1){
            // Stop(); Removed because Stop calls GetProgress
            stopped = true;
            progress = 1;
        }

        fullDelta += deltaTime;

        lastRes = [progress, fullDelta / 60/60/24, mrel || mass];
        return lastRes;
};
/* */
var Stop = () => {
    stopped = true;
    let times = 1;
    while (progress < 1) {
        GetProgress(times);

        times *= 2;
        times=  Math.abs(times);

        if (times > 10e9)
        {
            break;
        }
    }

    return lastRes;
};