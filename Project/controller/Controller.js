class Controller {
    constructor(view, service) {
        this.view = view;
        this.service = service;
        this.view.fetchContainIntoHtml().then(() => {
            this.view.DOM();
            this.view.bindRestartGame(this.handleResetPlayerLives());
            this.view.bindIsPlayerDead(this.handleIsPlayerDead());
            this.view.bindAllLettersGuessed(this.handleAllLettersGuessed());
            this.view.bindSetWord(this.handleSetWord());
            this.view.bindGetWord(this.handleGetWord());
            this.view.bindFetchWord(this.handleFetchWord());
            const promiseLetters = this.view.fetchLetters();
            const promiseWord = this.service.fetchWord();
            const promiseCoordinates = this.view.fetchCoordinates();
            //ejecuta todas las promesas y espera a que estén listas para ejecutar el código
            Promise.all([promiseLetters,promiseWord,promiseCoordinates]).then((values)=> {
                this.service.setWord(values[1])
                //add the coordinates fetched to the view to draw the hangman
                this.view.coordinates = values[2];
                //add the handler and listener to the letters.
                this.view.bindLettersHandler(this.handleFindLetterPosition());
                this.view.initDraw(values[0]);
                //add the handler to the input.
                this.view.bindGuessButton(this.handleCheckWordGuessed());
            });
        });
    }

    handleAllLettersGuessed = () => {
        return this.service.allLettersGuessed;
    }

    handleFindLetterPosition = () => {
        return this.service.findLetterPosition;
    }

    handleCheckWordGuessed = () => {
        return this.service.checkWordGuessed;
    }

    handleIsPlayerDead = () => {
        return this.service.player.isDead;
    }

    handleAddToPlayerHistory= () => {
        return this.service.player.addToHistory;
    }

    handleResetPlayerLives = () => {
        return this.service.player.resetLives;
    }

    handleGetWord=() => {
        return this.service.getWord;
    }

    handleSetWord = () => {
        return this.service.setWord;
    }
    handleFetchWord= () => {
        return this.service.fetchWord;
    }

}