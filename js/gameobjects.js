var tileWidth = 40;
var tileHeight= 25;
var megamanDelay;
var megamanBlocked = false;
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
    // Align sprite
    this.anchor.set(-0.05, 0.5);
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

function Mettaur(game, x, y) 
{
    this.canAttack = true;

    // call Phaser.Sprite constructor
    MovingEntity.call(this, game, x, y, 800, 'mettaur');

    this.animations.add('attack', [1, 2, 3, 0], 10, false);
    // Align sprite
    this.anchor.set(0.2, 0.5);

    }
Mettaur.prototype = Object.create(MovingEntity.prototype);
Mettaur.prototype.constructor = Megaman;
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
                        shockwave = new Shockwave(this.game, this, this.xpos-1, this.ypos);

                        this.game.add.existing(shockwave);
                        enemies.add(shockwave);
                        this.delay=this.game.time.now+(this.delayTime);
                        sfx.shockwave.play("", 0, 1, false);

                }
                
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
Shockwave.prototype.constructor = Megaman;
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