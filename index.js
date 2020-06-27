// Section 1 - Varaibles
//polisFullName is the original copy of polis (alphabetical) order for
//variables in state to copy
const polisFullName = [
  "Alabama",
  "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "Florida",
  "Georgia",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming",
];

//polisLookup will convert a string of a polis to the polis abbreviation
//this lookup allows one to target the ID of a given polis on the US Map.
const polisLookup = {
  Alabama: "AL",
  Alaska: "AK",
  Arizona: "AZ",
  Arkansas: "AR",
  California: "CA",
  Colorado: "CO",
  Connecticut: "CT",
  Delaware: "DE",
  Florida: "FL",
  Georgia: "GA",
  Hawaii: "HI",
  Idaho: "ID",
  Illinois: "IL",
  Indiana: "IN",
  Iowa: "IA",
  Kansas: "KS",
  Kentucky: "KY",
  Louisiana: "LA",
  Maine: "ME",
  Maryland: "MD",
  Massachusetts: "MA",
  Michigan: "MI",
  Minnesota: "MN",
  Mississippi: "MS",
  Missouri: "MO",
  Montana: "MT",
  Nebraska: "NE",
  Nevada: "NV",
  "New Hampshire": "NH",
  "New Jersey": "NJ",
  "New Mexico": "NM",
  "New York": "NY",
  "North Carolina": "NC",
  "North Dakota": "ND",
  Ohio: "OH",
  Oklahoma: "OK",
  Oregon: "OR",
  Pennsylvania: "PA",
  "Rhode Island": "RI",
  "South Carolina": "SC",
  "South Dakota": "SD",
  Tennessee: "TN",
  Texas: "TX",
  Utah: "UT",
  Vermont: "VT",
  Virginia: "VA",
  Washington: "WA",
  "West Virginia": "WV",
  Wisconsin: "WI",
  Wyoming: "WY",
};

//section 2 - Helpers

//returns and removes a random string/polis from a given array
//usecase: used to assign a new state.currentPolis for Client to select
const getCurrentPolis = (array) => {
  const randomIndex = Math.floor(Math.random() * array.length);
  const currentPolis = array.splice(randomIndex, 1);
  return currentPolis[0];
};

//toggles modal on/off - z-index ensures nothing is clicked besides modal buttons
const toggleModal = (modal, CSS__Class, bool) => {
  //bool parameter allows for control to stop/start the interval when the modal opens/closes
  //note the second parameter bool is not used when the "start" button is used.
  if (bool) {
    state.interval = setInterval(disappearPolis, state.answerTime);
  } else if (bool === false) {
    clearInterval(state.interval);
  }
  modal.classList.toggle(CSS__Class);
};

//used to determine the rate at which polis will disappear from the US Map
const getTimeValue = (difficulty) => {
  switch (difficulty) {
    case "easy":
      return 1000;
    case "medium":
      return 2500;
    case "hard":
      return 5000;
    default:
      console.log("error");
  }
};

//returns the ID of radio button that is checked this is passed to function getTimeValue
//which returns the time interval for the next game to be played
const getCheckedRadio = (radioGroupClass) => {
  const radioButtons = document.getElementsByClassName(radioGroupClass);
  for (const button of radioButtons) {
    if (button.checked) return button.id;
  }
};

//Section 3 - State

//Values are set explicity as undefined to increase readability: showing
//what variables begin are defined at app initialization
const state = {
  answerTime: 1000,
  correct: 0,
  attempted: 0,
  interval: undefined,
  remainingPolis: undefined,
  disappearPolis: undefined,
  currentPolis: undefined,
};

//Section 4 - Run Application Functions

const disappearPolis = () => {
  if (state.disappearPolis.length === 1) clearInterval(state.interval);
  const currentRemove = polisLookup[getCurrentPolis(state.disappearPolis)];
  const polis = document.getElementById(currentRemove);
  polis.classList.add("incorrect");
};

const checkPolisSelection = (event) => {
  clearInterval(state.interval);
  //removes the class of wrong answers away from each poils
  //The next interval will be able to remove incorrect answers again
  const polis = document.getElementById("us-map").getElementsByTagName("path");
  for (let i = 0; i < 50; i++) {
    polis[i].classList.remove("incorrect");
  }

  const selection = event.target.dataset.name;
  const target = state.currentPolis;
  const answer = selection === target;
  const scoreboard = document.getElementsByClassName(
    "us-map--scoreboard--score"
  )[0];
  if (answer) state.correct++;
  state.attempted++;
  state.currentPolis = getCurrentPolis(state.remainingPolis);
  state.disappearPolis = state.remainingPolis.slice();
  scoreboard.innerHTML = `${state.correct} of ${state.attempted} | Select ${state.currentPolis} | `;

  const current = document.getElementById(polisLookup[target]);
  current.removeEventListener("click", checkPolisSelection);
  current.classList.add("answer");
  if (state.attempted === 50) return endGame();
  state.interval = setInterval(disappearPolis, state.answerTime);
};

const resetState = () => {
  clearInterval(state.interval);
  for (let i = 0; i < polisFullName.length; i++) {
    const disappearedPolis = document.getElementById(
      polisLookup[polisFullName[i]]
    );
    disappearedPolis.classList.remove("incorrect");
    disappearedPolis.classList.remove("answer");
    disappearedPolis.addEventListener("click", checkPolisSelection);
  }
  state.correct = 0;
  state.attempted = 0;
  state.remainingPolis = polisFullName.slice();
  state.currentPolis = getCurrentPolis(state.remainingPolis);
  state.disappearPolis = state.remainingPolis.slice();
  state.interval = setInterval(disappearPolis, state.answerTime);

  const scoreboard = document.getElementsByClassName(
    "us-map--scoreboard--score"
  )[0];
  scoreboard.innerHTML = `${state.correct} of ${state.attempted} | Select ${state.currentPolis} | `;
};

const startGame = () => {
  clearInterval(state.interval);
  const modalStart = document.getElementsByClassName("modal__container")[0];
  const checked = getCheckedRadio("radio-input");
  state.answerTime = getTimeValue(checked);
  resetState();
  toggleModal(modalStart, "modal__start--toggle");

  const modalExplanation = document.getElementsByClassName(
    "modal__start--explanation"
  )[0];
  const defaultExplanation =
    "Are you sure you want to restart? <br> All progress will not be saved <br> The harder the difficulty, <br> the faster the states will disappear from the map";
  modalExplanation.innerHTML = defaultExplanation;
};

const endGame = () => {
  const percentage = state.correct * 2;
  const modalExplanation = document.getElementsByClassName(
    "modal__start--explanation"
  )[0];
  const modalPhrase = `You finished with a ${percentage}% accuracy.`;
  modalExplanation.innerHTML = modalPhrase;
  const scoreboard = document.getElementsByClassName(
    "us-map--scoreboard--score"
  )[0];
  scoreboard.innerHTML = `${state.correct} of 50 | ${percentage}% Correct | `;
  const modalStart = document.getElementsByClassName("modal__container")[0];
  toggleModal(modalStart, "modal__start--toggle");
};

const app = () => {
  const restartButton = document.getElementsByClassName(
    "us-map--scoreboard--restart"
  )[0];
  const modalStart = document.getElementsByClassName("modal__container")[0];
  document.getElementById("easy").checked = true;
  restartButton.addEventListener(
    "click",
    toggleModal.bind(this, modalStart, "modal__start--toggle", false)
  );

  const startButton = document.getElementsByClassName("modal__start-start")[0];
  startButton.addEventListener("click", startGame);

  const closeButton = document.getElementsByClassName("modal__start-close")[0];
  closeButton.addEventListener(
    "click",
    toggleModal.bind(this, modalStart, "modal__start--toggle", true)
  );

  state.remainingPolis = polisFullName.slice();
  state.disappearPolis = polisFullName.slice();
  state.currentPolis = getCurrentPolis(state.remainingPolis);
  const polis = document.getElementById("us-map").getElementsByTagName("path");
  const scoreboard = document.getElementsByClassName(
    "us-map--scoreboard--score"
  )[0];
  scoreboard.innerHTML = `${state.correct} of ${state.attempted} | Select ${state.currentPolis} | `;
  for (let i = 0; i < polis.length; i++) {
    polis[i].addEventListener("click", checkPolisSelection);
  }
  const currentPolisIndex = state.disappearPolis.indexOf(state.currentPolis);
  state.disappearPolis.splice(currentPolisIndex, 1);
  state.interval = setInterval(disappearPolis, state.answerTime);
};

app();
