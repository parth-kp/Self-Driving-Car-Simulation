const canvas = document.getElementById("myCanvas"); //Getting Canvas
canvas.height=window.innerHeight; // Setting height to full window size to give it a feel of road
canvas.width=300;

const ctx=canvas.getContext("2d"); //Canvas.Context for puting up car in canvas

const road = new Road(canvas.width/2,canvas.width);
const car = new Car(road.getLaneCenter(1),(canvas.height-50),30,50);
animate();

function animate(){
    car.update();
    canvas.height=window.innerHeight;

    ctx.save();
    ctx.translate(0,-car.y+canvas.height*0.7)

    road.draw(ctx);
    car.draw(ctx);

    ctx.restore();
    requestAnimationFrame(animate);
}

