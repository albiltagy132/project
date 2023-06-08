"use client";

import { useEffect } from "react";
import axios from "axios";

export default function HomePage() {
	useEffect(() => {
		(async () => {
			let users = await axios.get("/api/signIn?type=All");
			if (!users.data.length) axios.get("/api/seeds?type=users");

			let locations = await axios.get("/api/sessions?type=locations");
			if (!locations.data.length) axios.get("/api/seeds?type=locations");
		})();
	}, []);

	return (
		<div id="main-content" style={{ maxWidth: 1190, marginInline: "auto" }}>
			<div className="box" id="center">
				<h2 className="homeTitle" id="homeTitle">
					Welcome to ConfPlus
				</h2>
				<h3 className="subTitle">Your All-in-One Conference Management System</h3>
				<p className="homeTxt">
					Welcome to ConfPlus, your all-in-one solution for conference management. Our platform offers a comprehensive suite of tools and features designed to help you streamline and
					organize your conference planning process from start to finish. Whether you're hosting a small event or a large-scale conference, ConfPlus has everything you need to ensure its
					success.
					<br />
					<br />
					With ConfPlus, you can easily manage speaker submissions, attendee registrations, session schedules, and more. Our intuitive interface makes it easy to navigate and use, while our
					customizable features allow you to tailor the platform to your specific needs. Plus, our robust reporting and analytics tools provide valuable insights into attendee engagement and
					event success.
					<br />
					<br />
					Thank you for choosing ConfPlus as your conference management system. We're excited to help you create an exceptional event that exceeds your expectations.
				</p>
				{/* <button className="buybtn">Buy Tickets</button>  */}
			</div>
		</div>
	);
}
