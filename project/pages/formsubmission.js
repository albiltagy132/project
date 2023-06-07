// pages/index.js

import { useState } from 'react';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default function Home() {
  const [pdf, setPdf] = useState('');
  const [author, setAuthor] = useState('');
  const [abstract, setAbstract] = useState('');
  const [title, setTitle] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await prisma.paper.create({
        data: {
          pdf,
          author,
          abstract,
          title,
        },
      });

      console.log('Paper submitted successfully!');
      // Reset form fields
      setPdf('');
      setAuthor('');
      setAbstract('');
      setTitle('');
    } catch (error) {
      console.error('Error submitting paper:', error);
    }
  };

  return (
    <div>
      <h1>Submit Paper</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="pdf">PDF:</label>
        <input
          type="text"
          id="pdf"
          value={pdf}
          onChange={(e) => setPdf(e.target.value)}
        />

        <label htmlFor="author">Author:</label>
        <input
          type="text"
          id="author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />

        <label htmlFor="abstract">Abstract:</label>
        <textarea
          id="abstract"
          value={abstract}
          onChange={(e) => setAbstract(e.target.value)}
        ></textarea>

        <label htmlFor="title">Title:</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
