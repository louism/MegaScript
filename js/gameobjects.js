var tileWidth = 40;
var tileHeight= 25;
var megamanDelay;
var megamanBlocked = false;
var megamanAttacking = false;
var lastKey;
var enemies;


var gameMegaman;
var sfx;

function MovingEntity(game, x, y, delayTime, name) 
{
    this.delayTime=delayTime;
    this.blocked = false;
    this.xpos =x;
    this.ypos= y;
    // call Phaser.Sprite constructor
    Phaser.Sprite.call(this, game, x, y, name);
    this.x=(this.xpos*tileWidth)+8;
    this.y=(this.ypos*tileHeight)+97;
    this.delay=this.game.time.now+this.delayTime;
    }
MovingEntity.prototype = Object.create(Phaser.Sprite.prototype);
MovingEntity.prototype.constructor = MovingEntity;
MovingEntity.prototype.moveTo = function (x1, y1)
 {
    this.xpos=x1;
    this.ypos=y1;


    this.x=(this.xpos*tileWidth)+8;
    this.y=(this.ypos*tileHeight)+97;
};
MovingEntity.prototype.setDelayed = function ()
 {
    this.delay=this.game.time.now+this.delayTime;
};


function Megaman(game, x, y) 
{
    this.xpos =x;
    this.ypos= y;
    // call Phaser.Sprite constructor
    MovingEntity.call(this, game, x, y, 0, 'megaman');
    this.animations.add('shoot', [1, 2, 3, 0], 8, false);

    this.events.onAnimationComplete.add(function () 
    {
    megamanAttacking=false;
    }, this);
    // Align sprite
    this.anchor.set(-0.05, 0.7);
    this.x=(this.xpos*tileWidth)+8;
    this.y=(this.ypos*tileHeight)+97;
    }
Megaman.prototype = Object.create(MovingEntity.prototype);
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
Megaman.prototype.shoot = function()
{
    if(!megamanAttacking)
    {
    this.animations.play('shoot');
    sfx.cannon.play("", 0, 1, false);
    megamanAttacking=true;
    }  
}

function Mettaur(game, x, y) 
{
    this.canAttack = true;
    this.attacking=false;

    // call Phaser.Sprite constructor
    MovingEntity.call(this, game, x, y, 800, 'mettaur');

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
Mettaur.prototype = Object.create(MovingEntity.prototype);
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
    MovingEntity.call(this, game, x, y, 800, 'gunner');
    this.aimX=2;
    this.aimY=this.ypos;

    this.animations.add('attack', [1, 2, 3, 0], 10, false);
    // Align sprite
    this.anchor.set(0.4, 0.65);

                        this.events.onAnimationComplete.add(function () 
                    {   
                        this.canAttack=true;
                    }, this);

    }
Gunner.prototype = Object.create(MovingEntity.prototype);
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


    // call Phaser.Sprite constructor
    MovingEntity.call(this, game, x, y, 400, 'shockwave');
    // Shockwave has 1 animation
    this.animations.add('default', [0, 1, 2, 3], 10, true);
    this.animations.play('default');
    this.delay=this.game.time.now+this.delayTime;
    this.target = new Target(this.game, this, this.xpos-1, this.ypos);
    this.game.add.existing(this.target);
    this.target.upd();

    // Align sprite
    this.anchor.set(0, 0.5);
    }
Shockwave.prototype = Object.create(MovingEntity.prototype);
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


    // call Phaser.Sprite constructor
    MovingEntity.call(this, game, x, y, 300, 'cannontarget');
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
                    }, this);
    }

CannonTarget.prototype = Object.create(MovingEntity.prototype);
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
    MovingEntity.call(this, game, x, y, 400, 'shot');
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
Shot.prototype = Object.create(MovingEntity.prototype);
Shot.prototype.constructor = Megaman;

function Target(game, owner, x, y) 
{
    this.owner = owner;
    // call Phaser.Sprite constructor
    MovingEntity.call(this, game, x, y, 0, 'target');
    // Align sprite
    this.anchor.set(0, 0);
    }
Target.prototype = Object.create(MovingEntity.prototype);
Target.prototype.constructor = Megaman;
Target.prototype.upd = function()
{
    this.moveTo(this.owner.xpos, this.owner.ypos);
}