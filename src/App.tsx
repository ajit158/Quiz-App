import React, { useState } from "react";
import "./App.css";
import QuestionCard from "./components/QuestionCard";
import { QuestionState, Difficulty, fetchQuizQuestions } from "./Api";

export type AnswerObject = {
  question: string;
  answer: string;
  correct: boolean;
  correctAnswer: string;
};
function App(){
  //States
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<QuestionState[]>([]);
  const [number, setNumber] = useState(0);
  const [userAnswers, setUserAnswers] = useState<AnswerObject[]>([]);
  const [score, setScore] = useState(0);
  const [gameover, setGameover] = useState(true);

  const startTrivia = async () => {
    setLoading(true);
    setGameover(false);

    const newQuestions = await fetchQuizQuestions(10, Difficulty.EASY);

    setQuestions(newQuestions);
    setScore(0);
    setUserAnswers([]);
    setNumber(0);
    setLoading(false);
  };

  const checkAnswer = (e: any) => {
    if (!gameover) {
      // User's answer
      const answer = e.currentTarget.value;
      // Check answer against correct answer
      const correct = questions[number].correct_answer === answer;
      // Add score if answer is correct
      if (correct) setScore((prev) => prev + 1);
      // Save the answer in the array for user answers
      const answerObject = {
        question: questions[number].question,
        answer,
        correct,
        correctAnswer: questions[number].correct_answer,
      };
      setUserAnswers((prev) => [...prev, answerObject]);
    }
  };

  const nextQuestion = () => {
    //Move to next Questions
    const nextQuestion = number + 1;

    if (nextQuestion === 10) {
      setGameover(true);
    } else {
      setNumber(nextQuestion);
    }
  };

  return (
    <div className="App">
      <h1>React Quiz</h1>
      {gameover || userAnswers.length === 10 ? (
        <button className="start" onClick={startTrivia}>
          Start
        </button>
      ) : null}
      {!gameover ? <p className="score">Score :{score}</p> : null}
      {loading && <p>Loading Questions...</p>}

      {!loading && !gameover && (
        <QuestionCard
          questionNr={number + 1}
          totalQuestions={10}
          question={questions[number].question}
          answers={questions[number].answers}
          userAnswer={userAnswers ? userAnswers[number] : undefined}
          callback={checkAnswer}
        />
      )}
      {!gameover &&
      !loading &&
      userAnswers.length === number + 1 &&
      number !== 9 ? (
        <button className="next" onClick={nextQuestion}>
          Next Question
        </button>
      ) : null}
    </div>
  );
}

export default App;
