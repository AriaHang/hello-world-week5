let game;
const CW=1000,CH=570;
function setup(){const c=createCanvas(CW,CH);c.parent('game');pixelDensity(Math.min(2,window.devicePixelRatio||1));game=new Game();textFont('Arial');}
function draw(){const dt=Math.min(deltaTime/1000,.05);game.update(dt,keyIsDown(65)||keyIsDown(LEFT_ARROW),keyIsDown(68)||keyIsDown(RIGHT_ARROW),keyIsDown(SHIFT));background('#28324e');game.cam=lerp(game.cam,constrain(game.player.x-CW*.37,0,WORLD-CW),.085);push();translate(-game.cam,0);drawWorld();drawItems();drawCat();drawPlayer();pop();drawHUD();if(game.event==='caught'&&game.eventTime>0)drawJumpscare();}
function drawWorld(){noStroke();const zones=[{a:0,b:570,col:'#36405c'},{a:570,b:1040,col:'#323b54'},{a:1040,b:1750,col:'#44435a'},{a:1750,b:2300,col:'#374959'}];for(const z of zones){fill(z.col);rect(z.a,0,z.b-z.a,FLOOR);fill(250,219,166,18);rect(z.a,0,z.b-z.a,14);}fill('#64586a');rect(0,FLOOR,WORLD,CH-FLOOR);fill('#8a7180');rect(0,FLOOR-8,WORLD,8);stroke(245,220,184,22);strokeWeight(1);for(let x=0;x<WORLD;x+=66)line(x,FLOOR+8,x+30,CH);noStroke();
// windows and moon
for(let x of [260,1080,1900]){fill('#1b2742');rect(x,90,158,142,8);fill('#f7d9a1');circle(x+112,134,31);fill('#a6bad0');rect(x+76,90,6,142);rect(x,155,158,6);fill('#c29fa8');rect(x-11,84,22,154,6);rect(x+147,84,22,154,6);}
// bedroom bed
fill('#66556a');rect(55,335,350,105,18);fill('#dca7a4');rect(68,322,326,76,14);fill('#f1d7c0');rect(83,325,92,35,14);fill('#a7adc9');rect(182,352,202,45,8);fill('#c79c8d');rect(75,427,22,25);rect(370,427,22,25);
// lamp and bedside table
fill('#876b78');rect(435,379,70,59,7);fill('#d8b79e');rect(458,322,8,58);fill('#f7d59d');quad(439,326,487,326,479,296,447,296);fill(255,217,144,35);ellipse(464,320,120,90);
// bookshelf and cover
fill('#7d6071');rect(625,205,190,235,8);fill('#a78791');for(let y of [275,348,417])rect(639,y,164,9);for(let i=0;i<13;i++){fill(['#b4bdc5','#d9ac9e','#b9a58d','#7c9b9c'][i%4]);rect(649+(i%7)*21,225+Math.floor(i/7)*75,14,45+(i%3)*5,2);}
// corridor frames
for(let x of [890,985]){fill('#6b6178');rect(x,205,70,88,5);fill('#e0ba91');rect(x+7,212,56,74,4);fill('#8d9ba9');ellipse(x+35,251,36,45);}
// rug
fill('#8c7180');ellipse(1300,449,470,60);fill('#b99a91');ellipse(1300,448,410,40);
// couch cover
fill('#6f8993');rect(1520,345,230,95,18);fill('#92a9af');rect(1535,324,200,75,16);fill('#d8b8a9');rect(1575,350,50,40,8);fill('#667b89');rect(1510,413,20,36);rect(1740,413,20,36);
// kitchen cabinets and counter
fill('#9a8790');rect(1805,355,405,86,9);fill('#d6b7a0');rect(1805,347,405,16,6);for(let x=1830;x<2170;x+=85){fill('#b9a1a5');rect(x,373,70,55,4);fill('#8b6e79');rect(x+31,390,9,3);}
// fridge
fill('#b8cad3');rect(FRIDGE-48,175,112,173,11);fill('#dbe5e9');rect(FRIDGE-39,183,94,156,8);stroke('#a5b8c6');strokeWeight(3);line(FRIDGE-39,253,FRIDGE+55,253);stroke('#f5e7d9');strokeWeight(7);line(FRIDGE+38,202,FRIDGE+38,236);noStroke();if(game.fridgeOpen){fill(255,237,172,65);quad(FRIDGE-36,185,FRIDGE+50,185,FRIDGE+190,430,FRIDGE-130,430);}
// plants
for(let x of [540,1800,2220]){fill('#b48b7c');quad(x-19,413,x+19,413,x+14,443,x-14,443);stroke('#7fae8b');strokeWeight(5);for(let j=-2;j<=2;j++){line(x,414,x+j*11,365+abs(j)*7);noStroke();fill('#82ad8b');ellipse(x+j*11,365+abs(j)*7,24,12);stroke('#7fae8b');}noStroke();}
// creaky boards
for(const c of CREAKS){fill('#a77970');rect(c.x,FLOOR-8,c.w,8);stroke('#d4a899');strokeWeight(2);line(c.x+10,FLOOR-4,c.x+c.w-10,FLOOR-4);noStroke();}
// signs
fill('#f2d9b9');textSize(16);textAlign(CENTER);for(const z of [{x:250,t:'BEDROOM'},{x:900,t:'HALLWAY'},{x:1380,t:'LIVING ROOM'},{x:2020,t:'KITCHEN'}])text(z.t,z.x,58);
}
function drawItems(){const p=game.player;if(!game.treatCollected){fill('#efc57e');rect(401,400,37,25,6);fill('#9c6b67');textSize(17);textAlign(CENTER);text('♥',419,420);if(abs(p.x-420)<75)promptAt(420,382,'E · Pick up treat');}for(const h of HIDES){if(abs(p.x-h.x-h.w/2)<h.w/2+40)promptAt(h.x+h.w/2,305,p.hidden?'E · Come out':'E · Hide');}if(abs(p.x-FRIDGE)<100)promptAt(FRIDGE,155,game.hasSnack?'E · Close fridge':'E · Open fridge');if(game.cat.happy>0){fill('#f5aab1');textSize(26);textAlign(CENTER);text('♥',game.cat.x,game.cat.mode==='investigate'?310:325);}}
function promptAt(x,y,msg){push();textAlign(CENTER);textSize(14);const w=textWidth(msg)+24;fill(26,33,55,218);rect(x-w/2,y-19,w,27,9);fill('#fff1d7');text(msg,x,y);pop();}
function catPortrait(c, mood){
 push();noStroke();
 // One consistent head design across all states: rounded cheeks, stripes, whiskers and highlights.
 fill('#d38f5f');triangle(-58,-26,-49,-105,-11,-59);triangle(11,-59,49,-105,58,-26);
 fill('#f1a7a6');triangle(-47,-47,-45,-88,-24,-61);triangle(24,-61,45,-88,47,-47);
 fill('#d99464');ellipse(0,-15,150,124);fill('#e9ab76');ellipse(0,-17,146,117);fill('#f8c99b');ellipse(0,-7,132,101);fill('#ffe0b8');ellipse(-43,6,46,43);ellipse(43,6,46,43);
 fill('#f8d5ae');ellipse(-32,12,58,45);ellipse(32,12,58,45);
 stroke('#c58355');strokeWeight(3);noFill();arc(-19,-52,16,13,0,PI);arc(0,-57,15,14,0,PI);arc(19,-52,16,13,0,PI);line(0,-63,0,-48);noStroke();
 if(mood==='sleep'||mood==='yawn'){stroke('#775044');strokeWeight(4);noFill();arc(-31,-17,27,18,0,PI);arc(31,-17,27,18,0,PI);noStroke();}
 else {fill('#fff5e7');ellipse(-32,-19,32,37);ellipse(32,-19,32,37);fill('#69504b');ellipse(-32+(mood==='watch'?5:0),-17,19,27);ellipse(32+(mood==='watch'?5:0),-17,19,27);fill('#a97862');ellipse(-30+(mood==='watch'?5:0),-16,10,16);ellipse(34+(mood==='watch'?5:0),-16,10,16);fill('white');circle(-39,-27,8);circle(25,-27,8);circle(-27,-10,3);circle(37,-10,3);}
 fill(237,143,151,135);ellipse(-51,6,26,17);ellipse(51,6,26,17);fill(255,246,227,90);ellipse(-55,3,10,5);ellipse(47,3,10,5);fill('#b97479');triangle(-8,10,8,10,0,19);
 stroke('#8b5d52');strokeWeight(2);noFill();if(mood==='yawn'){fill('#875759');noStroke();ellipse(0,31,17,24);fill('#f4b1a5');ellipse(0,39,10,7);}else{arc(-8,22,16,12,0,PI);arc(8,22,16,12,0,PI);}stroke('#fce5ca');strokeWeight(1.8);line(-37,19,-85,8);line(-37,27,-84,33);line(37,19,85,8);line(37,27,84,33);stroke('#d58b5f');strokeWeight(1.7);line(-58,-37,-71,-49);line(58,-37,71,-49);pop();
}
function drawCat(){const c=game.cat;push();translate(c.x,FLOOR-14);const standing=['watch','stir','patrol','investigate'].includes(c.mode);const breathe=sin(frameCount*.045)*2;noStroke();fill(15,18,30,55);ellipse(0,8,165,19);stroke('#d49463');strokeWeight(13);strokeCap(ROUND);noFill();bezier(52,-28,110,-18,100,-96,59,-84);noStroke();
 if(standing){fill('#d58c5d');ellipse(0,-49,117,120);fill('#e9a875');ellipse(0,-53,110,117);fill('#f8d2a5');ellipse(0,-40,76,82);fill('#e7a270');ellipse(-39,-8,33,48);ellipse(39,-8,33,48);fill('#f8d0a5');ellipse(-39,8,24,14);ellipse(39,8,24,14);translate(0,-108);}else{fill('#d58c5d');ellipse(0,-26,159,79);fill('#e9a875');ellipse(0,-29,152,75);fill('#f8d2a5');ellipse(0,-19,104,47);fill('#e7aa77');ellipse(-48,0,37,20);ellipse(48,0,37,20);fill('#f7cda3');ellipse(-48,3,29,12);ellipse(48,3,29,12);translate(0,-68+breathe);}
 // Cat face stays the same shape whether lying, standing or yawning.
 catPortrait(c,c.mode);pop();push();fill('#ffebcf');textAlign(CENTER);textSize(18);if(c.mode==='sleep')text('Z z z',c.x+83,FLOOR-141);if(c.mode==='yawn')text('yaaawn...',c.x,FLOOR-175);if(c.mode==='stir')text('?',c.x+82,FLOOR-165);if(c.mode==='watch')text('...?',c.x+83,FLOOR-165);if(c.mode==='patrol')text('step... step...',c.x,FLOOR-176);if(c.happy>0){fill('#f3a3ae');text('♥',c.x+72,FLOOR-185);}pop();}
function drawPlayer() {
  const p = game.player;
  push();
  translate(p.x, FLOOR - 10);
  const stride = p.walking ? sin(p.step) * 8 : 0;
  const bob = p.walking ? abs(sin(p.step)) * 2 : sin(frameCount * .03) * .6;
  translate(0, bob + (p.sneaking ? 6 : 0));
  noStroke();

  // Soft ground shadow.
  fill(20, 20, 35, 50);
  ellipse(0, 8, 52, 12);

  // Legs and slippers.
  stroke(120, 140, 165); strokeWeight(13); strokeCap(ROUND);
  line(-10, -28, -10 + stride, 0);
  line(10, -28, 10 - stride, 0);
  noStroke();
  fill(245, 236, 228);
  ellipse(-10 + stride, 3, 24, 12);
  ellipse(10 - stride, 3, 24, 12);

  // Blue pajamas.
  fill(148, 180, 210); rect(-23, -92, 46, 66, 12);
  fill(245, 242, 236); rect(-3, -88, 6, 48, 3);
  triangle(-15, -88, 0, -76, -2, -88);
  triangle(15, -88, 0, -76, 2, -88);
  fill(110, 130, 155); circle(0, -67, 3); circle(0, -54, 3);
  stroke(148, 180, 210); strokeWeight(12);
  line(-22, -75, -28 - stride * .25, -45);
  line(22, -75, 28 + stride * .25, -45);
  stroke(236, 190, 168); strokeWeight(10);
  point(-28 - stride * .25, -45);
  point(28 + stride * .25, -45);
  noStroke();

  // Neck, single-color centered bob hair, and face.
  fill(236, 190, 168); rect(-8, -108, 16, 18, 5);
  fill(120, 82, 72); rect(-28, -165, 56, 55, 18);
  fill(244, 203, 180); ellipse(0, -130, 50, 58);
  fill(120, 82, 72);
  arc(0, -142, 56, 34, PI, TWO_PI, CHORD);
  rect(-28, -145, 10, 32, 8);
  rect(18, -145, 10, 32, 8);

  // Hair clip, eyes, cheeks and smile.
  fill(242, 210, 120); rect(14, -148, 13, 5, 3);
  fill(70, 58, 58);
  ellipse(-9, -129, 4, 6); ellipse(9, -129, 4, 6);
  fill(235, 160, 165, 150);
  ellipse(-17, -116, 12, 7); ellipse(17, -116, 12, 7);
  noFill(); stroke(170, 110, 110); strokeWeight(1.5);
  arc(0, -117, 10, 6, 0, PI);
  noStroke();

  if (p.hidden) {
    fill(170, 200, 215, 35);
    ellipse(0, -82, 78, 120);
  }
  pop();
}
function drawHUD(){push();noStroke();fill(23,29,47,215);rect(16,14,285,95,12);fill('#f9e4c7');textAlign(LEFT);textStyle(BOLD);textSize(18);text('NIGHT '+game.night+' / 3',31,40);textStyle(NORMAL);textSize(13);text('Mission: '+(game.hasSnack?'Return safely to BED':'Reach the fridge'),31,63);text('Treat: '+(game.treats?'READY (T)':'none')+'  ·  '+(game.player.hidden?'HIDDEN':'exposed'),31,85);fill(23,29,47,215);rect(CW-270,14,254,74,12);fill('#f9e4c7');textSize(13);text('MOCHI · '+game.cat.mode.toUpperCase(),CW-255,35);fill('#59627a');rect(CW-255,46,222,12,6);fill(game.cat.detect>60?'#e89489':'#e6bd8e');rect(CW-255,46,222*game.cat.detect/100,12,6);fill('#ead9c9');textSize(10);text('Detection · '+(game.cat.detect>65?'DANGER':game.cat.detect>25?'CAUTION':'calm'),CW-255,74);fill(21,26,43,220);rect(18,CH-64,CW-36,48,12);fill('#fbe8c9');textSize(15);textAlign(CENTER);text(game.message,CW/2,CH-34);// Always-on Mochi Cam: shows the same face and state even when offscreen.
 fill(20,27,46,242);rect(CW-237,95,221,184,13);fill('#fbe4c9');textSize(12);textStyle(BOLD);text('MOCHI CAM  ·  LIVE',CW-224,116);textStyle(NORMAL);
 push();translate(CW-126,215);scale(.65);catPortrait(game.cat,game.cat.mode);pop();
 fill('#f5d6b8');textAlign(CENTER);textSize(12);text(game.cat.mode.toUpperCase(),CW-126,263);if(game.cat.mode==='sleep'){fill('#bde6c6');textSize(10);text('SAFE MOMENT',CW-126,276);}textAlign(LEFT);
 if(game.finished){fill(17,23,42,225);rect(220,130,560,178,20);fill(game.caught?'#f3acaa':'#c9e8c2');textSize(30);textStyle(BOLD);text(game.caught?'MOCHI CAUGHT YOU!':'MIDNIGHT MISSION COMPLETE!',CW/2,187);textStyle(NORMAL);fill('#f8e8d6');textSize(17);text(game.caught?'Press R to retry from Night 1':game.night<3?'Press N for next night · R to restart':'All three nights complete! Press R to replay',CW/2,241);}pop();}
function drawJumpscare(){const t=game.eventTime;push();noStroke();fill(16,20,38,210);rect(0,0,CW,CH);translate(CW/2,CH/2+25);const sc=1.4+(.5*(2.5-t)/2.5);scale(sc);fill('#e8aa76');ellipse(0,0,330,290);triangle(-138,-75,-116,-225,-35,-137);triangle(35,-137,116,-225,138,-75);fill('#e99fa4');triangle(-114,-98,-105,-192,-65,-139);triangle(65,-139,105,-192,114,-98);fill('#fff1e4');ellipse(-76,-18,75,100);ellipse(76,-18,75,100);fill('#66504a');ellipse(-76,-14,46,74);ellipse(76,-14,46,74);fill('white');circle(-90,-38,20);circle(62,-38,20);fill('#e8a3a3');ellipse(-125,52,54,29);ellipse(125,52,54,29);fill('#b76e78');triangle(-13,42,13,42,0,57);fill('#714a4a');ellipse(0,92,35,20);pop();}
function keyPressed(){SFX.unlock();if(key==='m'||key==='M'){const muted=SFX.toggle();game.say(muted?'Sound muted (M)':'Sound on (M)',1.8);return false;}if(key==='e'||key==='E')game.interact();if(key==='t'||key==='T')game.tossTreat();if(key==='r'||key==='R')game.reset();if(key==='n'||key==='N')game.nextNight();if([LEFT_ARROW,RIGHT_ARROW,UP_ARROW,DOWN_ARROW,32].includes(keyCode))return false;}
