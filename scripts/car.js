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

        this.controls = new Controls(controlType);

        if(controlType!="DUMMY")
            this.sensor = new Sensor(this,5);
    }

    update(roadBorders,traffic){
        if(!this.damaged){
            this.#movement();
            this.polygon=this.#createPolygon();
            this.damaged=this.#assessDamage(roadBorders,traffic);
        }
        if(this.sensor)
            this.sensor.update(roadBorders,traffic);
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
    
    draw(ctx){

        switch(this.controlType){
            case "KEYS":
                ctx.save();
                ctx.translate(this.x,this.y);
                ctx.rotate(-this.angle);
                ctx.beginPath();
                const image1 = document.getElementById("bugatti");
                ctx.drawImage(
                    image1,
                    -this.width/2,
                    -this.height/2,
                    this.width,
                    this.height
                );
                ctx.restore();
                this.sensor.draw(ctx);
                break;
            
            case "DUMMY":
                ctx.save();
                ctx.translate(this.x,this.y);
                //ctx.rotate(-this.angle);
                ctx.beginPath();
                const image2 = document.getElementById("car1");
                ctx.drawImage(
                    image2,
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