function Mettaur(game, x, y, level) 
{
    this.canAttack = true;
    this.canMove = true;
    this.attacking=false;
    this.name = "Mettaur";
    this.recover = false;

    // call Phaser.Sprite constructor
    if(level==3)
    {
    GameObject.call(this, game, x, y, 200, 'mettaur3', 240);
    }
    else if(level==2)
    {
    GameObject.call(this, game, x, y, 400, 'mettaur2', 120);
    }
    else
    {
    GameObject.call(this, game, x, y, 800, 'mettaur', 40);
    }   
    this.animations.add('attack', [1, 2, 3, 4, 5], 15, false);
    this.animations.add('recover', [6, 7, 0], 15, false);
    // Align sprite
    this.anchor.set(0.2, 0.5);

                        this.events.onAnimationComplete.add(function () 
                    {
                        if(this.attacking)
                        {
                        shockwave = new Shockwave(this.game, this, level, this.xpos-1, this.ypos);
                        this.game.add.existing(shockwave);
                        enemies.add(shockwave);             
                        sfx.shockwave.play("", 0, 0.75, false);
                        this.animations.play('recover');
                        this.attacking=false;
                        this.recover=true;
                        
                        }
                        else if(this.recover)
                        {
                            this.canMove=true;
                        }

                    }, this);

    }
Mettaur.prototype = Object.create(GameObject.prototype);
Mettaur.prototype.constructor = Mettaur;

Mettaur.prototype.act = function()
{
    if(this.game.time.now>this.delay && this.canMove)
    {
        //Mettaur always tries to go to the same row as MegaMan
        
	                if(this.ypos < gameMegaman.ypos)
                {          
                                    if(!isEnemyAt(this.xpos, this.ypos+1))
                    {

                    this.moveTo(this.xpos, this.ypos+1);
                }   
                    this.setDelayed();               
                }
                else if(this.ypos > gameMegaman.ypos)
                {
                   if(!isEnemyAt(this.xpos, this.ypos-1))
                    {
                    this.moveTo(this.xpos, this.ypos-1);
                    }      
                    this.setDelayed();   
                }
                else if(this.canAttack)
                {

                    this.animations.play('attack');
                    this.attacking=true;
                    this.canMove=false;
                    this.delay=this.game.time.now+(this.delayTime);

                }
                
            }

}

function Volgear(game, x, y, level) 
{
    this.canAttack = true;
    this.attacking=false;
    this.name = "Volgear";
    this.moves=5;
    this.level = level;

    // call Phaser.Sprite constructor
        if(level==3)
    {
    GameObject.call(this, game, x, y, 700, 'volgear3', 280);
    }
    else if(level==2)
    {
    GameObject.call(this, game, x, y, 700, 'volgear2', 160);
    }
    else
    {
    GameObject.call(this, game, x, y, 700, 'volgear', 80);
    }  
    

    this.animations.add('attack', [3, 4, 5, 6, 7], 10, false);
    this.animations.add('idle', [0, 1, 2], 10, true);
    // Align sprite
    this.animations.play('idle');
    this.anchor.set(0.2, 0.5);

                        this.events.onAnimationComplete.add(function () 
                    {
                        if(this.attacking)
                        {
                        firetower = new Firetower(this.game, this, this.xpos-1, this.ypos, this.level);
                        this.game.add.existing(firetower);
                        enemies.add(firetower);             
                        sfx.shockwave.play("", 0, 0.75, false);
                        this.animations.play('idle');
                        this.attacking=false;
                    }

                    }, this);

    }
Volgear.prototype = Object.create(GameObject.prototype);
Volgear.prototype.constructor = Mettaur;

Volgear.prototype.act = function()
{
    if(this.game.time.now>this.delay)
    {
        
                    if(this.ypos < gameMegaman.ypos)
                    {          
                if(!isEnemyAt(this.xpos, this.ypos+1))
                    {
                    this.moveTo(this.xpos, this.ypos+1);
                    }   
                    this.setDelayed();     
                    this.moves--;          
                }
                else if(this.ypos > gameMegaman.ypos)
                {
                   if(!isEnemyAt(this.xpos, this.ypos-1))
                    {
                    this.moveTo(this.xpos, this.ypos-1);
                    }      
                    this.setDelayed();  
                    this.moves--; 
                }
                else
                {
                    if(!isEnemyAt(this.xpos, this.ypos-1))
                    {
                    this.moveTo(this.xpos, this.ypos-1);
                    }
                    else if(!isEnemyAt(this.xpos, this.ypos+1))
                    {
                    this.moveTo(this.xpos, this.ypos+1);
                    }      
                    this.setDelayed();  
                    this.moves--;
                }
                if(this.moves<=0 && this.canAttack)
                {
                    this.moves=5;
                    this.animations.play('attack');

                    this.attacking=true;
                    this.delay=this.game.time.now+(this.delayTime);

                }
                
            }

}

function Spikey(game, x, y, level) 
{
    this.canAttack = true;
    this.attacking=false;
    this.name = "Spikey";
    this.level = level;
    this.moves = 4;

    // call Phaser.Sprite constructor
        if(level==3)
    {
    GameObject.call(this, game, x, y, 300, 'spikey3', 220);
    }
    else if(level==2)
    {
    GameObject.call(this, game, x, y, 500, 'spikey2', 150);
    }
    else
    {
    GameObject.call(this, game, x, y, 800, 'spikey', 70);
    }   
    

    this.animations.add('attack', [4, 5, 6], 15, false);
    this.animations.add('idle', [0, 1, 2, 3], 4, true);
    this.animations.play('idle');
    // Align sprite
    this.anchor.set(0.2, 0.6);

                        this.events.onAnimationComplete.add(function () 
                    {
                        if(this.attacking)
                        {
                            
                        fireball = new Fireball(this.game, this.xpos-1, this.ypos, this.level);
                        this.game.add.existing(fireball);
                        enemies.add(fireball);             
                        sfx.shockwave.play("", 0, 0.75, false);
                        this.animations.play('idle');
                        this.attacking=false;
                    }

                    }, this);

    }
Spikey.prototype = Object.create(GameObject.prototype);
Spikey.prototype.constructor = Mettaur;

Spikey.prototype.act = function()
{
    if(this.game.time.now>this.delay)
    { 
                    if(this.moves>0)
                {                   
                    var xm = Math.floor((Math.random() * 3) + 1)+2;
                    var ym = Math.floor((Math.random() * 3));
                    if(!isEnemyAt(xm, ym))
                    {
                    this.moveTo(xm, ym); 
                    }
                    this.setDelayed();  
                    this.moves--;             
                }
                else if(this.canAttack)
                {

                    this.animations.play('attack');
                    this.attacking=true;
                    this.delay=this.game.time.now+(this.delayTime);
                    this.moves=4;
                }
                
            }

}

function Ratton(game, x, y, level) 
{
    this.canAttack = true;
    this.attacking=false;
    this.name = "Ratton";
    this.moves = 4;
    this.level = level;

    // call Phaser.Sprite constructor
            if(level==3)
    {
    GameObject.call(this, game, x, y, 350, 'ratton3', 120);
    }
    else if(level==2)
    {
    GameObject.call(this, game, x, y, 450, 'ratton2', 80);
    }
    else
    {
    GameObject.call(this, game, x, y, 650, 'ratton', 40);
    }   
    

    this.animations.add('idle', [0, 1, 2, 3], 8, true);
    this.animations.play('idle');
    // Align sprite
    this.anchor.set(0.2, 0.5);

                        this.events.onAnimationComplete.add(function () 
                    {
                 

                    }, this);

    }
Ratton.prototype = Object.create(GameObject.prototype);
Ratton.prototype.constructor = Mettaur;

Ratton.prototype.act = function()
{

    if(this.game.time.now>this.delay)
    {
                    if(this.moves>0)
                {                 
                    var spaces = [];
                    if(!isEnemyAt(this.xpos+1, this.ypos))
                    {
                        spaces.push(1);
                    }

                    if(!isEnemyAt(this.xpos-1, this.ypos))
                    {

                        spaces.push(2);
                        
                    }

                    if(!isEnemyAt(this.xpos, this.ypos+1))
                    {
                        spaces.push(3);
                    }

                    if(!isEnemyAt(this.xpos, this.ypos-1))
                    {
                        spaces.push(4);
                    }

                    var index = Math.floor((Math.random() * spaces.length));

                    dir=spaces[index];

                    if(dir==1)
                    {
                        xm=1;
                        ym=0;
                    }
                    else if(dir==2)
                    {
                        xm=-1;
                        ym=0;
                    }
                    else if(dir==3)
                    {
                        xm=0;
                        ym=1;
                    }
                    else if(dir==4)
                    {
                        xm=0;
                        ym=-1;
                    }
                    this.moveTo(this.xpos+xm, this.ypos+ym); 
                    this.setDelayed();  
                    this.moves--;             
                }
                else if(this.canAttack)
                {
                    fireball = new RattonShot(this.game, this.xpos-1, this.ypos, this.level);
                    this.game.add.existing(fireball);
                    enemies.add(fireball);             
                    sfx.shockwave.play("", 0, 0.75, false);
                    this.animations.play('idle');
                    this.attacking=false;
                    this.delay=this.game.time.now+(this.delayTime);
                    this.moves=4;
                }
                
            }



}


function Gunner(game, x, y, level) 
{
    this.canAttack = true;
    this.direction = 0;
    this.level = level;


    // call Phaser.Sprite constructor
        if(level==3)
    {
    GameObject.call(this, game, x, y, 400, 'gunner3', 200);
    }
    else if(level==2)
    {
    GameObject.call(this, game, x, y, 600, 'gunner2', 120);
    }
    else
    {
    GameObject.call(this, game, x, y, 800, 'gunner', 60);
    }   
    
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

                    cannonTarget = new CannonTarget(this.game, this, this.level, this.xpos-1, this.ypos);
                    this.game.add.existing(cannonTarget);             
                    enemies.add(cannonTarget);
                    this.delay=this.game.time.now+(this.delayTime);
                    this.canAttack=false;

                }
}