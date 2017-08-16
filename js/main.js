var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
var won = false;
var lvl = 1;
var battlesWon= 0;
var currentChip;
var pause;

PlayState = {};

// load game assets here
PlayState.preload = function ()
 {
        this.game.load.spritesheet('background', 'images/bn3panels.png', 256, 188);
        this.game.load.spritesheet('megaman', 'images/megaman.png', 90, 58);
        this.game.load.spritesheet('chips', 'images/chips.png', 64, 56);
        this.game.load.spritesheet('spikey', 'images/spikey.png', 70, 54);
        this.game.load.spritesheet('spikey2', 'images/spikey2.png', 70, 54);
        this.game.load.spritesheet('spikey3', 'images/spikey3.png', 70, 54);
        this.game.load.spritesheet('volgear', 'images/volgear.png', 64, 54);
        this.game.load.spritesheet('volgear2', 'images/volgear2.png', 64, 54);
        this.game.load.spritesheet('volgear3', 'images/volgear3.png', 64, 54);
        this.game.load.spritesheet('elemperor', 'images/elemperor.png', 64, 54);
        this.game.load.spritesheet('darksword', 'images/darksword.png', 100, 100);
        this.game.load.spritesheet('bass', 'images/bass.png', 64, 74);
        this.game.load.spritesheet('mettaur', 'images/met.png', 64, 64);
        this.game.load.spritesheet('mettaur2', 'images/met2.png', 64, 64);
        this.game.load.spritesheet('mettaur3', 'images/met3.png', 64, 64);
        this.game.load.spritesheet('watertower', 'images/watertower.png', 64, 64);
        this.game.load.spritesheet('shadowflame', 'images/shadowflame.png', 64, 64);
        this.game.load.spritesheet('ratton', 'images/ratton.png', 64, 64);
        this.game.load.spritesheet('ratton2', 'images/ratton2.png', 64, 64);
        this.game.load.spritesheet('ratton3', 'images/ratton3.png', 64, 64);
        this.game.load.spritesheet('gunner', 'images/gunner.png', 64, 64);
        this.game.load.spritesheet('gunner2', 'images/gunner2.png', 64, 64);
        this.game.load.spritesheet('gunner3', 'images/gunner3.png', 64, 64);
        this.game.load.spritesheet('shockwave', 'images/shockwave.png', 64, 64);
        this.game.load.spritesheet('darkwave', 'images/darkwave.png', 64, 64);
        this.game.load.spritesheet('fireball', 'images/fireball.png', 64, 64);
        this.game.load.spritesheet('bassshot', 'images/bassshot.png', 64, 64);
        this.game.load.spritesheet('shot', 'images/shot.png', 64, 64);
        this.game.load.spritesheet('cannontarget', 'images/CannonTarget.png', 64, 64);
        this.game.load.spritesheet('blast', 'images/blast.png', 64, 64);
        this.game.load.image('target', 'images/target.png');
        this.game.load.image('rattonshot', 'images/rattonshot.png');
        this.game.load.image('mmbnface', 'images/MMBNFace.png');
        if(isMobile)
        {
            this.game.load.audio('music:battle', 'audio/Busting2.m4a');
        }
        else
        {
        this.game.load.audio('music:battle', 'audio/Busting.m4a');
        }
        this.game.load.audio('music:finalbattle', 'audio/finalbattle.m4a');
        this.game.load.audio('sfx:shockwave', 'audio/shockwave.m4a');
        this.game.load.audio('sfx:gun', 'audio/gun.wav');
        this.game.load.audio('sfx:darksword', 'audio/darksword.m4a');
        this.game.load.audio('sfx:darkcharge', 'audio/darkcharge.m4a');
        this.game.load.audio('sfx:burn', 'audio/burn.wav');
        this.game.load.audio('sfx:defeat', 'audio/defeat.wav');
        this.game.load.audio('sfx:cannon', 'audio/cannon.m4a');
        this.game.load.audio('sfx:hurt', 'audio/hurt.m4a');
        this.game.load.audio('sfx:winner', 'audio/winner.m4a');
};

// create game entities and set up world here
PlayState.create = function () {
    var bg = new Phaser.Sprite(this.game, 0, 0, 'background');
    this.game.add.existing(bg);
    bg.animations.add('a', [0, 1, 2, 3, 4, 5], 5, true);
    bg.animations.play('a');
        var face = new Phaser.Sprite(this.game, 0, 0, 'mmbnface');
    this.game.add.existing(face);
    this._loadLevel();
        sfx = 
        {
        battle: this.game.add.audio('music:battle'),
        shockwave: this.game.add.audio('sfx:shockwave'),
        cannon: this.game.add.audio('sfx:cannon'),
        gun: this.game.add.audio('sfx:gun'),
        darksword: this.game.add.audio('sfx:darksword'),
        burn: this.game.add.audio('sfx:burn'),
        defeat: this.game.add.audio('sfx:defeat'),
        hurt: this.game.add.audio('sfx:hurt'),
        winner: this.game.add.audio('sfx:winner'),
        finalbattle: this.game.add.audio('music:finalbattle'),
        darkcharge: this.game.add.audio('sfx:darkcharge'),
    	};
    	sfx.battle.play("", 0, 1, true);

};

PlayState._loadLevel = function () {
    // spawn megaman   
     enemies = this.game.add.group();
     this._spawnCharacters();

   
};

PlayState._spawnCharacters = function () 
{
    // spawn megaman
    this.megaman = new Megaman(this.game, 1, 1);
    this.game.add.existing(this.megaman);

    this.currentChip = new CurrentChip(this.game);
    this.game.add.existing(this.currentChip);

    gameMegaman=this.megaman;
    currentChip=this.currentChip;
    // test Mettaur
    
   spawnRandom3(this.game);
    
    
};

PlayState.init = function () {

    this.keys = this.game.input.keyboard.addKeys({
        left: Phaser.KeyCode.LEFT,
        right: Phaser.KeyCode.RIGHT,
        up: Phaser.KeyCode.UP,
        down: Phaser.KeyCode.DOWN,
        z: Phaser.KeyCode.Z,
        x: Phaser.KeyCode.X,
        enter: Phaser.KeyCode.ENTER

		});




            this.game.renderer.renderSession.roundPixels = true;
            Phaser.Canvas.setImageRenderingCrisp(this.game.canvas)  

          if (!isMobile) 
          { 
          this.game.scale.setUserScale(1.5, 1.5, 0, 0);  
          this.game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
          }
          else
            {
              this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;  
            }
};

PlayState.update = function () {

        if(!megamanBlocked && !megamanAttacking) 
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

    if(!pause)
    {
    enemies.forEach(function(enemy)
    {
    	enemy.act();

    })
}
    enemies.sort('y', Phaser.Group.SORT_ASCENDING);

    if(enemies.length==0 && !won)
    {
        
        sfx.winner.play("", 0, 1, false);
        battlesWon++;
        
        if(battlesWon==3)
        {
            gameMegaman.setHP(500);
            lvl++;
        }
        else if(battlesWon==6)
        {
            gameMegaman.setHP(1000);
            lvl++;
        }

        if(battlesWon<=10)
        {
        spawnRandom3();
        }
        else
        {
            gameMegaman.setHP(750);
            sfx.battle.stop();
            sfx.finalbattle.play("", 0, 0.5, true);
            spawnBass();
        }
    }
};

PlayState._handleInput = function () 
{
    if(!pause)
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
        else if (this.keys.down.isDown) 
    { // move megaman down
        this.megaman.move(4);
    }
    if (this.keys.z.isDown) 
    { // Shoot
        this.megaman.attack();
    }
    else if (this.keys.x.isDown) 
    { // Shuffle Chip
        currentChip.next();
    }
    }
    if (this.keys.enter.isDown) 
    { // Shoot
        pause = !pause;
    }
    if(isMobile)
    {
    if(this.game.input.activePointer.isDown)
    {
        travelx = parseInt((this.game.input.activePointer.x-8)/tileWidth);
        travely = parseInt((this.game.input.activePointer.y-97)/tileHeight);
        if(travelx>-1 && travelx <3 && travely>-1 && travely <3)
        {
        this.megaman.moveTo(travelx, travely);
        }
        else if(travelx>2 && travely>-1)
        {
            this.megaman.attack();
        }
        else if(travelx>2)
        {
        	currentChip.next();
        }
    }
    }
};

function getEnemyAt(x, y)
{
    for(var i=0;i<enemies.length;i++)
    {
        element = enemies.getAt(i);
        if(element.xpos==x && element.ypos==y && !element.passable)
        {
            return element;
        }
    }
    return null;
}

function isEnemyAt(x, y)
{
        for(var i=0;i<enemies.length;i++)
    {
        element = enemies.getAt(i);
        if(element.xpos==x && element.ypos==y && !element.passable)
        {

            return true;
        }
    }
    if(x>5 || x<3 || y>2 || y<0)
    {

        return true;
    }

    return false;
}

function isMegamanAt(x, y)
{

        if(gameMegaman.xpos==x && gameMegaman.ypos==y)
        {
            return true;
        }
    
    return false;
}
window.onload = function () {
    game = new Phaser.Game(256, 188, Phaser.CANVAS, 'game', this, false, false);
    game.state.add('play', PlayState);
   	game.state.start('play');
    gameInstance = game;


   	
};