import './styles.css';

import { recognizer } from './speech-to-text';

import { textToAsl } from './text-to-asl';

import { scan } from 'rxjs/operators';

import staticAvatar from './avatar.png';

import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';

// let subscriber;

// document.getElementById('startRecognizer').onclick = function () {
// 	recognizer.startRecognizer();
// 	// document.getElementById("status").innerHTML = "Status: running";
// 	// recognizer.recognized$.next("hello world");
// 	document.getElementById('stopRecognizer').classList.remove('hidden');
// 	document.getElementById('startRecognizer').classList.add('hidden');

// 	// const option = document.getElementById("option").value;
// 	// console.log(option);

// 	// if (option === "text") {
// 	if (document.getElementById('text').checked) {
// 		let gifEl = document.getElementById('gifEl');
// 		gifEl.classList.add("static");
// 		subscriber = recognizer.recognized$.subscribe(
// 			(phrase) => {
// 				console.log(`phrase: ${phrase}`);
// 				var phraseEl = document.createElement('div');
// 				phraseEl.innerText = phrase; // Create a <li> node
// 				var textEl = document
// 					.getElementById('results')
// 					.prepend(phraseEl);
// 			},
// 			(error) => {
// 				console.log(error);
// 			},
// 			() => {
// 				console.log('complete');
// 			}
// 		);
// 		// } else if (option === "asl") {
// 	} else if (document.getElementById('asl').checked) {
//     gifEl.classList.remove("static");
// 		subscriber = textToAsl(recognizer.recognized$).subscribe(
// 			(data) => {
// 				if (data) {
// 					let gifEl = document.getElementById('gifEl');
// 					gifEl.src = `data:image/png;base64, ${data.gif}`;
// 					document.getElementById('results').innerHTML = data.word;
// 				} else {
// 					let gifEl = document.getElementById('gifEl');
// 					gifEl.src = '';
// 					document.getElementById('results').innerHTML = '';
// 				}
// 			},
// 			(error) => {
// 				console.log(error);
// 			},
// 			() => {
// 				console.log('complete');
// 			}
// 		);
// 	}
// };

// document.getElementById('stopRecognizer').onclick = function () {
// 	recognizer.stopRecognizer();
// 	subscriber.unsubscribe();
// 	document.getElementById('stopRecognizer').classList.add('hidden');
// 	document.getElementById('startRecognizer').classList.remove('hidden');
// 	// document.getElementById("status").innerHTML = "Status: stopped";
// };

// // Hook
// function useDebounce(value, delay) {
//   // State and setters for debounced value
//   const [debouncedValue, setDebouncedValue] = useState(value);

//   useEffect(
//     () => {
//       // Update debounced value after delay
//       const handler = setTimeout(() => {
//         setDebouncedValue(value);
//       }, delay);

//       // Cancel the timeout if value changes (also on delay change or unmount)
//       // This is how we prevent debounced value from updating if value is changed ...
//       // .. within the delay period. Timeout gets cleared and restarted.
//       return () => {
//         clearTimeout(handler);
//       };
//     },
//     [value, delay] // Only re-call effect if value or delay changes
//   );

//   return debouncedValue;
// }

// function sleep(ms) {
//   return new Promise((resolve) => setTimeout(resolve, ms));
// }

// window.gifReplaceInterval;
// window.gifI = 0;
// window.repeat = 0;

export default function App() {
	// const [phrase, setPhrase] = useState('');
	// const [result, setResult] = useState('');
	const [option, setOption] = useState('text');
	const [phrases, setPhrases] = useState([]);
	const [isRunning, setIsRunning] = useState(false);
	const [gifSrc, setGifSrc] = useState(staticAvatar);

	// const debouncedPhrase = useDebounce(phrase, 500);

	let subscriber;

	function startRecognizer() {
		recognizer.startRecognizer();
		// document.getElementById("status").innerHTML = "Status: running";
		// recognizer.recognized$.next("hello world");
		// document.getElementById('stopRecognizer').classList.remove('hidden');
		// document.getElementById('startRecognizer').classList.add('hidden');
		setIsRunning(true);

		// const option = document.getElementById("option").value;
		console.log(option);

		// if (option === "text") {
		if (option === 'text') {
			// let gifEl = document.getElementById('gifEl');
			// gifEl.classList.add('static');
			setGifSrc(staticAvatar);
			subscriber = recognizer.recognized$
				.pipe(scan((acc, current) => [current].concat(acc), []))
				.subscribe(
					(phrases) => {
						console.log(`phrases: ${phrases}`);
						setPhrases(phrases);
					},
					(error) => {
						console.log(error);
					},
					() => {
						console.log('complete');
					}
				);
			// } else if (option === "asl") {
		} else if (option === 'asl') {
			// gifEl.classList.remove('static');

			subscriber = textToAsl(recognizer.recognized$).subscribe(
				(data) => {
					if (data) {
						// let gifEl = document.getElementById('gifEl');
						// gifEl.src = `data:image/png;base64, ${data.gif}`;
						setGifSrc(`data:image/png;base64, ${data.gif}`);
						// document.getElementById('results').innerHTML =
						// 	data.word;
						setPhrases([data.word]);
					} else {
						// let gifEl = document.getElementById('gifEl');
						// gifEl.src = '';
						setGifSrc('');
						// document.getElementById('results').innerHTML = '';
						setPhrases([]);
					}
				},
				(error) => {
					console.log(error);
				},
				() => {
					console.log('complete');
				}
			);
		}
	}

	function stopRecognizer() {
		recognizer.stopRecognizer();
		subscriber.unsubscribe();
		setIsRunning(false);
		// document.getElementById("status").innerHTML = "Status: stopped";
	}

	//   const getResult = async () => {
	//     try {
	//       if (!phrase) return;
	//       gifEl.current.src = "https://i.stack.imgur.com/h6viz.gif";

	//       // https://mindrocketsinc.com/api/Dic/en/sarah/Deaf.gif
	//       const r = await axios.get(
	//         `https://mindrocketsinc.com/api/getSignedWords.aspx?r=${phrase
	//           .split(" ")
	//           .join(
	//             "+"
	//           )}&av=sarah&lang=en&icmp=false&cmpcnt=193722&c=10124&u=http%3A%2F%2Fmindrocketsinc.com%2F`
	//       );
	//       // console.log(r);

	//       const gifs = await Promise.all(
	//         r.data.map(async (d) => {
	//           const response = await axios.get(
	//             "https://mindrocketsinc.com/api" + d.URL.slice(1, d.URL.length),
	//             {
	//               responseType: "arraybuffer"
	//             }
	//           );
	//           // console.log(response)
	//           return Buffer.from(response.data, "binary").toString("base64");
	//         })
	//       );

	//       // for (let j = 0; j < 3; j++) {
	//       //   for (let i = 0; i < gifs.length; i++) {
	//       //     await sleep(1000);
	//       //     gifEl.current.src = `data:image/png;base64, ${gifs[i]}`;
	//       //     wordEl.current.innerText = r.data[i].NewWord;
	//       //   }
	//       // }

	//       window.gifReplaceInterval = setInterval(function () {
	//         gifEl.current.src = `data:image/png;base64, ${gifs[window.gifI]}`;
	//         wordEl.current.innerText = r.data[window.gifI].NewWord;
	//         window.gifI += 1;
	//         if (window.repeat < 3 && !gifs[window.gifI]) {
	//           window.gifI = 0;
	//           window.repeat += 1;
	//         }
	//         if (!gifs[window.gifI]) {
	//           window.gifI = 0;
	//           clearInterval(window.gifReplaceInterval);
	//           gifEl.current.src = "";
	//           wordEl.current.innerText = "";
	//         }
	//       }, 1000);
	//     } catch (err) {
	//       console.error(err);
	//     }
	//   };

	//   useEffect(() => {
	//     window.gifI = 0;
	//     window.repeat = 0;
	//     clearInterval(window.gifReplaceInterval);
	//     getResult();
	//   }, [debouncedPhrase]);

	return (
		<div>
			<h1>Koko</h1>
			<div className="row">
				<div className="avatar-wrapper">
					<img id="gifEl" src={gifSrc} />
				</div>
				<div className="results-wrapper">
					<div id="results">
						{phrases.map((phrase, index) => (
							<div key={index}>{phrase.toString()}</div>
						))}
					</div>
				</div>
			</div>

			<h2>Translation Option</h2>
			<div>
				<input
					type="radio"
					name="options"
					id="text"
					value="text"
					autoComplete="off"
					checked={option === 'text'}
					onChange={(e) => setOption(e.target.value)}
				/>

				<label htmlFor="text" className="option-button">
					Speech to Text
				</label>

				<input
					type="radio"
					name="options"
					id="asl"
					value="asl"
					autoComplete="off"
					checked={option === 'asl'}
					onChange={(e) => setOption(e.target.value)}
				/>
				<label htmlFor="asl" className="option-button">
					Speech to ASL
				</label>
			</div>

			<div className="control-buttons">
				<button
					id="startRecognizer"
					onClick={startRecognizer}
					className={isRunning ? 'hidden' : null}
				>
					Start Recognizer
				</button>
				<button
					id="stopRecognizer"
					className={isRunning ? null : 'hidden'}
				>
					Stop Recognizer
				</button>
			</div>
		</div>
	);
}
