import React, { useState, useEffect } from "react";
import Flashcard from "./Flashcard";
import firebase from "firebase";

export default function FlashcardList({ flashcards }) {
  const [score, setScore] = useState(0);
  const [highscore, setHighScore] = useState(0);
  //Initialize database
  const db = firebase.database();
  useEffect(() => {
    var ref = db.ref("/score");
    ref.on("value", (snapshot) => {
      let data = snapshot.val();
      setScore(data);
    });
  }, []);

  useEffect(() => {
    var ref = db.ref("/highScore");
    ref.on("value", (snapshot) => {
      let data = snapshot.val();
      setHighScore(data);
    });
  }, []);

  if (highscore < score) {
    db.ref("/").update({
      highScore: score,
    });
  }

  return (
    <div className="card-grid">
      {flashcards.map((flashcard) => {
        return (
          <Flashcard score={score} flashcard={flashcard} key={flashcard.id} />
        );
      })}
    </div>
  );
}
