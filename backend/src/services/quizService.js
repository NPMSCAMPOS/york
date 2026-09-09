import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY,
});

export async function generateQuizQuestion(yorkName, ageGroup) {
  const ageMap = {
    '4-5 anos': '4-5 year olds',
    '6-8 anos': '6-8 year olds',
    '9-11 anos': '9-11 year olds',
  };

  const ageDesc = ageMap[ageGroup] || ageGroup;

  const systemPrompt = `You are a friendly quiz master for children aged ${ageDesc}. Generate ONE simple quiz question appropriate for the child's age group. The question should be educational, fun, and encourage learning.

Return a JSON object with:
{
  "question": "The quiz question here",
  "correctAnswer": "The correct answer",
  "hints": ["hint1", "hint2"]
}`;

  try {
    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 200,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: `Generate a quiz question for ${yorkName}, a child. Make it engaging and fun!`,
        },
      ],
    });

    const content = response.content[0].type === 'text' ? response.content[0].text : '';

    try {
      const parsed = JSON.parse(content);
      return {
        id: Math.random().toString(36).substring(7),
        question: parsed.question,
        correctAnswer: parsed.correctAnswer,
        hints: parsed.hints || [],
      };
    } catch {
      // Fallback if parsing fails
      return {
        id: Math.random().toString(36).substring(7),
        question: 'What is 2 + 2?',
        correctAnswer: '4',
        hints: ['It\'s an even number', 'It\'s between 3 and 5'],
      };
    }
  } catch (err) {
    console.error('Error generating quiz question:', err.message);
    throw new Error('Failed to generate quiz question');
  }
}

export async function validateQuizAnswer(quizId, userAnswer, correctAnswer) {
  const isCorrect = userAnswer.toLowerCase().trim() === correctAnswer.toLowerCase().trim();

  const systemPrompt = `You are a friendly quiz evaluator for children. The child gave an answer to a quiz question. Your job is to provide encouraging feedback regardless of whether they're right or wrong.

Return a JSON object with:
{
  "correct": boolean,
  "feedback": "Encouraging feedback message in Portuguese for the child"
}`;

  try {
    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 100,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: `The correct answer is "${correctAnswer}". The child answered "${userAnswer}". Is it correct? ${isCorrect ? 'Yes' : 'No'}.`,
        },
      ],
    });

    const content = response.content[0].type === 'text' ? response.content[0].text : '';

    try {
      const parsed = JSON.parse(content);
      return {
        correct: isCorrect,
        feedback: parsed.feedback || (isCorrect ? 'Parabéns! 🎉' : 'Tente novamente! 💪'),
      };
    } catch {
      // Fallback if parsing fails
      return {
        correct: isCorrect,
        feedback: isCorrect ? 'Parabéns! Você acertou! 🎉' : 'Que pena! A resposta correta é: ' + correctAnswer,
      };
    }
  } catch (err) {
    console.error('Error validating quiz answer:', err.message);
    throw new Error('Failed to validate quiz answer');
  }
}
