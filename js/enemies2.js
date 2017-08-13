function Elemperor(game, x, y, level) 
{
    this.canAttack = true;
    this.direction = 0;
    this.level = level;


    // call Phaser.Sprite constructor

    GameObject.call(this, game, x, y, 425, 'elemperor', 200);
    
    
    this.name = "elemperor";


    this.animations.add('attack', [3, 4, 5], 10, false);
    this.animations.add('idle', [0, 1, 2], 10, true);

    this.animations.play('idle');
    // Align sprite
    this.anchor.set(0.2, 0.5);

                        this.events.onAnimationComplete.add(function () 
                    {   
                        this.canAttack=true;
                        this.animations.play('idle');
                    }, this);

    }
Elemperor.prototype = Object.create(GameObject.prototype);
Elemperor.prototype.constructor = Gunner;

Elemperor.prototype.act = function()
{
    if(this.game.time.now>this.delay)
    {
    if(this.canAttack)
                {
                    if(!this.aim)
                    {
                        this.target = new Target(this.game, this, gameMegaman.xpos, gameMegaman.ypos);
                        this.game.add.existing(this.target);
                        this.aim=true;
                        this.delay=this.game.time.now+(this.delayTime);
                    }
                    else
                    {
                    shadowFlame = new ShadowFlame(this.game, this.target.xpos, this.target.ypos);
                    this.game.add.existing(shadowFlame);             
                    enemies.add(shadowFlame);
                    this.animations.play('attack');
                    this.delay=this.game.time.now+(this.delayTime);
                    this.canAttack=false;
                    sfx.burn.play("", 0, 0.8, false);
                    this.aim=false;
                    this.target.kill(false);
                    }
}
                }
}