 /*
  Collider-groups
  Default = Player
  1 = Exit Gate
  2 = Enemys
  3 = Items
  */

namespace Dungeon {
  import ƒ = FudgeCore;
  import fui = FudgeUserInterface;
  
  // Initialize Viewport
  export let viewport: ƒ.Viewport;
  export let graph: ƒ.Node;
  document.addEventListener("interactiveViewportStarted", <EventListener>start);

  // Initialize Variables
  export let pos_before: ƒ.Vector3 = new ƒ.Vector3(1,1,0);       // position of the Character before a new movement-command
  export let MAP_TILES: ƒ.Node[][];                                    // Information of the Map (2Dim-Array)
  export let keyPressedBefore: string;                           // Key which was pressed before
  export let obj_to_move = ["Floor_tile", "Exit_Gate_tile"];     // All Objects a player can move over
  export let COMPLEMENTARY_DIRECTIONS: {[id: string]: string} = {
    "Up": "Down", 
    "Down": "Up",
    "Left": "Right",
    "Right": "Left",
    "None": "None"
  }
  export let xValue = 0;                                          // x-Value of Light
  export let yValue = 180;                                        // y-Value of Light
  export let avatar: Avatar;                                     // Avatar-Object
  export let exit_gate: ƒ.Node;
  export let parent_of_exitgate: ƒ.Node;

  export let imgSpriteSheetEnemy: ƒ.TextureImage = new ƒ.TextureImage();

  export let ENEMYLIST: Enemy[] = [];

  // Global Variables which cant be set in settings.json (Standard)
  export let LEVEL: number = 1
  export let MAYLIGHTAMOUNT:number = 100;
  export let MAXENEMYAMOUNT:number = 10;
  
  // Variables set in Settings. Here are default values
  export let LIGHTMOVEMENTSPEED:number = 0.3;                         // How fast the light changes the direction
  export let PLAYERPROTECTIONAURA: number = 3;                       // radius of proteaction around the player. No enemy, items, exitgate can spawn in this area
  export let PLAYERSPEEDWALK: number = 1.5;
  export let PLAYERSPEEDSPRINT: number = 3;

  export let ENEMYSPAWNRATE: number = 3;
  export let ENEMYSPEEDWALK: number = 1;
  export let ENEMYSPEEDSPRINT: number = 1.5;
  export let ENEMYDAMAGE: number = 1;

  export let DECREASINGLIGHTRATE: number = 1;
  export let INCREASINGLEVELDIFFICULTY: number = 1;

  let MOVEMENTCOMPONENTSOUND: ƒ.ComponentAudio;
  let DUNGEONCOMPONENTSOUND: ƒ.ComponentAudio;


  function start(_event: CustomEvent): void {
    viewport = _event.detail;
    viewport.camera.mtxPivot.translateZ(-10);
    viewport.camera.mtxPivot.translateY(0);
    
    hndLoad(_event)
  }
  


  async function hndLoad(_event: Event): Promise<void> {

    // Create Animations
    let imgSpriteSheet: ƒ.TextureImage = new ƒ.TextureImage();
    await imgSpriteSheet.load("./Assets/Sprite/character_sprite.png");
    //await imgSpriteSheet.load("./Assets/Sprite/avatar_sprite.png");
    await imgSpriteSheetEnemy.load("./Assets/Sprite/enemy_sprite_new.png");

    // Create graph
    graph = viewport.getBranch();

    // Create Character
    avatar = new Avatar();
    
    // Setup Audio
    let AudioListener: ƒ.ComponentAudioListener = new ƒ.ComponentAudioListener()
    AudioListener.activate(true)
    avatar.initializeAnimations(imgSpriteSheet);
    graph.addChild(avatar);


    let walkingSound :ƒ.Audio = new ƒ.Audio("./Sound/walking.mp3")
    let dungeonSound :ƒ.Audio = new ƒ.Audio("./Sound/dungeon_ambiente.mp3")
    
    MOVEMENTCOMPONENTSOUND = new ƒ.ComponentAudio(walkingSound)
    MOVEMENTCOMPONENTSOUND.volume = 0.2
    MOVEMENTCOMPONENTSOUND.play(true)

    DUNGEONCOMPONENTSOUND = new ƒ.ComponentAudio(dungeonSound, true)
    DUNGEONCOMPONENTSOUND.volume = 0.2
    DUNGEONCOMPONENTSOUND.play(true)

    avatar.addComponent(AudioListener)
    avatar.addComponent(MOVEMENTCOMPONENTSOUND)
    avatar.addComponent(DUNGEONCOMPONENTSOUND)
    

    // Create Character Rigidbody for enemy/gatee/items Collisions
    avatar.addComponent(new CharacterScript());
    ƒ.Physics.adjustTransforms(avatar);

    // Initialize ExitGate_obj
    exit_gate = graph.getChildrenByName("Map")[0].getChildrenByName("Exit_Gate_tile")[0];
    exit_gate.addComponent(new ExitGateScript());
    
    // Start Game
    await startGame()

    /*
    let cmpAudio: ƒ.ComponentAudio = graph.getComponent(ƒ.ComponentAudio);
    cmpAudio.volume = 0.1;
    console.log(cmpAudio);
    */

   ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
   ƒ.Loop.start();
    
  }

  // Game time
  function update(_event: Event): void {
    let deltaTime: number = ƒ.Loop.timeFrameGame / 1000;
    
    let run: boolean = ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SHIFT_LEFT, ƒ.KEYBOARD_CODE.SHIFT_RIGHT]);

    // Check for key presses
    
    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT])) {
      if (keyPressedBefore != "a") {
        keyPressedBefore = "a";
        yValue = 190
        xValue = 0
      }else{
        animateLightRotation()
      }
      if (!MOVEMENTCOMPONENTSOUND.isPlaying){
        MOVEMENTCOMPONENTSOUND.play(true)
      }
      avatar.act(run ? ACTION.SPRINT_LEFT : ACTION.WALK_LEFT);
    }
    else if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT])) {
      if (keyPressedBefore != "d") {
        keyPressedBefore = "d";
        yValue = 170
        xValue = 0
      }else{
        animateLightRotation()
      }
      if (!MOVEMENTCOMPONENTSOUND.isPlaying){
        MOVEMENTCOMPONENTSOUND.play(true)
      }
      avatar.act(run ? ACTION.SPRINT_RIGHT : ACTION.WALK_RIGHT);
    }
    else if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP])){
      if (keyPressedBefore != "w") {
        keyPressedBefore = "w";
        yValue = 180
        xValue = -10
      }else{
        animateLightRotation()
      }
      if (!MOVEMENTCOMPONENTSOUND.isPlaying){
        MOVEMENTCOMPONENTSOUND.play(true)
      }
      avatar.act(run ? ACTION.SPRINT_UP : ACTION.WALK_UP);
    } 
    else if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.S, ƒ.KEYBOARD_CODE.ARROW_DOWN])){
      if (keyPressedBefore != "s") {
        keyPressedBefore = "s";
        yValue = 180
        xValue = 10
        
        
      }else{
        animateLightRotation()
      }
      if (!MOVEMENTCOMPONENTSOUND.isPlaying){
        MOVEMENTCOMPONENTSOUND.play(true)
      }
      avatar.act(run ? ACTION.SPRINT_DOWN : ACTION.WALK_DOWN);
    }
    else{  
      avatar.act(ACTION.IDLE);
      animateLightRotation()
      MOVEMENTCOMPONENTSOUND.play(false)

    }


    ƒ.Physics.simulate(ƒ.Loop.timeFrameReal / 1000);
    
    //checkCollision(MAP_TILES);
    
    // Update Character
    avatar.update(deltaTime);

    // Update Enemys
    for (let enemy of ENEMYLIST as Enemy[]){
      enemy.update(deltaTime);
    }
    viewport.draw();
    //ƒ.AudioManager.default.update();
  }

  async function initializeGlobalVariables(): Promise<void> {
    // Read settings-json
    let response: Response = await fetch("settings.json");
    let settings_dict = await response.json();
    //let json_parse = JSON.parse(settings_dict);
    // Set global Variables
    return settings_dict
    
  }

  async function set(settings_dict: any): Promise<void> {
    LIGHTMOVEMENTSPEED = settings_dict[Object.keys({light_movement_speed: LIGHTMOVEMENTSPEED})[0]];
    PLAYERPROTECTIONAURA = settings_dict[Object.keys({player_Protection_Aura: PLAYERPROTECTIONAURA})[0]];                         
    PLAYERSPEEDWALK = settings_dict[Object.keys({player_Speed_Walk: PLAYERSPEEDWALK})[0]]; 
    PLAYERSPEEDSPRINT = settings_dict[Object.keys({player_Speed_Sprint: PLAYERSPEEDSPRINT})[0]]; 
    ENEMYSPAWNRATE = settings_dict[Object.keys({enemy_Spawn_Rate: ENEMYSPAWNRATE})[0]]; 
    ENEMYSPEEDWALK = settings_dict[Object.keys({enemy_Speed_Walk: ENEMYSPEEDWALK})[0]]; 
    ENEMYSPEEDSPRINT = settings_dict[Object.keys({enemy_Sprint: ENEMYSPEEDSPRINT})[0]]; 
    ENEMYDAMAGE = settings_dict[Object.keys({enemy_Damage: ENEMYDAMAGE})[0]]; 
    DECREASINGLIGHTRATE = settings_dict[Object.keys({decreasing_Light_Rate: DECREASINGLIGHTRATE})[0]]; 
    INCREASINGLEVELDIFFICULTY = settings_dict[Object.keys({increasing_Level_Difficulty: INCREASINGLEVELDIFFICULTY})[0]] 
    
  }
  

  async function startGame(): Promise<void> {
    // Initialize Global Variables
    let settings = await initializeGlobalVariables();
    await set(settings);

    // Create a tile_map, which is generated on the start.
    MAP_TILES = createMap();

    // Create Exit
    setExitGate();
    

    // Set Character on Random pos
    placePlayer()
  
    // Create and position Enemys
    createEnemy();

    // Create and postiion Items
  
  }
// Reset all global-Variables
export function resetGame(won: boolean): void {
  if (won) {

  } else {

  }
  // Read settings-json
  // Set/reset global-Variables

  // delete Map


  // Delete Enemys

  // Delete Items

  // Reset HUD
      // reset Stamina
      // reset battery
  
}

// Resets only the level
function resetLevel(): void {
  // Delete Enemys
  let enemy_graph: ƒ.Node = graph.getChildrenByName("Enemys")[0];
  enemy_graph.removeAllChildren();
  // Delete Items
  // Remove ExitGate
  //resetExitGate()
  // Reset HUD
      // reset Stamina
  setExitGate()
      // reset battery
} 

// Set next Level and increase difficulty
export function nextLevel(): void {
  console.log("before player", avatar.mtxLocal.translation)
  placePlayer();
  console.log("after palyer", avatar.mtxLocal.translation)
  resetLevel();
  LEVEL += 1;
  
  createEnemy();
  //setExitGate();

}


}


