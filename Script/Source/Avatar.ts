
namespace Dungeon {
    import ƒ = FudgeCore;
    import ƒAid = FudgeAid;
    export let mtx: ƒ.Matrix4x4 = new ƒ.Matrix4x4()
  
    export enum ACTION {
      IDLE, WALK_LEFT, WALK_RIGHT, WALK_UP, WALK_DOWN, SPRINT_DOWN, SPRINT_UP, SPRINT_LEFT, SPRINT_RIGHT
    }
  
    export class Avatar extends ƒAid.NodeSprite {
      public speedWalk: number = 1.5;
      public speedSprint: number = 3;
      public ySpeed: number = 0;
      public xSpeed: number = 0;
      
      private animationCurrent: ƒAid.SpriteSheetAnimation;
  
      private animWalkRight: ƒAid.SpriteSheetAnimation;
      private animWalkLeft: ƒAid.SpriteSheetAnimation;
      private animWalkUp: ƒAid.SpriteSheetAnimation;
      private animWalkDown: ƒAid.SpriteSheetAnimation;

      private animSprintRight: ƒAid.SpriteSheetAnimation;
      private animSprintLeft: ƒAid.SpriteSheetAnimation;
      private animSprintUp: ƒAid.SpriteSheetAnimation;
      private animSprintDown: ƒAid.SpriteSheetAnimation;
      
      private animIdleRight: ƒAid.SpriteSheetAnimation;
      private animIdleLeft: ƒAid.SpriteSheetAnimation;
      private animIdleUp: ƒAid.SpriteSheetAnimation;
      private animIdleDown: ƒAid.SpriteSheetAnimation;
      public rigid_character: ƒ.ComponentRigidbody;
  
  
      public constructor() {
        super("AvatarInstance");
        this.addComponent(new ƒ.ComponentTransform());

        
        //this.animationCurrent = this.animWalkRight;
        // this.addEventListener(ƒ.EVENT.RENDER_PREPARE, () => console.log("Render"));
      }
  
      public update(_deltaTime: number): void {
        
        let pos: ƒ.Vector3 = this.mtxLocal.translation;
        viewport.camera.mtxPivot.translation = new ƒ.Vector3( pos.x * -1, pos.y,-4);
        if (checkCollision(this)) {
          this.mtxLocal.translation = pos_before
        } else {
          pos_before = pos
        }
        //console.log(this.mtxLocal.translation.x, this.mtxLocal.translation.y)
        this.mtxLocal.translate(new ƒ.Vector3(this.xSpeed * _deltaTime,this.ySpeed * _deltaTime,0), true);  
        
      }
  
      // Bei sprint animation unten einfach auf 3 frames anstatt 10
      // this.animWalk.generateByGrid(ƒ.Rectangle.GET(480, 910, 120, 130),3, 128, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(120));
      //this.animWalk.generateByGrid(ƒ.Rectangle.GET(480, 910, 120, 130),10, 128, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(120));
  
      public act(_action: ACTION): void {
        let animation: ƒAid.SpriteSheetAnimation;
        this.xSpeed = 0;
        this.ySpeed = 0;
        switch (_action) {
          case ACTION.WALK_RIGHT:
            this.xSpeed = this.speedWalk;
            animation = this.animWalkRight;
            break;
          case ACTION.WALK_LEFT:
            this.xSpeed = - this.speedWalk;
            animation = this.animWalkLeft;
            break;
          case ACTION.WALK_UP:
            this.ySpeed = this.speedWalk;
            animation = this.animWalkUp;
            break;
          case ACTION.WALK_DOWN:
            this.ySpeed = -this.speedWalk;
            animation = this.animWalkDown;
            break;
          case ACTION.SPRINT_LEFT:
            this.xSpeed = - this.speedSprint;
            animation = this.animSprintLeft;
            break;
          case ACTION.SPRINT_RIGHT:
            this.xSpeed = this.speedSprint;
            animation = this.animSprintRight;
            break;
          case ACTION.SPRINT_UP :
            this.ySpeed = this.speedSprint;
            animation = this.animSprintUp;
            break;
          case ACTION.SPRINT_DOWN:
            this.ySpeed = -this.speedSprint;
            animation = this.animSprintDown;
            break;
          case ACTION.IDLE:
            //animation = this.animationCurrent;
            if (this.animationCurrent == this.animSprintRight || this.animationCurrent == this.animWalkRight) {
              animation = this.animIdleRight;
              //this.showFrame(6);
            }else if (this.animationCurrent == this.animSprintLeft || this.animationCurrent == this.animWalkLeft) {
              animation = this.animIdleLeft;
            }else if (this.animationCurrent == this.animSprintUp || this.animationCurrent == this.animWalkUp) {
              animation = this.animIdleUp;
            }else if (this.animationCurrent == this.animSprintDown || this.animationCurrent == this.animWalkDown) {
              animation = this.animIdleDown;
            } else {
              animation = this.animationCurrent;
            }
            break;
        }
  
        if (animation != this.animationCurrent) {
          this.setAnimation(animation);
          this.animationCurrent = animation;
        }
      }
      /* Animations for real_avatar with lamp
      public async initializeAnimations(_imgSpriteSheet: ƒ.TextureImage): Promise<void> {
        let coat: ƒ.CoatTextured = new ƒ.CoatTextured(undefined, _imgSpriteSheet);
  
        this.animIdleRight = new ƒAid.SpriteSheetAnimation("IdleRight", coat);
        this.animIdleRight.generateByGrid(ƒ.Rectangle.GET(0, 390, 120, 130),3, 172, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(120));
        this.animIdleLeft = new ƒAid.SpriteSheetAnimation("IdleLeft", coat);
        this.animIdleLeft.generateByGrid(ƒ.Rectangle.GET(0, 130, 120, 130),3, 172, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(120));
        this.animIdleUp = new ƒAid.SpriteSheetAnimation("IdleUp", coat);
        this.animIdleUp.generateByGrid(ƒ.Rectangle.GET(0, 260, 120, 130),1, 172, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(120));
        this.animIdleDown = new ƒAid.SpriteSheetAnimation("IdleDown", coat);
        this.animIdleDown.generateByGrid(ƒ.Rectangle.GET(0, 0, 120, 130),3, 172, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(120));


        this.animWalkRight = new ƒAid.SpriteSheetAnimation("WalkRight", coat);
        this.animWalkRight.generateByGrid(ƒ.Rectangle.GET(0, 192, 64, 64),9, 64, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(64));
        this.animWalkLeft = new ƒAid.SpriteSheetAnimation("WalkLeft", coat);
        this.animWalkLeft.generateByGrid(ƒ.Rectangle.GET(0, 64, 64, 64),9, 64, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(64));
        this.animWalkUp = new ƒAid.SpriteSheetAnimation("WalkUp", coat);
        this.animWalkUp.generateByGrid(ƒ.Rectangle.GET(0, 0, 64, 64), 9, 64, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(64));
        this.animWalkDown = new ƒAid.SpriteSheetAnimation("WalkDown", coat);
        this.animWalkDown.generateByGrid(ƒ.Rectangle.GET(0, 128, 64, 64), 9, 64, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(64));
  
        this.animSprintRight = new ƒAid.SpriteSheetAnimation("SprintRight", coat);
        this.animSprintRight.generateByGrid(ƒ.Rectangle.GET(600, 910, 120, 130), 5, 172, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(120));
        this.animSprintLeft = new ƒAid.SpriteSheetAnimation("SprintLeft", coat);
        this.animSprintLeft.generateByGrid(ƒ.Rectangle.GET(600, 650, 120, 130), 5, 172, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(120));
        this.animSprintUp = new ƒAid.SpriteSheetAnimation("SprintUp", coat);
        this.animSprintUp.generateByGrid(ƒ.Rectangle.GET(0, 780, 120, 130), 9, 172, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(120));
        this.animSprintDown = new ƒAid.SpriteSheetAnimation("SprintDown", coat);
        this.animSprintDown.generateByGrid(ƒ.Rectangle.GET(0, 520, 120, 130), 9, 172, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(120));

        this.setAnimation(this.animIdleDown);
        this.framerate = 20;

        // Setup Audio
    
    
      }
      */

      
        public async initializeAnimations(_imgSpriteSheet: ƒ.TextureImage): Promise<void> {
        let coat: ƒ.CoatTextured = new ƒ.CoatTextured(undefined, _imgSpriteSheet);
  
        this.animIdleRight = new ƒAid.SpriteSheetAnimation("IdleRight", coat);
        this.animIdleRight.generateByGrid(ƒ.Rectangle.GET(0, 390, 120, 130),3, 172, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(120));
        this.animIdleLeft = new ƒAid.SpriteSheetAnimation("IdleLeft", coat);
        this.animIdleLeft.generateByGrid(ƒ.Rectangle.GET(0, 130, 120, 130),3, 172, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(120));
        this.animIdleUp = new ƒAid.SpriteSheetAnimation("IdleUp", coat);
        this.animIdleUp.generateByGrid(ƒ.Rectangle.GET(0, 260, 120, 130),1, 172, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(120));
        this.animIdleDown = new ƒAid.SpriteSheetAnimation("IdleDown", coat);
        this.animIdleDown.generateByGrid(ƒ.Rectangle.GET(0, 0, 120, 130),3, 172, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(120));


        this.animWalkRight = new ƒAid.SpriteSheetAnimation("WalkRight", coat);
        this.animWalkRight.generateByGrid(ƒ.Rectangle.GET(360, 910, 120, 130),4, 172, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(120));
        this.animWalkLeft = new ƒAid.SpriteSheetAnimation("WalkLeft", coat);
        this.animWalkLeft.generateByGrid(ƒ.Rectangle.GET(360, 650, 120, 130),4, 172, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(120));
        this.animWalkUp = new ƒAid.SpriteSheetAnimation("WalkUp", coat);
        this.animWalkUp.generateByGrid(ƒ.Rectangle.GET(0, 780, 120, 130), 9, 172, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(120));
        this.animWalkDown = new ƒAid.SpriteSheetAnimation("WalkDown", coat);
        this.animWalkDown.generateByGrid(ƒ.Rectangle.GET(0, 520, 120, 130), 9, 172, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(120));
  
        this.animSprintRight = new ƒAid.SpriteSheetAnimation("SprintRight", coat);
        this.animSprintRight.generateByGrid(ƒ.Rectangle.GET(600, 910, 120, 130), 5, 172, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(120));
        this.animSprintLeft = new ƒAid.SpriteSheetAnimation("SprintLeft", coat);
        this.animSprintLeft.generateByGrid(ƒ.Rectangle.GET(600, 650, 120, 130), 5, 172, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(120));
        this.animSprintUp = new ƒAid.SpriteSheetAnimation("SprintUp", coat);
        this.animSprintUp.generateByGrid(ƒ.Rectangle.GET(0, 780, 120, 130), 9, 172, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(120));
        this.animSprintDown = new ƒAid.SpriteSheetAnimation("SprintDown", coat);
        this.animSprintDown.generateByGrid(ƒ.Rectangle.GET(0, 520, 120, 130), 9, 172, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(120));

        this.setAnimation(this.animIdleDown);
        this.framerate = 20;
      }
       
    }
  }