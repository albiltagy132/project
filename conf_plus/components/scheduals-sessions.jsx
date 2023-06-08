import { useDispatch, useSelector } from "react-redux";
import { updatedSession, deleteSession } from "@/redux";

export function SchedualsSessions({ setOpenWidget, setProcess }) {
	const state = useSelector(({ sessions }) => sessions);
	const sessions = state.sessions;
	const dispatch = useDispatch();

	const handleUpdate = (id) => {
		dispatch(updatedSession({ id, process: "info" }));
		setOpenWidget((o) => (o = true));
		setProcess((p) => (p = "update"));
	};

	const handleDelete = (id) => {
		dispatch(deleteSession(id));
	};

	return (
		<div id="session-container">
			{sessions.map((session, i) => (
				<div className="box session-box" key={i}>
					<div className="content">
						<h2 className="">{session.name}</h2>
					</div>
					<p className="homeTxt">Paper: {session.paper}</p>
					<p className="homeTxt">Location: {session.location}</p>
					<div className="artbtm">
						<span>
							{session.date} | {session.time}
						</span>
						<div>
							<button className="sessionbtn" onClick={() => handleUpdate(session.id)}>
								edit
							</button>
							<button className="sessionbtn red" onClick={() => handleDelete(session.id)}>
								delete
							</button>
						</div>
					</div>
				</div>
			))}
		</div>
	);
}
