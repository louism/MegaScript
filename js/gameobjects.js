var tileWidth = 40;
var tileHeight= 25;
var megamanDelay;
var megamanBlocked = false;
var megamanAttacking = false;
var lastKey;
var enemies;


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


function Megaman(game, x, y) 
{
    this.xpos =x;
    this.ypos= y;
    // call Phaser.Sprite constructor
    GameObject.call(this, game, x, y, 0, 'megaman', 100);
    this.text.x=42;
    this.text.y=-3;
    this.animations.add('shoot', [1, 2, 3, 0], 8, false);
    this.animations.add('hurt', [4, 5, 6, 0], 12 , false);



    this.events.onAnimationComplete.add(function () 
    {
    megamanAttacking=false;

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
Megaman.prototype.shoot = function()
{
    if(!megamanAttacking)
    {
    this.animations.play('shoot');
    sfx.cannon.play("", 0, 1, false);
    megamanAttacking=true;
        for(z = this.xpos+1;z<6;z++)
    {
        enem = getEnemyAt(z, this.ypos);

        if(enem != null)
        {
            enem.damage(20);
            break;
        }
    }
    }  
}

function Mettaur(game, x, y) 
{
    this.canAttack = true;
    this.attacking=false;
    this.name = "Mettaur";

    // call Phaser.Sprite constructor
    GameObject.call(this, game, x, y, 800, 'mettaur', 40);

    this.animations.add('attack', [1, 2, 3, 4, 5], 15, false);
    this.animations.add('recover', [6, 7, 0], 15, false);
    // Align sprite
    this.anchor.set(0.2, 0.5);

                        this.events.onAnimationComplete.add(function () 
                    {
                        if(this.attacking)
                        {
                        shockwave = new Shockwave(this.game, this, this.xpos-1, this.ypos);
                        this.game.add.existing(shockwave);
                        enemies.add(shockwave);             
                        sfx.shockwave.play("", 0, 0.75, false);
                        this.animations.play('recover');
                        this.attacking=false;
                    }

                    }, this);

    }
Mettaur.prototype = Object.create(GameObject.prototype);
Mettaur.prototype.constructor = Mettaur;

Mettaur.prototype.act = function()
{
    if(this.game.time.now>this.delay)
    {
        //Mettaur always tries to go to the same row as MegaMan
        
	                if(this.ypos < gameMegaman.ypos)
                {               	
                    this.moveTo(this.xpos, this.ypos+1); 
                    this.setDelayed();               
                }
                else if(this.ypos > gameMegaman.ypos)
                {
                                 
                    this.moveTo(this.xpos, this.ypos-1);      
                    this.setDelayed();   
                }
                else if(this.canAttack)
                {

                    this.animations.play('attack');
                    this.attacking=true;
                    this.delay=this.game.time.now+(this.delayTime);

                }
                
            }

}

function Gunner(game, x, y) 
{
    this.canAttack = true;
    this.direction = 0;


    // call Phaser.Sprite constructor
    GameObject.call(this, game, x, y, 800, 'gunner', 60);
    this.name = "Cannon";
    this.aimX=2;
    this.aimY=this.ypos;

    this.animations.add('attack', [1, 2, 3, 4, 0], 10, false);
    // Align sprite
    this.anchor.set(0.4, 0.65);

                        this.events.onAnimationComplete.add(function () 
                    {   
                        this.canAttack=true;
                    }, this);

    }
Gunner.prototype = Object.create(GameObject.prototype);
Gunner.prototype.constructor = Gunner;

Gunner.prototype.act = function()
{

    if(this.canAttack)
                {

                    cannonTarget = new CannonTarget(this.game, this, this.xpos-1, this.ypos);
                    this.game.add.existing(cannonTarget);             
                    enemies.add(cannonTarget);
                    this.delay=this.game.time.now+(this.delayTime);
                    this.canAttack=false;

                }
}


function Shockwave(game, mettaur, x, y) 
{
    this.mettaur = mettaur;
    mettaur.canAttack=false;
    this.name = "Shockwave";



    // call Phaser.Sprite constructor
    GameObject.call(this, game, x, y, 400, 'shockwave');
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

function CannonTarget(game, cannon, x, y) 
{
    this.cannon = cannon;
    this.found = false;
    cannon.canAttack=false;
    this.name = "CannonTarget";


    // call Phaser.Sprite constructor
    GameObject.call(this, game, x, y, 300, 'cannontarget');
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
                    gameMegaman.damage(20);
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

                    }, this);

    // Align sprite
    this.anchor.set(0.2, 0.5);
    }
Shot.prototype = Object.create(GameObject.prototype);
Shot.prototype.constructor = Megaman;

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