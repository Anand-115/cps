// AI Integration and Quiz Analysis
// Developed by Srishti Koni
import readline from 'readline';
import fetch from 'node-fetch';

interface MCQ {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  concept: string;
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function ask(question: string): Promise<string> {
  return new Promise(resolve => rl.question(question, resolve));
}

async function fetchQuiz(topic: string): Promise<MCQ[]> {
  const prompt = `
Generate 5 MCQs on the topic "${topic}".Make sure the options are correct and that only one option is correct answer and also make sure you have the right and precise answer
Format:
[
  {
    "question": "...",
    "options": ["A", "B", "C", "D"],
    "correctAnswer": 1,
    "explanation": "...",
    "concept": "..."
  }
]
Return only valid JSON.
`;

  const res = await fetch('http://localhost:11434/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'mistral',
      prompt,
      stream: false
    })
  });

  const data = await res.json() as { response: string };
  const match = data.response.match(/\[\s*{[\s\S]*}\s*\]/);
  if (!match) throw new Error('Could not parse JSON response');

  return JSON.parse(match[0]);
}

async function runQuiz() {
  const topic = await ask('📝 Enter the topic you want a quiz on: ');
  console.log(`\n🎯 Generating quiz for "${topic}"...\n`);

  const quiz = await fetchQuiz(topic);
  let score = 0;

  for (let i = 0; i < quiz.length; i++) {
    const q = quiz[i];
    console.log(`Q${i + 1}: ${q.question}`);
    q.options.forEach((opt, idx) => console.log(`   ${idx + 1}. ${opt}`));

    const ans = await ask('👉 Your answer (1-4): ');
    const userChoice = parseInt(ans) - 1;

    const isCorrect = userChoice === q.correctAnswer;
    if (isCorrect) {
      console.log('✅ Correct!\n');
      score++;
    } else {
      if (!isCorrect) {
  console.log(`❌ Incorrect. ✅ Correct Answer: ${q.options[q.correctAnswer]}\n`);
}

    }
  }

  const percent = (score / quiz.length) * 100;
  console.log(`📊 Your Score: ${score}/${quiz.length} (${percent.toFixed(0)}%)`);

  if (percent >= 70) {
    console.log('🎉 You’re ready to move to the next topic!');
  } else {
    console.log('🧠 Please revise this topic before proceeding.');
  }

  rl.close();
}

runQuiz();

/* async function fetchQuiz(topic: string): Promise<{
  question: string;
  options: string[];
  correctAnswer: number;
}[]> {
  const res = await fetch('http://localhost:11434/api/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama3',
      prompt: `Generate 5 DSA quiz questions in JSON format on the topic "${topic}". Each question should include:
- "question": string,
- "options": [option1, option2, option3, option4],
- "correctAnswer": number (index of correct option 0-3)`,
      stream: false
    }),
  });

  if (!res.ok) throw new Error('Failed to generate quiz');

  const data = await res.json();

  try {
    const quiz = JSON.parse(data.response);
    return quiz;
  } catch (err) {
    console.error('Could not parse quiz JSON:', data.response);
    throw new Error('Response is not valid JSON.');
  }
}


runQuiz();*/

