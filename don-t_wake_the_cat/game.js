const WORLD=2300;
const FLOOR=435;
const FRIDGE=2070;
const BED=175;
const HIDES=[{x:660,w:120,label:'behind bookshelf'},{x:1580,w:135,label:'behind couch'}];
const CREAKS=[{x:820,w:120},{x:1730,w:130}];
class Game {
  constructor(){this.memory={fridge:0,noise:0,treat:0};this.night=1;this.startNight();}
  startNight(){
    this.cat=new Cat(this.night,this.memory);
    this.player={x:170,hidden:false,sneaking:false,walking:false,step:0};
    this.treats=0;this.treatCollected=false;this.treatUsed=false;
    this.fridgeOpen=false;this.hasSnack=false;this.finished=false;this.caught=false;
    this.message='Find a cat treat, or sneak past Mochi. Reach the fridge!';
    this.messageTime=6;this.noiseClock=0;this.creakCooldown=0;
    this.event='';this.eventTime=0;this.cam=0;
  }
  say(msg,t=3.2){this.message=msg;this.messageTime=t;}
  interact(){
    if(this.finished)return;
    const p=this.player;
    const hiding=HIDES.find(h=>Math.abs(p.x-(h.x+h.w/2))<h.w/2+45);
    if(p.hidden){p.hidden=false;this.cat.detect=Math.min(this.cat.detect,12);this.say('You step out quietly. Watch Mochi’s face.');return;}
    if(hiding){p.hidden=true;this.say('Hidden '+hiding.label+'. Wait for Mochi to look away.');return;}
    if(!this.treatCollected && Math.abs(p.x-420)<65){this.treatCollected=true;this.treats=1;this.say('Cat treat collected! Press T to toss it near Mochi.');return;}
    if(Math.abs(p.x-FRIDGE)<95){
      if(!this.hasSnack){this.hasSnack=true;this.fridgeOpen=true;SFX.fridge();this.cat.noise(25,FRIDGE);this.memory.fridge++;this.say('CLINK! Snack acquired. Now return to your BEDROOM!',5);this.event='fridge';this.eventTime=1.5;}
      else {this.fridgeOpen=false;SFX.fridge();this.say('Fridge closed. Head back to bed.');}
      return;
    }
    if(hiding){p.hidden=true;this.say('Hidden '+hiding.label+'.');return;}
    this.say('Move closer to an object. Look for the E prompt.');
  }
  tossTreat(){
    if(this.finished)return;
    if(!this.treats){this.say('No cat treats left!');return;}
    this.treats--;this.treatUsed=true;this.memory.treat++;
    const x=Math.max(900,Math.min(1880,this.player.x+this.cat.facing*150));
    this.cat.offerTreat(x);this.say('Mochi follows the treat! This is your chance.');this.event='heart';this.eventTime=1.4;
  }
  update(dt,left,right,sneak){
    if(this.finished)return;
    const p=this.player;
    p.sneaking=sneak;p.walking=!!(left||right)&&!p.hidden;
    this.messageTime=Math.max(0,this.messageTime-dt);this.eventTime=Math.max(0,this.eventTime-dt);
    this.creakCooldown=Math.max(0,this.creakCooldown-dt);
    let direction=(right?1:0)-(left?1:0);
    if(p.hidden)direction=0;
    if(direction){
      const speed=sneak?86:190;
      p.x=Math.max(60,Math.min(WORLD-65,p.x+direction*speed*dt));
      p.step+=dt*(sneak?4:10);
      this.noiseClock+=dt;
      if(this.noiseClock>(sneak?.68:.28)){
        SFX.step(sneak);this.cat.noise(sneak?1.2:7,p.x);
        this.noiseClock=0;
      }
      const creak=CREAKS.find(c=>p.x>=c.x&&p.x<=c.x+c.w);
      if(creak&&this.creakCooldown<=0){
        this.cat.noise(sneak?9:24,p.x);
        this.creakCooldown=2.2;this.memory.noise++;
        this.say('CREEEAK! Even sneaking makes this floor noisy!',2.5);
        this.event='creak';this.eventTime=.8;
      }
    }
    if(this.fridgeOpen){this.cat.noise(dt*3,FRIDGE);}
    if(this.cat.update(dt,p)){
      this.caught=true;this.finished=true;SFX.meow();this.event='caught';this.eventTime=2.5;
      this.say('CAUGHT! Mochi spotted you. Press R to try again.',99);
    }
    if(this.hasSnack && p.x<BED+70){
      this.finished=true;this.caught=false;SFX.win();
      this.say('MISSION COMPLETE! You made it back to bed. Press N for next night.',99);
    }
  }
  nextNight(){
    if(!this.finished||this.caught)return;
    if(this.night<3){this.night++;this.startNight();this.say(['','', 'Night 2: Mochi remembers the fridge. Watch its patrols!','Night 3: Mochi is clever. Be patient and use cover!'][this.night],7);}
    else this.say('You survived all three nights! Press R to replay.',99);
  }
  reset(){this.memory={fridge:0,noise:0,treat:0};this.night=1;this.startNight();}
}
