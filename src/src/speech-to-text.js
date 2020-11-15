import "microsoft-cognitiveservices-speech-sdk/distrib/browser/microsoft.cognitiveservices.speech.sdk.bundle.js";

import { BehaviorSubject } from "rxjs";

const sdk = window.SpeechSDK;

 //todo: add key
const speechConfig = sdk.SpeechConfig.fromSubscription(

 "22cfa769a87240e28a9bb026821d790f",
  "eastus"
);

let audioConfig = sdk.AudioConfig.fromDefaultMicrophoneInput();
let recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);

const recognizing$ = new BehaviorSubject("");

recognizer.recognizing = (s, e) => {
  console.log(`RECOGNIZING: Text=${e.result.text}`);
  recognizing$.next(e.result.text);
};


const recognized$ = new BehaviorSubject("");

recognizer.recognized = (s, e) => {
  if (e.result.reason === sdk.ResultReason.RecognizedSpeech) {
    console.log(`RECOGNIZED: Text=${e.result.text}`);
    recognized$.next(e.result.text);
  } else if (e.result.reason === sdk.ResultReason.NoMatch) {
    console.log("NOMATCH: Speech could not be recognized.");
  }
};

recognizer.speechEndDetected = (s, e) => {
  console.log("speech ended");
};

recognizer.canceled = (s, e) => {
  console.log(`CANCELED: Reason=${e.reason}`);

  if (e.reason === sdk.CancellationReason.Error) {
    console.log(`"CANCELED: ErrorCode=${e.errorCode}`);
    console.log(`"CANCELED: ErrorDetails=${e.errorDetails}`);
    console.log("CANCELED: Did you update the subscription info?");
  }

  recognizer.stopContinuousRecognitionAsync();
};

recognizer.sessionStopped = (s, e) => {
  console.log("\n    Session stopped event.");
  recognizer.stopContinuousRecognitionAsync();
};

function startRecognizer(recognizing, recognized) {
  console.log("STARTED");
  recognizer.startContinuousRecognitionAsync();
}

function stopRecognizer() {
  console.log("STOPPED");
  recognizer.stopContinuousRecognitionAsync();
}

const recognizerApp = {
  startRecognizer,
  stopRecognizer,
  recognizing$,
  recognized$
};

export { recognizerApp as recognizer };
