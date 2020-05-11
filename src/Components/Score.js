import React from "react";

const Score = ({ initialScore, highScore }) => {
  return (
    <div id="navbar">
      <p>React & Firebase Quiz App</p>
      <span>
        Current Score : {""} {initialScore}
      </span>
      <span>
        All time HighScore : {""}
        {highScore}
      </span>
    </div>
  );
};

export default Score;
