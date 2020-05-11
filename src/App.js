import React, { useState, useEffect } from "react";
import FlashcardList from "./Components/FlashcardList";
import Score from "./Components/Score";
import "./app.css";
import decodeString from "./utils/decodeString";
import firebase from "firebase";
import firebaseConfig from "./utils/config";

function App() {
  const [flashcards, setFlashcards] = useState([]);
  const [highScore, sethighScore] = useState(0);
  const [initialScore, setinitialScore] = useState(0);
  //Initialize firebase
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
  const db = firebase.database();

  useEffect(() => {
    var ref = db.ref("/results");
    ref.on("value", (snapshot) => {
      let data = snapshot.val();
      setFlashcards(
        //Sort the data to get random question everytime
        data
          .sort(() => Math.random() - 0.5)
          .map((questionItem, index) => {
            const answer = decodeString(questionItem.correct_answer);
            const options = [
              ...questionItem.incorrect_answers.map((a) => decodeString(a)),
              answer,
            ];
            return {
              id: `${index}-${Date.now()}`,
              question: decodeString(questionItem.question),
              answer: answer,
              options: options.sort(() => Math.random() - 0.5),
            };
          })
      );
    });
  }, []);

  /* useEffect(() => {
    var ref = db.ref("/score");
    ref.on("value", (snapshot) => {
      let currentScore = snapshot.val();

      let alltimehighScore = 0;

      if (alltimehighScore < currentScore) {
        let alltimehighScore = currentScore;

        db.ref("/").update({
          highScore: alltimehighScore,
        });
        sethighScore(alltimehighScore);
      }
      console.log(Math.max(initialScore, currentScore));
    });
  }, []);
  */
  useEffect(() => {
    var ref = db.ref("/score");
    ref.on("value", (snapshot) => {
      let data = snapshot.val();
      setinitialScore(data);
    });
  }, []);
  useEffect(() => {
    var ref = db.ref("/highScore");
    ref.on("value", (snapshot) => {
      let data = snapshot.val();
      sethighScore(data);
    });
  }, []);

  return (
    <div>
      <Score initialScore={initialScore} highScore={highScore} />
      <div className="container">
        {" "}
        <FlashcardList flashcards={flashcards} />
      </div>
    </div>
  );
}

/*const SAMPLE_FLASHCARDS = [
  {
    id: 1,
    question: "What is 2+2",
    answer: "4",
    options: ["2", "3", "4", "5"],
  },
  {
    id: 2,
    question: "What is 2+3",
    answer: "5",
    options: ["2", "3", "4", "5"],
  },
  {
    id: 3,
    question: "What is 2+1",
    answer: "3",
    options: ["2", "3", "4", "5"],
  },
];
*/
export default App;
