function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function delayMean(mid, delta) {
    return mid;
}

function delayUniform(mid, delta) {
    return mid - delta + Math.random() * (2 * delta);
}

function delayTriangular(mid, delta) {
    const min = mid - delta;
    const max = mid + delta;
    const mode = mid;
    const u = Math.random();
    const c = (mode - min) / (max - min);
    return u < c
        ? min + Math.sqrt(u * (max - min) * (mode - min))
        : max - Math.sqrt((1 - u) * (max - min) * (max - mode));
}

function delayNormal(mid, delta) {
    let val;
    do {
        val = mid + (Math.random() * 2 - 1 + Math.random() * 2 - 1) * delta / 2;
    } while (val < mid - delta || val > mid + delta);
    return val;
}

function delayExponential(mid, delta) {
    const sign = Math.random() < 0.5 ? -1 : 1;
    const val = -Math.log(1 - Math.random());
    return mid + sign * Math.min(delta, val * delta / 3);
}

function delayBimodal(mid, delta) {
    return Math.random() < 0.5
        ? mid - delta * Math.random()
        : mid + delta * Math.random();
}

function delayGamma(mid, delta) {
    let val = 0;
    for (let i = 0; i < 2; i++) {
        val += -Math.log(Math.random());
    }
    val = (val / 2 - 0.5) * delta;
    return Math.max(mid - delta, Math.min(mid + delta, mid + val));
}

let perlin_t = 0;
function delayPerlin(mid, delta) {
    perlin_t += 0.1;
    const noise =
        (Math.sin(perlin_t) +
         Math.sin(perlin_t * 0.5 + 1) +
         Math.sin(perlin_t * 0.25 + 2)) / 3;
    return mid + noise * delta;
}

function getDelayValue(type, mid, delta) {
    switch (type) {
        case "mean": return delayMean(mid, delta);
        case "uniform": return delayUniform(mid, delta);
        case "triangular": return delayTriangular(mid, delta);
        case "normal": return delayNormal(mid, delta);
        case "exponential": return delayExponential(mid, delta);
        case "bimodal": return delayBimodal(mid, delta);
        case "gamma": return delayGamma(mid, delta);
        case "perlin": return delayPerlin(mid, delta);
        default: return mid;
    }
}

async function getSettings() {
  return new Promise(resolve => {
    chrome.storage.sync.get(["midDelay", "deltaDelay", "deltaType", "wordDatabase"], resolve);
  });
}

function getResult(string) {
    switch (string) {
        case "Dobrze!": return true;
        case "Niepoprawnie": return false;
        case "Niepoprawnie": return false;
        case "Niepoprawnie": return false;
        default: return false;
    }
}

async function updateWordDatabase(key, value, wordDatabase) {
    wordDatabase[key] = value;

    return new Promise((resolve, reject) => {
        chrome.storage.sync.set({ wordDatabase }, () => {
            if (chrome.runtime.lastError) reject(chrome.runtime.lastError);
            else {
                console.log(`Baza słów została zaktualizowana: ${key} => ${value}`);
                resolve(wordDatabase);
            }
        });
    });
}

async function typeChar(inputElement, string, charIdx) {
    await sleep(100);
    inputElement.value = inputElement.value + string[charIdx];
    if (string[charIdx + 1]) {
        await typeChar(inputElement, string, charIdx + 1);
    }
}

async function typeAnswer(inputElement, string) {
    inputElement.focus();
    await typeChar(inputElement, string, 0);
    await sleep(100);
}

async function nextQuestion(midDelay, deltaDelay, type, inputElement, checkButton, nextButton, wordDatabase, finishPage, returnButton) {
    console.log("Używam bazy słów: ");
    console.log(wordDatabase);

    const questionString = document.querySelector(".usage_example").textContent;

    if (!questionString) {
        return;
    }

    const answer = (wordDatabase[questionString] !== undefined) ? wordDatabase[questionString] : "Uhh...";

    await sleep(getDelayValue(type, midDelay, deltaDelay));
    
    await typeAnswer(inputElement, answer);
    checkButton.click();
    await sleep(1000);

    const resultString = document.querySelector("#answer_result > div").textContent;
    const correctResult = getResult(resultString);

    let newWordDatabase = wordDatabase;
    if (!correctResult) {
        const answerString = document.querySelector("#word").textContent;
        await updateWordDatabase(questionString, answerString, wordDatabase);
    }

    nextButton.click();
    await sleep(1000);

    if (window.getComputedStyle(finishPage).display !== "none") {
        setTimeout(() => returnButton.click(), 1000);
        console.log("Session finished!");
        return;
    }

    nextQuestion(midDelay, deltaDelay, type, inputElement, checkButton, nextButton, newWordDatabase, finishPage, returnButton);
}

async function loadScript() {
    console.log("Initializing...");

    const { midDelay, deltaDelay, deltaType, wordDatabase } = await getSettings();
    const type = deltaType || "mean";
    const words = wordDatabase || {};

    console.log("Loaded with data:");
    console.log({ midDelay, deltaDelay, deltaType, wordDatabase });

    const inputElement = document.querySelector("#answer");

    const checkButton = document.querySelector("#check > div");
    const nextButton = document.querySelector("#next_word");

    const finishPage = document.querySelector("#finish_page");
    const returnButton = document.querySelector("#return_mainpage");

    const continuePage = document.querySelector("#continue_session_page");
    const continueButton = document.querySelector("#continue_session_button > div");

    if (window.getComputedStyle(continuePage).display !== "none") {
        continueButton.click();
    }
        
    setTimeout(() => nextQuestion(midDelay, deltaDelay, type, inputElement, checkButton, nextButton, words, finishPage, returnButton), 1000);
}

console.log("Loading Instaling Solver...");
setTimeout(() => loadScript(), 1000);