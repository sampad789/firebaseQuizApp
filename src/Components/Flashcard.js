import React, { useState, useRef, useEffect } from "react";
import firebase from "firebase";
import { useAlert } from "react-alert";
export default function Flashcard({ flashcard, score }) {
  const [flip, setFlip] = useState(false);
  // Set the state for the button color to change if answer is wrong
  const [color, setColor] = useState(true);
  const db = firebase.database();

  //initial i.e default value set
  const [height, setHeight] = useState("initial");
  const frontEl = useRef();
  const backEl = useRef();

  //Set the height of the container relevant to the content
  const setMaxHeight = () => {
    const frontHeight = frontEl.current.getBoundingClientRect().height;
    const backHeight = backEl.current.getBoundingClientRect().height;
    setHeight(Math.max(frontHeight, backHeight, 100));
  };

  const alert = useAlert();

  useEffect(setMaxHeight, [
    flashcard.question,
    flashcard.options,
    flashcard.answer,
  ]);

  useEffect(() => {
    window.addEventListener("resize", setMaxHeight);
    return () => window.addEventListener("resize", setMaxHeight);
  }, []);

  const getCorrectanswer = (option) => {
    if (option === flashcard.answer) {
      setFlip(!flip);
      alert.success("Correct!!");
      db.ref("/").update({
        score: score + 1,
      });

      // Question can be answered multiple times
      /*  const timer = setTimeout(() => {
        setFlip(flip);
      }, 3000);
      return () => clearTimeout(timer);*/
    } else {
      setColor(false);
      db.ref("/").update({
        score: 0,
      });
      alert.error(`Incorrect !! Game restarts in 5 seconds`);

      //Set 5 second timeout before the game restarts
      const timer = setTimeout(() => {
        window.location.reload(true);
      }, 5000);
      return () => clearTimeout(timer);
    }
  };

  /*useEffect(() => {
    var ref = db.ref("/score");
    ref.on("value", (snapshot) => {
      let currentScore = snapshot.val();
      let alltimehighScore = 0;

      if (currentScore > alltimehighScore) {
        let alltimehighScore = currentScore;
        db.ref("/").update({
          highScore: alltimehighScore,
        });
      }
    });
  }, []);*/

  return (
    <div className={`card ${flip ? "flip" : ""}`} style={{ height: height }}>
      <div className="front" ref={frontEl}>
        {flashcard.question}
        <div className="flashcard-options">
          {flashcard.options.map((option) => {
            return (
              <button
                key={option}
                className={
                  color ? "flashcard-option-true" : "flashcard-option-false"
                }
                onClick={() => getCorrectanswer(option)}
              >
                {option}
              </button>
            );
          })}
        </div>
      </div>
      <div className="back" ref={backEl}>
        <p>"Corrrect answer" : {flashcard.answer}</p>
      </div>
    </div>
  );
}
