class Service {

    player
    word
    constructor() {
       this.player = new Player("sergio",9);
    }

    //para usar await en una funcion asincrona hay que definirla como tal
    //

    fetchWord() {
        return (fetch('../../Datas/words.json')
      .then(words => words.json())).
      then(words => {
          const random = Math.floor(Math.random()*words.length);
          console.log(random);
          return words[random];
        });
    }

    getWord = () => {
        return this.word
    }

    setWord = (word) => {
        this.word = word
    }
    

    findLetterPosition = (letter,word) => {
        const lettersArray = word.split("");
        let found=false;
        if (lettersArray.includes(letter)) {
            found = true;
        } else {
            this.player.loseLives(1);
        }
        return found;
    }

    checkWordGuessed = (wordGuessed,word) => {
        let guessed = false;
        if (word === wordGuessed) {
            guessed=true
        } else {
            this.player.loseLives(2);
        }
        return guessed;
    }
    
    allLettersGuessed = (foundLetters,word) => {
        return !(word.split("").map((letter) => foundLetters.includes(letter))).includes(false);
    }

    
}