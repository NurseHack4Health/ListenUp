import "./styles.css";

import { recognizer } from "./speech-to-text";

import { textToAsl } from "./text-to-asl";

import { tap, switchMap, zip } from "rxjs/operators";

import { from, of, interval } from "rxjs";

import axios from "axios";

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

// recognizer.recognized$.subscribe((phrase) => {
//   textToAsl.aslSubject$.next(phrase);
// });

// recognizer.recognized$
//   .pipe(
//     // tap((phrase) => (document.getElementById("text").innerHTML = phrase)),
//     switchMap((phrase) => {
//       if (!phrase) return from([]);
//       // gifEl.current.src = "https://i.stack.imgur.com/h6viz.gif";

//       // https://mindrocketsinc.com/api/Dic/en/sarah/Deaf.gif
//       return from(
//         axios.get(
//           `https://mindrocketsinc.com/api/getSignedWords.aspx?r=${phrase
//             .split(" ")
//             .join(
//               "+"
//             )}&av=sarah&lang=en&icmp=false&cmpcnt=193722&c=10124&u=http%3A%2F%2Fmindrocketsinc.com%2F`
//         )
//       );
//     }),
//     switchMap((results) =>
//       from(results.data.concat([null])).pipe(zip(interval(1000), (a, b) => a))
//     ),
//     // switchMap((results) => from(results.data)),

//     // delay(5000),
//     // zip(interval(2000), (a, b) => a),
//     tap((data) => console.log(data)),
//     switchMap(
//       (d) => {
//         if (!d) {
//           return of(null);
//         }

//         return from(
//           axios
//             .get(
//               "https://mindrocketsinc.com/api" + d.URL.slice(1, d.URL.length),
//               {
//                 responseType: "arraybuffer"
//               }
//             )
//             .then((response) => {
//               return {
//                 word: d.NewWord,
//                 gif: Buffer.from(response.data, "binary").toString("base64")
//               };
//             })
//         );
//       }

//       // console.log(response)
//     )
//     // map((response) => Buffer.from(response.data, "binary").toString("base64"))
//   )
//   .subscribe(
//     (data) => {
//       if (data) {
//         let gifEl = document.getElementById("gifEl");
//         gifEl.src = `data:image/png;base64, ${data.gif}`;
//         document.getElementById("text").innerHTML = data.word;
//       } else {
//         let gifEl = document.getElementById("gifEl");
//         gifEl.src = "";
//         document.getElementById("text").innerHTML = "";
//       }

//       //   wordEl.current.innerText = r.data[window.gifI].NewWord;
//       //   window.gifI += 1;
//       //   if (window.repeat < 3 && !gifs[window.gifI]) {
//       //     window.gifI = 0;
//       //     window.repeat += 1;
//       //   }
//       //   if (!gifs[window.gifI]) {
//       //     window.gifI = 0;
//       //     clearInterval(window.gifReplaceInterval);
//       //     gifEl.current.src = "";
//       //     wordEl.current.innerText = "";
//       //   }
//       // console.log(text)
//     },
//     (error) => {
//       console.log(error);
//     },
//     () => {
//       console.log("complete");
//     }
//   );
