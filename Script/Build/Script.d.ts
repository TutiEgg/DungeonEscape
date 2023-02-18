declare namespace Dungeon {
    import ƒ = FudgeCore;
    import ƒAid = FudgeAid;
    let mtx: ƒ.Matrix4x4;
    enum ACTION {
        IDLE = 0,
        WALK_LEFT = 1,
        WALK_RIGHT = 2,
        WALK_UP = 3,
        WALK_DOWN = 4,
        SPRINT_DOWN = 5,
        SPRINT_UP = 6,
        SPRINT_LEFT = 7,
        SPRINT_RIGHT = 8
    }
    class Avatar extends ƒAid.NodeSprite {
        speedWalk: number;
        speedSprint: number;
        ySpeed: number;
        xSpeed: number;
        private animationCurrent;
        private animWalkRight;
        private animWalkLeft;
        private animWalkUp;
        private animWalkDown;
        private animSprintRight;
        private animSprintLeft;
        private animSprintUp;
        private animSprintDown;
        private animIdleRight;
        private animIdleLeft;
        private animIdleUp;
        private animIdleDown;
        rigid_character: ƒ.ComponentRigidbody;
        constructor();
        update(_deltaTime: number): void;
        act(_action: ACTION): void;
        initializeAnimations(_imgSpriteSheet: ƒ.TextureImage): Promise<void>;
    }
}
declare namespace Dungeon {
    import ƒ = FudgeCore;
    class CharacterScript extends ƒ.ComponentScript {
        static readonly iSubclass: number;
        message: string;
        rigid_character: ƒ.ComponentRigidbody;
        mt_rigid: ƒ.Matrix4x4;
        gameState: GameState;
        mtx_light: ƒ.Matrix4x4;
        light: ƒ.ComponentLight;
        private minLightPercentage;
        private maxLightPercentage;
        private lightStepValue;
        lightPercentage: number;
        private lightUpdateFrequency;
        private timeOfLastUpdate;
        private lightDecreaseValue;
        maxHealthAmount: number;
        playerhealthAmount: number;
        private timeOfLastDamageTaken;
        private playerProtectionTime;
        private gettingDamageSound;
        private enemyAttackSound;
        constructor();
        hndEvent: (_event: Event) => void;
        update: (_event: Event) => void;
        reduceBattery(): void;
        dateBetween(date1: Date, date2: Date): number;
    }
}
declare namespace Dungeon {
    import ƒ = FudgeCore;
    import ƒAid = FudgeAid;
    enum EnemyState {
        IDLE = 0,
        PATROL = 1,
        ATTACK = 2
    }
    class Enemy extends ƒAid.NodeSprite {
        private rigid_enemy;
        private cmpStateMachine;
        private moveTarget;
        private moveDirection;
        private enemyPosBefore;
        private yOffset;
        private attackdamage;
        private sprintSpeed;
        private walkSpeed;
        private animationCurrent;
        private animWalkRight;
        private animWalkLeft;
        private animWalkUp;
        private animWalkDown;
        private animAttackRight;
        private animAttackLeft;
        private animAttackUp;
        private animAttackDown;
        private enemyAttackSound;
        constructor(_name: string, _startposition: ƒ.Vector3, _damage: number, _walkspeed: number, _sprintspeed: number);
        update(deltaTime: number): void;
        checkCollisionsenemy(): boolean;
        move(deltaTime: number): void;
        attack(): void;
        initializeAnimations(_imgSpriteSheet: ƒ.TextureImage): Promise<void>;
    }
}
declare namespace Dungeon {
    import ƒAid = FudgeAid;
    class EnemyStateMachine extends ƒAid.ComponentStateMachine<EnemyState> {
        static readonly iSubclass: number;
        private static instructions;
        constructor();
        private static setupStateMachine;
        private static transitDefault;
        private static actDefault;
        private static actIdle;
        private static actPatrol;
        private static actAttack;
    }
}
declare namespace Dungeon {
    import ƒ = FudgeCore;
    class ExitGateScript extends ƒ.ComponentScript {
        static readonly iSubclass: number;
        message: string;
        rigid_exit: ƒ.ComponentRigidbody;
        constructor();
        hndEvent: (_event: Event) => void;
        update: (_event: Event) => void;
    }
}
declare namespace Dungeon {
    import ƒ = FudgeCore;
    function animateLightRotation(): void;
    function createMap(): [][];
    function checkCollision(_obj_to_check: ƒ.Node): boolean;
    function resetExitGate(): void;
    function setExitGate(): void;
    function getRandomFloortile(): ƒ.GraphInstance;
    function check_if_player_around(x: number, y: number): boolean;
    function createEnemy(): void;
    function searchNewTargetToMove(entityLocation: ƒ.Vector3, _moveDirectionBefore: string): [ƒ.Vector3, string];
    function chooseDirectionToMove(possibleWays: string[], _moveDirectionBefore: string): string;
    function getAllMoveOptions(entityLocation: ƒ.Vector3): string[];
    function placePlayer(): ƒ.Vector3;
}
declare namespace Dungeon {
    import ƒ = FudgeCore;
    let viewport: ƒ.Viewport;
    let graph: ƒ.Node;
    let pos_before: ƒ.Vector3;
    let MAP_TILES: ƒ.Node[][];
    let keyPressedBefore: string;
    let obj_to_move: string[];
    let COMPLEMENTARY_DIRECTIONS: {
        [id: string]: string;
    };
    let xValue: number;
    let yValue: number;
    let avatar: Avatar;
    let exit_gate: ƒ.Node;
    let parent_of_exitgate: ƒ.Node;
    let imgSpriteSheetEnemy: ƒ.TextureImage;
    let ENEMYLIST: Enemy[];
    let LEVEL: number;
    let MAYLIGHTAMOUNT: number;
    let MAXENEMYAMOUNT: number;
    let LIGHTMOVEMENTSPEED: number;
    let PLAYERPROTECTIONAURA: number;
    let PLAYERSPEEDWALK: number;
    let PLAYERSPEEDSPRINT: number;
    let ENEMYSPAWNRATE: number;
    let ENEMYSPEEDWALK: number;
    let ENEMYSPEEDSPRINT: number;
    let ENEMYDAMAGE: number;
    let DECREASINGLIGHTRATE: number;
    let INCREASINGLEVELDIFFICULTY: number;
    let deltaTime: number;
    function resetGame(won: boolean): void;
    function nextLevel(): void;
}
declare namespace Dungeon {
    import ƒ = FudgeCore;
    class GameState extends ƒ.Mutable {
        r: HTMLElement;
        constructor();
        updateBattery(value: number): void;
        getBatteryValue(): number;
        getHealthValue(): number;
        updateHealth(value: number): void;
        protected reduceMutator(_mutator: ƒ.Mutator): void;
    }
}
