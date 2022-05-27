/**
 * Created by andrey on 08.05.2022.
 */

var Battle = function () {
    this.solder = new Solder('solder');
    this.enemy = new Solder('enemy');

    this.onStart = function() {
    };
    this.onEnd = function (isVictory) {
    };
    setTimeout(this.start.bind(this), 3000);
};

Battle.prototype.start = function () {
    this.running = true;

    console.log("Started!");

    this.interval = setInterval(this.run.bind(this), 100);
    this.onStart();
};

Battle.prototype.run = function () {
    if (!this.solder.isAlive() || !this.enemy.isAlive()) {
        this.stop();
        return;
    }

    if (!this.nextEnemyAttack) {
        this.nextEnemyAttack = Date.now() +
            Math.random() * (Battle.ENEMY_INTERVAL[1] - Battle.ENEMY_INTERVAL[0]) + Battle.ENEMY_INTERVAL[0];
    }

    if (Date.now() > this.nextEnemyAttack) {
        this.enemy.attack(this.solder);
        delete this.nextEnemyAttack;
    }
};

Battle.prototype.stop = function () {
    this.running = false;
    
    console.log("Stopped!");

    clearInterval(this.interval);

    this.onEnd(this.solder.isAlive());
};

Battle.ENEMY_INTERVAL = [2000, 3000];
