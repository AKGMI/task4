/**
 * Created by andrey on 06.05.2022.
 */

var BattleScene = cc.Scene.extend({
    ctor: function () {
        this._super();

        this.battle = new Battle();

        this.addBackground();

        this.solderView = new SolderView(this.battle.solder);
        this.solderView.setPosition(this.width / 2 - this.width / 6, this.height / 2);
        this.addChild(this.solderView);

        this.enemyView = new SolderView(this.battle.enemy);
        this.enemyView.setPosition(this.width / 2 + this.width / 6, this.height / 2);
        this.addChild(this.enemyView);

        this.addAttackButton();
        this.playVersusAnimation();

        this.battle.onStart = this.onBattleStart.bind(this);
        this.battle.onEnd = this.onBattleEnd.bind(this);
        this.solderView.solder.canAttack = this.onSolderCanAttack.bind(this);

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

    addAttackButton: function () {
        var buttonSize = cc.spriteFrameCache.getSpriteFrame('button.png').getOriginalSize();
        this.attackButton = new ccui.Button('#button.png', '#button_on.png', '#button_off.png', ccui.Widget.PLIST_TEXTURE);
        this.attackButton.setScale9Enabled(true);
        this.attackButton.setContentSize(180, 70);
        this.attackButton.setCapInsets(cc.rect(buttonSize.width / 2 - 1, buttonSize.height / 2 - 1, 2, 2));
        this.attackButton.setPosition(this.width / 2, this.height / 2 - this.height / 3);
        this.addChild(this.attackButton);

        this.attackButton.setTitleText("ATTACK");
        this.attackButton.setTitleFontSize(35);
        this.attackButton.setTitleFontName(resources.marvin_round.name);

        this.attackButton.setBright(false);

        this.attackButton.addClickEventListener(function () {
            if (!this.battle.running) {
                console.log("wait start");
                return;
            }

            this.battle.solder.attack(this.battle.enemy);
            this.attackButton.setBright(false);
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
        this.attackButton.setBright(true);
    },

    onBattleEnd: function(isVictory) {
        this.attackButton.setBright(false);
        if (this.attackButton.timeout != null) {
            clearTimeout(this.attackButton.timeout);
            this.attackButton.timeout = null;
        }
        
        this.playVictoryAnimation(isVictory);
    },

    onSolderCanAttack: function() {
        this.attackButton.setBright(true);
    }
});