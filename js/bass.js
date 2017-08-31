function Bass(game, x, y) 
{
    this.canAttack = true;
    this.canMove = true;
    this.attacking=false;
    this.shadowFlame=false;
    this.darkSword=false;
    this.name = "Bass";
    this.busterShots=10;
    this.recover = false;
    this.moves=5;
    this.moves2=0;
    this.buster=false;

    // call Phaser.Sprite constructor
    GameObject.call(this, game, x, y, 400, 'bass', 2500);
    
    this.animations.add('attack', [0, 1], 8, false);
    this.animations.add('buster', [2, 3], 8, false);
    this.animations.add('rapidfire', [2, 3], 15, false);
    this.animations.add('megafire', [2, 3], 25, false);
    this.animations.add('idle', [4, 5, 6, 7], 10, true);
    this.animations.add('chargedattack', [10, 11, 10, 11, 10, 11, 10, 11, 9], 10, false);
    // Align sprite
    this.animations.play('idle');
    this.anchor.set(0.2, 0.75);

                        this.events.onAnimationComplete.add(function () 
                    {

                    if(this.buster)
                    {

                    var xm = Math.floor((Math.random() * 3));
                    var ym = Math.floor((Math.random() * 3));
                    bassAttack = new Shot(this.game, gameMegaman.xpos, gameMegaman.ypos, 2);
                    this.game.add.existing(bassAttack);
                    enemies.add(bassAttack);
                    if(this.hp>600)
                    {
                    this.animations.play('buster');
                    }
                    else if(this.hp>300)
                    {
                    this.animations.play('rapidfire');    
                    }
                    else
                    {
                    this.animations.play('megafire');     
                    }
                    sfx.gun.play("", 0, 0.8, false);
                    this.busterShots--;
                    if(this.busterShots==0)
                    {
                        this.buster=false;
                        this.moves=10;
                                            if(this.hp>500)
                    {
                    this.busterShots=10;
                    }
                    else if(this.hp>250)
                    {
                    this.busterShots=20;
                    }
                    else
                    {
                    this.busterShots=30;   
                    }
                        
                    }

                    }
                    else if(this.shadowFlame)
                    {
                        bassAttack = new ShadowFlame(this.game, 2, 1);
                        this.game.add.existing(bassAttack);
                        enemies.add(bassAttack);
                        bassAttack = new ShadowFlame(this.game, 1, 0);
                        this.game.add.existing(bassAttack);
                        enemies.add(bassAttack);
                        bassAttack = new ShadowFlame(this.game, 1, 1);
                        this.game.add.existing(bassAttack);
                        enemies.add(bassAttack);
                        bassAttack = new ShadowFlame(this.game, 1, 2);
                        this.game.add.existing(bassAttack);
                        enemies.add(bassAttack);
                        bassAttack = new ShadowFlame(this.game, 0, 0);
                        this.game.add.existing(bassAttack);
                        enemies.add(bassAttack);
                        bassAttack = new ShadowFlame(this.game, 0, 1);
                        this.game.add.existing(bassAttack);
                        enemies.add(bassAttack);
                        bassAttack = new ShadowFlame(this.game, 0, 2);
                        this.game.add.existing(bassAttack);
                        enemies.add(bassAttack);
                        this.shadowFlame=false;
                        sfx.burn.play("", 0, 0.8, false);
                        this.canMove=true;
                        this.animations.play('idle');
                    }
                    else if(this.darkSword)
                    {
                        bassAttack = new Slash(this.game, 1, 0, false);
                        this.game.add.existing(bassAttack);
                        enemies.add(bassAttack); 
                        this.canMove=true;
                        this.animations.play('idle');
                        this.darkSword=false;
                    }
                      else
                        {                     
                        if(this.attacking)
                        {
                                r = Math.floor((Math.random() * 3) + 1);
                                switch(r)
                                {
                                case 1:
                                    bassAttack = new Shockwave(this.game, this, 4, this.xpos-1, this.ypos,);
                                    break;
                                case 2:
                                    bassAttack = new Fireball(this.game, this.xpos-1, this.ypos, 4);
                                    break;
                                default:
                                    bassAttack = new Shockwave(this.game, this, 4, this.xpos-1, this.ypos);
                                break;
                            }
                        
                        this.game.add.existing(bassAttack);
                        enemies.add(bassAttack);             
                        sfx.shockwave.play("", 0, 0.75, false);
                        this.animations.play('idle');
                        this.attacking=false;
                        this.recover=true;
                        this.canMove=true;
                        }
                    }

                    }, this);

    }
Bass.prototype = Object.create(GameObject.prototype);
Bass.prototype.constructor = Mettaur;

Bass.prototype.act = function()
{
    if(this.game.time.now>this.delay && this.canMove)
    {
        if(!this.buster)
        {
	           if(this.moves>0)
                {               
                unique = false;    
                    while(!unique)
                    {
                    var xm = Math.floor((Math.random() * 3) + 1)+2;
                    var ym = Math.floor((Math.random() * 3));
                        if(xm!= this.x && ym != this.y)
                        {
                        unique = true;
                        }
                    }
                    if(!isEnemyAt(xm, ym))
                    {
                    this.moveTo(xm, ym); 
                    }
                    this.setDelayed();  
                    this.moves--; 
                    
         
                }
                else if(this.moves==0)
                {

                    this.animations.play('attack');
                    this.attacking=true;
                    this.delay=this.game.time.now+(this.delayTime);
                    if(this.hp>800)
                    {
                    this.moves=5;
                    }
                    else
                    {
                    this.moves=3;    
                    }
                    this.moves2++;
                                      if(this.moves2==3)
                    {
                        rand = Math.floor((Math.random() * 3));
                        if(rand==0)
                        {
                        this.animations.play('buster');
                        this.buster=true;
                        this.moves2=0;
                        }
                       else if(rand==1)
                        {
                        this.animations.play('chargedattack');
                        sfx.darkcharge.play("", 0, 1, false);
                        this.moveTo(3, 1);
                        this.shadowFlame=true;
                        this.moves2=0;
                        this.canMove=false;
                        }
                        else if(rand==2)
                    {
                        this.animations.play('attack');
                        sfx.darksword.play("", 0, 1, false);
                        this.darkSword=true;
                        this.moveTo(3, 1);
                        this.moves2=0;
                    } 
                    }
                    
                             
                }

                }
            
            
            }

}

Bass.prototype.damage= function (dm)
 {

    this.hp = this.hp - dm;
    if(this.hp<1500)
    {
        this.delayTime=350;
    }
    if(this.hp<800)
    {
        this.delayTime=250;
    }
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
