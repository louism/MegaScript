function spawnRandom(x, y, l, game)
{
	r = Math.floor((Math.random() * 5) + 1);
	lvl2 = Math.floor((Math.random() * lvl) + 1);
	switch(r)
	{
		case 1:
			spawnMettaur(x, y, lvl2);
			break;
		case 2:
			spawnGunner(x, y, lvl2);
			break;
		case 3:
			spawnRatton(x, y, lvl2);
			break;
		case 4:
			spawnVolgear(x, y, 0);
			break;
		case 5:
			spawnSpikey(x, y, lvl2);
			break;
		default:
			spawnMettaur(x, y, 0);
			break;
	}
}

function spawnRandom3(game)
{
	spawnRandom(3, 2, 1, game);
    spawnRandom(5, 0, 3, game);
    spawnRandom(4, 1, 2, game);
}

function spawnMettaur(x, y, l)
{
	this.enemy = new Mettaur(gameInstance, x, y, l);
	gameInstance.add.existing(enemy);
    enemies.add(enemy);
}

function spawnGunner(x, y, l)
{
	this.enemy = new Gunner(gameInstance, x, y, l);
	gameInstance.add.existing(enemy);
    enemies.add(enemy);
}


function spawnRatton(x, y, l)
{
	enemy = new Ratton(gameInstance, x, y, l);
	gameInstance.add.existing(enemy);
    enemies.add(enemy);
}


function spawnVolgear(x, y, l)
{
	this.enemy = new Volgear(gameInstance, x, y, l);
	gameInstance.add.existing(this.enemy);
    enemies.add(this.enemy);
}

function spawnSpikey(x, y, l)
{
	enemy = new Spikey(gameInstance, x, y, l);
	gameInstance.add.existing(enemy);
    enemies.add(enemy);
}