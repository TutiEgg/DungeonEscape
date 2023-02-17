namespace Dungeon {
  import ƒ = FudgeCore;
  ƒ.Project.registerScriptNamespace(Dungeon);  // Register the namespace to FUDGE for serialization

  export class CharacterScript extends ƒ.ComponentScript {
    // Register the script as component for use in the editor via drag&drop
    public static readonly iSubclass: number = ƒ.Component.registerSubclass(CharacterScript);
    // Properties may be mutated by users in the editor via the automatically created user interface
    public message: string = "CustomComponentScript added to ";
    public rigid_character: ƒ.ComponentRigidbody;
    public mt_rigid: ƒ.Matrix4x4 = new ƒ.Matrix4x4();
    public gameState: GameState;
    
    // Light Variables
    public mtx_light: ƒ.Matrix4x4;

    public light: ƒ.ComponentLight;

    private minLightPercentage:number = 2; 
    private maxLightPercentage: number = 5;
    private lightStepValue: number = Math.round(100/(5-2))
    public lightPercentage: number;

    private lightUpdateFrequency: number = 100; // Milliseconds
    private timeOfLastUpdate: Date;
    private lightDecreaseValue: number = 0.001;

    // Player Variables
    public maxHealthAmount: number;
    public playerhealthAmount: number;
    private timeOfLastDamageTaken: Date;
    private playerProtectionTime: number = 2000 // Millisecons

    // Sound variablees
    private gettingDamageSound:  ƒ.ComponentAudio;
    private enemyAttackSound:  ƒ.ComponentAudio;

   

    constructor() {
      super();

      // Don't start when running in editor
      if (ƒ.Project.mode == ƒ.MODE.EDITOR)
        return;

      // Give Player health


      // Listen to this component being added to or removed from a node
      this.addEventListener(ƒ.EVENT.COMPONENT_ADD, this.hndEvent);
      this.addEventListener(ƒ.EVENT.COMPONENT_REMOVE, this.hndEvent);
      this.addEventListener(ƒ.EVENT.NODE_DESERIALIZED, this.hndEvent);
    }

    // Activate the functions of this component as response to events
    public hndEvent = (_event: Event): void => {
      switch (_event.type) {
        case ƒ.EVENT.COMPONENT_ADD:
          ƒ.Debug.log(this.message, this.node);

          // Create lights around the Character
          this.mtx_light = new ƒ.Matrix4x4();
          this.mtx_light.translateZ(this.maxLightPercentage);
          this.mtx_light.rotateY(180);
          this.mtx_light.scale(new ƒ.Vector3(20,20,15));
          this.light = new ƒ.ComponentLight(new ƒ.LightSpot(ƒ.Color.CSS("white")));
          this.light.mtxPivot = this.mtx_light;
          this.node.addComponent(this.light);

          // Create Rigidbody
          this.mt_rigid.scale(new ƒ.Vector3(0.5, 0.5, 10));
          this.rigid_character = new ƒ.ComponentRigidbody(0, ƒ.BODY_TYPE.KINEMATIC, ƒ.COLLIDER_TYPE.CUBE, ƒ.COLLISION_GROUP.DEFAULT, this.mt_rigid);
          this.rigid_character.isTrigger = true;
          this.rigid_character.mtxPivot = this.mt_rigid;
          this.node.addComponent(this.rigid_character)

          // Set Player health
          this.playerhealthAmount = 100;
          this.lightPercentage = 100;
          
          // Set time
          this.timeOfLastUpdate = new Date();
          this.timeOfLastDamageTaken = new Date();

          // Set VUI
          this.gameState = new GameState();

          // Set Audio
          let damageSound :ƒ.Audio = new ƒ.Audio("./Sound/getting_damage.mp3");
          this.gettingDamageSound = new ƒ.ComponentAudio(damageSound);
          this.gettingDamageSound.volume = 0.5;
          this.node.addComponent(this.gettingDamageSound);

          let enemyAttack :ƒ.Audio = new ƒ.Audio("./Sound/enemy_attack.mp3");
          this.enemyAttackSound = new ƒ.ComponentAudio(enemyAttack);
          this.enemyAttackSound.volume = 0.5;
          this.node.addComponent(this.enemyAttackSound);

          this.node.addEventListener(ƒ.EVENT.RENDER_PREPARE, this.update);
          
          break;
        case ƒ.EVENT.COMPONENT_REMOVE:
          this.removeEventListener(ƒ.EVENT.COMPONENT_ADD, this.hndEvent);
          this.removeEventListener(ƒ.EVENT.COMPONENT_REMOVE, this.hndEvent);
          break;
        case ƒ.EVENT.NODE_DESERIALIZED:
          // if deserialized the node is now fully reconstructed and access to all its components and children is possible
          break;
      }
    }


    public update = (_event: Event): void => {
      
      let dateTime = new Date();
    
      if (this.rigid_character.collisions) {
        let collison_list =  this.rigid_character.collisions

        
        // Check Collisions
       
        if (collison_list){
          for (let collision_index in collison_list){
            let collision_obj: ƒ.ComponentRigidbody = collison_list[collision_index];
            if (collision_obj.collisionGroup == ƒ.COLLISION_GROUP.GROUP_1) {
              if (LEVEL == 5) {
                resetGame(true)
              } else {

              }
              nextLevel();
            } else if(collision_obj.collisionGroup == ƒ.COLLISION_GROUP.GROUP_2) {
              
              if (this.dateBetween(this.timeOfLastDamageTaken, dateTime) >= this.playerProtectionTime/(INCREASINGLEVELDIFFICULTY)) {
                // Player health
                this.playerhealthAmount -= ( ENEMYDAMAGE+((3+INCREASINGLEVELDIFFICULTY)*INCREASINGLEVELDIFFICULTY) ) 
                this.gameState.updateHealth(this.playerhealthAmount);
                // Sound
                if (!this.gettingDamageSound.isPlaying) {
                  this.gettingDamageSound.play(true);
                }
                if (!this.enemyAttackSound.isPlaying) {
                  this.enemyAttackSound.play(true);
                }
                
                
                this.timeOfLastDamageTaken = dateTime;
              }
              if (this.playerhealthAmount <= 0){
                // Game Over
                resetGame(false)
              }
              
            }
          }
         // console.log("Collisonssss", collison_rigid.collisionGroup)
        }
      }

      // Decrease Light with time
      if (this.dateBetween(this.timeOfLastUpdate, dateTime) >= this.lightUpdateFrequency/(DECREASINGLIGHTRATE*INCREASINGLEVELDIFFICULTY)) {
        if (this.mtx_light.translation.z > this.minLightPercentage) {
          this.mtx_light.translateZ(this.lightDecreaseValue);
          // Change Value to percentage for VUI
          let rounded_value = Math.round(this.mtx_light.translation.z * 10) / 10 
          let percentage_value = 99 - Math.round( (this.maxLightPercentage-rounded_value) * this.lightStepValue *10 ) / 10 
          this.gameState.updateBattery(percentage_value);
        }
        this.timeOfLastUpdate = dateTime;
      }    
    }
    public reduceBattery(){
      let rounded_value = Math.round(this.mtx_light.translation.z * 10) / 10 
    }

    public dateBetween ( date1: Date, date2: Date ) {
    
      // Convert both dates to milliseconds
      var date1_ms = date1.getTime();
      var date2_ms = date2.getTime();
    
      // Calculate the difference in milliseconds
      var difference_ms = date2_ms - date1_ms;
        
      // return in milliseconds
      return difference_ms; 
    }

 
      
      
      


    
    // protected reduceMutator(_mutator: ƒ.Mutator): void {
    //   // delete properties that should not be mutated
    //   // undefined properties and private fields (#) will not be included by default
    // }
  }
}