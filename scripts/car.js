class Car{
    constructor(x,y,width,height,controlType,maxSpeed=3){
        this.x=x;
        this.y=y;
        this.width=width;
        this.height=height;
        this.controlType=controlType;
        this.speed=0;
        this.acceleration=0.2;
        this.maxSpeed=maxSpeed;
        this.friction=0.05;
        this.angle=0;
        this.damaged=false;

        this.useBrain=controlType=="AI";

        this.controls = new Controls(controlType);

        if(controlType!="DUMMY"){
            this.sensor = new Sensor(this,5);
            this.brain = new NeuralNetwork(
                [this.sensor.rayCount,6,4],
            );
        }
    }

    update(roadBorders,traffic){
        if(!this.damaged){
            this.#movement();
            this.polygon=this.#createPolygon();
            this.damaged=this.#assessDamage(roadBorders,traffic);
        }
        if(this.sensor){
            this.sensor.update(roadBorders,traffic);
            const offsets=this.sensor.readings.map(
                s=>s==null?0:(1-s.offset)
            );
            const outputs = NeuralNetwork.feedForward(offsets,this.brain);
            
            if(this.useBrain){
                this.controls.forward=outputs[0];
                this.controls.left=outputs[1];
                this.controls.right=outputs[2];
                this.controls.reverse=outputs[3];
            }
        }
    }

    #assessDamage(roadBorders,traffic){
        for (let i = 0; i < roadBorders.length; i++) {
            if(polyIntersect(this.polygon,roadBorders[i])){
                return true;
            }
        }
        for (let i = 0; i < traffic.length; i++) {
            if(polyIntersect(this.polygon,traffic[i].polygon)){
                return true;
            }
        }
        return false;
    }



    #createPolygon(){
        const points=[];
        const rad = Math.hypot(this.width,this.height)/2;
        const alpha = Math.atan2(this.width,this.height);

        points.push({
            x:this.x-Math.sin(this.angle-alpha)*rad,
            y:this.y-Math.cos(this.angle-alpha)*rad,
        })
        points.push({
            x:this.x-Math.sin(this.angle+alpha)*rad,
            y:this.y-Math.cos(this.angle+alpha)*rad,
        })
        points.push({
            x:this.x-Math.sin(Math.PI+this.angle-alpha)*rad,
            y:this.y-Math.cos(Math.PI+this.angle-alpha)*rad,
        })
        points.push({
            x:this.x-Math.sin(Math.PI+this.angle+alpha)*rad,
            y:this.y-Math.cos(Math.PI+this.angle+alpha)*rad,
        })
        return points;
    }

    #movement(){
        if(this.controls.forward){
            this.speed+=this.acceleration;
        }
        if(this.controls.reverse){
            this.speed-=this.acceleration;
        }
        
        if(this.speed>0){
            this.speed-=this.friction
        }
        if(this.speed<0){
            this.speed+=this.friction
        }

        if(this.speed>this.maxSpeed){
            this.speed=this.maxSpeed;
        }
        if(this.speed<-this.maxSpeed/2){
            this.speed=-this.maxSpeed/2;
        }

        if((this.speed<=-0.00005) || (this.speed>=0.00005) ){
            const flip = this.speed>0?1:-1;
            if(this.controls.right){
                this.angle-=0.025*flip;
            }
            if(this.controls.left){
                this.angle+=0.025*flip;
            }
        }
        else{
            this.speed=0;
        }
       
        this.x-=Math.sin(this.angle)*this.speed;
        this.y-=Math.cos(this.angle)*this.speed;
        //console.table(this.speed);
    }
    
    draw(ctx,drawSensor=false){
        switch(this.controlType){
            case "KEYS":
                if(drawSensor)
                    this.sensor.draw(ctx);
                ctx.save();
                const image1 = this.damaged?document.getElementById("bugattiDamaged"):document.getElementById("bugatti");
                ctx.translate(this.x,this.y);
                ctx.rotate(-this.angle);
                ctx.beginPath();
                ctx.drawImage(
                    image1,
                    -this.width/2,
                    -this.height/2,
                    this.width,
                    this.height
                );
                ctx.restore();
                break;
            
            case "AI":
                if(drawSensor)
                    this.sensor.draw(ctx);
                ctx.save();
                ctx.translate(this.x,this.y);
                ctx.rotate(-this.angle);
                ctx.beginPath();
                const image2 = this.damaged?document.getElementById("bugattiDamaged"):document.getElementById("bugatti");
                ctx.drawImage(
                    image2,
                    -this.width/2,
                    -this.height/2,
                    this.width,
                    this.height
                );
                ctx.restore();
                break;

            case "DUMMY":
                ctx.save();
                ctx.translate(this.x,this.y);
                //ctx.rotate(-this.angle);
                ctx.beginPath();
                const image3 = document.getElementById("car1");
                ctx.drawImage(
                    image3,
                    -this.width/2,
                    -this.height/2,
                    this.width,
                    this.height
                );
                ctx.restore();
                break;
        }

        // if(this.damaged){
        //     ctx.fillStyle="gray";
        // }
        // else{
        //     ctx.fillStyle="black";
        // }
        // ctx.beginPath();
        // ctx.moveTo(this.polygon[0].x,this.polygon[0].y)
        // for (let i = 1; i < this.polygon.length; i++) {
        //    ctx.lineTo(this.polygon[i].x,this.polygon[i].y);
        // }
        // ctx.fill();
    }
}