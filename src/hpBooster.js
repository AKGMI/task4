var Booster = function(_hpAmount = 50, _cost = 50) {
    this.cost = _cost;
    this.hpAmount = _hpAmount
    
    this.use = function(solders) {
        let lowestHp = 999999;
        let lowestHpId = -1;
        solders.forEach((s, index) => {
            if (s.hp < lowestHp) {
                lowestHp = s.hp;
                lowestHpId = index;
            }
        });

        if (lowestHpId !== -1) {
            solders[lowestHpId].takeDamage(this.hpAmount * -1);
        }        
    }
}