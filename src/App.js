import React, { useReducer, useEffect, useRef, useCallback, useState } from 'react';
import config from './config.json';
import SumDisplay from './SumDisplay';
import Score from './Score';
import Result from './Result';
import { generateSums } from './utils';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Button, Container } from 'react-bootstrap';

// Initial game state
const initialState = {
  timer: config.timeAllowed,
  score: 0,
  sums: [],
  completed: false,
  correctAnswers: 0,
  incorrectAnswers: 0,
  allScores: JSON.parse(localStorage.getItem('mathGameScores')) || [],
};

// Reducer function to manage game state
const gameReducer = (state, action) => {
  switch (action.type) {
    case 'SET_SUMS':
      return { ...state, sums: action.payload };
    case 'DECREMENT_TIMER':
      return { ...state, timer: state.timer - 1 };
    case 'INCREMENT_SCORE':
      return { ...state, score: state.score + 1, correctAnswers: state.correctAnswers + 1 };
    case 'DECREMENT_SCORE':
      return { ...state, score: state.score - 1, incorrectAnswers: state.incorrectAnswers + 1 };
    case 'REMOVE_SUM':
      return { ...state, sums: state.sums.slice(1) };
    case 'COMPLETE_GAME':
      return { ...state, completed: true };
    case 'RESTART_GAME':
      return { ...initialState, sums: generateSums() };
    case 'SAVE_SCORE':
      const updatedScores = [...state.allScores, action.payload];
      localStorage.setItem('mathGameScores', JSON.stringify(updatedScores));
      return { ...state, allScores: updatedScores };
    case 'SET_SCORES':
      return { ...state, allScores: action.payload };
    default:
      return state;
  }
};

const App = () => {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const timerRef = useRef(null);
  const [currentGameTimestamp, setCurrentGameTimestamp] = useState(null); // Track the latest game's timestamp

  // Load scores from localStorage on initial load
  useEffect(() => {
    const savedScores = JSON.parse(localStorage.getItem('mathGameScores')) || [];
    dispatch({ type: 'SET_SCORES', payload: savedScores });
    dispatch({ type: 'SET_SUMS', payload: generateSums() });
    startTimer();
    return () => stopTimer();
  }, []);

  // Start timer function
  const startTimer = () => {
    if (!timerRef.current) {
      timerRef.current = setInterval(() => {
        dispatch({ type: 'DECREMENT_TIMER' });
      }, 1000);
    }
  };

  // Stop timer function
  const stopTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
  };

  // Complete game and save score
  const completeGame = useCallback(() => {
    if (state.completed) return; // Prevent re-completing the game
    stopTimer();
    const totalAnswers = state.correctAnswers + state.incorrectAnswers;
    const timeTaken = config.timeAllowed - state.timer;
    const timestamp = Date.now(); // Use timestamp as a unique identifier

    const gameData = {
      score: state.score,
      correctAnswers: state.correctAnswers,
      incorrectAnswers: state.incorrectAnswers,
      totalAnswers,
      timeTaken,
      date: new Date().toLocaleString(), // Display date
      timestamp, // Unique identifier
    };

    const lastSavedScore = state.allScores[state.allScores.length - 1];
    if (JSON.stringify(lastSavedScore) !== JSON.stringify(gameData)) {
      dispatch({ type: 'SAVE_SCORE', payload: gameData });
    }
    dispatch({ type: 'COMPLETE_GAME' });

    setCurrentGameTimestamp(timestamp); // Set current game timestamp for highlighting
  }, [state]);

  // Handle answer submission
  const handleAnswer = (isCorrect) => {
    if (isCorrect) {
      dispatch({ type: 'INCREMENT_SCORE' });
    } else {
      dispatch({ type: 'DECREMENT_SCORE' });
    }
    dispatch({ type: 'REMOVE_SUM' });

    // Complete game if no sums remain
    if (state.sums.length <= 1) {
      completeGame();
    }
  };

  // Restart game
  const restartGame = () => {
    stopTimer();
    dispatch({ type: 'RESTART_GAME' });
    setCurrentGameTimestamp(null); // Reset current game timestamp
    startTimer();
  };

  // Complete game if timer reaches 0
  useEffect(() => {
    if (state.timer <= 0) {
      completeGame();
    }
  }, [state.timer, completeGame]);

  return (
    <div id="app-container" className="container-fluid p-0">
      {/* Navbar */}
      <Navbar bg="primary" data-bs-theme="dark">
      <Container>
          <Navbar.Brand href="#home">144 Game</Navbar.Brand>
          <Button onClick={restartGame} variant="outline-light">Restart Game</Button>
        </Container>
      </Navbar>

      {/* Main Game or Result Display */}
      {state.completed ? (
        <Container className="text-center">
          <Result
            score={state.score}
            timeTaken={config.timeAllowed - state.timer}
            onRestart={restartGame}
            allScores={state.allScores}
            currentGameTimestamp={currentGameTimestamp} // Pass the timestamp to Result
          />
        </Container>
      ) : (
        <div className="container text-center">
          <Score id="score-display" timer={state.timer} score={state.score} />
          {state.sums.length > 0 ? (
            <SumDisplay id="sum-display" sum={state.sums[0]} onAnswer={handleAnswer} />
          ) : (
            <p id="loading-message">Loading...</p>
          )}
        </div>
      )}
    </div>
  );
};

export default App;
