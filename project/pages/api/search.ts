import { NextApiRequest, NextApiResponse } from "next";
import words from "../../data/words.json";

const MAX_WORDS = 100;
const DEFAULT_NUM_WORDS = 10;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { query, numWords = DEFAULT_NUM_WORDS } = req.query;

  if (typeof query !== "string") {
    res.status(400).json({ message: "Query parameter is required" });
    return;
  }

  const matchingWords = words.filter((word: string) =>
    word.toLowerCase().includes(query.toLowerCase())
  );

  const numMatchingWords = matchingWords.length;

  if (numMatchingWords === 0) {
    res.status(404).json({ message: "No matching words found" });
    return;
  }

  const numWordsToReturn = Math.min(numWords, MAX_WORDS, numMatchingWords);
  const selectedWords = new Set<string>();

  while (selectedWords.size < numWordsToReturn) {
    const randomIndex = Math.floor(Math.random() * numMatchingWords);
    selectedWords.add(matchingWords[randomIndex]);
  }

  res.status(200).json({ words: Array.from(selectedWords) });
}
