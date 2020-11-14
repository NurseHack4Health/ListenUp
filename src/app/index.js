import "./styles.css";

import { recognizer } from "./speech-to-text";

import { textToAsl } from "./text-to-asl";

let subscriber;

document.getElementById("startRecognizer").onclick = function () {
  recognizer.startRecognizer();
  document.getElementById("status").innerHTML = "Status: running";
  // recognizer.recognized$.next("hello world");

  const option = document.getElementById("option").value;
  console.log(option);

  if (option === "text") {
    subscriber = recognizer.recognized$.subscribe(
      (phrase) => {
        var phraseEl = document.createElement("div");
        phraseEl.innerText = phrase; // Create a <li> node
        document.getElementById("text").appendChild(phraseEl);
      },
      (error) => {
        console.log(error);
      },
      () => {
        console.log("complete");
      }
    );
  } else if (option === "asl") {
    subscriber = textToAsl(recognizer.recognized$).subscribe(
      (data) => {
        if (data) {
          let gifEl = document.getElementById("gifEl");
          gifEl.src = `data:image/png;base64, ${data.gif}`;
          document.getElementById("text").innerHTML = data.word;
        } else {
          let gifEl = document.getElementById("gifEl");
          gifEl.src = "";
          document.getElementById("text").innerHTML = "";
        }
      },
      (error) => {
        console.log(error);
      },
      () => {
        console.log("complete");
      }
    );
  }
};

document.getElementById("stopRecognizer").onclick = function () {
  recognizer.stopRecognizer();
  subscriber.unsubscribe();
  document.getElementById("status").innerHTML = "Status: stopped";
};
