var tileWidth = 40;
var tileHeight= 25;
var megamanDelay;
var megamanBlocked = false;
var megamanAttacking = false;
var lastKey;
var enemies;
var gameInstance;


var gameMegaman;
var sfx;

function GameObject(game, x, y, delayTime, name, hp) 
{
    this.delayTime=delayTime;
    this.blocked = false;
    this.xpos =x;
    this.ypos= y;
    this.hp = hp;
    this.passable = false;
    

    // call Phaser.Sprite constructor
    Phaser.Sprite.call(this, game, x, y, name);
    this.x=(this.xpos*tileWidth)+8;
    this.y=(this.ypos*tileHeight)+97;
    if(this.hp>5)
    {
    style = new Object;
    style.fill="white";
    style.stroke="black";
    style.font="9pt Helvetica";
    style.strokeThickness=4;
    this.text = game.add.text(x, y, this.hp, style);
    this.text.x=this.x+10;
    this.text.y=this.y+6;
	}
    this.delay=this.game.time.now+this.delayTime;
    }
GameObject.prototype = Object.create(Phaser.Sprite.prototype);
GameObject.prototype.constructor = GameObject;
GameObject.prototype.moveTo = function (x1, y1)
 {
    this.xpos=x1;
    this.ypos=y1;

    this.x=(this.xpos*tileWidth)+8;
    this.y=(this.ypos*tileHeight)+97;
    if(this.hp>5)
    {
    this.text.x=this.x+10;
    this.text.y=this.y+6;
	}
};
GameObject.prototype.setGrid = function (x1, y1)
 {
    this.xpos=x1;
    this.ypos=y1;
};
GameObject.prototype.setDelayed = function ()
 {
    this.delay=this.game.time.now+this.delayTime;
};

GameObject.prototype.damage= function (dm)
 {

    this.hp = this.hp - dm;
    if(this.hp>0)
    {
    this.text.text = this.hp;
    blast = new Blast(this.game, this.xpos, this.ypos);
    blast.scale.x= 0.5;
    blast.scale.y=0.5;
    blast.anchor.setTo(-0.1, 0.5);
    this.game.add.existing(blast);
    }
    else
    {
        sfx.defeat.play();
        enemies.remove(this);
        this.kill(false);
        this.text.kill(false);
        blast = new Blast(this.game, this.xpos, this.ypos);
        this.game.add.existing(blast);
    }
};
GameObject.prototype.setHP= function (hp)
 {

    this.hp = hp;
    this.text.text = this.hp;
    
};

function CurrentChip(game) 
{

    this.blocked = false;
    this.passable = false;
    this.chipID = 0;
    

    // call Phaser.Sprite constructor
    Phaser.Sprite.call(this, game, 0, 0, 'chips');
    this.x=192;
    this.y=0;
 
    style = new Object;
    style.fill="white";
    style.stroke="black";
    style.font="9pt Helvetica";
    style.strokeThickness=4;
    this.text = game.add.text(this.x-2, this.y+52, "Cannon", style);

    }
CurrentChip.prototype = Object.create(Phaser.Sprite.prototype);
CurrentChip.prototype.constructor = GameObject;

CurrentChip.prototype.next = function()
{
    this.chipID++;
    if(this.chipID>3)
    {
        this.chipID=0;
    }

    if(this.chipID==0)
    {
        this.text.text="Cannon"
        this.frame=0;
    }
    else if(this.chipID==1)
    {
        this.frame=3;
        this.text.text="Shockwave";
    }
    else if(this.chipID==2)
    {
        this.frame=1;
        this.text.text="Heatshot";
    }
        else if(this.chipID==3)
    {
        this.frame=4;
        this.text.text="Lifesword";
    }
}


function Megaman(game, x, y) 
{
    this.xpos =x;
    this.ypos= y;
    this.alive=true;
    this.canAttack=true;
    this.name = "Megaman";
    this.invincible=false;
    // call Phaser.Sprite constructor
    GameObject.call(this, game, x, y, 0, 'megaman', 100);
    this.text.x=42;
    this.text.y=-3;
    this.animations.add('shoot', [1, 2, 3, 4, 5, 6, 7, 0], 12, false);
    this.animations.add('shoot2', [1, 2, 3, 4, 5, 6, 7, 0], 14, false);
    this.animations.add('hurt', [8, 9, 10, 0], 9 , false);
    this.animations.add('swipe', [11, 12, 13, 0], 9 , false);
    this.animations.add('slash', [14, 15, 16, 17, 0, 0], 11 , false);



    this.events.onAnimationComplete.add(function () 
    {
    megamanAttacking=false;
    this.invincible=false;
    }, this);
    // Align sprite
    this.anchor.set(-0.05, 0.7);
    this.x=(this.xpos*tileWidth)+8;
    this.y=(this.ypos*tileHeight)+97;
    }
Megaman.prototype = Object.create(GameObject.prototype);
Megaman.prototype.constructor = Megaman;
Megaman.prototype.move = function (direction)
 {
    if(direction==1)
    {
        if(this.xpos>0)
        this.xpos-=1;
    }
    else if(direction==2)
    {
        if(this.xpos<2)
        this.xpos+=1;
    }
    else if(direction==3)
    {
        if(this.ypos>0)
        this.ypos-=1;
    }
    else if(direction==4)
    {
        if(this.ypos<2)
      this.ypos+=1;   
    }   
    this.x=(this.xpos*tileWidth)+8;
    this.y=(this.ypos*tileHeight)+97;
};

Megaman.prototype.damage = function(dm)
{
    if(!this.invincible && this.alive)
    {
    this.hp = this.hp - dm;
    if(this.hp>0)
    {
    this.text.text = this.hp;
    blast = new Blast(this.game, this.xpos, this.ypos);
    blast.scale.x= 0.7;
    blast.scale.y=0.7;
    blast.anchor.setTo(-0.1, 0.5);
    this.game.add.existing(blast);
    this.animations.play('hurt');
    sfx.hurt.play();
    this.invincible=true;

    }
    else
    {
        this.alive=false;
        this.text.text = 0;
        sfx.defeat.play("", 0, 1, false);
        enemies.remove(this);
        this.kill(false);
        blast = new Blast(this.game, this.xpos, this.ypos);
        this.game.add.existing(blast);
    }
}
}
Megaman.prototype.attack = function()
{
    if(!megamanAttacking)
    {
    
    if(currentChip.chipID==0)
    {
        megamanAttacking=true;
    if(lvl==1)
    {
    this.animations.play('shoot');
    sfx.cannon.play("", 0, 1, false);
    }
    else
    {
     this.animations.play('shoot2');
     sfx.cannon.play("", 0, 1, false);   
    }

    
    
        for(z = this.xpos+1;z<6;z++)
    {
        enem = getEnemyAt(z, this.ypos);

        if(enem != null)
        {
            if(lvl==1)
            {
                enem.damage(20);
            }
            else if(lvl==2)
            {
                enem.damage(40);
            }
            else
            {
            enem.damage(60);    
            }
            break;
                }
            }
        }
        else if(this.canAttack)
        {
            
            if(currentChip.chipID==1)
            {
                this.animations.play('swipe');
            shockwave = new Shockwave(this.game, this, 3, this.xpos+1, this.ypos);
            this.game.add.existing(shockwave);
            enemies.add(shockwave);             
            sfx.shockwave.play("", 0, 0.75, false);
            megamanAttacking=true;

            }
            else if(currentChip.chipID==2)
            {
                this.animations.play('swipe');
            fireball = new Fireball(this.game, this.xpos+1, this.ypos, 5);
            this.game.add.existing(fireball);
            enemies.add(fireball);             
            sfx.shockwave.play("", 0, 0.75, false);   
            this.canAttack=false;
            megamanAttacking=true;
            }
            else if(currentChip.chipID==3)
            {
                this.animations.play('slash');
            slash = new Slash(this.game, this.xpos+1, this.ypos+1, true);
            this.game.add.existing(slash);
            enemies.add(slash);             
            sfx.darksword.play("", 0, 0.9, false); 
             this.canAttack=false;
             megamanAttacking=true;
            
            }
        }
    }  
}
Megaman.prototype.moveTo = function (x1, y1)
 {
    this.xpos=x1;
    this.ypos=y1;

    this.x=(this.xpos*tileWidth)+8;
    this.y=(this.ypos*tileHeight)+97;
};



function Shockwave(game, mettaur, level, x, y) 
{

    this.name = "Shockwave";
    this.level = level;
    this.first=true;




    // call Phaser.Sprite constructor
        if(level==4)
    {
    GameObject.call(this, game, x, y, 250, 'darkwave', 0);
    }
    else if(level==3)
    {
    GameObject.call(this, game, x, y, 200, 'shockwave', 0);
    }
    else if(level==2)
    {
    GameObject.call(this, game, x, y, 300, 'shockwave', 0);
    }
    else
    {
    GameObject.call(this, game, x, y, 400, 'shockwave', 0);
    }   

    // Shockwave has 1 animation
    this.passable=true;
    this.animations.add('default', [0, 1, 2, 3], 10, true);
    this.animations.play('default');
    this.delay=this.game.time.now+this.delayTime;
    this.target = new Target(this.game, this, this.xpos+this.direction, this.ypos);
    this.game.add.existing(this.target);
    this.target.upd();

    // Align sprite
    this.anchor.set(0, 0.5);

        if(mettaur.name == "Megaman")
    {
        this.direction = 1;
        this.scale.x = -1;
        this.anchor.set(0.7, 0.5);
        mettaur.canAttack=false;
    }
    else
    {
    
    
    this.direction = -1;
    }
    this.mettaur = mettaur;

    }
Shockwave.prototype = Object.create(GameObject.prototype);
Shockwave.prototype.constructor = Shockwave;
Shockwave.prototype.act = function()
{
    if(this.game.time.now>this.delay)
    {
                //Shockwave travels in a straight line
                if(this.xpos>0 && this.xpos<5)
                {
                this.moveTo(this.xpos+this.direction, this.ypos);
                this.damaged=false;
                sfx.shockwave.play("", 0, 1, false);
                this.setDelayed();
                this.target.upd();

                }
                else
                {
                //Reached the end of the map, kill this object.
                    sfx.shockwave.play("", 0, 1, false);
                    enemies.remove(this);
                    this.kill(false);
                    this.target.kill(false);
                    this.mettaur.canAttack=true;
                    
                }
            }
                                if(isMegamanAt(this.xpos, this.ypos))
                    {

                    if(this.level==4)
                    {
                    gameMegaman.damage(60);
          
                    }
                    else if(this.level==3)
                    {
                    gameMegaman.damage(70);
          
                    }
                    else if(this.level==2)
                    {
                    gameMegaman.damage(50);
                    }   
                    else
                    {
                    gameMegaman.damage(20);
                    }     
                    }
                    else if(this.direction==1 && !this.damaged)
                    {
                        enemy = getEnemyAt(this.xpos, this.ypos);
                        if(enemy!= null)
                        {
                            enemy.damage(40);
                            this.damaged=true;
                        }
                    }

}

function ShadowFlame(game, x, y, level) 
{

    this.name = "Shadowflame";

    // call Phaser.Sprite constructor

    GameObject.call(this, game, x, y, 100, 'shadowflame', 0);

    
    
    // Shockwave has 1 animation
    this.passable=true;
    this.animations.add('default', [0, 1, 2, 1, 0], 15, false);
    this.animations.play('default');
    this.delay=this.game.time.now+this.delayTime;
    this.target = new Target(this.game, this, this.xpos-1, this.ypos);
    this.game.add.existing(this.target);
    this.target.upd();
        this.events.onAnimationComplete.add(function () 
    {
      //Reached the end of the map, kill this object.
                    sfx.shockwave.play("", 0, 1, false);
                    enemies.remove(this);
                    this.kill(false);
                    this.target.kill(false);
    }, this);
    // Align sprite
    this.anchor.set(0, 0.7);
    this.x=(this.xpos*tileWidth)+8;
    this.y=(this.ypos*tileHeight)+97;
    

    // Align sprite
    this.anchor.set(0.19, 0.5);
}
    
ShadowFlame.prototype = Object.create(GameObject.prototype);
ShadowFlame.prototype.constructor = Shockwave;
ShadowFlame.prototype.act = function()
{
                    if(isMegamanAt(this.xpos, this.ypos))
                    {
                    gameMegaman.damage(60);
                    }

                
                

            

}


function Firetower(game, mettaur, x, y, level) 
{
    this.mettaur = mettaur;
    mettaur.canAttack=false;
    this.name = "firetower";
    this.level=level;

    sfx.burn.play("", 0, 1, false);

    // call Phaser.Sprite constructor
        if(level==3)
    {
    GameObject.call(this, game, x, y, 250, 'shadowflame', 0);
    }
    else if(level==2)
    {
    GameObject.call(this, game, x, y, 360, 'shadowflame', 0);
    }
    else
    {
    GameObject.call(this, game, x, y, 500, 'shadowflame', 0);
    }  
    // WaterTower has 1 animation
    this.passable=true;
    this.animations.add('default', [0, 1, 2, 1, 0], 15, true);
    this.animations.play('default');
    this.delay=this.game.time.now+this.delayTime;
    this.target = new Target(this.game, this, this.xpos-1, this.ypos);
    this.game.add.existing(this.target);
    this.target.upd();

    // Align sprite
    this.anchor.set(0.2, 0.5);
    }
Firetower.prototype = Object.create(GameObject.prototype);
Firetower.prototype.constructor = Shockwave;
Firetower.prototype.act = function()
{
    if(this.game.time.now>this.delay)
    {
                //Shockwave travels in a straight line
                if(this.xpos>0)
                {
                if(gameMegaman.ypos==this.ypos)
                {                 
                this.moveTo(this.xpos-1, this.ypos);
                }
                else if (gameMegaman.ypos<this.ypos)
                {
                this.moveTo(this.xpos-1, this.ypos-1);
                }
                else
                {
                this.moveTo(this.xpos-1, this.ypos+1);   
                }
                sfx.burn.play("", 0, 1, false);
                this.setDelayed();
                this.target.upd();

                }
                else
                {
                //Reached the end of the map, kill this object.
                    sfx.burn.play("", 0, 1, false);
                    enemies.remove(this);
                    this.kill(false);
                    this.target.kill(false);
                    this.mettaur.canAttack=true;
                }
            }
                                            if(isMegamanAt(this.xpos, this.ypos))
                    {

                    if(this.level==4)
                    {
                    gameMegaman.damage(60);
          
                    }
                    else if(this.level==3)
                    {
                    gameMegaman.damage(70);
          
                    }
                    else if(this.level==2)
                    {
                    gameMegaman.damage(50);
                    }   
                    else
                    {
                    gameMegaman.damage(20);
                    }     
                    }

}

function Fireball(game, x, y, level, megaman) 
{
    this.name = "Fireball";
    this.level = level;
    if(megaman = true)
    {
        this.megaman=true;
    }
    else
    {
        this.megaman=false;
    }


    // call Phaser.Sprite constructor
            if(level<4 || level==5)
    {
        GameObject.call(this, game, x, y, 400, 'fireball');
    }
    else    {
        GameObject.call(this, game, x, y, 400, 'bassshot');
    }

    // Shockwave has 1 animation
    this.passable=true;


    this.travelDuration=10;
    this.animations.add('default', [0, 1, 2], 10, true);
    this.animations.play('default');
    this.delay=this.game.time.now+this.delayTime;
    this.anchor.set(0.7, 0.5);
    // Align sprite
    
    if(this.level != 5)
    {
        this.direction = -1;
        
        this.anchor.set(0, 0.7);
    }
    else
    {
    this.direction = 1;
    this.scale.x = -1;
    }
    }
Fireball.prototype = Object.create(GameObject.prototype);
Fireball.prototype.constructor = Fireball;
Fireball.prototype.act = function()
{

                //Fireball travels in a straight line at 10 px per delay.

                if(this.travelDuration<=0)
                {
                    this.travelDuration=20;

                    if(this.xpos>0 && this.xpos<=5)
                    {                 
                    this.setGrid(this.xpos+(this.direction), this.ypos);
                    this.setDelayed();

                    }
                else
                {
                //Reached the end of the map, kill this object.
                    enemies.remove(this);
                    this.kill(false);
                            if(this.megaman)
                            {
                            gameMegaman.canAttack=true;
                            }
                }

            }

                if(isMegamanAt(this.xpos, this.ypos))
                {
                                                                if(this.level==4)
    {
gameMegaman.damage(55);
    }

    else if(this.level==3)
    {
gameMegaman.damage(40);
    }
    else if(this.level==2)
    {
gameMegaman.damage(20);
    }
    else
    {
gameMegaman.damage(10);
    }   
                            enemies.remove(this);
                            this.kill(false);
                }
                else if(this.direction==1)
                {

                        enemy = getEnemyAt(this.xpos, this.ypos);
                        if(enemy!= null)
                        {
                            enemy.damage(50);
                            enemy2 = getEnemyAt(this.xpos+1, this.ypos);
                            if(enemy2!= null)
                            {
                            enemy2.damage(50);
                            }
                            enemies.remove(this);
                            this.kill(false);
                            if(this.megaman)
                            {
                            gameMegaman.canAttack=true;
                            }
                        }
                }
    if(this.level==5)
    {
    this.x+=4*this.direction;
    this.travelDuration-=2*this.direction;
    }
    else if(this.level==3)
    {
    this.x+= 6*this.direction;
    this.travelDuration+=3*this.direction;
    }
    else if(this.level==2 || this.level==4)
    {
    this.x+=4*this.direction;
    this.travelDuration+=2*this.direction;
    }
    else
    {
    this.x+=2*this.direction;
    this.travelDuration+=this.direction;
    }   
                
}

function RattonShot(game, x, y, level) 
{
    this.name = "RattonShot";
    this.turn = false;
    this.level = level;


    // call Phaser.Sprite constructor
    GameObject.call(this, game, x, y, 400, 'rattonshot');
    this.passable=true;

    this.travelDuration=10;
    this.delay=this.game.time.now+this.delayTime;


    // Align sprite
    this.anchor.set(0, 0.4);
    }
RattonShot.prototype = Object.create(GameObject.prototype);
RattonShot.prototype.constructor = Fireball;
RattonShot.prototype.act = function()
{
                //RattonShot travels in a straight line at 10 px per delay.

                if(this.travelDuration<=0)
                {
                    this.travelDuration=20;
                                            if(!(this.turn))
                        {
                        this.setGrid(this.xpos-1, this.ypos);
                        }
                        else
                        {
                        this.setGrid(this.xpos, this.ypos+this.dir);    
                        }
                    if(this.xpos<=gameMegaman.xpos && !this.turn)
                    {
                        this.turn=true;
                        this.x-=10;
                        if(this.ypos>gameMegaman.ypos)
                        {
                            this.dir=-1;
                        }
                        else
                        {
                            this.dir=1;
                        }
                    }
                    this.setDelayed();
    


                    if(!(this.xpos>-1 && this.ypos <3 && this.ypos>= 0))
 
                {
                //Reached the end of the map, kill this object.
                    enemies.remove(this);
                    this.kill(false);
    
                }

            }

                                if(isMegamanAt(this.xpos, this.ypos))
                        {
                                                                    if(this.level==3)
    {
gameMegaman.damage(40);
    }
    else if(this.level==2)
    {
gameMegaman.damage(25);
    }
    else
    {
gameMegaman.damage(15);
    }   
                        }
                if(!this.turn)
                {
                this.x-=2*this.level;
                }
                else
                {
                this.y+=this.dir*this.level;
                }
                this.travelDuration-=1*this.level;
}

function Slash(game, x, y, megaman) 
{
    this.megaman=megaman;
    this.attacked=false;

    this.name = "Slash";
    // call Phaser.Sprite constructor
    GameObject.call(this, game, x, y, 400, 'darksword');
    this.passable=true;

    this.animations.add('default', [0, 1, 2, 3], 10, false);
    this.animations.play('default');


                        this.events.onAnimationComplete.add(function () 
                    {
                    enemies.remove(this);
                    this.kill(false);
                    gameMegaman.canAttack=true;
                    }, this);

    // Align sprite
    this.anchor.set(0, 0.3);
    if(this.megaman)
    {
        this.anchor.set(0.7, 0.7);
        this.scale.x = -1;
    }
    }
Slash.prototype = Object.create(GameObject.prototype);
Slash.prototype.constructor = Slash;
Slash.prototype.act = function()
{

if(!this.megaman)
{
if(isMegamanAt(this.xpos, this.ypos) || isMegamanAt(this.xpos+1, this.ypos)||
    isMegamanAt(this.xpos, this.ypos+1) || isMegamanAt(this.xpos+1, this.ypos+1)||
    isMegamanAt(this.xpos, this.ypos+2) || isMegamanAt(this.xpos+1, this.ypos+2))
    {
    gameMegaman.damage(60);

    }
}
else
{   
    if(!this.attacked)
    {
                        for(i = 0;i<2;i++)
                        {
                            for(j = -2; j<1;j++)
                            {
                         enemy = getEnemyAt(this.xpos+i, this.ypos+j);
                         x1 = this.xpos+i;
                         y1 = this.ypos+j;

                        if(enemy!= null)
                        {
                            enemy.damage(50);
                        }
                    }
                    }
                    this.attacked=true;
}
}
}



function CannonTarget(game, cannon, level, x, y) 
{
    this.cannon = cannon;
    this.found = false;
    cannon.canAttack=false;
    this.name = "CannonTarget";


    // call Phaser.Sprite constructor
            if(level==3)
    {
    GameObject.call(this, game, x, y, 100, 'cannontarget');
    }
    else if(level==2)
    {
    GameObject.call(this, game, x, y, 200, 'cannontarget');
    }
    else
    {
    GameObject.call(this, game, x, y, 300, 'cannontarget');
    }   
    
    this.passable=true;
     this.animations.add('locked', [1, 2, 3, 4], 10, false);
    this.delay=this.game.time.now+this.delayTime;

    // Align sprite
    this.anchor.set(0.2, 0.5);
                            this.events.onAnimationComplete.add(function () 
                    {
                                        enemies.remove(this);
                this.kill(false);
                this.cannon.animations.play('attack');
                sfx.cannon.play("", 0, 1, false);
                if(isMegamanAt(this.xpos, this.ypos))
                {
                                if(level==3)
    {
                 gameMegaman.damage(100);
    }
    else if(level==2)
    {
                 gameMegaman.damage(60);
    }
    else
    {
                 gameMegaman.damage(40);
    }   
                }
                    }, this);
                
    }

CannonTarget.prototype = Object.create(GameObject.prototype);
CannonTarget.prototype.constructor = CannonTarget;
CannonTarget.prototype.act = function()
{
    if(this.game.time.now>this.delay)
    {
                //CannonTarget travels in a straight line
                if(!this.found)
                {
                    if(this.xpos>0)
                    {                 
                    this.moveTo(this.xpos-1, this.ypos);
                    this.setDelayed();
                    }
                    else
                    {
                    //Reached the end of the map, kill this object.
                    enemies.remove(this);
                    this.kill(false);
                    this.cannon.canAttack=true;
                    }
                }
            }
            if(this.xpos==gameMegaman.xpos && this.ypos==gameMegaman.ypos)
            {
                this.animations.play('locked');
                this.found=true;
            }
        
}


function Shot(game, x, y) 
{

    // call Phaser.Sprite constructor
    GameObject.call(this, game, x, y, 400, 'shot');
    this.passable=true;
    this.animations.add('default', [0, 1, 2, 3], 15, false);
    this.animations.play('default');
    this.delay=this.game.time.now+this.delayTime;
    this.target = new Target(this.game, this, this.xpos-1, this.ypos);
    this.game.add.existing(this.target);
    this.target.upd();

    this.events.onAnimationComplete.add(function () 
                    { 

                        this.kill(false);
                        this.target.kill(false);
                        if(this.xpos == gameMegaman.xpos && this.ypos == gameMegaman.ypos)
                        {
                            gameMegaman.damage(25);
                            gameMegaman.invincible=false;
                        }

                    }, this);

    // Align sprite
    this.anchor.set(0.2, 0.5);
    }
Shot.prototype = Object.create(GameObject.prototype);
Shot.prototype.constructor = Megaman;
Shot.prototype.act = function()
{
}

function Blast(game, x, y) 
{

    // call Phaser.Sprite constructor
    GameObject.call(this, game, x, y, 400, 'blast');
    this.passable=true;
    this.animations.add('default', [0, 1, 2, 3, 4, 5], 15, false);
    this.animations.play('default');
    this.delay=this.game.time.now+this.delayTime;

    this.events.onAnimationComplete.add(function () 
                    { 

                        this.kill(false);

                    }, this);

    // Align sprite
    this.anchor.set(0.2, 0.5);
    }
Blast.prototype = Object.create(GameObject.prototype);
Blast.prototype.constructor = Blast;

function Target(game, owner, x, y) 
{
    this.owner = owner;
    // call Phaser.Sprite constructor
    GameObject.call(this, game, x, y, 0, 'target');
    this.passable=true;
    // Align sprite
    this.anchor.set(0, 0);
    }
Target.prototype = Object.create(GameObject.prototype);
Target.prototype.constructor = Target;
Target.prototype.upd = function()
{
    this.moveTo(this.owner.xpos, this.owner.ypos);
}