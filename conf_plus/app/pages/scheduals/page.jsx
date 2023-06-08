"use client";
import { Fragment, useEffect, useState } from "react";
import { SchedualEditor } from "@/components";
import { SchedualsSessions } from "@/components";
import { useSelector, useDispatch } from "react-redux";
import { fetchDates, fetchLocations, fetchPapers, fetchSessions } from "@/redux";

export default function Scheduals() {
	const [openWidget, setOpenWidget] = useState(false);
	const [process, setProcess] = useState("");
	const { sessions } = useSelector((s) => s);
	const dispatch = useDispatch();

	useEffect(() => {
		document.title = "Scheduals";
		let user = JSON.parse(localStorage.getItem("user"));
		if (!user || user.role !== "organizer") window.location.href = "/pages/signIn";

		dispatch(fetchDates());
		dispatch(fetchLocations());
		dispatch(fetchPapers());
		dispatch(fetchSessions());
	}, []);

	const open = () => {
		setOpenWidget((o) => !o);
		setProcess((p) => (p = "add"));
	};

	return (
		<div id="main-content">
			<input type="button" id="add-session" value="Add Session" onClick={open} />
			{sessions.loading === "loading" ? (
				<h1 style={{ fontSize: 33 }}>Loading...</h1>
			) : sessions.loading === "error" ? (
				<h1 style={{ fontSize: 33 }}>Error</h1>
			) : (
				<Fragment>
					{openWidget && <SchedualEditor setOpenWidget={setOpenWidget} process={process} />}
					{!openWidget && <SchedualsSessions setOpenWidget={setOpenWidget} setProcess={setProcess} />}
				</Fragment>
			)}
		</div>
	);
}
