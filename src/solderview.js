/**
 * Created by andrey on 08.05.2022.
 */

var SolderView = cc.Node.extend({
    ctor: function (solder) {
        this._super();

        this.solder = solder;

        this.animation = sp.SkeletonAnimation.create(resources[solder.type + solder.code + '_json'], resources.battle_atlas);
        this.animation.setAnimation(0, "idle", true);
        this.addChild(this.animation);

        this.addHealthBar(); 

        if (solder.type === 'solder') {
            this.animation.setScaleX(-1);
        }

        solder.onTakeDamageAnimation = this.onTakeDamage.bind(this);
        solder.onAttackAnimation = this.onAttack.bind(this);
        solder.onDieAnimation = this.onDie.bind(this);
    },

    addHealthBar: function() {
        let barWidth = this.animation.getContentSize().width * 2;
        let barHeight = cc.view.getFrameSize().height * 0.05;

        let offsetX = 0.5;
        let offsetY = -(this.animation.getContentSize().height / barHeight) * 1.1;

        var barBackgroundSize = cc.spriteFrameCache.getSpriteFrame('progress_background.png').getOriginalSize();
        this.heatlhBarBackground = new ccui.LoadingBar();
        this.heatlhBarBackground.loadTexture('progress_background.png', ccui.Widget.PLIST_TEXTURE);
        this.heatlhBarBackground.setPercent(100);
        this.heatlhBarBackground.x = this.getPositionX();
        this.heatlhBarBackground.y = this.getPositionY();
        this.heatlhBarBackground.setScale9Enabled(true);
        this.heatlhBarBackground.setContentSize(barWidth, barHeight);
        this.heatlhBarBackground.setCapInsets(cc.rect(barBackgroundSize.width / 2 - 1, barBackgroundSize.height / 2 - 1, 2, 2));
        this.heatlhBarBackground.setScale(0.5);
        // this.heatlhBarBackground.setScaleY(0.5);
        // this.heatlhBarBackground.setScaleX(2.0);
        this.heatlhBarBackground.setAnchorPoint(offsetX, offsetY);

        var barSize = cc.spriteFrameCache.getSpriteFrame('progressbar.png').getOriginalSize();
        this.heatlhBar = new ccui.LoadingBar();
        this.heatlhBar.loadTexture('progressbar.png', ccui.Widget.PLIST_TEXTURE);
        this.heatlhBar.setPercent(100);
        this.heatlhBar.x = this.getPositionX();
        this.heatlhBar.y = this.getPositionY();
        this.heatlhBar.setScale9Enabled(true);
        this.heatlhBar.setContentSize(barWidth, barHeight);
        this.heatlhBar.setCapInsets(cc.rect(barSize.width / 2 - 1, barSize.height / 2 - 1, 2, 2));
        this.heatlhBar.setScale(0.5);
        // this.heatlhBar.setScaleY(0.5);
        // this.heatlhBar.setScaleX(2.0);
        this.heatlhBar.setAnchorPoint(offsetX, offsetY);
        
        this.addChild(this.heatlhBarBackground);
        this.addChild(this.heatlhBar);
    },

    onDie: function() {
        this.animation.runAction(new cc.Sequence(
            new cc.FadeOut(0.3),
            new cc.ToggleVisibility()
        ));
        this.heatlhBar.removeFromParent();
        this.heatlhBarBackground.removeFromParent();
    },

    onAttack: function() {
        this.animation.setAnimation(0, "attack", false);
        this.animation.setCompleteListener(function() {
            this.animation.setAnimation(0, "idle", true);
        }.bind(this));

        cc.audioEngine.playEffect(resources['battle_' + this.solder.type + '_effect'], false);
    },

    onTakeDamage: function (damageAmount) {
        this.animation.runAction(new cc.Sequence(
            new cc.FadeTo(0.3, 140),
            new cc.FadeTo(0.3, 255)
        ));

        var damage = sp.SkeletonAnimation.create(resources.damage_json, resources.battle_atlas);
        damage.setAnimation(0, "animation", false);
        damage.setCompleteListener(function() {
            damage.removeFromParent();
        })
        this.addChild(damage);

        let damageTxt = '-' + damageAmount;
        var damageLabel = new ccui.Text(damageTxt, resources.marvin_round.name, 15);
        damageLabel.enableShadow(cc.color(0, 0, 0, 255), cc.size(1, 1), 2.0);
        this.addChild(damageLabel);
        damageLabel.runAction(new cc.Sequence(
            new cc.MoveTo(0.6, cc.p(damageLabel.getPositionX(), damageLabel.getPositionY() + 20)),
            new cc.FadeTo(0.3, 0),
            new cc.RemoveSelf()
        ));
        
        this.heatlhBar.setPercent((this.solder.hp / Solder.HP) * 100);
    }
});