import './styles.css';

import { recognizer } from './speech-to-text';

import { textToAsl } from './text-to-asl';

let subscriber;

document.getElementById('startRecognizer').onclick = function () {
	recognizer.startRecognizer();
	// document.getElementById("status").innerHTML = "Status: running";
	// recognizer.recognized$.next("hello world");
	document.getElementById('stopRecognizer').classList.remove('d-none');
	document.getElementById('startRecognizer').classList.add('d-none');

	// const option = document.getElementById("option").value;
	// console.log(option);

	// if (option === "text") {
	if (document.getElementById('text').checked) {
		let gifEl = document.getElementById('gifEl');
		gifEl.classList.add("static");
		subscriber = recognizer.recognized$.subscribe(
			(phrase) => {
				console.log(`phrase: ${phrase}`);
				var phraseEl = document.createElement('div');
				phraseEl.innerText = phrase; // Create a <li> node
				var textEl = document
					.getElementById('results')
					.prepend(phraseEl);
			},
			(error) => {
				console.log(error);
			},
			() => {
				console.log('complete');
			}
		);
		// } else if (option === "asl") {
	} else if (document.getElementById('asl').checked) {
    gifEl.classList.remove("static");
		subscriber = textToAsl(recognizer.recognized$).subscribe(
			(data) => {
				if (data) {
					let gifEl = document.getElementById('gifEl');
					gifEl.src = `data:image/png;base64, ${data.gif}`;
					document.getElementById('results').innerHTML = data.word;
				} else {
					let gifEl = document.getElementById('gifEl');
					gifEl.src = '';
					document.getElementById('teresultsxt').innerHTML = '';
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
};

document.getElementById('stopRecognizer').onclick = function () {
	recognizer.stopRecognizer();
	subscriber.unsubscribe();
	document.getElementById('stopRecognizer').classList.add('d-none');
	document.getElementById('startRecognizer').classList.remove('d-none');
	// document.getElementById("status").innerHTML = "Status: stopped";
};
