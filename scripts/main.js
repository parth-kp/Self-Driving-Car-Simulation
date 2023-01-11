const carCanvas = document.getElementById("carCanvas"); //Getting Car Canvas
carCanvas.width=300;

const controlType = prompt("Enter Y: Let AI drive Car\nEnter N: Let You drive Car", 'Y')

const networkCanvas = document.getElementById("networkCanvas");
networkCanvas.width=500;

const carCtx=carCanvas.getContext("2d"); //Canvas.Context for puting up car in carCanvas
const networkCtx=networkCanvas.getContext("2d");

const road = new Road(carCanvas.width/2,carCanvas.width);

let N=1;
if(controlType=='y'||controlType=='Y')
    N=prompt("Please Enter Number of Test Car\n( \'1\' for the best car)", 100);
const cars = generateCars(N);
let bestCar=cars[0];

if(localStorage.getItem("bestBrain")){
    for (let i = 0; i < cars.length; i++) {
        cars[i].brain=JSON.parse(localStorage.getItem("bestBrain"));
        if(i!=0){
            NeuralNetwork.mutate(cars[i].brain,0.1);
        }
    }

}

const traffic=[
    new Car(road.getLaneCenter(1),-100,45,75,"DUMMY",2),
    new Car(road.getLaneCenter(0),-350,45,75,"DUMMY",2),
    new Car(road.getLaneCenter(2),-350,45,75,"DUMMY",2),
    new Car(road.getLaneCenter(0),-600,45,75,"DUMMY",2),
    new Car(road.getLaneCenter(1),-600,45,75,"DUMMY",2),
    new Car(road.getLaneCenter(1),-850,45,75,"DUMMY",2),
    new Car(road.getLaneCenter(2),-850,45,75,"DUMMY",2),
    new Car(road.getLaneCenter(0),-1100,45,75,"DUMMY",2),
    new Car(road.getLaneCenter(2),-1100,45,75,"DUMMY",2),
    new Car(road.getLaneCenter(1),-1300,45,75,"DUMMY",2),
];

animate();

function save(){
    localStorage.setItem("bestBrain",
        JSON.stringify(bestCar.brain)
    );
}

function discard(){
    localStorage.removeItem("bestBrain");
}

function generateCars(N){
    const cars=[];
    for (let i = 0; i < N; i++) {
        if(controlType=='y'||controlType=='Y')
            cars.push(new Car(road.getLaneCenter(1),100,45,75,"AI"));
        else{
            cars.push(new Car(road.getLaneCenter(1),100,45,75,"KEYS"));
        }
    }
    return cars;
}

function animate(){
    for (let i = 0; i < traffic.length; i++) {
        traffic[i].update(road.borders,[]);
    }
    for (let i = 0; i < cars.length; i++) {
        cars[i].update(road.borders,traffic);
    }
    
    bestCar=cars.find(
        c=>c.y==Math.min(...cars.map(c=>c.y))
    );

    carCanvas.height=window.innerHeight;
    networkCanvas.height=window.innerHeight;

    carCtx.save();
    carCtx.translate(0,-bestCar.y+carCanvas.height*0.7)

    road.draw(carCtx);
    for (let i = 0; i < traffic.length; i++) {
       traffic[i].draw(carCtx);
    }

    carCtx.globalAlpha=0.2;
    for (let i = 0; i < cars.length; i++) {
        cars[i].draw(carCtx);
    }
    carCtx.globalAlpha=1;
    bestCar.draw(carCtx,true);

    carCtx.restore();
    Visualizer.drawNetwork(networkCtx,bestCar.brain);
    requestAnimationFrame(animate);
}

