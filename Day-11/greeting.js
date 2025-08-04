const Date = new Date();

currentTime = Date.currentTime()

function greet() {

    if (currentTime>12) {
        console.log("good afternoon");
    }
    else if (currentTime>17) {
        console.log("good evening");
    }
    else if (currentTime>17||currentTime<5) {
        console.log("good night");
    }
};

module.exports = { greet };
