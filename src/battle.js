/**
 * Created by andrey on 08.05.2022.
 */

var Battle = function () {
    this.coins = 100;
    this.solders = [];
    this.enemies = [];

    let count = 3;
    for (let i = 0; i < count; ++i) {
        this.solders.push(new Solder('solder'));
        this.enemies.push(new Solder('enemy'));
    }

    this.booster = new Booster(50, 50);

    this.onStart = function() {
    };
    this.onEnd = function (isVictory) {
    };
    this.onUpdateBalance = function() {
    };

    this.updateBalance = function(count) {
        this.coins += count;
        this.onUpdateBalance();
    };
    this.boost = function() {
        if (this.coins < this.booster.cost) return;

        this.updateBalance(this.booster.cost * -1);
        this.booster.use(this.solders);
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
    if (this.solders.length == 0 || this.enemies.length == 0) {
        this.stop();
        return;
    }

    this.solders.forEach((solder => {
        if (!solder.nextAttack) {
            solder.nextAttack = Date.now() +
                Math.random() * (Battle.SOLDER_INTERVAL[1] - Battle.SOLDER_INTERVAL[0]) + Battle.SOLDER_INTERVAL[0];
        }

        if (Date.now() > solder.nextAttack) {
            solder.attack(this.enemies[Math.floor(Math.random() * this.enemies.length)]);
            delete solder.nextAttack;
        }
    }));
    
    this.enemies.forEach((enemy => {
        if (!enemy.nextAttack) {
            enemy.nextAttack = Date.now() +
                Math.random() * (Battle.ENEMY_INTERVAL[1] - Battle.ENEMY_INTERVAL[0]) + Battle.ENEMY_INTERVAL[0];
        }

        if (Date.now() > enemy.nextAttack) {
            enemy.attack(this.solders[Math.floor(Math.random() * this.solders.length)]);
            delete enemy.nextAttack;
        }
    }));

};

Battle.prototype.stop = function () {
    this.running = false;
    
    console.log("Stopped!");

    clearInterval(this.interval);

    this.onEnd(this.solders.length > 0);
};

Battle.SOLDER_INTERVAL = [1500, 3500];
Battle.ENEMY_INTERVAL = [2000, 3000];
