class Cat {
 constructor(night,memory){this.night=night;this.memory=memory;this.home=[1140,1300,1500][night-1]+Math.min(65,memory.fridge*16);this.x=this.home;this.target=this.home;this.facing=-1;this.mode='sleep';this.timer=7.5;this.alert=0;this.detect=0;this.happy=0;this.lookCount=0;this.noticeX=null;this.noticeTime=0;this.treatTarget=null;this.safeWindow=2;this.lastSeen=0;}
 setMode(mode,duration){this.mode=mode;this.timer=duration;if(mode==='sleep'){this.safeWindow=2.5;this.alert=Math.min(this.alert,12);this.detect=Math.min(this.detect,14);}}
 noise(amount,sourceX){const hearing=Math.max(0,1-Math.abs(this.x-sourceX)/510);this.alert=Math.min(100,this.alert+amount*hearing*(1+this.night*.07));if(hearing>.2&&amount*hearing>5){this.noticeX=sourceX;this.noticeTime=3;if(this.mode==='sleep'&&this.alert>34&&this.safeWindow<=0)this.setMode('stir',1.25);}}
 offerTreat(x){this.treatTarget=x;this.target=x;this.alert=Math.max(0,this.alert-55);this.detect=0;this.setMode('investigate',6);this.happy=3;}
 update(dt,player){this.happy=Math.max(0,this.happy-dt);this.noticeTime=Math.max(0,this.noticeTime-dt);this.safeWindow=Math.max(0,this.safeWindow-dt);this.lastSeen=Math.max(0,this.lastSeen-dt);this.timer-=dt;
 const distance=Math.abs(this.x-player.x);const active=['watch','patrol','investigate'].includes(this.mode);const facingPlayer=(player.x-this.x)*this.facing>0;
 const inView=active&&!player.hidden&&distance<255&&facingPlayer;
 // Fair warning: the player has a chance to react before a catch. Sneaking affects noise, not visibility.
 if(inView){const rate=distance<100?39:distance<180?29:21;this.detect=Math.min(100,this.detect+dt*rate*(1+(this.night-1)*.12)*(player.walking?1.12:1));this.lastSeen=1.4;this.alert=Math.min(100,this.alert+dt*7);}
 else this.detect=Math.max(0,this.detect-dt*(player.hidden?35:this.mode==='sleep'?30:23));
 // Sleeping Mochi reacts to footsteps, but quiet walking during sleep is a legitimate opportunity.
 if(!player.hidden&&distance<120&&player.walking&&this.mode==='sleep'&&!player.sneaking&&this.safeWindow<=0){this.alert=Math.min(100,this.alert+dt*16);if(this.alert>45)this.setMode('stir',1.3);}
 if(this.alert>75&&this.mode==='sleep'&&this.safeWindow<=0)this.setMode('stir',1.25);
 if(this.mode==='patrol'||this.mode==='investigate'){const dx=this.target-this.x;if(Math.abs(dx)>5){this.facing=Math.sign(dx);this.x+=this.facing*Math.min(Math.abs(dx),dt*(this.mode==='investigate'?66:38));}else if(this.mode==='investigate'){this.treatTarget=null;this.happy=2;this.setMode('yawn',1.5);}}
 if(this.timer<=0){if(this.mode==='sleep')this.setMode('yawn',1.8);else if(this.mode==='yawn')this.setMode('stir',1.4);else if(this.mode==='stir'){this.facing=this.noticeTime>0?Math.sign(this.noticeX-this.x)||this.facing:(this.lookCount%2===0?1:-1);this.lookCount++;this.setMode('watch',1.65+(this.night-1)*.35);}else if(this.mode==='watch'){if(this.night>=2&&this.lookCount%3===0){this.target=this.home+(this.lookCount%2===0?-105:105);this.setMode('patrol',3.6);}else this.setMode('sleep',Math.max(5.8,8.5-(this.night-1)*.85));}else if(this.mode==='patrol'){this.target=this.home;this.setMode('sleep',6);}else if(this.mode==='investigate')this.setMode('yawn',1.5);}
 return this.detect>=100;
 }
}
