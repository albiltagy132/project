"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDates } from "@/redux";
import axios from "axios";

export default function ViewSession() {
	const [sessions, setSessions] = useState([]); // filtered Sessions
	const [selected, setSelected] = useState("");
	const [loading, setLoading] = useState("loading");
	const { sessions: state } = useSelector((state) => state);
	const dispatch = useDispatch();

	useEffect(() => {
		document.title = "View Sessions";
		dispatch(fetchDates());
	}, []);

	useEffect(() => {
		// GET The Matching Session With Date With This Presenters
		(async () => {
			setLoading((l) => (l = "loading"));
			let sessions = await axios.get(`/api/view-sessions?date=${selected || "All"}`);
			setSessions((s) => (s = sessions.data));
			setLoading((l) => (l = "Done"));
		})();
	}, [selected]);

	return (
		<div className="box sessionAdd-box">
			<h1 className="homeTitle">Conference Schedule</h1>
			<h2>Filter Schedule by Date</h2>
			<div className="line">
				<label htmlFor="filter-date" style={{ whiteSpace: "nowrap" }}>
					Select Date:
				</label>
				<select name="session-date" value={selected} onChange={(e) => setSelected((s) => (s = e.target.value))} required>
					<option value="">--Select A Date--</option>
					{state.dates.map((date, i) => (
						<option value={date} key={i}>
							{date}
						</option>
					))}
				</select>
			</div>
			<h2>Sessions</h2>
			<hr />
			<ul id="sessions-list">
				{loading === "loading" && <h1 style={{ color: "green" }}>Loading...</h1>}
				{loading === "Done" && !sessions.length && <h1 style={{ color: "red" }}>No Sessions Found</h1>}
				{loading === "Done" &&
					sessions.map((session, i) => (
						<li key={i}>
							<h3>{session.name}</h3>
							<p>
								<strong>Date:</strong> {session.date}
							</p>
							<p>
								<strong>Time:</strong> {session.time}
							</p>
							<p>
								<strong>Location:</strong> {session.location}
							</p>
							<p>
								<strong>Paper:</strong> {session.paper}
							</p>
							<p>
								<strong>Presenter:</strong>
								{session.presenters?.join(" & ")}
							</p>
							<hr />
						</li>
					))}
			</ul>
		</div>
	);
}
