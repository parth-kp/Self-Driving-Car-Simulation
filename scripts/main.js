const canvas = document.getElementById("myCanvas"); //Getting Canvas
canvas.height=window.innerHeight; // Setting height to full window size to give it a feel of road
canvas.width=450;

const ctx=canvas.getContext("2d"); //Canvas.Context for puting up car in canvas

const car = new Car(225,100,30,50);

animate();

function animate(){
    car.update();
    canvas.height=window.innerHeight;
    car.draw(ctx);
    requestAnimationFrame(animate);
}

