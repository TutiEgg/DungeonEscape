namespace Dungeon {
    import ƒ = FudgeCore;
    import ƒAid = FudgeAid;



    export class BatteryItem extends ƒAid.NodeSprite {

        
        private animIdle: ƒAid.SpriteSheetAnimation;
        private rigid: ƒ.ComponentRigidbody;
        

        

        public constructor(_name: string = "Battery", _startposition: ƒ.Vector3) {
            super("AvatarInstance");


            // Initialize private Values
            this.name = _name;
            this.addComponent(new ƒ.ComponentTransform());  // Add tranformation component,for translations
            this.mtxLocal.translation = _startposition;     // Start Position of Enemy
           
            
            // Add Rigidbody
            let mt: ƒ.Matrix4x4 = new ƒ.Matrix4x4()
            mt.scale(new ƒ.Vector3(0.7, 0.7, 10));
                      
            this.rigid = new ƒ.ComponentRigidbody(0, ƒ.BODY_TYPE.KINEMATIC, ƒ.COLLIDER_TYPE.CUBE, ƒ.COLLISION_GROUP.GROUP_3, mt);
            this.rigid.isTrigger = true;
            this.rigid.mtxPivot = mt;

            this.addComponent(this.rigid);
                
        }

        
        public async initializeAnimations(_imgSpriteSheet: ƒ.TextureImage): Promise<void> {
            let coat: ƒ.CoatTextured = new ƒ.CoatTextured(undefined, _imgSpriteSheet);
    

            this.animIdle = new ƒAid.SpriteSheetAnimation("Idle", coat);
            this.animIdle.generateByGrid(ƒ.Rectangle.GET(0, 16, 16, 16),1, 32, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(16));
            

            this.setAnimation(this.animIdle);
            this.framerate = 20;
        }

        public setNewPos(vec: ƒ.Vector3) :void {
            this.mtxLocal.translation = vec;
        }

      

        

    

        

        
        

    }ƒAid.StateMachine
 


}