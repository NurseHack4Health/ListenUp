import './styles.css';

import { recognizer } from './speech-to-text';

import { textToAsl } from './text-to-asl';

import { scan } from 'rxjs/operators';

import staticAvatar from './avatar.png';

import React, { useState } from 'react';

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
  const [subscriber, setSubscriber] = useState();

	function startRecognizer() {
		recognizer.startRecognizer();
		setIsRunning(true);

		console.log(option);

		if (option === 'text') {
			setGifSrc(staticAvatar);
			setSubscriber(recognizer.recognized$
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
				));
		} else if (option === 'asl') {

			setSubscriber(textToAsl(recognizer.recognized$).subscribe(
				(data) => {
					if (data) {
						setGifSrc(`data:image/png;base64, ${data.gif}`);
						setPhrases([data.word]);
					} else {
						setGifSrc(staticAvatar);
						setPhrases([]);
					}
				},
				(error) => {
					console.log(error);
				},
				() => {
					console.log('complete');
				}
			));
		}
	}

	function stopRecognizer() {
    recognizer.stopRecognizer();
    if(subscriber) {
      subscriber.unsubscribe();
    }
		
		setIsRunning(false);
	}

	return (
		<div>
			<h1><img src="logo.png" class="logo" alt="Koko logo"></img>Koko</h1>
			<div className="row">
				<div className="avatar-wrapper">
					<img id="gifEl" src={gifSrc} alt="interpreter avatar" />
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
          onClick={stopRecognizer}
					className={isRunning ? null : 'hidden'}
				>
					Stop Recognizer
				</button>
			</div>
		</div>
	);
}
