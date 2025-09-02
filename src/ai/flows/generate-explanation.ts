// src/ai/flows/generate-explanation.ts
'use server';
/**
 * @fileOverview A flow that generates an explanation for why an answer to a quiz question was right or wrong.
 *
 * - generateExplanation - A function that handles the explanation generation process.
 * - GenerateExplanationInput - The input type for the generateExplanation function.
 * - GenerateExplanationOutput - The return type for the generateExplanation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateExplanationInputSchema = z.object({
  question: z.string().describe('The quiz question.'),
  answer: z.string().describe('The answer given by the student.'),
  isCorrect: z.boolean().describe('Whether the answer was correct or not.'),
  correctAnswer: z.string().optional().describe('The correct answer, if the student was incorrect.'),
  subject: z.string().describe('The subject of the quiz question.'),
  week: z.string().describe('The week of the curriculum the quiz question is from.'),
  topic: z.string().describe('The topic of the quiz question.'),
});
export type GenerateExplanationInput = z.infer<typeof GenerateExplanationInputSchema>;

const GenerateExplanationOutputSchema = z.object({
  explanation: z.string().describe('The explanation for why the answer was right or wrong.'),
});
export type GenerateExplanationOutput = z.infer<typeof GenerateExplanationOutputSchema>;

export async function generateExplanation(input: GenerateExplanationInput): Promise<GenerateExplanationOutput> {
  return generateExplanationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateExplanationPrompt',
  input: {schema: GenerateExplanationInputSchema},
  output: {schema: GenerateExplanationOutputSchema},
  prompt: `You are an expert tutor, skilled at explaining complex topics in simple terms.

  A student has answered a question on a quiz. Your job is to explain why their answer was right or wrong.

  Subject: {{subject}}
  Week: {{week}}
  Topic: {{topic}}

  Question: {{question}}
  Student's Answer: {{answer}}
  Correct: {{isCorrect}}
  {{#if correctAnswer}}
  Correct Answer: {{correctAnswer}}
  {{/if}}

  Generate a clear and concise explanation. Focus on the key concepts and reasoning behind the correct answer.  Avoid overly technical jargon.
  If the student was incorrect, explain why their answer was wrong and why the correct answer is right.
  If the student was correct, affirm their understanding and provide additional insights or related information.
  `,
});

const generateExplanationFlow = ai.defineFlow(
  {
    name: 'generateExplanationFlow',
    inputSchema: GenerateExplanationInputSchema,
    outputSchema: GenerateExplanationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
