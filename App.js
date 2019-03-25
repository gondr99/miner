class App{
    constructor(){
        this.canvas = document.querySelector("#gameCanvas");
        this.ctx = this.canvas.getContext("2d");
        this.frame;
        this.mineCount = 8; //초기 지뢰 8개 배치
        this.mineList = [];
        
        this.mineSize = 25;
        this.mineGap = 4;

        for(let i = 0; i < this.mineCount; i++){ 
            for(let j = 0; j < this.mineCount; j++){
                let mine = new Mine(j, i, this.mineSize, this.mineGap);
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
            this.mineList[one].isMine = true;
            
            //교환해서 또 안뽑히게
            let temp = one;
            chooseList[idx] = chooseList[i - 1];
            chooseList[i - 1] = temp;
        }

        //근처에 지뢰 갯수 계산하기
        for(let i = 0; i < this.mineCount; i++){ 
            for(let j = 0; j < this.mineCount; j++){
                if(this.mineList[i*this.mineCount + j].isMine){
                    continue;
                }
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
        let idx = this.findIndexOfMine(x, y);
        if(idx < 0) return;
        
        this.mineList[idx].flagCheck();
    }

    checkMineCount(i, j){
        let cnt = 0;

        for(let k = -1; k <= 1; k++){
            for(let l = -1; l <= 1; l++){
                if(k == 0 && l == 0){
                    continue;
                }
                if(i+k < 0 || i + k >= this.mineCount || j + l < 0 || j + l >= this.mineCount){
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
        let idx = this.findIndexOfMine(x, y);
        if(idx < 0) return;

        let mine = this.mineList[idx];
        mine.flip();
        
        if(mine.isMine){
            clearInterval(this.frame);
            this.render(this.ctx);
            alert("게임오버");
        }else if (mine.value == 0){
            this.revealMine(idx);
        }
    }

    findIndexOfMine(x, y){
        let j = Math.floor(x / (this.mineSize + this.mineGap));
        let i = Math.floor(y / (this.mineSize + this.mineGap));

        if(i >= this.mineCount || j >= this.mineCount){
            return -1; //지뢰가 아닌 부분을 클릭
        }

        let gapJ = x % (this.mineSize + this.mineGap);
        let gapI = y % (this.mineSize + this.mineGap);
        if(gapI < this.mineGap || gapJ < this.mineGap) {
            return -1; //갭을 클릭
        }

        return i * this.mineCount + j;
    }

    revealMineRecusive(idx){
        if(this.mineList[idx].reveal){
            return;
        }
        if(!this.mineList[idx].isMine && this.mineList[idx].value != 0){
            this.mineList[idx].reveal = true;
            return;
        }
        this.mineList[idx].reveal = true;

        if(this.mineList[idx].value == 0){
            this.revealMine(idx);
        }
    }

    revealMine(idx){
        let i = Math.floor(idx / this.mineCount); 
        let j = Math.floor(idx % this.mineCount);

        for(let k = -1; k <= 1; k++){
            for(let l = -1; l <= 1; l++){
                if(k == l || (i+k) < 0 || (i+k) >= this.mineCount || (j+l) < 0 || (j+l) >= this.mineCount) {
                    continue;
                }

                if((i+k) * this.mineCount + j+l >= this.mineList.length){
                    continue;
                }
                
                this.revealMineRecusive((i+k) * this.mineCount + j+l);
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