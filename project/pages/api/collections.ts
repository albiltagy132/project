import { NextApiHandler } from 'next';
import fs from 'fs';
import path from 'path';

const WORDS_FILE = path.join(process.cwd(), 'data', 'words.json');
const COLLECTIONS_FILE = path.join(process.cwd(), 'data', 'collections.json');

interface Collection {
  name: string;
  words: string[];
}

const handler: NextApiHandler = (req, res) => {
  if (req.method === 'GET' && req.query.name) {
    // Read all words in a collection
    const collectionName = req.query.name as string;
    const collections = JSON.parse(fs.readFileSync(COLLECTIONS_FILE, 'utf8'));
    const collection = collections.find((c: Collection) => c.name === collectionName);

    if (!collection) {
      return res.status(404).json({ message: `Collection "${collectionName}" not found.` });
    }

    res.status(200).json(collection.words);
  } else if (req.method === 'POST' && req.query.name) {
    // Add a word to a collection
    const collectionName = req.query.name as string;
    const { word } = req.body;

    if (!word) {
      return res.status(400).json({ message: 'Please provide a word to add.' });
    }

    const collections = JSON.parse(fs.readFileSync(COLLECTIONS_FILE, 'utf8'));
    const collectionIndex = collections.findIndex((c: Collection) => c.name === collectionName);

    if (collectionIndex === -1) {
      return res.status(404).json({ message: `Collection "${collectionName}" not found.` });
    }

    const existingWords = collections[collectionIndex].words;
    if (existingWords.includes(word)) {
      return res.status(400).json({ message: `The word "${word}" already exists in collection "${collectionName}".` });
    }

    collections[collectionIndex].words.push(word);
    fs.writeFileSync(COLLECTIONS_FILE, JSON.stringify(collections, null, 2));

    res.status(201).json(collections[collectionIndex].words);
  } else if (req.method === 'DELETE' && req.query.name && req.query.word) {
    // Delete a word from a collection
    const collectionName = req.query.name as string;
    const wordToDelete = req.query.word as string;

    const collections = JSON.parse(fs.readFileSync(COLLECTIONS_FILE, 'utf8'));
    const collectionIndex = collections.findIndex((c: Collection) => c.name === collectionName);

    if (collectionIndex === -1) {
      return res.status(404).json({ message: `Collection "${collectionName}" not found.` });
    }

    const existingWords = collections[collectionIndex].words;
    if (!existingWords.includes(wordToDelete)) {
      return res.status(404).json({ message: `The word "${wordToDelete}" does not exist in collection "${collectionName}".` });
    }

    if (existingWords.length === 1) {
      return res.status(400).json({ message: `Collection "${collectionName}" cannot be empty.` });
    }

    collections[collectionIndex].words = existingWords.filter((w: string) => w !== wordToDelete);
    fs.writeFileSync(COLLECTIONS_FILE, JSON.stringify(collections, null, 2));

    res.status(204).end();
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
};

export default handler;
