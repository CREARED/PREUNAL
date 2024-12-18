const questionsContainer = document.getElementById('question-container');
const nextButton = document.getElementById('next-btn');
const resultContainer = document.getElementById('result-container');
const resultList = document.getElementById('result-list');
const totalCorrectSpan = document.getElementById('total-correct');
const timerElement = document.getElementById('time-left');

let questions = [];
let answers = [];
let currentQuestionIndex = 0;
let correctAnswers = 0;
let totalTime = 600; // Total time in seconds (10 minutes)

const loadQuestions = async () => {
    const response = await fetch('questions.json');
    questions = await response.json();
};

const loadAnswers = async () => {
    const response = await fetch('answers.json');
    answers = await response.json();
};

const startTimer = () => {
    const interval = setInterval(() => {
        if (totalTime <= 0) {
            clearInterval(interval);
            showResults();
        } else {
            totalTime--;
            timerElement.textContent = formatTime(totalTime);
        }
    }, 1000);
};

const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
};

const showQuestion = (index) => {
    const question = questions[index];
    questionsContainer.innerHTML = `
        <img src="${question.img}" alt="Question ${index + 1}">
        <div>
            ${question.options.map((option, i) => `
                <label>
                    <input type="radio" name="option" value="${i}">
                    ${option}
                </label>
            `).join('')}
        </div>
    `;
};

const nextQuestion = () => {
    const selectedOption = document.querySelector('input[name="option"]:checked');
    if (!selectedOption) return alert('Seleccione una opción');

    const selectedAnswer = parseInt(selectedOption.value);
    if (selectedAnswer === answers[currentQuestionIndex]) {
        correctAnswers++;
    }

    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        showQuestion(currentQuestionIndex);
    } else {
        showResults();
    }
};

const showResults = () => {
    document.getElementById('app').classList.add('hidden');
    resultContainer.classList.remove('hidden');
    totalCorrectSpan.textContent = correctAnswers;

    questions.forEach((question, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = `Pregunta ${index + 1}: ${answers[index] === questions[index].correct ? 'Correcta' : 'Incorrecta'}`;
        resultList.appendChild(listItem);
    });
};

const init = async () => {
    await loadQuestions();
    await loadAnswers();
    showQuestion(currentQuestionIndex);
    startTimer();
};

init();
