function getRandomNumber() {
    //random number between 1 and 100
    let number = Math.floor(Math.random() * 100) + 1;
    return number
}

//1, Select the HTML element in JS:
const canvas_1 = document.getElementById("canvas-1"); //JS value is linked, so the correct gets updated
const landingContainer = document.getElementById("landing-container");
const context_1 = canvas_1.getContext("2d");              //Default command, so it knows to interpret as 2D drawing.

const currentItemList = [];
const speedMultiplier = 1;
const amountOfItems_1 = 30;

//Needed for mouse repelling to work
let mouseX = null;
let mouseY = null;

//Update on mouse move
landingContainer.addEventListener('mousemove', (e) => {
    const containerRect = landingContainer.getBoundingClientRect();
    const canvasRect = canvas_1.getBoundingClientRect();

    //Ehh, catch-22 issue here. Technically the CSS "place-items: center;" stretches (?) the container.
    //This makes the mouse offset with distance, and this is to reset when checking.
    //If the CSS is removed, then the grid/centering with alternatives are issues as well.
    const offsetX = canvasRect.left - containerRect.left;
    const offsetY = canvasRect.top - containerRect.top;

    mouseX = e.clientX - containerRect.left - offsetX;
    mouseY = e.clientY - containerRect.top - offsetY;
});

landingContainer.addEventListener('mouseleave', () => {
    mouseX = null;
    mouseY = null;
});

//Debugging needed as each method is different amount FOR DIFFERENT BROWSERS!
//Firefox and Chrome are not pixel-perfect same, sometimes having completely different values.
//The "document.documentElement.clientWidth" method is used later as the only good solution. Does not include scrollbars!
/*
function debugCanvas() {
    const rect = canvas_1.getBoundingClientRect();

    const vw1 = Math.floor(rect.width);
    const vh1 = Math.floor(rect.height);
    console.log("method 1, rect.width", vw1)
    const vw2 = document.documentElement.clientWidth;
    const vh2 = document.documentElement.clientHeight;
    console.log("method 2, document.documentElement.clientWidth", vw2)
    const vw3 = window.innerWidth;
    const vh3 = window.innerHeight;
    console.log("method 3, window.innerWidth", vw3)
    const vw4 = screen.width;
    const vh4 = screen.height;
    console.log("method 4, screen.width", vw4)
    const vw5 = window.visualViewport.width;
    const vh5 = window.visualViewport.height;
    console.log("method 5, window.visualViewport.width", vw5)
}
debugCanvas()
*/

function getViewportSize() {
    return {
        width: document.documentElement.clientWidth,
        height: document.documentElement.clientHeight
    };
}

//Resizes for mobile width based on viewport.
function resizeCanvas() {
    const { width: vw, height: vh } = getViewportSize();
    canvas_1.width = Math.min(vw, 1280);
    canvas_1.height = Math.min(vh, 720);
    canvas_1.style.width = canvas_1.width + 'px';
    canvas_1.style.height = canvas_1.height + 'px';
}


//2, Create the re-useable Constructors in JS:
class Circle {
    constructor(x, y, radius, options = {}) {
        this.x = x;              //this.x is the input X value
        this.y = y;              //this.y is the input Y value
        this.radius = radius;    //this.radius is the input radius value
        this.color = options.color; //this.color is the input Options color value
        // Velocity (random x and y speed between -3 and 3)
        this.vx = (Math.random() - 0.5) * speedMultiplier;
        this.vy = (Math.random() - 0.5) * speedMultiplier;
    }


    //Needed for animation to update each frame
    update(canvasWidth, canvasHeight) {
        //Repelling function added
        if (mouseX !== null && mouseY !== null) {
            const dx = this.x - mouseX;
            const dy = this.y - mouseY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            const repelDistance = 100;

            if (distance < repelDistance && distance > 0) {
                // If the distance is very small, give it a higher escape momentum.
                const escapeMomentum = distance < 20 ? 10 : 5;

                const nx = dx / distance;
                const ny = dy / distance;

                const dot = this.vx * nx + this.vy * ny;

                // Reflect velocity and add the escape momentum to move out of the radius
                this.vx = this.vx - 2 * dot * nx;
                this.vy = this.vy - 2 * dot * ny;

                // Push the particle out
                this.x += this.vx + escapeMomentum * nx;
                this.y += this.vy + escapeMomentum * ny;
            }
        }

        // Continue standard velocity motion
        this.x += this.vx;
        this.y += this.vy;

        // Bounce off canvas walls
        if (this.x - this.radius <= 0 || this.x + this.radius >= canvasWidth) {
            this.vx *= -1;
            this.x = Math.max(this.radius, Math.min(this.x, canvasWidth - this.radius));
        }

        if (this.y - this.radius <= 0 || this.y + this.radius >= canvasHeight) {
            this.vy *= -1;
            this.y = Math.max(this.radius, Math.min(this.y, canvasHeight - this.radius));
        }
    }


    //3, Add the Drawing part (within the class, so it's also drawn without needing 2nd function.    
    draw(context_1, options = {}) {

        //Default settings for options. Ensures everything starts as basic, unless instructed and no bleedover of details.
        const {
            fillStyle = this.color,
            strokeStyle = null,
            shadowColor = 'rgba(255, 255, 255, 0.9)',
            shadowBlur = 20,
            useStroke = false,
        } = options;

        context_1.save();

        context_1.beginPath();                                          //Start a new shape
        context_1.arc(this.x, this.y, this.radius, 0, Math.PI * 2);     //Say it'll be a circle
        context_1.fillStyle = fillStyle;                                //Set a fill color, default is black
        context_1.shadowColor = shadowColor;                            //Add a "glow" color around the item
        context_1.shadowBlur = shadowBlur;                              //Set the blurring size/radius

        //Use Stroke when istructed, otherwise default to Fill.
        if (useStroke) {
            context_1.strokeStyle = strokeStyle || fillStyle;
            context_1.stroke();
        } else {
            context_1.fill();
        }

        context_1.restore();
    }

};


//Running the window size check for mobile, otherwise it will stretch
resizeCanvas()
window.addEventListener('resize', () => {
    resizeCanvas();
});

//4, Create an item and actually call the above function to fill it:
function drawForContainer1() {

    for (let i = 0; i < amountOfItems_1; i++) {
        //Parameters, randomised here for variety
        const x = Math.random() * canvas_1.width;   //We define x0 based on the container width.
        const y = Math.random() * canvas_1.height;  //We define y0 based on the container height.


        //Parameters, randomised here for variety
        const radius = 4
        const colors = ['rgba(255, 255, 255, 0.9)',/*'white', blue', 'yellow',  'green', 'orange', 'purple'*/]; //Add whatever colors wanted
        const color = colors[Math.floor(Math.random() * colors.length)];

        currentItemList.push(new Circle(x, y, radius, { color }));
    }
}

//Call the function once
drawForContainer1()

//Animation loop
function animate() {
    //Clear the canvas, failsafe to ensure it doesnt stack
    context_1.clearRect(0, 0, canvas_1.width, canvas_1.height);


    //added as it improves performance ?
    const length = currentItemList.length;
    //Draw lines between nearby circles
    for (let i = 0; i < length; i++) {
        for (let j = i + 1; j < length; j++) {
            const a = currentItemList[i];
            const b = currentItemList[j];

            const dx = a.x - b.x;
            const dy = a.y - b.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            const maxDist = 200;
            const minLineWidth = 1;
            const maxLineWidth = 10;

            if (dist < maxDist) {

                // Invert scale: closer = thicker
                const lineWidth = Math.max(
                    minLineWidth,
                    maxLineWidth * ((100 - dist) / 100)
                );

                // 1. Glow effect with a wide blurred transparent stroke
                context_1.save();

                context_1.beginPath();
                context_1.moveTo(a.x, a.y);
                context_1.lineTo(b.x, b.y);
                context_1.lineWidth = lineWidth; // Slightly wider than main line
                context_1.strokeStyle = 'rgba(181, 0, 252, 0.9)';
                context_1.shadowColor = 'rgb(255, 255, 255)';
                context_1.shadowBlur = 12;
                context_1.stroke();

                context_1.restore();

            }
        }
    }

    //Update and draw all circles
    for (let circle of currentItemList) {
        circle.update(canvas_1.width, canvas_1.height);
        circle.draw(context_1);
    }

    requestAnimationFrame(animate);
}

// 5. Start animation
animate();