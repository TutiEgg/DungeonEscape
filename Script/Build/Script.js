"use strict";
var Dungeon;
(function (Dungeon) {
    var ƒ = FudgeCore;
    var ƒAid = FudgeAid;
    Dungeon.mtx = new ƒ.Matrix4x4();
    let ACTION;
    (function (ACTION) {
        ACTION[ACTION["IDLE"] = 0] = "IDLE";
        ACTION[ACTION["WALK_LEFT"] = 1] = "WALK_LEFT";
        ACTION[ACTION["WALK_RIGHT"] = 2] = "WALK_RIGHT";
        ACTION[ACTION["WALK_UP"] = 3] = "WALK_UP";
        ACTION[ACTION["WALK_DOWN"] = 4] = "WALK_DOWN";
        ACTION[ACTION["SPRINT_DOWN"] = 5] = "SPRINT_DOWN";
        ACTION[ACTION["SPRINT_UP"] = 6] = "SPRINT_UP";
        ACTION[ACTION["SPRINT_LEFT"] = 7] = "SPRINT_LEFT";
        ACTION[ACTION["SPRINT_RIGHT"] = 8] = "SPRINT_RIGHT";
    })(ACTION = Dungeon.ACTION || (Dungeon.ACTION = {}));
    class Avatar extends ƒAid.NodeSprite {
        speedWalk = 1.5;
        speedSprint = 3;
        ySpeed = 0;
        xSpeed = 0;
        animationCurrent;
        animWalkRight;
        animWalkLeft;
        animWalkUp;
        animWalkDown;
        animSprintRight;
        animSprintLeft;
        animSprintUp;
        animSprintDown;
        animIdleRight;
        animIdleLeft;
        animIdleUp;
        animIdleDown;
        rigid_character;
        constructor() {
            super("AvatarInstance");
            this.addComponent(new ƒ.ComponentTransform());
            //this.animationCurrent = this.animWalkRight;
            // this.addEventListener(ƒ.EVENT.RENDER_PREPARE, () => console.log("Render"));
        }
        update(_deltaTime) {
            let pos = this.mtxLocal.translation;
            Dungeon.viewport.camera.mtxPivot.translation = new ƒ.Vector3(pos.x * -1, pos.y, -4);
            if (Dungeon.checkCollision(this)) {
                this.mtxLocal.translation = Dungeon.pos_before;
            }
            else {
                Dungeon.pos_before = pos;
            }
            //console.log(this.mtxLocal.translation.x, this.mtxLocal.translation.y)
            this.mtxLocal.translate(new ƒ.Vector3(this.xSpeed * _deltaTime, this.ySpeed * _deltaTime, 0), true);
        }
        // Bei sprint animation unten einfach auf 3 frames anstatt 10
        // this.animWalk.generateByGrid(ƒ.Rectangle.GET(480, 910, 120, 130),3, 128, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(120));
        //this.animWalk.generateByGrid(ƒ.Rectangle.GET(480, 910, 120, 130),10, 128, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(120));
        act(_action) {
            let animation;
            this.xSpeed = 0;
            this.ySpeed = 0;
            switch (_action) {
                case ACTION.WALK_RIGHT:
                    this.xSpeed = this.speedWalk;
                    animation = this.animWalkRight;
                    break;
                case ACTION.WALK_LEFT:
                    this.xSpeed = -this.speedWalk;
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
                    this.xSpeed = -this.speedSprint;
                    animation = this.animSprintLeft;
                    break;
                case ACTION.SPRINT_RIGHT:
                    this.xSpeed = this.speedSprint;
                    animation = this.animSprintRight;
                    break;
                case ACTION.SPRINT_UP:
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
                    }
                    else if (this.animationCurrent == this.animSprintLeft || this.animationCurrent == this.animWalkLeft) {
                        animation = this.animIdleLeft;
                    }
                    else if (this.animationCurrent == this.animSprintUp || this.animationCurrent == this.animWalkUp) {
                        animation = this.animIdleUp;
                    }
                    else if (this.animationCurrent == this.animSprintDown || this.animationCurrent == this.animWalkDown) {
                        animation = this.animIdleDown;
                    }
                    else {
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
        async initializeAnimations(_imgSpriteSheet) {
            let coat = new ƒ.CoatTextured(undefined, _imgSpriteSheet);
            this.animIdleRight = new ƒAid.SpriteSheetAnimation("IdleRight", coat);
            this.animIdleRight.generateByGrid(ƒ.Rectangle.GET(0, 390, 120, 130), 3, 172, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(120));
            this.animIdleLeft = new ƒAid.SpriteSheetAnimation("IdleLeft", coat);
            this.animIdleLeft.generateByGrid(ƒ.Rectangle.GET(0, 130, 120, 130), 3, 172, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(120));
            this.animIdleUp = new ƒAid.SpriteSheetAnimation("IdleUp", coat);
            this.animIdleUp.generateByGrid(ƒ.Rectangle.GET(0, 260, 120, 130), 1, 172, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(120));
            this.animIdleDown = new ƒAid.SpriteSheetAnimation("IdleDown", coat);
            this.animIdleDown.generateByGrid(ƒ.Rectangle.GET(0, 0, 120, 130), 3, 172, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(120));
            this.animWalkRight = new ƒAid.SpriteSheetAnimation("WalkRight", coat);
            this.animWalkRight.generateByGrid(ƒ.Rectangle.GET(360, 910, 120, 130), 4, 172, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(120));
            this.animWalkLeft = new ƒAid.SpriteSheetAnimation("WalkLeft", coat);
            this.animWalkLeft.generateByGrid(ƒ.Rectangle.GET(360, 650, 120, 130), 4, 172, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(120));
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
    Dungeon.Avatar = Avatar;
})(Dungeon || (Dungeon = {}));
var Dungeon;
(function (Dungeon) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Dungeon); // Register the namespace to FUDGE for serialization
    class CharacterScript extends ƒ.ComponentScript {
        // Register the script as component for use in the editor via drag&drop
        static iSubclass = ƒ.Component.registerSubclass(CharacterScript);
        // Properties may be mutated by users in the editor via the automatically created user interface
        message = "CustomComponentScript added to ";
        rigid_character;
        mt_rigid = new ƒ.Matrix4x4();
        gameState;
        // Light Variables
        mtx_light;
        light;
        minLightPercentage = 2;
        maxLightPercentage = 5;
        lightStepValue = Math.round(100 / (5 - 2));
        lightPercentage;
        lightUpdateFrequency = 200; // Milliseconds
        timeOfLastUpdate;
        lightDecreaseValue = 0.001;
        // Player Variables
        maxHealthAmount;
        playerhealthAmount;
        timeOfLastDamageTaken;
        playerProtectionTime = 2000; // Millisecons
        // Sound variablees
        gettingDamageSound;
        enemyAttackSound;
        pickUpTime;
        fill_process = true;
        constructor() {
            super();
            // Don't start when running in editor
            if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                return;
            // Give Player health
            // Listen to this component being added to or removed from a node
            this.addEventListener("componentAdd" /* ƒ.EVENT.COMPONENT_ADD */, this.hndEvent);
            this.addEventListener("componentRemove" /* ƒ.EVENT.COMPONENT_REMOVE */, this.hndEvent);
            this.addEventListener("nodeDeserialized" /* ƒ.EVENT.NODE_DESERIALIZED */, this.hndEvent);
        }
        // Activate the functions of this component as response to events
        hndEvent = (_event) => {
            switch (_event.type) {
                case "componentAdd" /* ƒ.EVENT.COMPONENT_ADD */:
                    ƒ.Debug.log(this.message, this.node);
                    // Create lights around the Character
                    this.mtx_light = new ƒ.Matrix4x4();
                    this.mtx_light.translateZ(this.maxLightPercentage);
                    this.mtx_light.rotateY(180);
                    this.mtx_light.scale(new ƒ.Vector3(20, 20, 15));
                    this.light = new ƒ.ComponentLight(new ƒ.LightSpot(ƒ.Color.CSS("white")));
                    this.light.mtxPivot = this.mtx_light;
                    this.node.addComponent(this.light);
                    // Create Rigidbody
                    this.mt_rigid.scale(new ƒ.Vector3(0.5, 0.5, 10));
                    this.rigid_character = new ƒ.ComponentRigidbody(0, ƒ.BODY_TYPE.KINEMATIC, ƒ.COLLIDER_TYPE.CUBE, ƒ.COLLISION_GROUP.DEFAULT, this.mt_rigid);
                    this.rigid_character.isTrigger = true;
                    this.rigid_character.mtxPivot = this.mt_rigid;
                    this.node.addComponent(this.rigid_character);
                    // Set Player health
                    this.playerhealthAmount = 100;
                    this.lightPercentage = 100;
                    // Set time
                    this.timeOfLastUpdate = new Date();
                    this.timeOfLastDamageTaken = new Date();
                    this.pickUpTime = new Date();
                    // Set VUI
                    this.gameState = new Dungeon.GameState();
                    // Set Audio
                    let damageSound = new ƒ.Audio("./Sound/getting_damage.mp3");
                    this.gettingDamageSound = new ƒ.ComponentAudio(damageSound);
                    this.gettingDamageSound.volume = 0.5;
                    this.node.addComponent(this.gettingDamageSound);
                    this.node.addEventListener("renderPrepare" /* ƒ.EVENT.RENDER_PREPARE */, this.update);
                    break;
                case "componentRemove" /* ƒ.EVENT.COMPONENT_REMOVE */:
                    this.removeEventListener("componentAdd" /* ƒ.EVENT.COMPONENT_ADD */, this.hndEvent);
                    this.removeEventListener("componentRemove" /* ƒ.EVENT.COMPONENT_REMOVE */, this.hndEvent);
                    break;
                case "nodeDeserialized" /* ƒ.EVENT.NODE_DESERIALIZED */:
                    // if deserialized the node is now fully reconstructed and access to all its components and children is possible
                    break;
            }
        };
        update = (_event) => {
            let dateTime = new Date();
            if (this.rigid_character.collisions) {
                let collison_list = this.rigid_character.collisions;
                // Check Collisions
                if (collison_list) {
                    for (let collision_index in collison_list) {
                        let collision_obj = collison_list[collision_index];
                        if (collision_obj.collisionGroup == ƒ.COLLISION_GROUP.GROUP_1) {
                            if (Dungeon.LEVEL == 5) {
                                Dungeon.resetGame(true);
                            }
                            else {
                            }
                            Dungeon.nextLevel();
                        }
                        else if (collision_obj.collisionGroup == ƒ.COLLISION_GROUP.GROUP_2) {
                            if (this.dateBetween(this.timeOfLastDamageTaken, dateTime) >= this.playerProtectionTime / (Dungeon.INCREASINGLEVELDIFFICULTY)) {
                                // Player health
                                this.playerhealthAmount -= (Dungeon.ENEMYDAMAGE + ((3 + Dungeon.INCREASINGLEVELDIFFICULTY) * Dungeon.INCREASINGLEVELDIFFICULTY));
                                this.gameState.updateHealth(this.playerhealthAmount);
                                // Sound
                                if (!this.gettingDamageSound.isPlaying) {
                                    this.gettingDamageSound.play(true);
                                }
                                this.timeOfLastDamageTaken = dateTime;
                            }
                            if (this.playerhealthAmount <= 0) {
                                // Game Over
                                Dungeon.resetGame(false);
                            }
                        }
                        else if (collision_obj.collisionGroup == ƒ.COLLISION_GROUP.GROUP_3) {
                            // Move Battery 
                            let rndFloor = Dungeon.getRandomFloortile();
                            let parent_col = rndFloor.getParent(); // X
                            let parent_row = parent_col.getParent(); //Y
                            let new_vec_pos = new ƒ.Vector3(parent_col.mtxLocal.translation.x, parent_row.mtxLocal.translation.y, 0.5);
                            collision_obj.node.mtxLocal.translation = new_vec_pos;
                            let new_battery = Dungeon.BATTERYFILLAMOUNT + this.gameState.getBatteryValue();
                            if (new_battery >= 100) {
                                new_battery = 99;
                            }
                            //this.gameState.updateBattery(new_battery);
                            // Optimize this area
                            if (this.dateBetween(this.pickUpTime, dateTime) >= 2000) {
                                this.fill_process = true;
                            }
                            if (this.fill_process) {
                                this.pickUpTime = dateTime;
                                let percentage_value = 2 + (new_battery / 100) * 3;
                                let light_inc = this.mtx_light.translation.z - percentage_value;
                                this.mtx_light.translateZ(light_inc / 10);
                                this.gameState.updateBattery(new_battery);
                                this.fill_process = false;
                            }
                            // 
                            // Battery deletefg
                            // Add Battery to playerlight 
                            // Add Battery in VUI
                        }
                    }
                    // console.log("Collisonssss", collison_rigid.collisionGroup)
                }
            }
            // Decrease Light with time
            if (this.dateBetween(this.timeOfLastUpdate, dateTime) >= this.lightUpdateFrequency / (Dungeon.DECREASINGLIGHTRATE * Dungeon.INCREASINGLEVELDIFFICULTY)) {
                if (this.mtx_light.translation.z > this.minLightPercentage) {
                    this.mtx_light.translateZ(this.lightDecreaseValue);
                    // Change Value to percentage for VUI
                    let rounded_value = Math.round(this.mtx_light.translation.z * 10) / 10;
                    let percentage_value = 99 - Math.round((this.maxLightPercentage - rounded_value) * this.lightStepValue * 10) / 10;
                    this.gameState.updateBattery(percentage_value);
                    //console.log(this.mtx_light.translation.z)
                }
                this.timeOfLastUpdate = dateTime;
            }
        };
        reduceBattery() {
            let rounded_value = Math.round(this.mtx_light.translation.z * 10) / 10;
        }
        dateBetween(date1, date2) {
            // Convert both dates to milliseconds
            var date1_ms = date1.getTime();
            var date2_ms = date2.getTime();
            // Calculate the difference in milliseconds
            var difference_ms = date2_ms - date1_ms;
            // return in milliseconds
            return difference_ms;
        }
    }
    Dungeon.CharacterScript = CharacterScript;
})(Dungeon || (Dungeon = {}));
var Dungeon;
(function (Dungeon) {
    var ƒ = FudgeCore;
    var ƒAid = FudgeAid;
    let EnemyState;
    (function (EnemyState) {
        EnemyState[EnemyState["IDLE"] = 0] = "IDLE";
        EnemyState[EnemyState["PATROL"] = 1] = "PATROL";
        EnemyState[EnemyState["ATTACK"] = 2] = "ATTACK";
    })(EnemyState = Dungeon.EnemyState || (Dungeon.EnemyState = {}));
    class Enemy extends ƒAid.NodeSprite {
        rigid_enemy;
        cmpStateMachine;
        moveTarget;
        moveDirection = "Up";
        enemyPosBefore;
        yOffset = 0.3;
        attackdamage;
        sprintSpeed;
        walkSpeed;
        animationCurrent;
        animWalkRight;
        animWalkLeft;
        animWalkUp;
        animWalkDown;
        animAttackRight;
        animAttackLeft;
        animAttackUp;
        animAttackDown;
        enemyAttackSound;
        constructor(_name = "Enemy", _startposition, _damage, _walkspeed, _sprintspeed) {
            super("AvatarInstance");
            // Initialize private Values
            this.name = _name;
            this.attackdamage = _damage;
            this.walkSpeed = _walkspeed;
            this.sprintSpeed = _sprintspeed;
            this.addComponent(new ƒ.ComponentTransform()); // Add tranformation component,for translations
            this.mtxLocal.translation = _startposition; // Start Position of Enemy
            this.enemyPosBefore = _startposition; // Init enemyPosBefore
            // Audio 
            // Search first Target to move
            [this.moveTarget, this.moveDirection] = Dungeon.searchNewTargetToMove(this.mtxLocal.translation, "None");
            // Add EnemyStateMachine
            this.cmpStateMachine = new Dungeon.EnemyStateMachine();
            this.addComponent(this.cmpStateMachine);
            this.cmpStateMachine.stateCurrent = EnemyState.PATROL;
            // Add Rigidbody
            let mt = new ƒ.Matrix4x4();
            mt.scale(new ƒ.Vector3(0.7, 0.7, 10));
            this.rigid_enemy = new ƒ.ComponentRigidbody(0, ƒ.BODY_TYPE.KINEMATIC, ƒ.COLLIDER_TYPE.CUBE, ƒ.COLLISION_GROUP.GROUP_2, mt);
            this.rigid_enemy.isTrigger = true;
            this.rigid_enemy.mtxPivot = mt;
            // Add SOund
            let enemyAttack = new ƒ.Audio("./Sound/enemy_attack.mp3");
            this.enemyAttackSound = new ƒ.ComponentAudio(enemyAttack);
            this.enemyAttackSound.volume = 0.5;
            this.addComponent(this.enemyAttackSound);
            //console.log("nachj", rigid_enemy.getScaling().x)
            this.addComponent(this.rigid_enemy);
        }
        update(deltaTime) {
            // Movement through EnemyStateMachine+
            if (this.checkCollisionsenemy()) {
            }
            else {
                if (this.cmpStateMachine.stateCurrent != EnemyState.PATROL) {
                    this.cmpStateMachine.transit(EnemyState.PATROL);
                }
            }
            this.getComponent(Dungeon.EnemyStateMachine).act();
            //this.displayAnimation();
        }
        checkCollisionsenemy() {
            if (this.rigid_enemy.collisions.length != 0) {
                let collison_list = this.rigid_enemy.collisions;
                // Check Collisions
                if (collison_list) {
                    for (let collision_index in collison_list) {
                        let collision_obj = collison_list[collision_index];
                        if (collision_obj.collisionGroup == ƒ.COLLISION_GROUP.DEFAULT) {
                            if (!this.enemyAttackSound.isPlaying) {
                                this.enemyAttackSound.play(true);
                                //this.cmpStateMachine.stateCurrent = EnemyState.ATTACK;
                                this.cmpStateMachine.transit(EnemyState.ATTACK);
                            }
                        }
                    }
                    return true;
                    // console.log("Collisonssss", collison_rigid.collisionGroup)
                }
                else {
                    return false;
                }
            }
            else {
                return false;
            }
        }
        move(deltaTime) {
            let animation;
            let enemyLocation = this.mtxLocal.translation;
            // Set new enemyPosBefore
            //this.enemyPosBefore = enemyLocation;
            // Move enemy
            if (this.moveDirection == "Left") {
                if (this.moveTarget.x > this.mtxLocal.translation.x) {
                    [this.moveTarget, this.moveDirection] = Dungeon.searchNewTargetToMove(enemyLocation, this.moveDirection);
                }
                else {
                    this.mtxLocal.translateX(-this.walkSpeed * deltaTime);
                }
                animation = this.animWalkLeft;
            }
            else if (this.moveDirection == "Right") {
                if (this.moveTarget.x < this.mtxLocal.translation.x) {
                    [this.moveTarget, this.moveDirection] = Dungeon.searchNewTargetToMove(enemyLocation, this.moveDirection);
                }
                else {
                    this.mtxLocal.translateX(this.walkSpeed * deltaTime);
                }
                animation = this.animWalkRight;
            }
            else if (this.moveDirection == "Down") {
                if (this.moveTarget.y > this.mtxLocal.translation.y) {
                    [this.moveTarget, this.moveDirection] = Dungeon.searchNewTargetToMove(enemyLocation, this.moveDirection);
                }
                else {
                    this.mtxLocal.translateY(-this.walkSpeed * deltaTime);
                }
                animation = this.animWalkDown;
            }
            else if (this.moveDirection == "Up") {
                if (this.moveTarget.y < this.mtxLocal.translation.y) {
                    [this.moveTarget, this.moveDirection] = Dungeon.searchNewTargetToMove(enemyLocation, this.moveDirection);
                }
                else {
                    this.mtxLocal.translateY(this.walkSpeed * deltaTime);
                }
                animation = this.animWalkUp;
            }
            else {
                console.log("ERROR: ", this.name, " is stuck !");
            }
            if (animation != this.animationCurrent) {
                this.setAnimation(animation);
                this.animationCurrent = animation;
            }
        }
        attack() {
            let animation;
            if (this.moveDirection == "Left") {
                animation = this.animAttackLeft;
            }
            else if (this.moveDirection == "Right") {
                animation = this.animAttackRight;
            }
            else if (this.moveDirection == "Down") {
                animation = this.animAttackDown;
            }
            else if (this.moveDirection == "Up") {
                animation = this.animAttackUp;
            }
            else {
                console.log("ERROR: ", this.name, " is stuck !");
            }
            if (animation != this.animationCurrent) {
                this.setAnimation(animation);
                this.animationCurrent = animation;
            }
        }
        async initializeAnimations(_imgSpriteSheet) {
            let coat = new ƒ.CoatTextured(undefined, _imgSpriteSheet);
            this.animWalkRight = new ƒAid.SpriteSheetAnimation("WalkRight", coat);
            this.animWalkRight.generateByGrid(ƒ.Rectangle.GET(0, 256, 128, 128), 4, 128, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(128));
            this.animWalkLeft = new ƒAid.SpriteSheetAnimation("WalkLeft", coat);
            this.animWalkLeft.generateByGrid(ƒ.Rectangle.GET(0, 128, 128, 128), 4, 128, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(128));
            this.animWalkUp = new ƒAid.SpriteSheetAnimation("WalkUp", coat);
            this.animWalkUp.generateByGrid(ƒ.Rectangle.GET(0, 512, 128, 128), 4, 128, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(128));
            this.animWalkDown = new ƒAid.SpriteSheetAnimation("WalkDown", coat);
            this.animWalkDown.generateByGrid(ƒ.Rectangle.GET(0, 384, 128, 128), 4, 128, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(128));
            this.animAttackRight = new ƒAid.SpriteSheetAnimation("AttackRight", coat);
            this.animAttackRight.generateByGrid(ƒ.Rectangle.GET(0, 640, 128, 128), 5, 128, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(128));
            this.animAttackLeft = new ƒAid.SpriteSheetAnimation("AttackLeft", coat);
            this.animAttackLeft.generateByGrid(ƒ.Rectangle.GET(0, 0, 128, 128), 5, 128, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(128));
            this.animAttackUp = new ƒAid.SpriteSheetAnimation("AttackUp", coat);
            this.animAttackUp.generateByGrid(ƒ.Rectangle.GET(0, 896, 128, 128), 5, 128, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(128));
            this.animAttackDown = new ƒAid.SpriteSheetAnimation("AttackDown", coat);
            this.animAttackDown.generateByGrid(ƒ.Rectangle.GET(0, 768, 128, 128), 5, 128, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(128));
            this.setAnimation(this.animWalkDown);
            this.framerate = 20;
        }
    }
    Dungeon.Enemy = Enemy;
    ƒAid.StateMachine;
})(Dungeon || (Dungeon = {}));
var Dungeon;
(function (Dungeon) {
    var ƒAid = FudgeAid;
    class EnemyStateMachine extends ƒAid.ComponentStateMachine {
        static iSubclass = ƒ.Component.registerSubclass(EnemyStateMachine);
        static instructions = EnemyStateMachine.setupStateMachine();
        constructor() {
            super();
            this.instructions = EnemyStateMachine.instructions;
        }
        static setupStateMachine() {
            let setup = new ƒAid.StateMachineInstructions();
            setup.transitDefault = EnemyStateMachine.transitDefault;
            setup.actDefault = EnemyStateMachine.actDefault;
            setup.setAction(Dungeon.EnemyState.IDLE, this.actIdle);
            setup.setAction(Dungeon.EnemyState.PATROL, this.actPatrol);
            setup.setAction(Dungeon.EnemyState.ATTACK, this.actAttack);
            return setup;
        }
        static transitDefault(_machine) {
            console.log("Transit to", _machine.stateNext);
        }
        static async actDefault(_machine) {
            console.log(Dungeon.EnemyState[_machine.stateCurrent]);
        }
        static async actIdle(_machine) {
            // Cant Happen, otherwise the enemy is stuck in place
            console.log("ENEMY Idle");
        }
        static async actPatrol(_machine) {
            let enemy_node;
            enemy_node = _machine.node;
            // Shows Error. Convert enemy_node to type of Enemy ?
            enemy_node.move(Dungeon.deltaTime);
        }
        static async actAttack(_machine) {
            //let container: Enemy = <Enemy>(<ƒAid.ComponentStateMachine<EnemyState>>_machine).getContainer();
            //let container: Enemy = <Enemy>(_machine).getContainer;
            let enemy_node;
            enemy_node = _machine.node;
            enemy_node.attack();
        }
    }
    Dungeon.EnemyStateMachine = EnemyStateMachine;
})(Dungeon || (Dungeon = {}));
var Dungeon;
(function (Dungeon) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Dungeon); // Register the namespace to FUDGE for serialization
    class ExitGateScript extends ƒ.ComponentScript {
        // Register the script as component for use in the editor via drag&drop
        static iSubclass = ƒ.Component.registerSubclass(ExitGateScript);
        // Properties may be mutated by users in the editor via the automatically created user interface
        message = "CustomComponentScript added to ";
        rigid_exit;
        constructor() {
            super();
            // Don't start when running in editor
            if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                return;
            // Listen to this component being added to or removed from a node
            this.addEventListener("componentAdd" /* ƒ.EVENT.COMPONENT_ADD */, this.hndEvent);
            this.addEventListener("componentRemove" /* ƒ.EVENT.COMPONENT_REMOVE */, this.hndEvent);
            this.addEventListener("nodeDeserialized" /* ƒ.EVENT.NODE_DESERIALIZED */, this.hndEvent);
        }
        // Activate the functions of this component as response to events
        hndEvent = (_event) => {
            switch (_event.type) {
                case "componentAdd" /* ƒ.EVENT.COMPONENT_ADD */:
                    ƒ.Debug.log(this.message, this.node);
                    this.rigid_exit = new ƒ.ComponentRigidbody(0, ƒ.BODY_TYPE.KINEMATIC, ƒ.COLLIDER_TYPE.CUBE, ƒ.COLLISION_GROUP.GROUP_1);
                    this.rigid_exit.isTrigger = true;
                    this.node.addComponent(new ƒ.ComponentTransform());
                    this.node.addComponent(this.rigid_exit);
                    //this.node.addEventListener(ƒ.EVENT.RENDER_PREPARE, this.update);
                    break;
                case "componentRemove" /* ƒ.EVENT.COMPONENT_REMOVE */:
                    this.removeEventListener("componentAdd" /* ƒ.EVENT.COMPONENT_ADD */, this.hndEvent);
                    this.removeEventListener("componentRemove" /* ƒ.EVENT.COMPONENT_REMOVE */, this.hndEvent);
                    break;
                case "nodeDeserialized" /* ƒ.EVENT.NODE_DESERIALIZED */:
                    // if deserialized the node is now fully reconstructed and access to all its components and children is possible
                    break;
            }
        };
        update = (_event) => {
            // For future , so i can add some animations and other function on triggering the exit_gate 
        };
    }
    Dungeon.ExitGateScript = ExitGateScript;
})(Dungeon || (Dungeon = {}));
var Dungeon;
(function (Dungeon) {
    var ƒ = FudgeCore;
    function animateLightRotation() {
        let light_mtx = Dungeon.avatar.getComponent(ƒ.ComponentLight).mtxPivot;
        let current_x = light_mtx.getEulerAngles().x;
        let current_y = light_mtx.getEulerAngles().y;
        // Change negativ value to Positiv ex.: -170 to 190 (180+10)
        if (current_y < 0) {
            current_y = 360 + current_y;
        }
        //console.log(Math.round(current_y), "=", yValue)
        if (Math.round(current_y) > Dungeon.yValue) {
            light_mtx.rotateY(-Dungeon.LIGHTMOVEMENTSPEED);
        }
        else if (Math.round(current_y) < Dungeon.yValue) {
            light_mtx.rotateY(Dungeon.LIGHTMOVEMENTSPEED);
        }
        if (Math.round(current_x) > Dungeon.xValue) {
            light_mtx.rotateX(-Dungeon.LIGHTMOVEMENTSPEED);
        }
        else if (Math.round(current_x) < Dungeon.xValue) {
            light_mtx.rotateX(Dungeon.LIGHTMOVEMENTSPEED);
        }
    }
    Dungeon.animateLightRotation = animateLightRotation;
    function createMap() {
        let tile_rows = Dungeon.graph.getChildrenByName("Map")[0].getChildrenByName("Tiles_map_12x12")[0];
        let tile_rows_amount = tile_rows.getChildren().length;
        let map = new Array(tile_rows_amount);
        for (let row of tile_rows.getChildren()) {
            // get y_value of tile
            let y_value = row.mtxLocal.translation.y;
            // add an array to each 1d element, hence creating 2d array 
            let tile_cols_amount = row.getChildren().length;
            map[y_value] = (new Array(tile_cols_amount));
            for (let col of row.getChildren()) {
                let x_value = col.mtxLocal.translation.x;
                if (col.getChildren()[0]) {
                    map[y_value][x_value] = col.getChildren()[0];
                }
                else {
                    map[y_value][x_value] = "None";
                }
            }
        }
        return map;
    }
    Dungeon.createMap = createMap;
    function checkCollision(_obj_to_check) {
        let pos = _obj_to_check.mtxLocal.translation;
        //viewport.camera.mtxPivot.translation = new ƒ.Vector3( pos.x * -1, pos.y,-4);
        let posYabs = Math.round(pos.y);
        let posXabs = Math.round(pos.x);
        if (Dungeon.MAP_TILES) {
            if (Dungeon.MAP_TILES[posYabs][posXabs].name != "None") {
                if (Dungeon.obj_to_move.indexOf(Dungeon.MAP_TILES[posYabs][posXabs].name) > -1) {
                    //console.log(obj_to_move.indexOf(map[posYabs+1][posXabs].name))
                    //For Visuals, so the character is not able to "visually" go into a wall in y-axis
                    if (pos.y % 1 <= 0.5 && !(Dungeon.obj_to_move.indexOf(Dungeon.MAP_TILES[posYabs + 1][posXabs].name) > -1)) {
                        //_obj_to_check.mtxLocal.translation = _pos_before
                        return true;
                    }
                    else {
                        //_pos_before = pos
                        return false;
                    }
                }
                else {
                    //_obj_to_check.mtxLocal.translation = _pos_before
                    return true;
                }
            }
        }
    }
    Dungeon.checkCollision = checkCollision;
    function getFloorlist(map) {
        let floor_list = [];
        for (let y = 0; y < map.length; y++) {
            for (let x = 0; x < map[y].length; x++) {
                if (map[y][x].name != undefined) {
                    if (Dungeon.obj_to_move.indexOf(map[y][x].name) > -1) {
                        // Check if no player is around
                        if (!check_if_player_around(x, y)) {
                            floor_list.push(map[y][x]);
                        }
                    }
                }
            }
        }
        return floor_list;
    }
    function resetExitGate() {
        // Get Exit_gate-Node
        console.log("EXIT 2: ", Dungeon.parent_of_exitgate);
        let exit_gate = Dungeon.parent_of_exitgate.getChildrenByName("Exit_Gate_tile")[0];
        console.log("EXIT script: ", exit_gate);
        // Move ExitGate-Object to Map, to save it for later
        Dungeon.graph.getChildrenByName("Map")[0].addChild(exit_gate);
        // Get saved floor_tile-object from map 
        let floor_tile = Dungeon.graph.getChildrenByName("Map")[0].getChildrenByName("Floor_tile")[0];
        Dungeon.parent_of_exitgate.addChild(floor_tile);
    }
    Dungeon.resetExitGate = resetExitGate;
    function setExitGate() {
        // Get Random Floor_tile_obj and replace it with exit_gate_tile_obj
        let floor_obj = getRandomFloortile();
        let parent_col = floor_obj.getParent(); // X
        let parent_row = parent_col.getParent(); //Y
        let new_vec_pos = new ƒ.Vector3(parent_col.mtxLocal.translation.x, parent_row.mtxLocal.translation.y, 0.7);
        Dungeon.exit_gate.mtxLocal.translation = new_vec_pos;
    }
    Dungeon.setExitGate = setExitGate;
    function getRandomFloortile() {
        let floor_list = getFloorlist(Dungeon.MAP_TILES);
        // Get random Number
        let rnd_number = Math.floor(Math.random() * (floor_list.length - 0 + 1)) + 0;
        return floor_list[rnd_number];
    }
    Dungeon.getRandomFloortile = getRandomFloortile;
    function check_if_player_around(x, y) {
        if (Dungeon.avatar.mtxLocal.translation.x - Dungeon.PLAYERPROTECTIONAURA <= x && x <= Dungeon.avatar.mtxLocal.translation.x + Dungeon.PLAYERPROTECTIONAURA) {
            if (Dungeon.avatar.mtxLocal.translation.y - Dungeon.PLAYERPROTECTIONAURA <= y && y <= Dungeon.avatar.mtxLocal.translation.y + Dungeon.PLAYERPROTECTIONAURA) {
                return true;
            }
        }
        return false;
    }
    Dungeon.check_if_player_around = check_if_player_around;
    function createEnemy() {
        let enemyAmount = Math.round(Dungeon.ENEMYSPAWNRATE * Math.round(Dungeon.LEVEL * Dungeon.INCREASINGLEVELDIFFICULTY));
        //console.log("EnemyAmount: ",enemySpawnRate, level , increasingLevelDifficulty)
        // Get grpah_enemy_parent
        let enemy_graph = Dungeon.graph.getChildrenByName("Enemys")[0];
        if (enemyAmount > 0) {
            // set enemyamount to max
            if (enemyAmount > Dungeon.MAXENEMYAMOUNT) {
                enemyAmount = Dungeon.MAXENEMYAMOUNT;
            }
            for (let i = 0; i < enemyAmount; i++) {
                let rndFloor = getRandomFloortile();
                let parent_col = rndFloor.getParent(); // X
                let parent_row = parent_col.getParent(); //Y
                let new_vec_pos = new ƒ.Vector3(parent_col.mtxLocal.translation.x, parent_row.mtxLocal.translation.y, 0.5);
                let enemydmg = Math.round(Dungeon.ENEMYDAMAGE * Math.round(Dungeon.LEVEL * Dungeon.INCREASINGLEVELDIFFICULTY));
                let enemywalkspeed = Dungeon.ENEMYSPEEDWALK * Math.round(Dungeon.LEVEL * Dungeon.INCREASINGLEVELDIFFICULTY);
                let enemysprintspeed = Dungeon.ENEMYSPEEDSPRINT * Math.round(Dungeon.LEVEL * Dungeon.INCREASINGLEVELDIFFICULTY);
                let en = new Dungeon.Enemy(`enemy_${i}`, new_vec_pos, enemydmg, enemywalkspeed, enemysprintspeed);
                en.initializeAnimations(Dungeon.imgSpriteSheetEnemy);
                Dungeon.ENEMYLIST.push(en);
                enemy_graph.addChild(en);
            }
        }
    }
    Dungeon.createEnemy = createEnemy;
    function createItems() {
        // Get graph battery
        let items_graph = Dungeon.graph.getChildrenByName("Items")[0];
        //let battery_graph = items_graph.getChildrenByName("Batterys")[0];
        console.log(items_graph);
        if (Dungeon.BATTERYAMOUNT > 0) {
            for (let i = 0; i < Dungeon.BATTERYAMOUNT; i++) {
                let rndFloor = getRandomFloortile();
                let parent_col = rndFloor.getParent(); // X
                let parent_row = parent_col.getParent(); //Y
                let new_vec_pos = new ƒ.Vector3(parent_col.mtxLocal.translation.x, parent_row.mtxLocal.translation.y, 0.5);
                let bat = new Dungeon.BatteryItem(`Battery_${i}`, new_vec_pos);
                bat.initializeAnimations(Dungeon.imgSpriteSheetBattery);
                Dungeon.BATTERYLIST.push(bat);
                items_graph.addChild(bat);
            }
        }
    }
    Dungeon.createItems = createItems;
    function searchNewTargetToMove(entityLocation, _moveDirectionBefore) {
        let possibleWays = getAllMoveOptions(entityLocation);
        let choosenDirection = chooseDirectionToMove(possibleWays, _moveDirectionBefore);
        if (choosenDirection == "Left") {
            return [new ƒ.Vector3(entityLocation.x - 1, entityLocation.y, entityLocation.z), choosenDirection];
        }
        else if (choosenDirection == "Right") {
            return [new ƒ.Vector3(entityLocation.x + 1, entityLocation.y, entityLocation.z), choosenDirection];
        }
        else if (choosenDirection == "Down") {
            return [new ƒ.Vector3(entityLocation.x, entityLocation.y - 1, entityLocation.z), choosenDirection];
        }
        else if (choosenDirection == "Up") {
            return [new ƒ.Vector3(entityLocation.x, entityLocation.y + 1, entityLocation.z), choosenDirection];
        }
        else {
            return [null, "Stuck"];
        }
    }
    Dungeon.searchNewTargetToMove = searchNewTargetToMove;
    function chooseDirectionToMove(possibleWays, _moveDirectionBefore) {
        // Check if list is empty
        if (possibleWays) {
            // Remove option to go back
            if (possibleWays.length > 1) {
                // Remove complementary Direction to removee the option of moving back
                possibleWays = possibleWays.filter(e => e !== String(Dungeon.COMPLEMENTARY_DIRECTIONS[_moveDirectionBefore]));
                let choosenString = possibleWays[Math.floor(Math.random() * possibleWays.length)];
                return choosenString;
            }
            else {
                return possibleWays[0];
            }
        }
        else {
            return "Stuck";
        }
    }
    Dungeon.chooseDirectionToMove = chooseDirectionToMove;
    function getAllMoveOptions(entityLocation) {
        let posYabs = Math.round(entityLocation.y);
        let posXabs = Math.round(entityLocation.x);
        let possibleWays = [];
        //if (String(MAP_TILES[posYabs][posXabs]) === "None"){
        //}else {
        if (Dungeon.obj_to_move.indexOf(Dungeon.MAP_TILES[posYabs + 1][posXabs].name) > -1) {
            possibleWays.push("Up");
        }
        if (Dungeon.obj_to_move.indexOf(Dungeon.MAP_TILES[posYabs - 1][posXabs].name) > -1) {
            possibleWays.push("Down");
        }
        if (Dungeon.obj_to_move.indexOf(Dungeon.MAP_TILES[posYabs][posXabs - 1].name) > -1) {
            possibleWays.push("Left");
        }
        if (Dungeon.obj_to_move.indexOf(Dungeon.MAP_TILES[posYabs][posXabs + 1].name) > -1) {
            possibleWays.push("Right");
        }
        //}
        return possibleWays;
    }
    Dungeon.getAllMoveOptions = getAllMoveOptions;
    function placePlayer() {
        // Check position if enemy or exit_gate is around
        let rndFloor = getRandomFloortile();
        let parent_col = rndFloor.getParent(); // X
        let parent_row = parent_col.getParent(); //Y
        let new_vec_pos = new ƒ.Vector3(parent_col.mtxLocal.translation.x, parent_row.mtxLocal.translation.y, 0.5);
        Dungeon.avatar.mtxLocal.translation = new_vec_pos;
        Dungeon.pos_before = new_vec_pos;
        return new_vec_pos;
    }
    Dungeon.placePlayer = placePlayer;
})(Dungeon || (Dungeon = {}));
var Dungeon;
(function (Dungeon) {
    var ƒ = FudgeCore;
    var ƒAid = FudgeAid;
    class BatteryItem extends ƒAid.NodeSprite {
        animIdle;
        rigid;
        constructor(_name = "Battery", _startposition) {
            super("AvatarInstance");
            // Initialize private Values
            this.name = _name;
            this.addComponent(new ƒ.ComponentTransform()); // Add tranformation component,for translations
            this.mtxLocal.translation = _startposition; // Start Position of Enemy
            // Add Rigidbody
            let mt = new ƒ.Matrix4x4();
            mt.scale(new ƒ.Vector3(0.7, 0.7, 10));
            this.rigid = new ƒ.ComponentRigidbody(0, ƒ.BODY_TYPE.KINEMATIC, ƒ.COLLIDER_TYPE.CUBE, ƒ.COLLISION_GROUP.GROUP_3, mt);
            this.rigid.isTrigger = true;
            this.rigid.mtxPivot = mt;
            this.addComponent(this.rigid);
        }
        async initializeAnimations(_imgSpriteSheet) {
            let coat = new ƒ.CoatTextured(undefined, _imgSpriteSheet);
            this.animIdle = new ƒAid.SpriteSheetAnimation("Idle", coat);
            this.animIdle.generateByGrid(ƒ.Rectangle.GET(0, 16, 16, 16), 1, 32, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(16));
            this.setAnimation(this.animIdle);
            this.framerate = 20;
        }
        setNewPos(vec) {
            this.mtxLocal.translation = vec;
        }
    }
    Dungeon.BatteryItem = BatteryItem;
    ƒAid.StateMachine;
})(Dungeon || (Dungeon = {}));
/*
 Collider-groups
 Default = Player
 1 = Exit Gate
 2 = Enemys
 3 = Items
 */
var Dungeon;
/*
 Collider-groups
 Default = Player
 1 = Exit Gate
 2 = Enemys
 3 = Items
 */
(function (Dungeon) {
    var ƒ = FudgeCore;
    document.addEventListener("interactiveViewportStarted", start);
    // Initialize Variables
    Dungeon.pos_before = new ƒ.Vector3(1, 1, 0); // position of the Character before a new movement-command
    Dungeon.obj_to_move = ["Floor_tile", "Exit_Gate_tile"]; // All Objects a player can move over
    Dungeon.COMPLEMENTARY_DIRECTIONS = {
        "Up": "Down",
        "Down": "Up",
        "Left": "Right",
        "Right": "Left",
        "None": "None"
    };
    Dungeon.xValue = 0; // x-Value of Light
    Dungeon.yValue = 180; // y-Value of Light
    Dungeon.imgSpriteSheetEnemy = new ƒ.TextureImage();
    Dungeon.imgSpriteSheetBattery = new ƒ.TextureImage();
    Dungeon.ENEMYLIST = [];
    Dungeon.BATTERYLIST = [];
    // Global Variables which cant be set in settings.json (Standard)
    Dungeon.LEVEL = 1;
    Dungeon.MAYLIGHTAMOUNT = 100;
    Dungeon.MAXENEMYAMOUNT = 10;
    Dungeon.BATTERYAMOUNT = 2;
    Dungeon.BATTERYFILLAMOUNT = 50;
    // Variables set in Settings. Here are default values
    Dungeon.LIGHTMOVEMENTSPEED = 0.3; // How fast the light changes the direction
    Dungeon.PLAYERPROTECTIONAURA = 3; // radius of proteaction around the player. No enemy, items, exitgate can spawn in this area
    Dungeon.PLAYERSPEEDWALK = 1.5;
    Dungeon.PLAYERSPEEDSPRINT = 3;
    Dungeon.ENEMYSPAWNRATE = 3;
    Dungeon.ENEMYSPEEDWALK = 1;
    Dungeon.ENEMYSPEEDSPRINT = 1.5;
    Dungeon.ENEMYDAMAGE = 1;
    Dungeon.DECREASINGLIGHTRATE = 1;
    Dungeon.INCREASINGLEVELDIFFICULTY = 1;
    let MOVEMENTCOMPONENTSOUND;
    let DUNGEONCOMPONENTSOUND;
    function start(_event) {
        Dungeon.viewport = _event.detail;
        Dungeon.viewport.camera.mtxPivot.translateZ(-10);
        Dungeon.viewport.camera.mtxPivot.translateY(0);
        hndLoad(_event);
    }
    async function hndLoad(_event) {
        // Create Animations
        let imgSpriteSheet = new ƒ.TextureImage();
        await imgSpriteSheet.load("./Assets/Sprite/character_sprite.png");
        //await imgSpriteSheet.load("./Assets/Sprite/avatar_sprite.png");
        await Dungeon.imgSpriteSheetEnemy.load("./Assets/Sprite/enemy_sprite_new.png");
        await Dungeon.imgSpriteSheetBattery.load("./Assets/Items/Battery.png");
        // Create graph
        Dungeon.graph = Dungeon.viewport.getBranch();
        // Create Character
        Dungeon.avatar = new Dungeon.Avatar();
        // Setup Audio
        let AudioListener = new ƒ.ComponentAudioListener();
        AudioListener.activate(true);
        Dungeon.avatar.initializeAnimations(imgSpriteSheet);
        Dungeon.graph.addChild(Dungeon.avatar);
        let walkingSound = new ƒ.Audio("./Sound/walking.mp3");
        let dungeonSound = new ƒ.Audio("./Sound/dungeon_ambiente.mp3");
        MOVEMENTCOMPONENTSOUND = new ƒ.ComponentAudio(walkingSound);
        MOVEMENTCOMPONENTSOUND.volume = 0.2;
        MOVEMENTCOMPONENTSOUND.play(true);
        DUNGEONCOMPONENTSOUND = new ƒ.ComponentAudio(dungeonSound, true);
        DUNGEONCOMPONENTSOUND.volume = 0.2;
        DUNGEONCOMPONENTSOUND.play(true);
        Dungeon.avatar.addComponent(AudioListener);
        Dungeon.avatar.addComponent(MOVEMENTCOMPONENTSOUND);
        Dungeon.avatar.addComponent(DUNGEONCOMPONENTSOUND);
        // Create Character Rigidbody for enemy/gatee/items Collisions
        Dungeon.avatar.addComponent(new Dungeon.CharacterScript());
        ƒ.Physics.adjustTransforms(Dungeon.avatar);
        // Initialize ExitGate_obj
        Dungeon.exit_gate = Dungeon.graph.getChildrenByName("Map")[0].getChildrenByName("Exit_Gate_tile")[0];
        Dungeon.exit_gate.addComponent(new Dungeon.ExitGateScript());
        // Start Game
        await startGame();
        /*
        let cmpAudio: ƒ.ComponentAudio = graph.getComponent(ƒ.ComponentAudio);
        cmpAudio.volume = 0.1;
        console.log(cmpAudio);
        */
        ƒ.Loop.addEventListener("loopFrame" /* ƒ.EVENT.LOOP_FRAME */, update);
        ƒ.Loop.start();
    }
    // Game time
    function update(_event) {
        Dungeon.deltaTime = ƒ.Loop.timeFrameGame / 1000;
        let run = ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SHIFT_LEFT, ƒ.KEYBOARD_CODE.SHIFT_RIGHT]);
        // Check for key presses
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT])) {
            if (Dungeon.keyPressedBefore != "a") {
                Dungeon.keyPressedBefore = "a";
                Dungeon.yValue = 190;
                Dungeon.xValue = 0;
            }
            else {
                Dungeon.animateLightRotation();
            }
            if (!MOVEMENTCOMPONENTSOUND.isPlaying) {
                MOVEMENTCOMPONENTSOUND.play(true);
            }
            Dungeon.avatar.act(run ? Dungeon.ACTION.SPRINT_LEFT : Dungeon.ACTION.WALK_LEFT);
        }
        else if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT])) {
            if (Dungeon.keyPressedBefore != "d") {
                Dungeon.keyPressedBefore = "d";
                Dungeon.yValue = 170;
                Dungeon.xValue = 0;
            }
            else {
                Dungeon.animateLightRotation();
            }
            if (!MOVEMENTCOMPONENTSOUND.isPlaying) {
                MOVEMENTCOMPONENTSOUND.play(true);
            }
            Dungeon.avatar.act(run ? Dungeon.ACTION.SPRINT_RIGHT : Dungeon.ACTION.WALK_RIGHT);
        }
        else if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP])) {
            if (Dungeon.keyPressedBefore != "w") {
                Dungeon.keyPressedBefore = "w";
                Dungeon.yValue = 180;
                Dungeon.xValue = -10;
            }
            else {
                Dungeon.animateLightRotation();
            }
            if (!MOVEMENTCOMPONENTSOUND.isPlaying) {
                MOVEMENTCOMPONENTSOUND.play(true);
            }
            Dungeon.avatar.act(run ? Dungeon.ACTION.SPRINT_UP : Dungeon.ACTION.WALK_UP);
        }
        else if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.S, ƒ.KEYBOARD_CODE.ARROW_DOWN])) {
            if (Dungeon.keyPressedBefore != "s") {
                Dungeon.keyPressedBefore = "s";
                Dungeon.yValue = 180;
                Dungeon.xValue = 10;
            }
            else {
                Dungeon.animateLightRotation();
            }
            if (!MOVEMENTCOMPONENTSOUND.isPlaying) {
                MOVEMENTCOMPONENTSOUND.play(true);
            }
            Dungeon.avatar.act(run ? Dungeon.ACTION.SPRINT_DOWN : Dungeon.ACTION.WALK_DOWN);
        }
        /* // For testing purposes-
        else if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.E, ƒ.KEYBOARD_CODE.ARROW_DOWN])){
          resetGame(false)
        }
        */
        else {
            Dungeon.avatar.act(Dungeon.ACTION.IDLE);
            Dungeon.animateLightRotation();
            MOVEMENTCOMPONENTSOUND.play(false);
        }
        ƒ.Physics.simulate(ƒ.Loop.timeFrameReal / 1000);
        //checkCollision(MAP_TILES);
        // Update Character
        Dungeon.avatar.update(Dungeon.deltaTime);
        // Update Enemys
        for (let enemy of Dungeon.ENEMYLIST) {
            enemy.update(Dungeon.deltaTime);
        }
        Dungeon.viewport.draw();
        //ƒ.AudioManager.default.update();
    }
    async function initializeGlobalVariables() {
        // Read settings-json
        let response = await fetch("settings.json");
        let settings_dict = await response.json();
        //let json_parse = JSON.parse(settings_dict);
        // Set global Variables
        return settings_dict;
    }
    async function set(settings_dict) {
        Dungeon.LIGHTMOVEMENTSPEED = settings_dict[Object.keys({ light_movement_speed: Dungeon.LIGHTMOVEMENTSPEED })[0]];
        Dungeon.PLAYERPROTECTIONAURA = settings_dict[Object.keys({ player_Protection_Aura: Dungeon.PLAYERPROTECTIONAURA })[0]];
        Dungeon.PLAYERSPEEDWALK = settings_dict[Object.keys({ player_Speed_Walk: Dungeon.PLAYERSPEEDWALK })[0]];
        Dungeon.PLAYERSPEEDSPRINT = settings_dict[Object.keys({ player_Speed_Sprint: Dungeon.PLAYERSPEEDSPRINT })[0]];
        Dungeon.ENEMYSPAWNRATE = settings_dict[Object.keys({ enemy_Spawn_Rate: Dungeon.ENEMYSPAWNRATE })[0]];
        Dungeon.ENEMYSPEEDWALK = settings_dict[Object.keys({ enemy_Speed_Walk: Dungeon.ENEMYSPEEDWALK })[0]];
        Dungeon.ENEMYSPEEDSPRINT = settings_dict[Object.keys({ enemy_Sprint: Dungeon.ENEMYSPEEDSPRINT })[0]];
        Dungeon.ENEMYDAMAGE = settings_dict[Object.keys({ enemy_Damage: Dungeon.ENEMYDAMAGE })[0]];
        Dungeon.DECREASINGLIGHTRATE = settings_dict[Object.keys({ decreasing_Light_Rate: Dungeon.DECREASINGLIGHTRATE })[0]];
        Dungeon.INCREASINGLEVELDIFFICULTY = settings_dict[Object.keys({ increasing_Level_Difficulty: Dungeon.INCREASINGLEVELDIFFICULTY })[0]];
    }
    async function startGame() {
        // Initialize Global Variables
        let settings = await initializeGlobalVariables();
        await set(settings);
        // Create a tile_map, which is generated on the start.
        Dungeon.MAP_TILES = Dungeon.createMap();
        // Create Exit
        Dungeon.setExitGate();
        // Set Character on Random pos
        Dungeon.placePlayer();
        // Create and position Enemys
        Dungeon.createEnemy();
        // Create and postiion Items
        Dungeon.createItems();
    }
    // Reset all global-Variables
    function resetGame(won) {
        if (won) {
            window.location.href = "../../won.html";
        }
        else {
            window.location.href = "../../gameover.html";
        }
    }
    Dungeon.resetGame = resetGame;
    // Resets only the level
    function resetLevel() {
        // Delete Enemys
        let enemy_graph = Dungeon.graph.getChildrenByName("Enemys")[0];
        enemy_graph.removeAllChildren();
        Dungeon.ENEMYLIST = [];
        Dungeon.BATTERYLIST = [];
        let battery_graph = Dungeon.graph.getChildrenByName("Items")[0];
        battery_graph.removeAllChildren();
        // Delete Items
        // Remove ExitGate
        Dungeon.setExitGate();
        // Update HUD
    }
    // Set next Level and increase difficulty
    function nextLevel() {
        Dungeon.placePlayer();
        resetLevel();
        Dungeon.LEVEL += 1;
        Dungeon.createEnemy();
        Dungeon.createItems();
        //setExitGate();
    }
    Dungeon.nextLevel = nextLevel;
})(Dungeon || (Dungeon = {}));
var Dungeon;
(function (Dungeon) {
    var ƒ = FudgeCore;
    class GameState extends ƒ.Mutable {
        r;
        constructor() {
            super();
            this.r = document.querySelector(':root');
        }
        updateBattery(value) {
            this.r.style.setProperty('--batteryValue', `${value}%`);
        }
        getBatteryValue() {
            let return_string = this.r.style.getPropertyValue('--batteryValue');
            return_string = return_string.slice(0, -1);
            var return_number = +return_string;
            return return_number;
        }
        getHealthValue() {
            let return_string = this.r.style.getPropertyValue('--fill');
            return_string = return_string.slice(0, -1);
            var return_number = +return_string;
            return return_number;
        }
        updateHealth(value) {
            this.r.style.setProperty('--fill', `${value}%`);
        }
        reduceMutator(_mutator) { }
    }
    Dungeon.GameState = GameState;
})(Dungeon || (Dungeon = {}));
//# sourceMappingURL=Script.js.map