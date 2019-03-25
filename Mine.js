class Mine {
    constructor(x, y, size, gap){
        this.x = x;
        this.y = y;
        this.isMine = false;
        this.value = 0;
        this.reveal = false;

        this.size = size;
        this.border = 3;
        this.gap = gap;

        this.posX = 5 + this.x * size + this.x * gap;
        this.posY = 5 + this.y * size + this.y * gap;


        this.flag = false;
    }

    //뒤집기
    flip(){
        if(this.flag){
            this.flag = false;
            return;
        }
        if(this.reveal){
            return;
        }

        this.reveal = true;
    }

    update(){

    }

    render(ctx){
        ctx.save();
        ctx.fillStyle = "#9DC8C8";
        ctx.fillRect( this.posX , this.posY , this.size, this.size);
        if(this.reveal && !this.isMine ){
            ctx.fillStyle = "#fff";
            ctx.fillRect( this.posX + this.border, this.posY + this.border, this.size - this.border * 2, this.size - this.border * 2);
            ctx.font = "15px Arial";
            ctx.fillStyle = "#000";
            ctx.fillText( this.value, this.posX + this.border + 5, this.posY + this.border + 15);
        }else if(this.reveal && this.isMine){
            ctx.fillStyle = "#fff";
            ctx.fillRect( this.posX + this.border, this.posY + this.border, this.size - this.border * 2, this.size - this.border * 2);
            ctx.fillStyle = "#000";
            ctx.beginPath();
            ctx.arc(this.posX + this.size / 2, this.posY + this.size / 2, 7, 0, 2 * Math.PI);
            ctx.fill();
            ctx.closePath();
        }else if(this.flag){
            ctx.fillStyle = "#58C9B9";
            ctx.fillRect( this.posX + this.border, this.posY + this.border, this.size - this.border * 2, this.size - this.border * 2);
            ctx.fillStyle = "#000";
            ctx.beginPath();
            ctx.moveTo( this.posX + 5, this.posY + 5);
            ctx.lineTo( this.posX + 15, this.posY + 12);
            ctx.lineTo( this.posX + 5, this.posY + 19);
            ctx.lineTo( this.posX + 5, this.posY + 5);
            ctx.fill();
            ctx.closePath();
        } else {
            ctx.fillStyle = "#58C9B9";
            ctx.fillRect( this.posX + this.border, this.posY + this.border, this.size - this.border * 2, this.size - this.border * 2);
        }
        ctx.restore();
    }

    flagCheck(){
        if(this.reveal) return; // 뒤집혀진 애는 뒤집을 필요 없다.
        this.flag = !this.flag;
    }
}