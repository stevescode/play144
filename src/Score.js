import React from 'react';

const Score = ({ id, timer, score }) => (
  <div id={id} className="mb-4">
    <div id="timer-display" className="display-4 text-primary">Time Remaining: {timer}s</div>
    <div id="score-value" className="display-5 text-success">Score: {score}</div>
  </div>
);

export default Score;