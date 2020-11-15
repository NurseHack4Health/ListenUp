import "./styles.css";

import { tap, switchMap, zip } from "rxjs/operators";

import { from, of, interval } from "rxjs";

// import { BehaviorSubject } from "rxjs";

import axios from "axios";

export function textToAsl(phrase$) {
  return phrase$.pipe(
    // tap((phrase) => (document.getElementById("text").innerHTML = phrase)),
    switchMap((phrase) => {
      if (!phrase) return from([]);
      // gifEl.current.src = "https://i.stack.imgur.com/h6viz.gif";

      // https://mindrocketsinc.com/api/Dic/en/sarah/Deaf.gif
      return from(
        axios.get(
          `https://mindrocketsinc.com/api/getSignedWords.aspx?r=${phrase
            .split(" ")
            .join(
              "+"
            )}&av=sarah&lang=en&icmp=false&cmpcnt=193722&c=10124&u=http%3A%2F%2Fmindrocketsinc.com%2F`
        )
      );
    }),
    switchMap((results) =>
      from(results.data.concat([null])).pipe(zip(interval(1000), (a, b) => a))
    ),
    // switchMap((results) => from(results.data)),

    // delay(5000),
    // zip(interval(2000), (a, b) => a),
    tap((data) => console.log(data)),
    switchMap(
      (d) => {
        if (!d) {
          return of(null);
        }

        return from(
          axios
            .get(
              "https://mindrocketsinc.com/api" + d.URL.slice(1, d.URL.length),
              {
                responseType: "arraybuffer"
              }
            )
            .then((response) => {
              return {
                word: d.NewWord,
                gif: Buffer.from(response.data, "binary").toString("base64")
              };
            })
        );
      }

      // console.log(response)
    )
    // map((response) => Buffer.from(response.data, "binary").toString("base64"))
  );
}

