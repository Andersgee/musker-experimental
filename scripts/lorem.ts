import { LoremIpsum } from "lorem-ipsum";

const lorem = new LoremIpsum({
  sentencesPerParagraph: { min: 4, max: 8 },
  wordsPerSentence: { min: 4, max: 16 },
});

const randInt = (max: number) => Math.floor(Math.random() * max) + 1;

export function randomText() {
  const r = Math.random();
  if (r < 0.33) {
    return lorem.generateWords(randInt(10));
  } else if (r < 0.66) {
    return lorem.generateSentences(randInt(5));
  } else {
    return lorem.generateParagraphs(2);
  }
}
