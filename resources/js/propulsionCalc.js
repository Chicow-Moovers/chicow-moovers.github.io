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
let lastRes;
const c = 299800000;

// Occurs on play
var Setup = (propulsion, m, distKm) => {
        totalDistance = Math.abs(destination - origin);
        time = 0
        previousTime = new Date().getTime();
        propulsionType = propulsion;
        mass = m;
        velocity = 0;
        travelDistance = 0;
        stopped = false;
/* */
        //Distance units in METERS, very important
        destinationDistance = distKm * 1000;
};

var GetProgress = (multiplier) => {
        if (stopped)
        {
            return lastRes;
        }

        time = new Date().getTime() / 1000 * 60 * 60 * 24 * multiplier; // 1 month*multiplier's worth of seconds. [Note] The month part confuses me...

        if (stopped == false){
                deltaTime = time - previousTime;
        }
        else{
                deltaTime = 60 * 60 * 24;
        }

        if (propulsionType == "Solar Sail"){
                thrustForce = .000058;
        }
        if (propulsionType == "emDrive"){
                thrustForce = .02;
        }
        if (propulsionType == "Ion Thruster"){
                thrustForce = .0012;
        }
        if (propulsionType == "Vasimr"){
                thrustForce = 5;

        }
        if (propulsionType == "Arkjet"){
                thrustForce = .25;

        }
        for (let i = 0; i <= Math.floor(deltaTime); i++){
                if (propulsionType != "Alcubierre Drive"){
                        mrel = mass/Math.sqrt(1-Math.exp(velocity,2) / Math.exp(c,2));
                        velocity += thrustForce/mrel;
                        travelDistance += velocity ;
                }
                else {
                        travelDistance += 500000000;
                }
        }

/* */        let delTime = time - previousTime;
        progress = travelDistance/totalDistance;
        previousTime = time;

        if (progress >= 1){
            // Stop(); Removed because Stop calls GetProgress
            stopped = true;
            progress = 1;
        }

        lastRes = [progress, delTime/60/60/24, mrel];
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