// pages/reviewer-form.js

import { useState } from 'react';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default function ReviewerForm() {
  const [paperWeaknesses, setPaperWeaknesses] = useState('');
  const [paperStrengths, setPaperStrengths] = useState('');
  const [paperContribution, setPaperContribution] = useState('');
  const [evaluation, setEvaluation] = useState('');
  const [paperId, setPaperId] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await prisma.reviewerForm.create({
        data: {
          paper_weaknesses: paperWeaknesses,
          paper_strengths: paperStrengths,
          paper_contribution: paperContribution,
          evaluation: evaluation,
          paper_id: Number(paperId),
        },
      });

      console.log('Reviewer form submitted successfully!');
      // Reset form fields
      setPaperWeaknesses('');
      setPaperStrengths('');
      setPaperContribution('');
      setEvaluation('');
      setPaperId('');
    } catch (error) {
      console.error('Error submitting reviewer form:', error);
    }
  };

  return (
    <div>
      <h1>Reviewer Form</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="paperWeaknesses">Paper Weaknesses:</label>
        <textarea
          id="paperWeaknesses"
          value={paperWeaknesses}
          onChange={(e) => setPaperWeaknesses(e.target.value)}
        ></textarea>

        <label htmlFor="paperStrengths">Paper Strengths:</label>
        <textarea
          id="paperStrengths"
          value={paperStrengths}
          onChange={(e) => setPaperStrengths(e.target.value)}
        ></textarea>

        <label htmlFor="paperContribution">Paper Contribution:</label>
        <textarea
          id="paperContribution"
          value={paperContribution}
          onChange={(e) => setPaperContribution(e.target.value)}
        ></textarea>

        <label htmlFor="evaluation">Evaluation:</label>
        <textarea
          id="evaluation"
          value={evaluation}
          onChange={(e) => setEvaluation(e.target.value)}
        ></textarea>

        <label htmlFor="paperId">Paper ID:</label>
        <input
          type="number"
          id="paperId"
          value={paperId}
          onChange={(e) => setPaperId(e.target.value)}
        />

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
