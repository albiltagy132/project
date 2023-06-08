"use client";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { addNewReview, fetchMatchingPaper } from "@/redux";

export default function Reviews() {
	const [papers, setPapers] = useState([]);
	const [review, setReview] = useState({ paper: "", evaluation: "", contribution: "", strengths: "", weaknesses: "" });
	const dispatch = useDispatch();

	useEffect(() => {
		document.title = "Reviewer Form";

		let user = JSON.parse(localStorage.getItem("user"));
		if (!user || user.role !== "reviewer") window.location.href = "/pages/signIn";

		// GET The Paper That RevierIds Matching The User Id
		(async () => {
			let { payload } = await dispatch(fetchMatchingPaper(`userId=${user.id}`));
			if (!payload.length) return;
			setPapers((p) => (p = payload));
		})();
	}, []);

	const handleReview = ({ target: { name, value } }) => {
		setReview((o) => (o = { ...o, [name]: value }));
	};

	const handleSubmit = () => {
		dispatch(addNewReview(review));
		alert("The Review Was Submitted");
		setTimeout(() => (window.location.href = "/"), 3000);
	};

	return (
		<div className="sessionAdd-box box">
			<h1>Reviewer Form</h1>
			<div>
				<label htmlFor="paper-list">Select Paper:</label>
				<select id="paper-list" name="paper" onChange={handleReview}>
					<option value="">--Select a paper--</option>
					{papers.map((paper, i) => (
						<option value={paper.title} key={i}>
							{paper.title}
						</option>
					))}
				</select>
			</div>
			<div>
				<h2>Overall Evaluation</h2>
				<div>
					<label htmlFor="overall-evaluation">Overall Evaluation:</label>
					<select id="overall-evaluation" name="evaluation" onChange={handleReview}>
						<option value="">--Select an option--</option>
						<option value="2">Strong Accept</option>
						<option value="1">Accept</option>
						<option value="0">Borderline</option>
						<option value="-1">Reject</option>
						<option value="-2">Strong Reject</option>
					</select>
				</div>
				<div>
					<label htmlFor="paper-contribution">Paper Contribution:</label>
					<select id="paper-contribution" name="contribution" onChange={handleReview}>
						<option value="">--Select an option--</option>
						<option value="4">A Major and Significant Contribution</option>
						<option value="3">A Clear Contribution</option>
						<option value="2">Minor Contribution</option>
						<option value="1">No Obvious Contribution</option>
					</select>
				</div>
				<div>
					<label htmlFor="paper-strengths">Paper Strengths:</label>
					<textarea id="paper-strengths" name="strengths" onChange={handleReview} />
				</div>
				<div>
					<label htmlFor="paper-weaknesses">Paper Weaknesses:</label>
					<textarea id="paper-weaknesses" name="weaknesses" onChange={handleReview} />
				</div>
				<div className="sub_res">
					<button className="subres" type="submit" onClick={handleSubmit}>
						Submit
					</button>
					<button className="subres" type="reset">
						Reset
					</button>
				</div>
			</div>
		</div>
	);
}
