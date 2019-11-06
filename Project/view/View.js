class View {

    lettersFilled
    isPlayerDead
    getWord
    setWord
    fetchWord
    lettersHandler
    foundLetters
    hangedManStatus
    allLettersGuessed
    coordinates
    letters
    lettersPressed

    constructor() {
        this.lettersFilled = [];
        this.initControlVariables();
    }

    initControlVariables= () => {
        this.foundLetters = [];
        this.hangedManStatus=0;
        this.lettersPressed=[];
    }

    

    initDraw= (letters) => {
        this.fillLetters(letters);
        this.bindLettersAndKeyboard();
        this.drawWord();
    }

    DOM = () => {
        this.canvas = document.getElementById("workSpace");  
        this.canvasContext = this.canvas.getContext("2d");
        this.letterContainer = document.getElementById("alphabet");
        this.guessInput = document.getElementById("guessInput");
        this.guessButton = document.getElementById("guessButton");
        this.restartButton = document.getElementById("restartButton");
        this.container = document.getElementById("container");
        this.restartButton.disabled=true;
        this.restartButton.hidden=true;
    }
    
    fillLetters = (letters) => {
        letters.forEach(value => {
            this.letters=letters;
            const letter = document.createElement("input");
            letter.setAttribute("type","button")
            letter.setAttribute("id",value);
            letter.setAttribute("value",value);
            letter.setAttribute("class","letter");
            letter.innerHTML = value;
            this.letterContainer.appendChild(letter);
            //las cacheo en la vista, para que el controlador tenga acceso luego a  ellas y las bindee con los handlers
            this.lettersFilled.push(letter);
        });
    }

    bindIsPlayerDead = (handler) => {
        this.isPlayerDead =  handler;
    }

    bindGetWord = (handler) => {
        this.getWord = handler;
    }

    bindGuessButton = (handler,) => {
        this.guessButton.addEventListener("click",(event) => {
            if (handler(this.guessInput.value,this.getWord())) {
                this.foundLetters=this.getWord().split("");
                this.drawWord();
                this.decideMatch(true);
            } else {
                this.drawHangedMan();
                this.drawHangedMan();
            }
        });
    }

    bindAllLettersGuessed = (handler) => {
        this.allLettersGuessed =handler;
    }

    bindLettersAndKeyboard = () => {
        this.lettersFilled.forEach((letterFilled) => {
            letterFilled.addEventListener("click",this.bindLetterAction);
        });
        document.addEventListener("keyup",this.bindKeyAction);
    }

    bindLettersHandler=(handler) => {
        this.letterAction=handler;
    }

    bindKeyAction=(event)=>{
        if (this.letters.includes(event.key) && !this.lettersPressed.includes(event.key)) {
            if ( this.letterAction(event.key,this.getWord())) {
                this.foundLetters.push(event.key);
                if (this.allLettersGuessed(this.foundLetters,this.getWord())) {
                    this.decideMatch(true);
                }
                this.drawWord();
            } else {
                console.log("te equivocaste!");
                this.drawHangedMan();
            }
            this.lettersPressed.push(event.key);
        }
    }

    bindLetterAction = (event) => {
        console.log(event.target.id+" clicked!");
        if (this.letterAction(event.target.id,this.getWord())) {
            this.foundLetters.push(event.target.id);
            if (this.allLettersGuessed(this.foundLetters,this.getWord())) {
                this.decideMatch(true);
            }
            this.drawWord();
        } else {
            console.log("te equivocaste!");
            this.drawHangedMan();
        }
        event.target.disabled = true;
    }


    //draw the word on win!!!
    drawHangedMan = () => {
        this.canvasContext.beginPath();
        const coordinate = this.coordinates[this.hangedManStatus];
        if (coordinate.action === "drawStick") {
            this.canvasContext.moveTo(coordinate.moveTo[0],coordinate.moveTo[1]);
            this.canvasContext.lineTo(coordinate.lineTo[0],coordinate.lineTo[1]);
            this.canvasContext.closePath();
        } else {
            this.canvasContext.arc(
                coordinate.position[0],
                coordinate.position[1],
                coordinate.radius,
                coordinate.angleStart,
                coordinate.angleStop*2*Math.PI/360
            );
        }
        this.canvasContext.stroke();
        if (this.hangedManStatus<8) {
            this.hangedManStatus++;
        }
        if (this.isPlayerDead()) {
            this.foundLetters=this.getWord().split("");
            this.drawWord();
            this.decideMatch(false);
        }
    }

    drawWord = () => {
        console.log(this.getWord().split(""));
        /**
         * TODO: Document the process
         * 1. Split words into letters
         * 2. ...
         */
        const wordToDraw = this.getWord().split("").reduce((acc,letter) => this.foundLetters.includes(letter)?acc+=(letter+" "):acc+="_ ","");
        this.canvasContext.font = "20px monospace";
        this.canvasContext.fillText(wordToDraw, 50, 50);
    }

    enableMatchControls = (enable) => {
        this.restartButton.disabled=enable;
        this.restartButton.hidden=enable;
        this.lettersFilled.forEach((letterFilled) => {
            letterFilled.disabled = !enable;
        });
        this.guessButton.disabled = !enable;        
    }

    decideMatch = (isWon) => {
        this.canvasContext.font = "50px Arial";
        const text = isWon?"YOU WON!":"YOU DIED!";
        this.canvasContext.fillText(text, 200, 250);
        this.enableMatchControls(false);
    }
    //TODO: ordenar y comentar
    bindRestartGame= (handlePlayer) => {
        this.restartButton.addEventListener("click", () => {
            console.log(this.getWord());            
            this.fetchWord().then((word) =>{
                handlePlayer();
                this.initControlVariables();
                this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
                this.enableMatchControls(true);
                this.setWord(word);
                this.drawWord();
                console.log(this.getWord());
            });
        })
    }

    bindSetWord = (handler) => {
        this.setWord = handler;
    }

    bindFetchWord = (handler) => {
        this.fetchWord = handler;
    }

    fetchCoordinates() {
        return (fetch('../../Datas/coordinates.json')
      .then(coordinates => coordinates.json()));
    }


    fetchLetters() {
        return (fetch('../../Datas/alphabet.json')
      .then(alphabet => alphabet.json()));
    }

    fetchContainIntoHtml() {
        return fetch('./hangedMan.html')
          .then(contain => contain.text())
          .then(containHTML => (document.getElementById("container").innerHTML = containHTML));
      }
}