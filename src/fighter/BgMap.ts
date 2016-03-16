module fighter {
	/**
	 *
	 * 可滚动的底图
	 *
	 */
	export class BgMap extends egret.DisplayObjectContainer {
		public constructor() {
            super();
            this.addEventListener(egret.Event.ADDED_TO_STAGE,this.onAddToStage,this);
		}
		/**图片引用*/
        private bmpArr: egret.Bitmap[];
        /**图片数量*/
        private rowCount: number;
        /**stage宽*/
        private stageW: number;
        /**stage高*/
        private stageH: number;
        /**纹理本身的高度*/
        private textureHeight: number;
        /**控制滚动速度*/
        private speed: number = 2;
        
		private onAddToStage(event:egret.Event){
            this.removeEventListener(egret.Event.ADDED_TO_STAGE,this.onAddToStage,this);
            this.stageW = this.stage.stageWidth;
            this.stageH = this.stage.stageHeight;
            var texture: egret.Texture = RES.getRes('bgImage');
            this.textureHeight = texture.textureHeight;
            this.rowCount = Math.ceil(this.stageH/this.textureHeight)+1
            this.bmpArr = [];
            //创建这些图片，并设置y坐标，让它们连接起来
            for(var i: number = 0;i < this.rowCount;i++){
                var bgBmp: egret.Bitmap = fighter.createBitmapByName('bgImage');
                bgBmp.y = this.textureHeight * i - (this.textureHeight * this.rowCount - this.stageH);
                this.bmpArr.push(bgBmp);
                this.addChild(bgBmp);
            }
            
		}
		
		public start():void{
            this.removeEventListener(egret.Event.ENTER_FRAME,this.enterFrameHandler,this);
            this.addEventListener(egret.Event.ENTER_FRAME,this.enterFrameHandler,this);
		}
		
		private enterFrameHandler(event:egret.Event){
            for(var i: number = 0;i < this.rowCount;i++){
                var bgBmp: egret.Bitmap = this.bmpArr[i];
                bgBmp.y += this.speed;
                
                if(bgBmp.y > this.stageH){
                    bgBmp.y = this.bmpArr[0].y - this.textureHeight;
                    this.bmpArr.pop();
                    this.bmpArr.unshift(bgBmp);
                }
            }
		}
		
		public pause():void{
            this.removeEventListener(egret.Event.ENTER_FRAME,this.enterFrameHandler,this);
		}
	}
}
