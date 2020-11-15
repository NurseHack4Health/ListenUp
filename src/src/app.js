import "./styles.css";
import Layout from "./Layout";

import { recognizer } from "./speech-to-text";

import { textToAsl } from "./text-to-asl";

import { scan } from "rxjs/operators";

import staticAvatar from "./avatar_hq.jpg";

import React, { useState } from "react";

export default function App() {
  const [option, setOption] = useState("text");
  const [phrases, setPhrases] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [gifSrc, setGifSrc] = useState(staticAvatar);
  const [subscriber, setSubscriber] = useState();

  function startRecognizer() {
    recognizer.startRecognizer();
    setIsRunning(true);

    console.log(option);

    if (option === "text") {
      setGifSrc(staticAvatar);
      setSubscriber(
        recognizer.recognized$
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
              console.log("complete");
            }
          )
      );
    } else if (option === "asl") {
      setSubscriber(
        textToAsl(recognizer.recognized$).subscribe(
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
            console.log("complete");
          }
        )
      );
    }
  }

  function stopRecognizer() {
    recognizer.stopRecognizer();
    if (subscriber) {
      subscriber.unsubscribe();
    }

    setIsRunning(false);
  }

  return (
    <Layout>
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6 flex justify-center">
          <div className="row">
            <div className="avatar-wrapper rounded-lg mr-0 md:mr-4">
              <img id="gifEl" src={gifSrc} alt="interpreter avatar" />
            </div>
            <div className="results-wrapper bg-gray-100 overflow-hidden rounded-lg text-gray-900 mt-4 md:mt-0">
              <div class="px-4 py-5 sm:p-6">
                {!phrases.length && "Translation will appear here."}
                {phrases.map((phrase, index) => (
                  <div key={index}>{phrase.toString()}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div class="border-t border-gray-200 px-4 py-4 sm:px-6">
          <fieldset>
            <legend class="text-base leading-6 font-medium text-gray-900">
              Translation Options
            </legend>
            <p class="text-sm leading-5 text-gray-500">
              Choose how you would like to communicate.
            </p>
            <div class="mt-4">
              <div class="flex items-center">
                <input
                  type="radio"
                  name="options"
                  id="text"
                  value="text"
                  autoComplete="off"
                  checked={option === "text"}
                  onChange={(e) => setOption(e.target.value)}
                  type="radio"
                  class="form-radio h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                />
                <label for="text" class="ml-3">
                  <span class="block text-sm leading-5 font-medium text-gray-700">
                    Speech to Text
                  </span>
                </label>
              </div>
              <div class="mt-4 flex items-center">
                <input
                  type="radio"
                  name="options"
                  id="asl"
                  value="asl"
                  autoComplete="off"
                  checked={option === "asl"}
                  onChange={(e) => setOption(e.target.value)}
                  class="form-radio h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                />
                <label for="asl" class="ml-3">
                  <span class="block text-sm leading-5 font-medium text-gray-700">
                    Speech to ASL
                  </span>
                </label>
              </div>
            </div>
          </fieldset>
          <div class="mt-8 border-t border-gray-200 pt-5">
            <div class="flex justify-end">
              <div>
                <span class="inline-flex rounded-md shadow-sm">
                  <button
                    type="button"
                    onClick={startRecognizer}
                    class={`${
                      isRunning && "hidden"
                    } inline-flex items-center px-6 py-3 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition ease-in-out duration-150`}
                  >
                    Start Koko
                  </button>
                </span>

                <span class="inline-flex rounded-md shadow-sm">
                  <button
                    type="button"
                    onClick={stopRecognizer}
                    class={`${
                      !isRunning && "hidden"
                    } inline-flex items-center px-6 py-3 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition ease-in-out duration-150`}
                  >
                    Stop Koko
                  </button>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
