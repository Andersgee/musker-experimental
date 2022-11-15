import { LoremIpsum } from "lorem-ipsum";

const lorem = new LoremIpsum({
  sentencesPerParagraph: { min: 4, max: 8 },
  wordsPerSentence: { min: 4, max: 16 },
});

const randInt = (max: number) => Math.floor(Math.random() * max) + 1;

export function randomText(maxLen = 1000) {
  const r = Math.random();
  if (r < 0.33) {
    return lorem.generateWords(randInt(10)).slice(0, maxLen);
  } else if (r < 0.66) {
    return lorem.generateSentences(randInt(5)).slice(0, maxLen);
  } else {
    return lorem.generateParagraphs(2).slice(0, maxLen);
  }
}

export function uniqueWords(n: number) {
  const words: string[] = [];
  while (words.length < n) {
    const word = lorem.generateWords(1);
    if (!words.includes(word)) {
      words.push(word);
    }
  }
  return words;
}

const fromDate = new Date(2021, 0, 1);
const toDate = new Date(2022, 0, 1);
export function randomDate(a: Date = fromDate, b: Date = toDate) {
  return new Date(a.getTime() + Math.random() * (b.getTime() - a.getTime()));
}
