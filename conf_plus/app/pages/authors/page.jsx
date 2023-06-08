"use client";
import { useEffect, useState } from "react";
import { addNewPaper, fetchRandomReviewers } from "@/redux";
import { useDispatch } from "react-redux";

export default function SubmitPaper() {
	let [paper, setPaper] = useState({ title: "", abstract: "", pdf: "" });
	let [authors, setAuthors] = useState([{ name: "", email: "", affiliation: "", presenter: false }]);
	let dispatch = useDispatch();

	useEffect(() => {
		document.title = "Submission Form";
		let user = JSON.parse(localStorage.getItem("user"));
		if (!user || user.role !== "author") window.location.href = "/pages/signIn";
	}, []);

	const addNewAuthor = () => {
		setAuthors((a) => [...a, { name: "", email: "", affiliation: "", presenter: false }]);
	};

	const handlePaper = ({ target: { name, value } }) => {
		setPaper((p) => (p = { ...paper, [name]: value }));
	};

	const handleAuthors = ({ target: { name, value, checked } }, i) => {
		if (name === "presenter") {
			setAuthors((a) => {
				a[i][name] = checked;
				return a;
			});
		} else {
			setAuthors((a) => {
				a[i][name] = value;
				return a;
			});
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		let { payload } = await dispatch(fetchRandomReviewers(`rondomReviewers=2`));
		if (!payload?.length) return console.log("Somthing Is Wronge -> handleSubmit() In Authors Page");

		dispatch(addNewPaper({ ...paper, authors, reviewerIds: payload }));

		alert("The Paper Was Submitted");
		window.location.href = "/";
	};

	return (
		<div className="sessionAdd-box box">
			<h1>Submission Form</h1>
			<form onSubmit={handleSubmit} onKeyDown={(e) => (e.key === "Enter" ? handleSubmit : () => {})}>
				<label htmlFor="title">Paper Title:</label>
				<input type="text" id="title" name="title" onChange={handlePaper} required />

				<label htmlFor="abstract">Abstract:</label>
				<textarea id="abstract" name="abstract" onChange={handlePaper} required />

				<label htmlFor="authors">Authors:</label>
				{authors.map((_, i) => (
					<div className="author" key={i}>
						<input type="text" name="name" onChange={(e) => handleAuthors(e, i)} placeholder="Name" required />
						<input type="email" name="email" onChange={(e) => handleAuthors(e, i)} placeholder="Email" required />
						<input type="text" name="affiliation" onChange={(e) => handleAuthors(e, i)} placeholder="Affiliation" required />
						<label htmlFor="presenter">Presenter:</label>
						<input type="checkbox" id="presenter" name="presenter" onChange={(e) => handleAuthors(e, i)} />
						<hr />
					</div>
				))}
				<button className="subres" id="add-author" type="button" onClick={addNewAuthor}>
					Add Author
				</button>
				<br />
				<label htmlFor="pdf">PDF File:</label>
				<input type="file" id="pdf" name="pdf" onChange={handlePaper} required />
				<br />
				<div className="sub_res">
					<button className="subres" type="submit" id="sub_bttn">
						Submit
					</button>
					<button className="subres" type="reset">
						Reset
					</button>
				</div>
			</form>
		</div>
	);
}
