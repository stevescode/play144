import React, { useState } from 'react';

const SumDisplay = ({ id, sum, onAnswer }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const isCorrect = parseInt(input) === sum.answer;
    onAnswer(isCorrect);
    setInput('');
  };

  return (
    <div id={id} className="sum-display">
      <h1 id="sum-question" className="mb-4">{`${sum.num1} x ${sum.num2} = ?`}</h1>
      <form id="answer-form" onSubmit={handleSubmit} className="d-flex justify-content-center">
        <input
          id="answer-input"
          type="number"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          required
          className="form-control me-2"
          style={{ width: '100px' }}
        />
        <button id="submit-button" type="submit" className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
};

export default SumDisplay;
