module fighter {
	/**
	 *
	 * @author 
	 *
	 */
	export class Bullet extends egret.Bitmap {
		public constructor(texture:egret.Texture) {
            super(texture);
		}
		
        public textureName: string;
        
        private static cacheDict: Object = {};
        /**生产*/
        public static produce(textureName:string):fighter.Bullet{
            if(fighter.Bullet.cacheDict[textureName]==null){
                fighter.Bullet.cacheDict[textureName] = [];
            }
            var dict: fighter.Bullet[] = fighter.Bullet.cacheDict[textureName];
            var bullet: fighter.Bullet;
            if(dict.length>0){
                bullet = dict.pop();
            }else{
                bullet = new fighter.Bullet(RES.getRes(textureName));
            }
            bullet.textureName = textureName;
            return bullet;
        }
        
        public static reclaim(bullet:fighter.Bullet):void{
            var textureName:string = bullet.textureName;
            if(fighter.Bullet.cacheDict[textureName]==null){
                Bullet.cacheDict[textureName] = [];
            }
            var dict: Bullet[] = Bullet.cacheDict[textureName];
            if(dict.indexOf(bullet)==-1){
                dict.push(bullet);
            }
        }
	}
}
