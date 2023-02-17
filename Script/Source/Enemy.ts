namespace Dungeon {
    import ƒ = FudgeCore;
    import ƒAid = FudgeAid;

    export enum EnemyState {
        IDLE, PATROL,CHASE,FREEZE
    }

    export class Enemy extends ƒAid.NodeSprite {
        
        private moveTarget: ƒ.Vector3;
        private moveDirection: string = "Up";
        private enemyPosBefore: ƒ.Vector3;
        private yOffset: number = 0.3;

        private attackdamage: number;
        private sprintSpeed: number;
        private walkSpeed: number;
  
        private animationCurrent: ƒAid.SpriteSheetAnimation;
  
        private animWalkRight: ƒAid.SpriteSheetAnimation;
        private animWalkLeft: ƒAid.SpriteSheetAnimation;
        private animWalkUp: ƒAid.SpriteSheetAnimation;
        private animWalkDown: ƒAid.SpriteSheetAnimation;

        private animAttackRight: ƒAid.SpriteSheetAnimation;
        private animAttackLeft: ƒAid.SpriteSheetAnimation;
        private animAttackUp: ƒAid.SpriteSheetAnimation;
        private animAttackDown: ƒAid.SpriteSheetAnimation;

        private EnemyAttackSound: ƒ.ComponentAudio;
        

        public constructor(_name: string = "Enemy", _startposition: ƒ.Vector3, _damage: number, _walkspeed: number, _sprintspeed: number) {
            super("AvatarInstance");

            // Initialize private Values
            this.name = _name;
            this.attackdamage = _damage;
            this.walkSpeed = _walkspeed;
            this.sprintSpeed = _sprintspeed;
            this.addComponent(new ƒ.ComponentTransform());  // Add tranformation component,for translations
            this.mtxLocal.translation = _startposition;     // Start Position of Enemy
            this.enemyPosBefore = _startposition;           // Init enemyPosBefore

            // Audio 
    
            
            // Search first Target to move
            [this.moveTarget, this.moveDirection] = searchNewTargetToMove(this.mtxLocal.translation, "None");

            // Add EnemyStateMachine
            let cmpStateMachine: EnemyStateMachine = new EnemyStateMachine();
            this.addComponent(cmpStateMachine);
            cmpStateMachine.stateCurrent = EnemyState.PATROL;
            
            // Add Rigidbody
            let mt: ƒ.Matrix4x4 = new ƒ.Matrix4x4()
            mt.scale(new ƒ.Vector3(0.7, 0.7, 10));
                      
            let rigid_enemy: ƒ.ComponentRigidbody = new ƒ.ComponentRigidbody(0, ƒ.BODY_TYPE.KINEMATIC, ƒ.COLLIDER_TYPE.CUBE, ƒ.COLLISION_GROUP.GROUP_2, mt);
            rigid_enemy.isTrigger = true;
            rigid_enemy.mtxPivot = mt;
            
            //console.log("nachj", rigid_enemy.getScaling().x)
            this.addComponent(rigid_enemy);
                
        }

        public update(deltaTime: number): void {
            this.move(deltaTime)
            
            
            // TODO: Über StateMachine die Bewegung handeln
            //this.getComponent(EnemyStateMachine).act();
            //this.displayAnimation();
        }

        public test(): number {
            return 2
        }
        

        public move(deltaTime: number): void {
            let animation: ƒAid.SpriteSheetAnimation;

            let enemyLocation: ƒ.Vector3 = this.mtxLocal.translation
            
            // Set new enemyPosBefore
            //this.enemyPosBefore = enemyLocation;
            // Move enemy
            if (this.moveDirection == "Left") {
                if (this.moveTarget.x > this.mtxLocal.translation.x){
                    [this.moveTarget, this.moveDirection] = searchNewTargetToMove(enemyLocation, this.moveDirection);
                } else {
                    
                    this.mtxLocal.translateX(-this.walkSpeed*deltaTime);
                }
                animation = this.animWalkLeft;
            } else if (this.moveDirection == "Right") {
                if (this.moveTarget.x < this.mtxLocal.translation.x){
                    [this.moveTarget, this.moveDirection] = searchNewTargetToMove(enemyLocation, this.moveDirection);
                } else {
                    
                    this.mtxLocal.translateX(this.walkSpeed*deltaTime);
                }
                animation = this.animWalkRight;
            } else if (this.moveDirection == "Down") {
                if (this.moveTarget.y > this.mtxLocal.translation.y){
                    [this.moveTarget, this.moveDirection] = searchNewTargetToMove(enemyLocation, this.moveDirection);
                } else {
                    
                    this.mtxLocal.translateY(-this.walkSpeed*deltaTime);
                }
                animation = this.animWalkDown;
            } else if (this.moveDirection == "Up") {
                if (this.moveTarget.y < this.mtxLocal.translation.y){
                    [this.moveTarget, this.moveDirection] = searchNewTargetToMove(enemyLocation, this.moveDirection);
                } else {
                    
                    this.mtxLocal.translateY(this.walkSpeed*deltaTime);
                }
                animation = this.animWalkUp;
            } else {
                console.log("ERROR: ", this.name ," is stuck !")
            }

            if (animation != this.animationCurrent) {
                this.setAnimation(animation);
                this.animationCurrent = animation;
            }
            
            
        }

        public async initializeAnimations(_imgSpriteSheet: ƒ.TextureImage): Promise<void> {
            let coat: ƒ.CoatTextured = new ƒ.CoatTextured(undefined, _imgSpriteSheet);
    

            this.animWalkRight = new ƒAid.SpriteSheetAnimation("WalkRight", coat);
            this.animWalkRight.generateByGrid(ƒ.Rectangle.GET(0, 256, 128, 128),4, 128, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(128));
            this.animWalkLeft = new ƒAid.SpriteSheetAnimation("WalkLeft", coat);
            this.animWalkLeft.generateByGrid(ƒ.Rectangle.GET(0, 128, 128, 128),4, 128, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(128));
            this.animWalkUp = new ƒAid.SpriteSheetAnimation("WalkUp", coat);
            this.animWalkUp.generateByGrid(ƒ.Rectangle.GET(0, 512, 128, 128), 4, 128, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(128));
            this.animWalkDown = new ƒAid.SpriteSheetAnimation("WalkDown", coat);
            this.animWalkDown.generateByGrid(ƒ.Rectangle.GET(0, 384, 128, 128), 4, 128, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(128));
    
            this.animAttackRight = new ƒAid.SpriteSheetAnimation("AttackRight", coat);
            this.animAttackRight.generateByGrid(ƒ.Rectangle.GET(0,640, 128, 128), 5, 128, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(128));
            this.animAttackLeft = new ƒAid.SpriteSheetAnimation("AttackLeft", coat);
            this.animAttackLeft.generateByGrid(ƒ.Rectangle.GET(0, 0, 128, 28), 5, 128, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(128));
            this.animAttackUp = new ƒAid.SpriteSheetAnimation("AttackUp", coat);
            this.animAttackUp.generateByGrid(ƒ.Rectangle.GET(0, 896, 128, 128), 5, 128, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(128));
            this.animAttackDown = new ƒAid.SpriteSheetAnimation("AttackDown", coat);
            this.animAttackDown.generateByGrid(ƒ.Rectangle.GET(0, 768, 128, 128), 5, 128, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(128));

            this.setAnimation(this.animWalkDown);
            this.framerate = 20;
          }
        

    }
    ƒAid.StateMachine


}