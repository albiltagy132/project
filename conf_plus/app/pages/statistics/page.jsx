"use client";
import { useEffect, useState } from "react";
import axios from "axios";

const Statistics = () => {
	const [papers, setPapers] = useState({ count: 0, paperState: { submitted: 0, accepted: 0, rejected: 0 }, paperAuthors: [{ title: "-", count: 0 }] });
	const [sessions, setSessions] = useState({ conferences: 0, presentations: 0 });

	useEffect(() => {
		(async () => {
			let response = await axios.get("/api/statistics");
			setPapers((p) => (p = response.data.papers));
			setSessions((p) => (p = response.data.sessions));
		})();
	}, []);

	return (
		<section>
			<div className="papers">
				<h3 className="papers-title">Papers ( {papers.count} )</h3>
				<table className="table">
					<thead className="table-header">
						<tr>
							{Object.keys(papers.paperState).map((key) => (
								<td key={key} style={{ textTransform: "capitalize" }}>
									{key}
								</td>
							))}
						</tr>
					</thead>
					<tbody className="table-body">
						<tr>
							{Object.keys(papers.paperState).map((key) => (
								<td key={key} style={{ textTransform: "capitalize" }}>
									{papers.paperState[key]}
								</td>
							))}
						</tr>
					</tbody>
				</table>

				<table className="table">
					<thead className="table-header">
						<tr>
							<td>Paper</td>
							<td>Number Of Authors</td>
						</tr>
					</thead>
					<tbody className="table-body">
						{papers.paperAuthors.map((paper, i) => (
							<tr key={i}>
								<td>{paper.title}</td>
								<td>{paper.count}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			<div className="sessions">
				<h3 className="papers-title">Sessions ( {sessions.conferences} )</h3>
				<table className="table">
					<thead className="table-header">
						<tr>
							<td>Conference Session</td>
							<td>Number Of Presentations</td>
						</tr>
					</thead>
					<tbody className="table-body">
						<tr>
							<td>{sessions.conferences}</td>
							<td>{sessions.presentations}</td>
						</tr>
					</tbody>
				</table>
			</div>
		</section>
	);
};

export default Statistics;
