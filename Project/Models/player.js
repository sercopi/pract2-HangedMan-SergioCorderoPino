class Player {

    history = [];

    constructor(name) {
        this.name=name;
        this.lives=9;
    }

    getName = () => {
        return this.name;
    }

    setName = (name) => {
        this.name=name;
    }

    loseLives = (damage) => {
        this.lives-=damage;
        if (this.lives<0) {
            this.lives = 0;
        }
        console.log(this.lives);
    }

    isDead = () => {
        return this.lives===0;
    }

    addToHistory= (guess) => {

    }

    resetLives = () => {
        this.lives = 9;
    }


}