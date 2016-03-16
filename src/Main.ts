class Main extends egret.DisplayObjectContainer {

    public constructor() {
        super();

        this.addEventListener(RES.ResourceEvent.ADDED_TO_STAGE,this.onAddToStage,this);
        
    }

    private loadingView: LoadingUI;
    /**测试用位图*/
    private background: egret.Bitmap;
    /**设置速度*/
    private speed: number;
    /**设置方向*/
    private diraction: number;
    /**设置boss*/
    private boss: egret.Bitmap;
    //将每次调用Tick的时间保存下来
    private now: number = 0;

    private onAddToStage(event:egret.Event){
        
        //设置加载进度条
        this.loadingView = new LoadingUI();
        this.stage.addChild(this.loadingView);
        //初始化Resource资源加载库
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE,this.onConfigComplete,this);
        RES.loadConfig('resource/default.res.json','resource/');
        
    }

    /**
     * 配置文件加载完成，开始预加载preLoad资源组
     */
    private onConfigComplete(event:RES.ResourceEvent){
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE,this.onConfigComplete,this);
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE,this.onResourceLoadComplete,this);
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR,this.onResourceLoadError,this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS,this.onResourceProgress,this);
        RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR,this.onItemLoadError,this);
        RES.loadGroup("preload");
    }

    /**
     * preLoad资源组加载完成
     */
    private onResourceLoadComplete(event:RES.ResourceEvent){
        if(event.groupName=='preload'){
            this.stage.removeChild(this.loadingView);
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE,this.onResourceLoadComplete,this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR,this.onResourceLoadError,this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS,this.onResourceProgress,this);
            RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR,this.onItemLoadError,this);
            
            //游戏的主类开始实例化
            var gameContainer: fighter.GameContainer = new fighter.GameContainer();
            this.addChild(gameContainer);
            //this.createGameScene();
        }
    }
    
    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    private onItemLoadError(event: RES.ResourceEvent): void {
        console.warn("Url:" + event.resItem.url + " has failed to load");
    }

    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    private onResourceLoadError(event: RES.ResourceEvent): void {
        //TODO
        console.warn("Group:" + event.groupName + " has failed to load");
        //忽略加载失败的项目
        //Ignore the loading failed projects
        this.onResourceLoadComplete(event);
    }

    /**
     * preload资源组加载进度
     * Loading process of preload resource group
     */
    private onResourceProgress(event: RES.ResourceEvent): void {
        if(event.groupName == "preload") {
            this.loadingView.setProgress(event.itemsLoaded,event.itemsTotal);
        }
    }
    
    /**
     * 创建游戏场景
     */
    private createGameScene():void{
        this.background = new egret.Bitmap();
        this.background.texture = RES.getRes('bg_jpg');
        this.addChild(this.background);
        
        this.boss = new egret.Bitmap();
        this.boss.texture = RES.getRes('boss_png');
        this.addChild(this.boss);
        //this.boss.addEventListener(egret.Event.ENTER_FRAME,this.onEnterFrame,this);
        
        this.speed = 0.05;
        this.diraction = 1;
        
        //egret.startTick(this.onTicker,this);
        
        var tween = egret.Tween.get(this.boss);
        tween.to({
            x: this.stage.stageWidth - this.boss.width,
            y: 50
        },2000).to({
            x: 0,
            y: 100
        },2000);
    }
    private onTicker(time:number){
        
        if(!this.now){
            this.now = time;
        }
        
        var then: number = time;
        //计算时间间隔
        var pass: number = then - this.now;
        
        var x = this.boss.x;
        var y = this.boss.y;
        if(y < this.stage.stageHeight - this.boss.height) {
            this.boss.y += this.speed*pass;
        }
        if(x < this.stage.stageWidth - this.boss.width && x > 0) {
            this.boss.x += this.speed * this.diraction*pass;
        } else if(x <= 0) {
            this.boss.x += this.speed;
            this.diraction = 1;
        } else {
            this.boss.x -= this.speed;
            this.diraction = -1;
        }
        
        //刷新时间
        this.now = then;
        
        return false;
        
    }
    
    private onEnterFrame(event:egret.Event){
        var x = this.boss.x;
        var y = this.boss.y;
        if(y<this.stage.stageHeight-this.boss.height){
            this.boss.y += this.speed;
        }
        if(x<this.stage.stageWidth -this.boss.width && x>0){
            this.boss.x += this.speed * this.diraction;
        }else if(x<=0){
            this.boss.x += this.speed;
            this.diraction = 1;
        }else{
            this.boss.x -= this.speed;
            this.diraction = -1;
        }
    }
}