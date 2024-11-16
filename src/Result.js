import React from 'react';

const Result = ({ score, timeTaken, onRestart, allScores, currentGameTimestamp }) => {
  const sortedScores = [...allScores].sort((a, b) => b.score - a.score);

  return (
    <div id="result-screen" className="result-screen">
      <h1 id="final-score-heading" className="text-success">Session Complete!</h1>
      <p id="final-score" className="lead">Final Score: {score}</p>
      <p id="time-taken" className="lead">Time Taken: {timeTaken} seconds</p>
      
      <button id="restart-button" onClick={onRestart} className="btn btn-primary my-3">Restart Game</button>

      <h2 id="previous-scores-heading" className="mt-4">Previous Scores</h2>
      <table id="score-table" className="table table-striped table-bordered">
        <thead>
          <tr>
            <th>Date</th>
            <th>Score</th>
            <th>Correct Answers</th>
            <th>Incorrect Answers</th>
            <th>Total Answers</th>
            <th>Time Taken (s)</th>
          </tr>
        </thead>
        <tbody>
          {sortedScores.map((game, index) => (
            <tr
              key={index}
              className={game.timestamp === currentGameTimestamp ? 'table-success' : ''}
            >
              <td>{game.date}</td>
              <td>{game.score}</td>
              <td>{game.correctAnswers}</td>
              <td>{game.incorrectAnswers}</td>
              <td>{game.totalAnswers}</td>
              <td>{game.timeTaken}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Result;
