// import sdk from "microsoft-cognitiveservices-speech-sdk";
// var sdk = require("microsoft-cognitiveservices-speech-sdk");
import "microsoft-cognitiveservices-speech-sdk/distrib/browser/microsoft.cognitiveservices.speech.sdk.bundle.js";

import { BehaviorSubject } from "rxjs";

const sdk = SpeechSDK;

console.log("test");
//todo: remove hardcoded key
// const speechConfig = sdk.SpeechConfig.fromSubscription(
//   "a5392ce2e83149ed8da63d0e0d9441d7",
//   "northcentralus"
// );

const speechConfig = sdk.SpeechConfig.fromSubscription(
  "22cfa769a87240e28a9bb026821d790f",
  "eastus"
);

//22cfa769a87240e28a9bb026821d790f

let audioConfig = sdk.AudioConfig.fromDefaultMicrophoneInput();
let recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);

// let lastRecognized = '';

// //create observable that emits click events
// const recognizingEvent$ = fromEvent(recognizer, "recognizing");
// //map to string with given event timestamp
// const recognizing$ = recognizingEvent$.pipe(
//   map((s, e) => {
//     console.log(`RECOGNIZING: Text=${e.result.text}`);
//     // console.log(e);
//     // recognized.innerHTML = lastRecognized + e.result.text;
//     return e.result.text;
//   })
// );

const recognizing$ = new BehaviorSubject("");

recognizer.recognizing = (s, e) => {
  console.log(`RECOGNIZING: Text=${e.result.text}`);
  recognizing$.next(e.result.text);
};

// const recognizedEvent$ = fromEvent(recognizer, "recognized");
// //map to string with given event timestamp
// const recognized$ = recognizedEvent$.pipe(
//   map((s, e) => {
//     if (e.result.reason == sdk.ResultReason.RecognizedSpeech) {
//       console.log(`RECOGNIZED: Text=${e.result.text}`);
//       // lastRecognized += e.result.text + '<br/>';
//       // console.log(lastRecognized);
//       // recognized.innerHTML = lastRecognized;
//       // if (recognizedCallback) {
//       //   recognizingCallback(e.result.text);
//       // }
//       return e.result.text;
//     } else if (e.result.reason == sdk.ResultReason.NoMatch) {
//       console.log("NOMATCH: Speech could not be recognized.");
//     }
//   })
// );

const recognized$ = new BehaviorSubject("");

recognizer.recognized = (s, e) => {
  if (e.result.reason == sdk.ResultReason.RecognizedSpeech) {
    console.log(`RECOGNIZED: Text=${e.result.text}`);
    // lastRecognized += e.result.text + '<br/>';
    // console.log(lastRecognized);
    // recognized.innerHTML = lastRecognized;
    // if (recognizedCallback) {
    //   recognizingCallback(e.result.text);
    // }
    recognized$.next(e.result.text);
  } else if (e.result.reason == sdk.ResultReason.NoMatch) {
    console.log("NOMATCH: Speech could not be recognized.");
  }
};

recognizer.speechEndDetected = (s, e) => {
  console.log("speech ended");
};

recognizer.canceled = (s, e) => {
  console.log(`CANCELED: Reason=${e.reason}`);

  if (e.reason == sdk.CancellationReason.Error) {
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
