import './styles.css';

import { recognizer } from './speech-to-text';

import { textToAsl } from './text-to-asl';

import { scan } from 'rxjs/operators';

import staticAvatar from './avatar.png';

import React, { useState } from 'react';

export default function App() {
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
