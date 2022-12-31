class Road{
    constructor(x,width,laneCount=3){
        this.grass=15;

        this.x=x;
        this.width=width;
        this.laneCount=laneCount;

        this.right=x+(width/2)-this.grass;
        this.left=(x-width/2)+this.grass;
        
        const infinity=100000;
        this.top=-infinity;
        this.bottom=infinity;

        const topLeft={x:this.left,y:this.top};
        const topRight={x:this.right,y:this.top};
        const bottomLeft={x:this.left,y:this.bottom};
        const bottomRight={x:this.right,y:this.bottom};

        this.borders=[
            [topLeft,bottomLeft],
            [topRight,bottomRight] 
        ];
        
    }

    getLaneCenter(laneIndex){
        const laneWidth=(this.width-2*this.grass)/this.laneCount;
        return this.left+(laneWidth/2)+Math.min(laneIndex,this.laneCount-1)*laneWidth;
    }


    draw(ctx){
        ctx.lineWidth=2;
        ctx.strokeStyle='white';

        for (let index = 1; index <= this.laneCount-1 ; index++) {
            const x = lerp(this.left,this.right,index/this.laneCount)
            
            ctx.setLineDash([30,30]);
            ctx.beginPath();
            ctx.moveTo(x,this.top);
            ctx.lineTo(x,this.bottom);
            ctx.stroke();
        }
        ctx.setLineDash([]);
        this.borders.forEach(border=>{
            ctx.beginPath();
            ctx.moveTo(border[0].x,border[0].y);
            ctx.lineTo(border[1].x,border[1].y);
            ctx.stroke();
        });
        this.drawGrass(ctx)
    }

    drawGrass(ctx){
    
        ctx.lineWidth=this.grass*2;
        ctx.strokeStyle='green';
        ctx.setLineDash([]);
        ctx.beginPath();
        ctx.moveTo(this.left-this.grass,this.top);
        ctx.lineTo(this.left-this.grass,this.bottom);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(this.right+this.grass,this.top);
        ctx.lineTo(this.right+this.grass,this.bottom);
        ctx.stroke();
    }
}

