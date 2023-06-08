import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addSession, updatedSession } from "@/redux";

let formState = { name: "", paper: "", location: "", date: "", time: "" };
export function SchedualEditor({ setOpenWidget, process }) {
	const [session, setSession] = useState(formState);
	const [options, setOptions] = useState({ papers: [], locations: [], dates: [] });
	const state = useSelector((state) => state.sessions);
	const dispatch = useDispatch();

	useEffect(() => {
		setOptions((o) => (o = { ...o, locations: state.locations }));
		setOptions((o) => (o = { ...o, dates: state.dates }));
		setOptions((o) => (o = { ...o, papers: state.papers }));
	}, [state.locations, state.dates, state.papers]);

	useEffect(() => {
		setSession((s) => (s = state.updatedSession));
	}, [state.updatedSession]);

	const closeWidget = () => {
		setOpenWidget((o) => (o = false));
		setSession((s) => (s = formState));
	};

	const handleSession = ({ target: { name, value } }) => {
		setSession((s) => (s = { ...s, [name]: value }));
	};

	const handleSubmit = (event) => {
		event.preventDefault();

		if (process === "add") dispatch(addSession(session));
		if (process === "update") dispatch(updatedSession({ ...session, process: "update" }));

		closeWidget();
	};

	return (
		<div id="main-content">
			<form className="box sessionAdd-box" onSubmit={handleSubmit}>
				<i className="fa fa-times" style={{ marginLeft: "auto" }} onClick={closeWidget} />
				<h1 className="stitle homeTitle">Create A Session</h1>

				<div className="form-group line">
					<label className="sameline" htmlFor="name">
						Session Name:
					</label>
					<input type="text" name="name" value={session?.name} onChange={handleSession} placeholder="Enter The Session Name" required />
				</div>

				<div className="form-group line">
					<label className="sameline" htmlFor="paper">
						Papers:
					</label>
					<select name="paper" value={session?.paper} onChange={handleSession} required>
						<option value="">--Select a Paper--</option>
						{options.papers?.map((paper, i) => (
							<option value={paper} key={i}>
								{paper}
							</option>
						))}
					</select>
				</div>

				<div className="line form-group" id="location">
					<label className="sameline" htmlFor="location">
						Session Location:
					</label>
					<select name="location" value={session?.location} onChange={handleSession} required>
						<option value="">--Select a Location--</option>
						{options.locations?.map((location, i) => (
							<option value={location.name} key={i}>
								( {location.building_code} - {location.room} ) {location.name}
							</option>
						))}
					</select>
				</div>

				<div className="line form-group" id="date">
					<label className="sameline" htmlFor="session-date">
						Session Date:
					</label>
					<select name="date" value={session?.date} onChange={handleSession} required>
						<option value="">--Select a Date--</option>
						{options.dates?.map((date, i) => (
							<option value={date} key={i}>
								{date}
							</option>
						))}
					</select>
				</div>

				<div className="line form-group" id="date">
					<label className="sameline" htmlFor="session-time">
						Session Time:
					</label>
					<input type="time" name="time" value={session?.time} onChange={handleSession} required />
				</div>

				<input type="submit" className="addSBtn" id="add-session-btn" value={`${process} Session`} />
			</form>
		</div>
	);
}
