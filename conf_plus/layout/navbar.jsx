"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import "@/public/fontAwasome.css";

let navLinks = [
	{ path: "/pages/view-session", name: "View Sessions" },
	{ path: "/pages/statistics", name: "Statistics" },
	{ path: "/pages/signIn", name: "Sign In" },
];

let formState = { fName: "", lName: "", email: "", password: "", role: "" };
export function Navbar() {
	const [open, setOpen] = useState(false);
	const [user, setUser] = useState(formState);

	useEffect(() => {
		window.scrollX > 700 ? setOpen(true) : setOpen(false);
		let user = JSON.parse(localStorage.getItem("user")) || formState;
		setUser((u) => (u = user));
	}, []);

	return (
		<header className="header">
			<div>
				<div style={{ display: "flex", justifyContent: "space-between" }}>
					<Link className="logo" href="/">
						Academic Conflus 2023
					</Link>
					{open ? <i className="fa fa-times mobile-icon" onClick={() => setOpen(false)} /> : <i className="fa fa-bars mobile-icon" onClick={() => setOpen(true)} />}
				</div>
			<div style={{ display: "flex", alignItems: "center" }}>
				{user?.id && (
						<h4>
							{user?.fName} {user?.lName} ( {user?.role} )
						</h4>
				)}
				{open ? <i className="fa fa-times desktop-icon" onClick={() => setOpen(false)} /> : <i className="fa fa-bars desktop-icon" onClick={() => setOpen(true)} />}
			</div>
			</div>
			{open && (
				<ul className="main-nav">
					{navLinks.map((link) => (
						<li onClick={() => setOpen((o) => (o = false))} key={link.name}>
							<Link href={link.path}>{link.name}</Link>
						</li>
					))}
				</ul>
			)}
		</header>
	);
}
