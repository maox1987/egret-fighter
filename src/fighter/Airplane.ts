module fighter {
	/**
	 *
	 * 飞机
	 *
	 */
	export class Airplane extends egret.DisplayObjectContainer{
		public constructor(texture:egret.Texture,fireDelay:number,textureName:string) {
            super();
            this.fireDelay = fireDelay;
            this.bmp = new egret.Bitmap(texture);
            this.textureName = textureName;
            this.addChild(this.bmp);
            this.fireTimer = new egret.Timer(fireDelay);
            this.fireTimer.addEventListener(egret.TimerEvent.TIMER,this.createBullet,this);
		}
		/**飞机位图*/
        private bmp: egret.Bitmap;
        /**创建子弹的时间间隔*/
        private fireDelay: number;
        /**定时器*/
        private fireTimer: egret.Timer;
        /**飞机生命值*/
        public blood: number = 10;
        //可视为飞机类型名
        public textureName: string;
        
        public fire():void{
            this.fireTimer.start();
        }
        
        public stopFire():void{
            this.fireTimer.stop();
        }
        
        /**创建子弹*/
        private createBullet(evt:egret.TimerEvent):void{
            this.dispatchEventWith('createBullet');
        }
        
        private static cacheDict: Object = {};
        
        /**生产*/
        public static produce(textureName:string,fireDelay:number):fighter.Airplane{
            if(fighter.Airplane.cacheDict[textureName]==null){
                fighter.Airplane.cacheDict[textureName] = [];
            }
            var dict: fighter.Airplane[] = fighter.Airplane.cacheDict[textureName];
            var theFighter: fighter.Airplane;
            if(dict.length>0){
                theFighter = dict.pop();
            }else{
                theFighter = new fighter.Airplane(RES.getRes(textureName),fireDelay,textureName);
                
            }
            theFighter.blood = 10;
            return theFighter;
        }
        
        /**回收*/
        public static reclaim(theFighter:fighter.Airplane):void{
            var textureName: string = theFighter.textureName;
            if(fighter.Airplane.cacheDict[textureName]==null){
                fighter.Airplane.cacheDict[textureName] = [];
            }
            var dict: fighter.Airplane[] = fighter.Airplane.cacheDict[textureName];
            if(dict.indexOf(theFighter)==-1){
                dict.push(theFighter);
            }
        }
	}
}
