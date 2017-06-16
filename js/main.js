var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);


PlayState = {};

// load game assets here
PlayState.preload = function ()
 {
        this.game.load.spritesheet('background', 'images/bn3panels.png', 256, 256);
        this.game.load.spritesheet('megaman', 'images/megaman.png', 64, 64);
        this.game.load.spritesheet('mettaur', 'images/met.png', 64, 64);
        this.game.load.spritesheet('shockwave', 'images/shockwave.png', 64, 64);
        this.game.load.image('target', 'images/target.png');
        if(isMobile)
        {
            this.game.load.audio('music:battle', 'audio/Busting2.mp3');
        }
        else
        {
        this.game.load.audio('music:battle', 'audio/Busting.mp3');
        }
        this.game.load.audio('sfx:shockwave', 'audio/shockwave.wav');
        this.game.load.audio('sfx:cannon', 'audio/cannon.wav');
};

// create game entities and set up world here
PlayState.create = function () {
    var bg = new Phaser.Sprite(this.game, 0, 0, 'background');
    this.game.add.existing(bg);
    bg.animations.add('a', [0, 1, 2, 3, 4, 5], 5, true);
    bg.animations.play('a');
    this._loadLevel();
        sfx = 
        {
        battle: this.game.add.audio('music:battle'),
        shockwave: this.game.add.audio('sfx:shockwave'),
        cannon: this.game.add.audio('sfx:cannon')
    	};
    	sfx.battle.play("", 0, 1, true);

};

PlayState._loadLevel = function () {
    // spawn megaman   
     enemies = this.game.add.group();
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

    enemies.add(this.mettaur);
};

PlayState.init = function () {

    this.keys = this.game.input.keyboard.addKeys({
        left: Phaser.KeyCode.LEFT,
        right: Phaser.KeyCode.RIGHT,
        up: Phaser.KeyCode.UP,
        down: Phaser.KeyCode.DOWN,
        z: Phaser.KeyCode.Z
		});




            this.game.renderer.renderSession.roundPixels = true;
            Phaser.Canvas.setImageRenderingCrisp(this.game.canvas)  

          if (!isMobile) 
          { 
          this.game.scale.setUserScale(2, 2, 0, 0);  
          this.game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
          }
          else
            {
              this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;  
            }
            this.game.stage.disableVisibilityChange = true;
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
        else if (this.keys.down.isDown) 
    { // move megaman down
        this.megaman.move(4);
    }
    if (this.keys.z.isDown) 
    { // Shoot
        this.megaman.shoot();
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
        else if(travelx>2)
        {
            this.megaman.shoot();
        }
    }
    }
};
window.onload = function () {
    let game = new Phaser.Game(256, 256, Phaser.CANVAS, 'game', this, false, false);
    game.state.add('play', PlayState);
   	game.state.start('play');


   	
};