import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY,
});

export async function generateStory(yorkName, theme, ageGroup) {
  const ageMap = {
    '4-5 anos': '4-5 year olds',
    '6-8 anos': '6-8 year olds',
    '9-11 anos': '9-11 year olds',
  };

  const ageDesc = ageMap[ageGroup] || ageGroup;

  const systemPrompt = `You are a children's storyteller creating stories for ${ageDesc}.
Create a short, engaging, educational story (~200-300 words) featuring ${yorkName}.
The story should be:
- Age-appropriate
- Positive and uplifting
- About the theme: ${theme}
- In Portuguese`;

  const startTime = performance.now();

  const response = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 150,
    system: {
      type: 'text',
      text: systemPrompt,
      cache_control: { type: 'ephemeral' },
    },
    messages: [
      {
        role: 'user',
        content: `Tell a story about ${yorkName} and "${theme}"`,
      },
    ],
  });

  const elapsed = performance.now() - startTime;
  const story = response.content[0].type === 'text' ? response.content[0].text : '';

  console.log(`[Story] Generated in ${elapsed.toFixed(0)}ms, input: ${response.usage.input_tokens}, output: ${response.usage.output_tokens}`);

  return {
    story,
    tokens: {
      input: response.usage.input_tokens,
      output: response.usage.output_tokens,
    },
    elapsed: elapsed.toFixed(0),
  };
}
