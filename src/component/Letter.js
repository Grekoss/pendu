import React from 'react';

const HIDDEN_SYMBOL = '_';

const Letter = ( { letter, onClick, status} ) => {
  const actionClick= onClick ? () => onClick(letter) : null;

  return (
    <div
      className={`card-letter ${status}`} onClick={actionClick}
    >
      <p>{status === 'hidden' ? HIDDEN_SYMBOL : letter}</p>
    </div>
  )
};

export default Letter;