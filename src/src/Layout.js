import React, { useState, useEffect, useRef } from "react";

const Modal = ({ setShowSignUp, showSignUp }) => {
  const [email, setEmail] = useState("");

  function useOutsideAlerterSign(ref) {
    useEffect(() => {
      /**
       * Alert if clicked on outside of element
       */
      function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target)) {
          setShowSignUp(false);
        }
      }

      // Bind the event listener
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  }

  const signUpRef = useRef(null);
  useOutsideAlerterSign(signUpRef);

  return (
    <div
      class={`fixed z-10 inset-0 overflow-y-auto items-center justify-center ${
        showSignUp ? "visible" : "invisible"
      }`}
    >
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* <!--
          Background overlay, show/hide based on modal state.

          Entering: "ease-out duration-300"
            From: "opacity-0"
            To: "opacity-100"
          Leaving: "ease-in duration-200"
            From: "opacity-100"
            To: "opacity-0"
        --> */}
        <div
          class={`fixed inset-0 transition-opacity ${
            showSignUp ? "opacity-100" : "opacity-0"
          } ease-in duration-200`}
        >
          <div class="absolute inset-0 bg-white opacity-75"></div>
        </div>
        {/* <!-- This element is to trick the browser into centering the modal contents. --> */}
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen"></span>
        &#8203;
        {/* <!--
          Modal panel, show/hide based on modal state.

          Entering: "ease-out duration-300"
            From: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            To: "opacity-100 translate-y-0 sm:scale-100"
          Leaving: "ease-in duration-200"
            From: "opacity-100 translate-y-0 sm:scale-100"
            To: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        --> */}
        <div
          ref={signUpRef}
          class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-xl sm:w-full sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-headline"
        >
          <div>
            <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full">
              {/* <!-- Heroicon name: check --> */}
              {/* <svg class="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg> */}
              <img src="logo3.png" />
            </div>
            <div class="mt-3 text-center sm:mt-5">
              <h3
                class="text-xl3 leading-6 font-medium text-gray-900"
                id="modal-headline"
                style={{ marginTop: "1.5rem" }}
              >
                Sign up for our newsletter
              </h3>

              {/* <span class="text-xl2 font-serif">Get the best of <i>Symposeum</i> delivered to your inbox.</span> */}
              <span class="text-xl2 font-serif">
                {/* In print quarterly, in your inbox monthly. */}
              </span>

              <div id="mc_embed_signup">
                <form
                  onSubmit={async () => {
                    await new Promise((r) => setTimeout(r, 300));
                    setShowSignUp(false);
                  }}
                  action="https://azureedge.us7.list-manage.com/subscribe/post?u=756e70319105eee9be4b7ca0c&amp;id=e8bc33ca1b"
                  method="post"
                  id="mc-embedded-subscribe-form"
                  name="mc-embedded-subscribe-form"
                  class="validate"
                  target="_blank"
                  novalidate
                >
                  <div id="mc_embed_signup_scroll">
                    <div class="mc-field-group">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        name="EMAIL"
                        class="text-lg required email appearance-none w-full px-5 py-3 border border-gray-300 text-base leading-6 rounded-md text-gray-900 bg-white placeholder-gray-500 focus:outline-none focus:shadow-outline focus:border-blue-300 transition duration-150 ease-in-out mt-6"
                        id="mce-EMAIL"
                        placeholder="Enter your email"
                      />
                    </div>
                    <div id="mce-responses" class="clear">
                      <div
                        class="response"
                        id="mce-error-response"
                        style={{ display: "none" }}
                      ></div>
                      <div
                        class="response"
                        id="mce-success-response"
                        style={{ display: "none" }}
                      ></div>
                    </div>
                    <div
                      style={{ position: "absolute", left: "-5000px" }}
                      aria-hidden="true"
                    >
                      <input
                        type="text"
                        name="b_29dfec4fae1d92e0a332c9acd_cda8a9e1ac"
                        tabindex="-1"
                        value=""
                      />
                    </div>
                    <button
                      type="submit"
                      value="Subscribe"
                      name="subscribe"
                      id="mc-embedded-subscribe"
                      class="text-lg w-full flex items-center justify-center px-5 py-3 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:shadow-outline transition duration-150 ease-in-out mt-8"
                    >
                      Sign up
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Layout = ({ children }) => {
  const [showSignUp, setShowSignUp] = useState(false);

  return (
    <div class="min-h-screen bg-white">
      <nav class="bg-white border-b border-gray-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-16">
            <div class="flex w-full h-full items-center justify-center">
              <div class="flex items-center justify-center flex-row">
                <div>
                  <img src="logo3.png" class="logo" alt="Koko logo"></img>
                </div>
                <div>
                  <h1 class="text-gray-900 hover:text-gray-400 font-black">
                    Koko
                  </h1>
                </div>
              </div>
            </div>
            <div
              style={{ position: "absolute", right: "1rem" }}
              className="email h-16 flex"
            >
              <div
                className="flex items-center justify-center"
                style={{ height: "100%" }}
              >
                <a
                  onClick={() => setShowSignUp(true)}
                  href="#"
                  class="px-3 py-2 rounded-md text-md leading-5 font-medium text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none transition duration-150 ease-in-out transition duration-150 ease-in-out"
                  style={{ color: "rgb(153, 153, 153)" }}
                >
                  Email Newsletter
                </a>
              </div>
            </div>
          </div>
        </div>
        {/* 
    <!--
      Mobile menu, toggle classes based on menu state.

      Open: "block", closed: "hidden"
    --> */}
        <div class="hidden sm:hidden">
          <div class="pt-2 pb-3 space-y-1">
            <a
              href="#"
              class="block pl-3 pr-4 py-2 border-l-4 border-indigo-500 text-base font-medium text-indigo-700 bg-indigo-50 focus:outline-none focus:text-indigo-800 focus:bg-indigo-100 focus:border-indigo-700 transition duration-150 ease-in-out"
            >
              Dashboard
            </a>

            <a
              href="#"
              class="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:text-gray-800 focus:bg-gray-50 focus:border-gray-300 transition duration-150 ease-in-out"
            >
              Team
            </a>

            <a
              href="#"
              class="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:text-gray-800 focus:bg-gray-50 focus:border-gray-300 transition duration-150 ease-in-out"
            >
              Projects
            </a>

            <a
              href="#"
              class="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:text-gray-800 focus:bg-gray-50 focus:border-gray-300 transition duration-150 ease-in-out"
            >
              Calendar
            </a>
          </div>
          <div class="pt-4 pb-3 border-t border-gray-200">
            <div class="flex items-center px-4 space-x-3">
              <div class="flex-shrink-0">
                <img
                  class="h-10 w-10 rounded-full"
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt=""
                />
              </div>
              <div>
                <div class="text-base font-medium leading-6 text-gray-800">
                  Tom Cook
                </div>
                <div class="text-sm font-medium leading-5 text-gray-500">
                  tom@example.com
                </div>
              </div>
            </div>
            <div
              class="mt-3 space-y-1"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="user-menu"
            >
              <a
                href="#"
                class="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100 focus:outline-none focus:text-gray-800 focus:bg-gray-100 transition duration-150 ease-in-out"
                role="menuitem"
              >
                Your Profile
              </a>

              <a
                href="#"
                class="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100 focus:outline-none focus:text-gray-800 focus:bg-gray-100 transition duration-150 ease-in-out"
                role="menuitem"
              >
                Settings
              </a>

              <a
                href="#"
                class="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100 focus:outline-none focus:text-gray-800 focus:bg-gray-100 transition duration-150 ease-in-out"
                role="menuitem"
              >
                Sign out
              </a>
            </div>
          </div>
        </div>
      </nav>

      <div class="bg-gray-200 rounded-lg min-h-screen">
        <div class="py-10">
          <header>
            {/* <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 class="text-3xl font-bold leading-tight text-gray-900">
          Dashboard
        </h1>
      </div> */}
          </header>
          <main>
            <div class="max-w-4xl mx-auto sm:px-6 lg:px-8">
              {/* <!-- Replace with your content --> */}
              {/* <div class="px-4 py-8 sm:px-0">
          <div class="border-4 border-dashed border-gray-200 rounded-lg h-96"></div>
        </div> */}
              {children}
              {/* <!-- /End replace --> */}
            </div>
          </main>
        </div>
      </div>
      {showSignUp && (
        <div>
          <Modal showSignUp={showSignUp} setShowSignUp={setShowSignUp} />
        </div>
      )}
    </div>
  );
};

export default Layout;
