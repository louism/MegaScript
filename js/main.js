var tileWidth = 39;
var tileHeight= 24;
var megamanDelay;
var megamanBlocked = false;
var lastKey;
var enemies = [];
var gameMegaman;

function Megaman(game, x, y) 
{
    this.xpos =x;
    this.ypos= y;
    // call Phaser.Sprite constructor
    Phaser.Sprite.call(this, game, x, y, 'megaman');
    // Align sprite
    this.anchor.set(-0.05, 0.5);
    this.x=this.xpos*tileWidth;
    this.y=(this.ypos*tileHeight)+71;
    }
Megaman.prototype = Object.create(Phaser.Sprite.prototype);
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
    this.x=this.xpos*tileWidth;
    this.y=(this.ypos*tileHeight)+71;
};

function Mettaur(game, x, y) 
{
    this.delay= 0;
    this.delayTime=1000;
    this.blocked = false;
    this.xpos =x;
    this.ypos= y;

    // call Phaser.Sprite constructor
    Phaser.Sprite.call(this, game, x, y, 'mettaur');
        this.animations.add('attack', [1, 2, 3, 0], 10, false);
    // Align sprite
    this.anchor.set(0.1, 0.7);
        this.x=this.xpos*tileWidth;
    this.y=(this.ypos*tileHeight)+71;
    }
Mettaur.prototype = Object.create(Phaser.Sprite.prototype);
Mettaur.prototype.constructor = Mettaur;
Mettaur.prototype.moveTo = function (x1, y1)
 {
    this.xpos=x1;
    this.ypos=y1;

    this.x=this.xpos*tileWidth;
    this.y=(this.ypos*tileHeight)+71;

};
Mettaur.prototype.act = function()
{
    if(this.game.time.now>this.delay)
    {
        //Mettaur always tries to go to the same row as MegaMan
        
	                if(this.ypos < gameMegaman.ypos)
                {               	
                    this.moveTo(this.xpos, this.ypos+1);                 
                }
                else if(this.ypos > gameMegaman.ypos)
                {
                                 
                    this.moveTo(this.xpos, this.ypos-1);      
                }
                else
                {
                    this.animations.play('attack');
                }
                this.delay=this.game.time.now+this.delayTime;
            }

}


PlayState = {};

// load game assets here
PlayState.preload = function ()
 {
    this.game.load.image('background', 'images/bn3panels.png');
        this.game.load.image('megaman', 'images/megaman.png');
        this.game.load.spritesheet('mettaur', 'images/met.png', 64, 64);
        this.game.load.audio('music:battle', 'audio/Busting.mp3');
};

// create game entities and set up world here
PlayState.create = function () {
    this.game.add.image(0, 0, 'background');
    this._loadLevel();
        this.sfx = 
        {
        battle: this.game.add.audio('music:battle')
    	};
    	this.sfx.battle.play("", 0, 1, true);

};

PlayState._loadLevel = function () {
    // spawn megaman
     this._spawnCharacters();
     

   
};

PlayState._spawnCharacters = function () {
    // spawn megaman
    this.megaman = new Megaman(this.game, 1, 1);
    this.game.add.existing(this.megaman);

    gameMegaman=this.megaman;
    // test Mettaur
    this.mettaur = new Mettaur(this.game, 4, 1);
    this.game.add.existing(this.mettaur);

    enemies.push(this.mettaur);
};

PlayState.init = function () {

    this.keys = this.game.input.keyboard.addKeys({
        left: Phaser.KeyCode.LEFT,
        right: Phaser.KeyCode.RIGHT,
        up: Phaser.KeyCode.UP,
        down: Phaser.KeyCode.DOWN
		});


            this.game.renderer.renderSession.roundPixels = true;
            Phaser.Canvas.setImageRenderingCrisp(this.game.canvas)  

    this.game.scale.setMinMax(478, 310, 478, 310);
    this.game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
};

PlayState.update = function () {

        if(!megamanBlocked)
    {
    megamanBlocked=true;
    megamanDelay=this.game.time.now+95;    
    this._handleInput();
}
        else
    {
        if(this.game.time.now>megamanDelay)
        {
            megamanBlocked=false;
        }
    }

    enemies.forEach(function(enemy)
    {
    	enemy.act();
    })


};

PlayState._handleInput = function () 
{


    if (this.keys.left.isDown) { // move megaman left
        this.megaman.move(1);
    }
    else if (this.keys.right.isDown) { // move megaman right
        this.megaman.move(2);
    }
    else if (this.keys.up.isDown) { // move megaman up
        this.megaman.move(3);
    }
        else if (this.keys.down.isDown) { // move megaman down
        this.megaman.move(4);
    }
};
window.onload = function () {
    let game = new Phaser.Game(239, 155, Phaser.AUTO, 'game', this, false, false);
    game.state.add('play', PlayState);
   	game.state.start('play');

   	
};