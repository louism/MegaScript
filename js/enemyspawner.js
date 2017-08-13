function spawnRandom(x, y, l, game)
{
	r = Math.floor((Math.random() * 5) + 1);
	switch(r)
	{
		case 1:
			spawnMettaur(x, y, lvl);
			break;
		case 2:
			spawnGunner(x, y, lvl);
			break;
		case 3:
			spawnRatton(x, y, lvl);
			break;
		case 4:
			spawnVolgear(x, y, lvl);
			break;
		case 5:
			spawnSpikey(x, y, lvl);
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

function spawnBass(x, y)
{
	this.enemy = new Bass(gameInstance, x, y);
	gameInstance.add.existing(enemy);
    enemies.add(enemy);
}

function spawnGunner(x, y, l)
{
	r = Math.floor((Math.random() * 2));
	if(l>2 && r==0)
	{
		spawnElemperor(x, y, l);
	}
	else
	{
	this.enemy = new Gunner(gameInstance, x, y, l);
	gameInstance.add.existing(enemy);
    enemies.add(enemy);
	}
}



function spawnRatton(x, y, l)
{
	enemy = new Ratton(gameInstance, x, y, l);
	gameInstance.add.existing(enemy);
    enemies.add(enemy);
}
function spawnElemperor(x, y, l)
{
	enemy = new Elemperor(gameInstance, x, y, l);
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