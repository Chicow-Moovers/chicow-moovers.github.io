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
let isStopped;
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
        isStopped = false;
/* */
        //Distance units in METERS, very important
        destinationDistance = distKm * 1000;
        totalDistance = distKm;
        thrustForce = thrust || 0;

        fullDelta = 0;
};

var GetProgress = (multiplier, additionalTime) => {
        if (isStopped)
        {
            return lastRes;
        }

        time = new Date().getTime() / 1000;
        time += additionalTime || 0;

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
                mrel = mass / Math.sqrt(1 - Math.pow(velocity / c, 2));
                console.log(Math.pow(velocity / c, 2));

                velocity += thrustForce/mrel * deltaTime;
                travelDistance += velocity * deltaTime;

                //console.log(mrel + "; " + velocity + "; " + travelDistance);
        }
        else {
                travelDistance += 500000000;
                mrel = mass;
        }

        progress = travelDistance/1000/totalDistance;
        previousTime = time;

        if (progress >= 1){
            // Stop(); Removed because Stop calls GetProgress
            isStopped = true;
            progress = 1;
        }

        fullDelta += deltaTime;

        lastRes = [progress, fullDelta / 60/60/24, mrel];
        return lastRes;
};
/* */
var Stop = () => {
    let times = 1;
    let iterations = 1;
    while (progress < 1) {
        GetProgress(times, iterations); // Add extra time
        console.log(progress + "; times: " + times + "; " + isStopped);

        times *= 1.03;
        times = Math.abs(times);
        iterations += 1;

        if (times > 10e9)
        {
            break;
        }
    }

    isStopped = true;

    return lastRes;
};