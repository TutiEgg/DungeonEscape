
namespace Dungeon {    
    import ƒ = FudgeCore;


    export function animateLightRotation(): void{
        let light_mtx = avatar.getComponent(ƒ.ComponentLight).mtxPivot
        let current_x = light_mtx.getEulerAngles().x
        let current_y = light_mtx.getEulerAngles().y
    
        // Change negativ value to Positiv ex.: -170 to 190 (180+10)
        if (current_y < 0) {
          current_y = 360 + current_y
        }
        
        //console.log(Math.round(current_y), "=", yValue)
        if(Math.round(current_y) > yValue){ 
          light_mtx.rotateY(-LIGHTMOVEMENTSPEED)
        }
        else if(Math.round(current_y) < yValue){ 
          light_mtx.rotateY(LIGHTMOVEMENTSPEED)
          
        }
    
        if(Math.round(current_x) > xValue){ 
          light_mtx.rotateX(-LIGHTMOVEMENTSPEED)
        }
        else if(Math.round(current_x) < xValue){ 
          light_mtx.rotateX(LIGHTMOVEMENTSPEED)
          
        }   
    
      }
    
      export function createMap(): [][]  {
        let tile_rows: ƒ.Node = graph.getChildrenByName("Map")[0].getChildrenByName("Tiles_map_12x12")[0];
        let tile_rows_amount: number = tile_rows.getChildren().length;
        
    
        let map = new Array(tile_rows_amount);
        for (let row of tile_rows.getChildren()) {
    
          // get y_value of tile
          let y_value: number = row.mtxLocal.translation.y;
    
          // add an array to each 1d element, hence creating 2d array 
          let tile_cols_amount: number = row.getChildren().length;
          map[y_value] = (new Array(tile_cols_amount));
          
          for (let col of row.getChildren()) {
            let x_value: number = col.mtxLocal.translation.x;
            
            if (col.getChildren()[0]){
    
              map[y_value][x_value] = col.getChildren()[0];
            } else {
              map[y_value][x_value] = "None";
            }
            
          }
          
        }
        return map;
      }
    
      export function checkCollision(_obj_to_check: ƒ.Node): boolean {
        
        let pos: ƒ.Vector3 = _obj_to_check.mtxLocal.translation;
        //viewport.camera.mtxPivot.translation = new ƒ.Vector3( pos.x * -1, pos.y,-4);
    
        let posYabs: number= Math.round(pos.y);
        let posXabs: number= Math.round(pos.x);
        
        if (MAP_TILES) {
          if (MAP_TILES[posYabs][posXabs].name != "None"){
            if (obj_to_move.indexOf(MAP_TILES[posYabs][posXabs].name) > -1){
              //console.log(obj_to_move.indexOf(map[posYabs+1][posXabs].name))
              //For Visuals, so the character is not able to "visually" go into a wall in y-axis
              if (pos.y%1 <= 0.5 && !(obj_to_move.indexOf(MAP_TILES[posYabs+1][posXabs].name) > -1)){
                //_obj_to_check.mtxLocal.translation = _pos_before
                return true
              } else {
                //_pos_before = pos
                return false
              }
            } else {
              //_obj_to_check.mtxLocal.translation = _pos_before
              return true
            }
          }
        }
      }

      function getFloorlist(map: any): any[] {
        let floor_list = [];
        for (let y = 0; y<map.length; y++) {
          for (let x = 0; x<map[y].length; x++) {
            if (map[y][x].name != undefined){
              if (obj_to_move.indexOf(map[y][x].name) > -1){
                // Check if no player is around
                if (!check_if_player_around(x,y)) {
                  floor_list.push(map[y][x]);
                }
              }
            }
          }
        }
        return floor_list;
      }

      export function resetExitGate(): void { 
    
        // Get Exit_gate-Node
        console.log("EXIT 2: ", parent_of_exitgate)
        
        let exit_gate: ƒ.Node = parent_of_exitgate.getChildrenByName("Exit_Gate_tile")[0];
        console.log("EXIT script: ", exit_gate)
        // Move ExitGate-Object to Map, to save it for later
        graph.getChildrenByName("Map")[0].addChild(exit_gate);
        // Get saved floor_tile-object from map 
        let floor_tile: ƒ.Node = graph.getChildrenByName("Map")[0].getChildrenByName("Floor_tile")[0];
        parent_of_exitgate.addChild(floor_tile);
        
        
      }
    
      export function setExitGate(): void {
         
    
        // Get Random Floor_tile_obj and replace it with exit_gate_tile_obj
        let floor_obj: ƒ.GraphInstance = getRandomFloortile()
        let parent_col: ƒ.Node = floor_obj.getParent(); // X
        let parent_row: ƒ.Node = parent_col.getParent(); //Y
        
        let new_vec_pos: ƒ.Vector3 = new ƒ.Vector3(parent_col.mtxLocal.translation.x, parent_row.mtxLocal.translation.y, 0.7);
        exit_gate.mtxLocal.translation = new_vec_pos;
        
      }

      export function getRandomFloortile(): ƒ.GraphInstance {
        let floor_list = getFloorlist(MAP_TILES);
        // Get random Number
        let rnd_number:number = Math.floor(Math.random() * (floor_list.length - 0 + 1)) + 0;
        return floor_list[rnd_number];
      }

    
      export function check_if_player_around(x:number, y:number): boolean {
        if (avatar.mtxLocal.translation.x-PLAYERPROTECTIONAURA <= x && x <= avatar.mtxLocal.translation.x+PLAYERPROTECTIONAURA) {
          if (avatar.mtxLocal.translation.y-PLAYERPROTECTIONAURA <= y && y <= avatar.mtxLocal.translation.y+PLAYERPROTECTIONAURA) {
            return true;
          }
        }
        return false;
      }

      export function createEnemy(): void {
        let enemyAmount: number = Math.round( ENEMYSPAWNRATE * Math.round(LEVEL * INCREASINGLEVELDIFFICULTY) )
        //console.log("EnemyAmount: ",enemySpawnRate, level , increasingLevelDifficulty)

        // Get grpah_enemy_parent
        let enemy_graph = graph.getChildrenByName("Enemys")[0];
        if (enemyAmount > 0)  {
          // set enemyamount to max
          if (enemyAmount > MAXENEMYAMOUNT) {
            enemyAmount = MAXENEMYAMOUNT;
          }
          for (let i = 0; i < enemyAmount; i++) {
            let rndFloor: ƒ.GraphInstance = getRandomFloortile()

            let parent_col: ƒ.Node = rndFloor.getParent(); // X
            let parent_row: ƒ.Node = parent_col.getParent(); //Y
            let new_vec_pos: ƒ.Vector3 = new ƒ.Vector3(parent_col.mtxLocal.translation.x, parent_row.mtxLocal.translation.y, 0.5)

            let enemydmg: number = Math.round(ENEMYDAMAGE * Math.round(LEVEL * INCREASINGLEVELDIFFICULTY))
            let enemywalkspeed: number = ENEMYSPEEDWALK * Math.round(LEVEL * INCREASINGLEVELDIFFICULTY)
            let enemysprintspeed: number = ENEMYSPEEDSPRINT * Math.round(LEVEL * INCREASINGLEVELDIFFICULTY)
            let en: Enemy = new Enemy(`enemy_${i}`, new_vec_pos, enemydmg, enemywalkspeed, enemysprintspeed);
            en.initializeAnimations(imgSpriteSheetEnemy);
            ENEMYLIST.push(en);
            enemy_graph.addChild(en);
          }
        }
      }

      export function createItems(): void {
        
        // Get graph battery
        let items_graph = graph.getChildrenByName("Items")[0];
        //let battery_graph = items_graph.getChildrenByName("Batterys")[0];
        console.log(items_graph)
        if (BATTERYAMOUNT > 0)  {
          
          
          for (let i = 0; i < BATTERYAMOUNT; i++) {
            let rndFloor: ƒ.GraphInstance = getRandomFloortile()

            let parent_col: ƒ.Node = rndFloor.getParent(); // X
            let parent_row: ƒ.Node = parent_col.getParent(); //Y
            let new_vec_pos: ƒ.Vector3 = new ƒ.Vector3(parent_col.mtxLocal.translation.x, parent_row.mtxLocal.translation.y, 0.5)

            let bat: BatteryItem = new BatteryItem(`Battery_${i}`, new_vec_pos);
            bat.initializeAnimations(imgSpriteSheetBattery);
            BATTERYLIST.push(bat);
            items_graph.addChild(bat);
          }
        }
      }

      export function searchNewTargetToMove(entityLocation: ƒ.Vector3, _moveDirectionBefore: string): [ƒ.Vector3, string] {
        let possibleWays: string[] = getAllMoveOptions(entityLocation);
        let choosenDirection: string = chooseDirectionToMove(possibleWays, _moveDirectionBefore);
        
        if (choosenDirection == "Left") {
          return [new ƒ.Vector3(entityLocation.x-1, entityLocation.y, entityLocation.z) , choosenDirection]
        } else if (choosenDirection == "Right") {
          return [new ƒ.Vector3(entityLocation.x+1, entityLocation.y, entityLocation.z) , choosenDirection]
        } else if (choosenDirection == "Down") {
          return [new ƒ.Vector3(entityLocation.x, entityLocation.y-1, entityLocation.z) , choosenDirection]
        } else if (choosenDirection == "Up") {
          return [new ƒ.Vector3(entityLocation.x, entityLocation.y+1, entityLocation.z) , choosenDirection]
        } else {
          return [null, "Stuck"]
        }
      } 

      export function chooseDirectionToMove(possibleWays: string[], _moveDirectionBefore: string): string {
        // Check if list is empty
        if (possibleWays){
            // Remove option to go back
            if (possibleWays.length > 1){
                // Remove complementary Direction to removee the option of moving back
                possibleWays = possibleWays.filter(e => e !== String(COMPLEMENTARY_DIRECTIONS[_moveDirectionBefore])); 
                
                let choosenString: string = possibleWays[Math.floor(Math.random() * possibleWays.length)];
                
                return choosenString
            } else {
                return possibleWays[0]
            }
        } else {
            return "Stuck";
        }
        
    }

      export function getAllMoveOptions(entityLocation: ƒ.Vector3): string[] {
        let posYabs: number= Math.round(entityLocation.y);
        let posXabs: number= Math.round(entityLocation.x);

        let possibleWays: string[] = [];
        
        //if (String(MAP_TILES[posYabs][posXabs]) === "None"){
        //}else {
          if (obj_to_move.indexOf(MAP_TILES[posYabs+1][posXabs].name) > -1) {
            possibleWays.push("Up");
          }
          if (obj_to_move.indexOf(MAP_TILES[posYabs-1][posXabs].name) > -1) {
            possibleWays.push("Down");
          }
          if (obj_to_move.indexOf(MAP_TILES[posYabs][posXabs-1].name) > -1) {
            possibleWays.push("Left");
          }
          if (obj_to_move.indexOf(MAP_TILES[posYabs][posXabs+1].name) > -1) {
            possibleWays.push("Right");
          }
        //}
         
        return possibleWays;
      }

    
      export function placePlayer(): ƒ.Vector3 {
        // Check position if enemy or exit_gate is around
        let rndFloor: ƒ.GraphInstance = getRandomFloortile()
        let parent_col: ƒ.Node = rndFloor.getParent(); // X
        let parent_row: ƒ.Node = parent_col.getParent(); //Y
        let new_vec_pos: ƒ.Vector3 = new ƒ.Vector3(parent_col.mtxLocal.translation.x, parent_row.mtxLocal.translation.y, 0.5)

        
        avatar.mtxLocal.translation = new_vec_pos
        pos_before = new_vec_pos
        return new_vec_pos;
      }
}