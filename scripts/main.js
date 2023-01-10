const canvas = document.getElementById("myCanvas"); //Getting Canvas
canvas.height=window.innerHeight; // Setting height to full window size to give it a feel of road
canvas.width=300;

const ctx=canvas.getContext("2d"); //Canvas.Context for puting up car in canvas
const road = new Road(canvas.width/2,canvas.width);
const car = new Car(road.getLaneCenter(1),100,45,75,"AI");
const traffic=[
    new Car(road.getLaneCenter(1),-100,45,75,"DUMMY",2),
    new Car(road.getLaneCenter(0),-350,45,75,"DUMMY",2),
    new Car(road.getLaneCenter(2),-350,45,75,"DUMMY",2),
    new Car(road.getLaneCenter(0),-600,45,75,"DUMMY",2),
    new Car(road.getLaneCenter(1),-600,45,75,"DUMMY",2),
    new Car(road.getLaneCenter(1),-850,45,75,"DUMMY",2),
    new Car(road.getLaneCenter(2),-850,45,75,"DUMMY",2),
];

animate();

function animate(){
    for (let i = 0; i < traffic.length; i++) {
        traffic[i].update(road.borders,[]);
    }
    car.update(road.borders,traffic);
    canvas.height=window.innerHeight;

    ctx.save();
    ctx.translate(0,-car.y+canvas.height*0.7)

    road.draw(ctx);
    for (let i = 0; i < traffic.length; i++) {
       traffic[i].draw(ctx);
    }
    car.draw(ctx);
    

    ctx.restore();
    requestAnimationFrame(animate);
}

