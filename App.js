class App{
    constructor(){
        this.canvas = document.querySelector("#gameCanvas");
        this.ctx = this.canvas.getContext("2d");
        this.frame;
        this.mineCount = 8; //초기 지뢰 5개 배치
        this.mineList = [];
        //일단 시작은 5X5짜리 지뢰찾기

        for(let i = 0; i < this.mineCount; i++){ 
            for(let j = 0; j < this.mineCount; j++){
                let mine = new Mine(j, i);
                //mine.reveal = true; //디버그 코드
                this.mineList.push(mine);
            }
        }

        let chooseList = [];
        let doubleCount = this.mineCount * this.mineCount;
        for(let i = 0; i < doubleCount; i++){
            chooseList.push(i);
        }

        for(let i = doubleCount; i > doubleCount - this.mineCount; i--) {
            let idx = Math.floor(Math.random() * i);
            let one = chooseList[idx];
            this.mineList[idx].isMine = true;
            
            //교환해서 또 안뽑히게
            let temp = one;
            chooseList[idx] = chooseList[i - 1];
            chooseList[i - 1] = temp;
        }

        //근처에 지뢰 갯수 계산하기
        for(let i = 0; i < this.mineCount; i++){ 
            for(let j = 0; j < this.mineCount; j++){
                // let mine = this.mineList[i*this.mineCount + j];
                this.mineList[i*this.mineCount + j].value = this.checkMineCount(i, j);
            }
        }
        
        this.canvas.addEventListener("click", (e)=>{
            this.clickMine(e.offsetX, e.offsetY);
        });

        this.canvas.addEventListener("contextmenu", (e)=>{
            e.preventDefault();
            this.flagMine(e.offsetX, e.offsetY);
        });
    }

    flagMine(x, y){
        for(let i = 0; i < this.mineList.length; i++){
            this.mineList[i].flagCheck(x, y);
        }
    }

    checkMineCount(i, j){
        let cnt = 0;

        for(let k = -1; k <= 1; k++){
            for(let l = -1; l <= 1; l++){
                if(k == 0 && l == 0){
                    continue;
                }
                if(this.mineList[(i+k) * this.mineCount + j+l] !== undefined 
                    && this.mineList[(i+k) * this.mineCount + j+l].isMine){
                    cnt++;
                }
            }
        }
        return cnt;
    }

    clickMine(x, y){
        for(let i = 0; i < this.mineList.length; i++){
            if(this.mineList[i].click(x, y)){
                this.render(this.ctx);
                clearInterval(this.frame);
                alert("게임 오버");
            }
        }
    }

    init(){
        this.frame = setInterval(()=>{
            this.update();
            this.render(this.ctx);
        }, 1000/30); //초당 30프레임으로 수행
    }

    update(){
        let cnt = 0;
        this.mineList.forEach( x => {
            if(x.isMine && x.flag){
                cnt++;
            }
        });

        if(cnt == this.mineCount){
            clearInterval(this.frame);
            alert("성공!");
        }
    }

    render(ctx){
        ctx.clearRect(0, 0, 400, 300);
        ctx.strokeRect(0, 0, 400, 300);
        
        for(let i = 0; i < this.mineList.length; i++){
            this.mineList[i].render(ctx);
        }
    }

}