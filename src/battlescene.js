/**
 * Created by andrey on 06.05.2022.
 */

var BattleScene = cc.Scene.extend({
    ctor: function () {
        this._super();

        this.battle = new Battle();

        this.addBackground();

        this.solderViews = [];
        this.battle.solders.forEach((solder, i) => {
            solder.onDie = this.onSolderDie.bind(this);
            this.solderViews[i] = new SolderView(solder);
            this.solderViews[i].setPosition(this.width / 2 - this.width / 6 + (i % 2) * this.width / 10, this.height / 2 + (i - 1) * this.height / 5);
            this.addChild(this.solderViews[i]);
        });

        this.enemyViews = [];
        this.battle.enemies.forEach((enemy, i) => {
            enemy.onDie = this.onSolderDie.bind(this);
            this.enemyViews[i] = new SolderView(enemy);
            this.enemyViews[i].setPosition(this.width / 2 + this.width / 6 - (i % 2) * this.width / 10, this.height / 2 + (i - 1) * this.height / 5);
            this.addChild(this.enemyViews[i]);
        });

        this.addBoosterButton();
        this.addCoinsLabel();
        this.playVersusAnimation();

        this.battle.onStart = this.onBattleStart.bind(this);
        this.battle.onEnd = this.onBattleEnd.bind(this);
        this.battle.onUpdateBalance = this.onBattleBalanceUpdate.bind(this);

        cc.audioEngine.playMusic(resources.battle_music, true);
        cc.audioEngine.setMusicVolume(0.5);
    },

    addBackground: function () {
        var background = new cc.Sprite(resources.background);
        background.setScale(Math.max(this.width / background.width, this.height / background.height));
        background.setPosition(this.width / 2, this.height / 2);
        background.setLocalZOrder(-1);
        this.addChild(background);
    },

    addCoinsLabel: function() {
        this.coinsLabel = new ccui.Text(this.battle.coins, resources.marvin_round.name, 50);
        this.coinsLabel.enableShadow(cc.color(0, 0, 0, 255), cc.size(1, 1), 2.0);
        this.coinsLabel.setPosition(this.width - (this.width / 15), this.height - (this.height / 10));
        this.addChild(this.coinsLabel);
    },

    onBattleBalanceUpdate: function() {
        this.coinsLabel.setString(this.battle.coins);
    },

    addBoosterButton: function () {
        var buttonSize = cc.spriteFrameCache.getSpriteFrame('button.png').getOriginalSize();
        this.boosterButton = new ccui.Button('#button.png', '#button_on.png', '#button_off.png', ccui.Widget.PLIST_TEXTURE);
        this.boosterButton.setScale9Enabled(true);
        this.boosterButton.setContentSize(180, 70);
        this.boosterButton.setCapInsets(cc.rect(buttonSize.width / 2 - 1, buttonSize.height / 2 - 1, 2, 2));
        this.boosterButton.setPosition(this.width / 2, this.height / 2 - this.height / 3);
        this.addChild(this.boosterButton);

        this.boosterButton.setTitleText("BOOST");
        this.boosterButton.setTitleFontSize(35);
        this.boosterButton.setTitleFontName(resources.marvin_round.name);

        this.boosterButton.addClickEventListener(function () {
            if (!this.battle.running) {
                console.log("wait start");
                return;
            }

            this.battle.boost();
        }.bind(this));
    },

    playVersusAnimation: function() {
        let vsAnimation = sp.SkeletonAnimation.create(resources.battle_versus_json, resources.battle_atlas);
        vsAnimation.setAnimation(0, "animation", false);
        vsAnimation.setPosition(this.width / 2, this.height / 2);
        this.addChild(vsAnimation);
        vsAnimation.setCompleteListener(function() {
            vsAnimation.removeFromParent();
        });
    },

    playVictoryAnimation: function(isVictory) {
        let victoryAnimation = sp.SkeletonAnimation.create(resources.battle_victory_json, resources.battle_atlas);
        victoryAnimation.setScale(0.5);
        victoryAnimation.setAnimation(0, "animation", false);
        victoryAnimation.setPosition(this.width / 2, this.height / 2);
        var victoryText = isVictory ? 'VICTORY' : 'DEFEATED';
        var victoryLabel = new ccui.Text(victoryText, resources.marvin_round.name, 130);
        victoryLabel.setColor(cc.color(255, 255, 255, 100));
        victoryAnimation.label = victoryLabel;
        victoryAnimation.addChild(victoryLabel);
        this.addChild(victoryAnimation);
        victoryAnimation.setCompleteListener(function() {
            victoryAnimation.removeFromParent();
        });
    },

    onBattleStart: function() {
    },

    onBattleEnd: function(isVictory) {
        this.playVictoryAnimation(isVictory);
    },

    onSolderDie: function(solder) {
        if (solder.type === 'solder') {
            this.battle.solders.forEach((e, index) => {
                if (e === solder) {
                    this.battle.solders.splice(index, 1);
                    return;
                }
            });
        } else {
            this.battle.enemies.forEach((e, index) => {
                if (e === solder) {
                    this.battle.enemies.splice(index, 1);
                    return;
                }
            });
        }
    }
});