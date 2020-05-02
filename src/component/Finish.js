import React, {Component, Fragment} from "react";
import '../css/finish.css';
import glass from '../samples/glass.wav';
import cheer from '../samples/cheer.wav';


class Finish extends Component {
  glass = new Audio(glass);
  cheer = new Audio(cheer);

  playSound(victory) {
    victory ? this.cheer.play() : this.glass.play()
  }

  render() {
    const {sentence, onClick, errors, limit} = this.props;

    console.log(limit);

    const isVictory = errors < limit ?
      (
        <Fragment>
          <h2 style={{color: 'green'}}>BRAVO</h2>
          <p>Vous avez trouvé l'expression : <em>{sentence}</em> en
            fesant <em>{errors}</em> {errors <= 1 ? 'erreur' : 'erreurs'}</p>
          {this.playSound(true)}
        </Fragment>
      ) : (
        <Fragment>
          <h2 style={{color: 'red'}}>DOMMAGE</h2>
          <p>Vous n'avez pas réussi à trouver l'expression!</p>
          <p>Voici la réponse : <em>{sentence}</em></p>
          {this.playSound(false)}
        </Fragment>
      );

    return (
      <div className="container-finish">
        {isVictory}
        <button onClick={onClick}>Rejouer ?</button>
      </div>
    )
  }
}

export default Finish;