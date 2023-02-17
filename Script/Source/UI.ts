namespace Dungeon {
    import ƒ = FudgeCore;
    import ƒUi = FudgeUserInterface;
  
    export class GameState extends ƒ.Mutable {
      public r: HTMLElement;
  
      public constructor() {
        super();
        this.r = document.querySelector(':root');
      }
    
      public updateBattery(value: number){
        this.r.style.setProperty('--batteryValue',`${value}%`);
      }
      public getBatteryValue(): number{
        let return_string = this.r.style.getPropertyValue('--batteryValue');
        return_string = return_string.slice(0, -1)
        var return_number: number = +return_string;
        return return_number;
      }
      public getHealthValue(): number{
        let return_string = this.r.style.getPropertyValue('--fill');
        return_string = return_string.slice(0, -1)
        var return_number: number = +return_string;
        return return_number;
      }
      public updateHealth(value: number){
        this.r.style.setProperty('--fill',`${value}%`);
      }
      protected reduceMutator(_mutator: ƒ.Mutator): void { /* */ }


  }
}