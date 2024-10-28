import { backend } from 'declarations/backend';

const inputText = document.getElementById('inputText');
const targetLang = document.getElementById('targetLang');
const translateBtn = document.getElementById('translateBtn');
const speakBtn = document.getElementById('speakBtn');
const outputText = document.getElementById('outputText');
const spinner = document.getElementById('spinner');
const historyList = document.getElementById('historyList');

translateBtn.addEventListener('click', translateText);
speakBtn.addEventListener('click', speakTranslation);

async function translateText() {
    const text = inputText.value.trim();
    const lang = targetLang.value;

    if (!text) return;

    spinner.classList.remove('d-none');
    outputText.value = '';
    speakBtn.disabled = true;

    try {
        const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${lang}`);
        const data = await response.json();

        if (data.responseStatus === 200) {
            const translation = data.responseData.translatedText;
            outputText.value = translation;
            speakBtn.disabled = false;

            // Save translation to backend
            await backend.addTranslation(text, translation, lang);
            updateHistory();
        } else {
            outputText.value = 'Translation error. Please try again.';
        }
    } catch (error) {
        console.error('Translation error:', error);
        outputText.value = 'An error occurred. Please try again.';
    } finally {
        spinner.classList.add('d-none');
    }
}

function speakTranslation() {
    const text = outputText.value;
    const lang = targetLang.value;

    if (!text) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    speechSynthesis.speak(utterance);
}

async function updateHistory() {
    try {
        const history = await backend.getTranslationHistory();
        historyList.innerHTML = '';
        history.forEach(item => {
            const li = document.createElement('li');
            li.className = 'list-group-item';
            li.textContent = `${item.original} -> ${item.translated} (${item.language})`;
            historyList.appendChild(li);
        });
    } catch (error) {
        console.error('Error fetching translation history:', error);
    }
}

// Initial history load
updateHistory();
