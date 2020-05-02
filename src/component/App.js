import React, {Component} from 'react';
import '../css/app.css';
import Letter from "./Letter";
import {sentencesList} from "../utils/sentencesList";
import {image} from '../utils/showImage';
import Finish from "./Finish";
import beepCell from '../samples/beep-cell.wav';

const ALPHABET = ['A', 'Z', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'Q', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'W', 'X', 'C', 'V', 'B', 'N'];
const DEFAULT_STATE = {
  sentence: '',
  errors: 0,
  finish: false,
  limit: 11
};

class App extends Component {

  state = {
    sentence: '',
    lettersInSentences: new Set(),
    lettersPlayed: new Set(),
    lettersRemaining: new Set(),
    errors: 0,
    finish: false,
    limit: 11
  };

  beep = new Audio(beepCell);

  componentDidMount() {
    this.getLettersInSentences();
    document.addEventListener("keypress", this.handleKeyPress);
  }

  handleClickLetter = letter => {
    this.game(letter)
  };

  handleKeyPress = (e) => {
    this.game(e.key.toUpperCase())
  };

  handleClickRestart = () => {
    const {lettersPlayed} = this.state;
    lettersPlayed.clear();
    this.setState(DEFAULT_STATE);
    this.getLettersInSentences();
    document.addEventListener("keypress", this.handleKeyPress);
  };

  getLettersInSentences() {
    const sentence = sentencesList[Math.floor(Math.random() * sentencesList.length)].toUpperCase();
    const setAlphabet = new Set(ALPHABET);

    let setLetters = new Set();

    for (let i = 0; i < sentence.length; i++) {
      if (!setLetters.has(sentence[i]) && setAlphabet.has(sentence[i])) {
        setLetters.add(sentence[i])
      }
    }

    this.setState({
      sentence: sentence,
      lettersInSentences: setLetters,
      lettersRemaining: new Set([...setLetters])
    })
  };

  getStatus(letter, player) {
    const {lettersPlayed, lettersInSentences, finish} = this.state;

    // Partie joueur
    if (player) {
      if (finish) {
        return 'finish'
      }

      if (lettersInSentences.has(letter) && lettersPlayed.has(letter)) {
        return 'good';
      }
      if (!lettersInSentences.has(letter) && lettersPlayed.has(letter)) {
        return 'bad';
      }

      return 'play';
    }

    // partie devinette
    if (lettersPlayed.has(letter)) {
      return 'visible';
    }
    return lettersInSentences.has(letter) ? 'hidden' : '';
  }

  game(letter) {
    const {lettersInSentences, lettersRemaining, lettersPlayed, errors, limit} = this.state;
    this.beep.play();

    let error = 1;
    let finish = false;

    if (lettersInSentences.has(letter) || lettersPlayed.has(letter)) {
      error = 0;
      lettersRemaining.delete(letter);
    }

    if (lettersRemaining.size === 0 || (errors + error === limit)) {
      document.removeEventListener("keypress", this.handleKeyPress);
      finish = true;
    }

    lettersPlayed.add(letter);

    this.setState(
      (prevState) => ({
        errors: prevState.errors + error,
        finish: finish
      })
    );
  }

  render() {
    const {sentence, errors, finish, limit} = this.state;
    const wordsSentence = sentence.split(' ');

    const showSentence = wordsSentence.map(
      (word, index) => (
        <div className="container-word" key={index}>
          {
            word.split('').map(
              (letter, index) =>
                <Letter
                  key={index}
                  onClick={false}
                  letter={letter}
                  status={this.getStatus(letter)}
                />
            )
          }
        </div>
      )
    );

    const keyboardUser = ALPHABET.map((letter) =>
      <Letter
        key={letter}
        onClick={this.handleClickLetter}
        letter={letter}
        status={this.getStatus(letter, true)}
      />
    );

    const showImage = image[errors];

    return (
      <div className="app">
        <h1>Le jeu du Pendu</h1>
        <div>
          <div className="container-game">
            <div className="container-image" style={{backgroundPosition: showImage}} />
            <div className="container-words">
              {showSentence}
            </div>
          </div>
          <p className="info">Cliquer sur la lettre souhaitée ou utiliser votre clavier</p>
          <div className="container-letters">
            {keyboardUser}
          </div>
        </div>

        {finish && (
          <Finish
            errors={errors}
            sentence={sentence}
            onClick={this.handleClickRestart}
            limit={limit}
          />
        )}
        <footer>Coder avec &hearts; par <a href="mailto:contact@cedricpourrias.fr">Cédric Pourrias</a></footer>
      </div>
    )
  }
}

export default App;
