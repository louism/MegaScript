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


function Megaman(game, x, y) 
{
    this.xpos =x;
    this.ypos= y;
    this.invincible=false;
    // call Phaser.Sprite constructor
    GameObject.call(this, game, x, y, 0, 'megaman', 100);
    this.text.x=42;
    this.text.y=-3;
    this.animations.add('shoot', [1, 2, 3, 4, 5, 6, 7, 0], 12, false);
    this.animations.add('shoot2', [1, 2, 3, 4, 5, 6, 7, 0], 14, false);
    this.animations.add('hurt', [8, 9, 10, 0], 9 , false);



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
    if(!this.invincible)
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
        this.text.text = 0;
        sfx.defeat.play("", 0, 1, false);
        enemies.remove(this);
        this.kill(false);
        blast = new Blast(this.game, this.xpos, this.ypos);
        this.game.add.existing(blast);
    }
}
}
Megaman.prototype.shoot = function()
{
    if(!megamanAttacking)
    {
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

    
    megamanAttacking=true;
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
    this.mettaur = mettaur;
    mettaur.canAttack=false;
    this.name = "Shockwave";
    this.level = level;




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
    this.target = new Target(this.game, this, this.xpos-1, this.ypos);
    this.game.add.existing(this.target);
    this.target.upd();

    // Align sprite
    this.anchor.set(0, 0.5);
    }
Shockwave.prototype = Object.create(GameObject.prototype);
Shockwave.prototype.constructor = Shockwave;
Shockwave.prototype.act = function()
{
    if(this.game.time.now>this.delay)
    {
                //Shockwave travels in a straight line
                if(this.xpos>0)
                {                 
                this.moveTo(this.xpos-1, this.ypos);
                sfx.shockwave.play("", 0, 1, false);
                this.setDelayed();
                this.target.upd();
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

}

function ShadowFlame(game, x, y) 
{

    this.name = "Shadowflame";

    // call Phaser.Sprite constructor

    GameObject.call(this, game, x, y, 250, 'shadowflame', 0);
    
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
    this.anchor.set(0.17, 0.5);
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


function Watertower(game, mettaur, x, y) 
{
    this.mettaur = mettaur;
    mettaur.canAttack=false;
    this.name = "Watertower";



    // call Phaser.Sprite constructor
    GameObject.call(this, game, x, y, 600, 'watertower');
    // WaterTower has 1 animation
    this.passable=true;
    this.animations.add('default', [0, 1, 2, 3, 4, 3, 2, 1, 0], 15, true);
    this.animations.play('default');
    this.delay=this.game.time.now+this.delayTime;
    this.target = new Target(this.game, this, this.xpos-1, this.ypos);
    this.game.add.existing(this.target);
    this.target.upd();

    // Align sprite
    this.anchor.set(0.2, 0.5);
    }
Watertower.prototype = Object.create(GameObject.prototype);
Watertower.prototype.constructor = Shockwave;
Watertower.prototype.act = function()
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
                sfx.shockwave.play("", 0, 1, false);
                this.setDelayed();
                this.target.upd();
                                if(isMegamanAt(this.xpos, this.ypos))
                {
                    gameMegaman.damage(20);
                }
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

}

function Fireball(game, x, y, level) 
{
    this.name = "Fireball";
    this.level = level;


    // call Phaser.Sprite constructor
            if(level<4)
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

    // Align sprite
    this.anchor.set(0, 0.7);
    }
Fireball.prototype = Object.create(GameObject.prototype);
Fireball.prototype.constructor = Fireball;
Fireball.prototype.act = function()
{
                //Fireball travels in a straight line at 10 px per delay.

                if(this.travelDuration<=0)
                {
                    this.travelDuration=20;

                    if(this.xpos>0)
                    {                 
                    this.setGrid(this.xpos-1, this.ypos);
                    this.setDelayed();


                    }
                else
                {
                //Reached the end of the map, kill this object.
                    enemies.remove(this);
                    this.kill(false);
    
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
                
                }
                        if(this.level==3)
    {
    this.x-=6;
    this.travelDuration-=3;
    }
    else if(this.level==2 || this.level==4)
    {
    this.x-=4;
    this.travelDuration-=2;
    }
    else
    {
    this.x-=2;
    this.travelDuration-=1;
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

function Slash(game, x, y) 
{
    this.name = "Slash";
    this.turn = false;





    // call Phaser.Sprite constructor
    GameObject.call(this, game, x, y, 400, 'darksword');
    this.passable=true;

    this.animations.add('default', [0, 1, 2, 3], 10, false);
    this.animations.play('default');


                        this.events.onAnimationComplete.add(function () 
                    {
                    enemies.remove(this);
                    this.kill(false);

                    }, this);

    this.travelDuration=10;
    this.delay=this.game.time.now+this.delayTime;


    // Align sprite
    this.anchor.set(0, 0.3);
    }
Slash.prototype = Object.create(GameObject.prototype);
Slash.prototype.constructor = Fireball;
Slash.prototype.act = function()
{


if(isMegamanAt(this.xpos, this.ypos) || isMegamanAt(this.xpos+1, this.ypos)||
    isMegamanAt(this.xpos, this.ypos+1) || isMegamanAt(this.xpos+1, this.ypos+1)||
    isMegamanAt(this.xpos, this.ypos+2) || isMegamanAt(this.xpos+1, this.ypos+2))
    {
    gameMegaman.damage(60);

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