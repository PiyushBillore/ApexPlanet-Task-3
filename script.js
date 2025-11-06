const quizData = [
  { question: "What is the capital of France?", options: ["Paris","London","Berlin","Madrid"], answer: "Paris" },
  { question: "Which planet is known as the Red Planet?", options: ["Mars","Venus","Jupiter","Mercury"], answer: "Mars" },
  { question: "Who painted the Mona Lisa?", options: ["Leonardo da Vinci","Picasso","Van Gogh","Michelangelo"], answer: "Leonardo da Vinci" },
  { question: "What is the largest mammal in the world?", options: ["Blue Whale","Elephant","Giraffe","Hippo"], answer: "Blue Whale" },
  { question: "Which gas do plants absorb?", options: ["Oxygen","Carbon Dioxide","Nitrogen","Helium"], answer: "Carbon Dioxide" },
  { question: "Which country is called the Land of Rising Sun?", options: ["China","Japan","India","Korea"], answer: "Japan" },
  { question: "What is H2O commonly known as?", options: ["Salt","Water","Oxygen","Hydrogen"], answer: "Water" },
  { question: "Who discovered gravity?", options: ["Einstein","Newton","Tesla","Edison"], answer: "Newton" },
  { question: "How many continents are there?", options: ["5","6","7","8"], answer: "7" },
  { question: "Which organ pumps blood?", options: ["Heart","Lungs","Liver","Brain"], answer: "Heart" }
];

let currentQuestionIndex = 0;
let userScore = 0;

const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const nextBtn = document.getElementById("next-btn");
const quizBox = document.getElementById("quiz-box");
const resultBox = document.getElementById("result-box");
const scoreEl = document.getElementById("score");
const showQuoteBtn = document.getElementById("show-quote-btn");
const resetBtn = document.getElementById("reset-btn");

const quoteModal = document.getElementById("quote-modal");
const quoteText = document.getElementById("quote-text");
const closeModal = document.getElementById("close-modal");

window.addEventListener("load", () => {
  quoteModal.classList.add("hidden");
  resultBox.classList.add("hidden");
  loadQuestion();
});

function loadQuestion() {
  if (currentQuestionIndex >= quizData.length) {
    showResults();
    return;
  }

  const q = quizData[currentQuestionIndex];
  questionEl.textContent = `Q${currentQuestionIndex + 1}. ${q.question}`;
  optionsEl.innerHTML = ""; 
  nextBtn.disabled = true;

  q.options.forEach(opt => {
    const optionDiv = document.createElement("div");
    optionDiv.className = "option";
    optionDiv.textContent = opt;
    optionDiv.onclick = () => handleOptionSelection(optionDiv, q.answer);
    optionsEl.appendChild(optionDiv);
  });
}

function handleOptionSelection(selectedDiv, correctAnswer) {
  document.querySelectorAll(".option").forEach(opt => (opt.style.pointerEvents = "none"));

  if (selectedDiv.textContent === correctAnswer) {
    selectedDiv.classList.add("correct");
    userScore++;
  } else {
    selectedDiv.classList.add("wrong");
    document.querySelectorAll(".option").forEach(opt => {
      if (opt.textContent === correctAnswer) {
        opt.classList.add("correct");
      }
    });
  }

  nextBtn.disabled = false;
}

nextBtn.onclick = () => {
  currentQuestionIndex++;
  if (currentQuestionIndex < quizData.length) {
    loadQuestion();
  } else {
    showResults();
  }
};

function showResults() {
  quizBox.classList.add("hidden");
  resultBox.classList.remove("hidden");
  // Score now correctly reflects the full 10 questions
  scoreEl.textContent = `🎯 You finished! Your Score: ${userScore} / ${quizData.length}`;
}

resetBtn.onclick = () => {
  currentQuestionIndex = 0;
  userScore = 0;
  resultBox.classList.add("hidden");
  quizBox.classList.remove("hidden");
  loadQuestion();
};

async function fetchAdvice() {
  try {
    const res = await fetch("https://api.adviceslip.com/advice", { cache: "no-store" });
    if (!res.ok) throw new Error("Network response was not ok");
    const data = await res.json();
    return `"${data.slip.advice}"`;
  } catch (err) {
    console.error("Failed to fetch advice:", err);
    return "Keep coding! Errors are just features waiting to be fixed. 😉";
  }
}

showQuoteBtn.onclick = async () => {
  quoteModal.classList.remove("hidden");
  quoteText.textContent = "Hold on, fetching a spark of genius...";
  
  const quote = await fetchAdvice();
  quoteText.textContent = quote;
};

closeModal.onclick = () => {
  quoteModal.classList.add("hidden");
};

quoteModal.addEventListener("click", (e) => {
  if (e.target === quoteModal) quoteModal.classList.add("hidden");
});