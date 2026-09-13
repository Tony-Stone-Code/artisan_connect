import fs from 'fs';
import path from 'path';
import { generateText } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const THESIS_PATH = path.join(__dirname, '../../../docs/THESIS_FINAL_COMPILED.md');
const OUTPUT_PATH = path.join(__dirname, '../../../docs/THESIS_FINAL_COMPILED_EXPANDED.md');

async function main() {
  console.log('Reading thesis document...');
  const thesisContent = fs.readFileSync(THESIS_PATH, 'utf-8');

  // Split by Chapter headings
  const chapters = thesisContent.split(/(?=# CHAPTER (?:ONE|TWO|THREE|FOUR|FIVE):)/g);
  
  // The first part might be the title and TOC, let's extract it
  const titleAndTOC = chapters.shift() || '';

  console.log(`Found ${chapters.length} chapters.`);
  
  let expandedThesis = titleAndTOC;

  for (let i = 0; i < chapters.length; i++) {
    const chapter = chapters[i];
    console.log(`\nExpanding Chapter ${i + 1}...`);
    
    try {
      const { text } = await generateText({
        model: google('gemini-2.5-flash'),
        prompt: `You are an expert academic writer and professor of computer science and software engineering.
Your task is to significantly EXPAND the following chapter of a computer science Master's thesis.
The student's supervisor requested that the content be roughly DOUBLED in size and detail.
You must maintain the exact same markdown structure, headings, and overall context, but dramatically increase the depth, theoretical background, technical explanations, examples, and academic rigor of the text.

Do NOT add new top-level headings, but you may add third-level subheadings if necessary to support the expansion.
Do NOT change the formatting of existing tables or Mermaid diagrams, but you may add more detailed text before and after them.
Output ONLY the fully expanded markdown for this chapter. Do not include introductory conversational text.

ORIGINAL CHAPTER CONTENT:
${chapter}`,
      });

      expandedThesis += '\n\n' + text;
      console.log(`Chapter ${i + 1} expanded successfully.`);
    } catch (error) {
      console.error(`Error expanding chapter ${i + 1}:`, error);
      process.exit(1);
    }
  }

  fs.writeFileSync(OUTPUT_PATH, expandedThesis);
  console.log('\n✅ Expanded thesis successfully written to docs/THESIS_FINAL_COMPILED_EXPANDED.md');
}

main().catch(console.error);
