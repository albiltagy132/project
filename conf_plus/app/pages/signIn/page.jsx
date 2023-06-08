"use client";
import { useEffect, useState } from "react";
import { fetchUsers } from "@/redux";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { signIn, getProviders, useSession } from "next-auth/react";

export default function Login() {
	const [error, setError] = useState("");
	const [user, setUser] = useState({ email: "", password: "password123" });
	const [providers, setProviders] = useState({});
	const { data: session } = useSession();
	const router = useRouter();
	const dispatch = useDispatch();

	useEffect(() => {
		document.title = "Login Page";
		(async () => {
			let providers = await getProviders();
			setProviders((p) => (p = providers));
		})();
	}, []);

	useEffect(() => {
		let user = localStorage.getItem("user");
		if (user && user?.id) window.location.href = "/";
	}, []);

	const handleSignIn = (id) => {
		signIn(id);
		localStorage.setItem("user", JSON.stringify(session.user));
		if (session.user.role === "reviewer") location.href = `/pages/reviews`;
		if (session.user.role === "organizer") location.href = `/pages/scheduals`;
	};

	const handleUser = ({ target: { name, value } }) => {
		setUser((u) => (u = { ...u, [name]: value }));
	};

	const handleSubmit = async () => {
		let { payload } = await dispatch(fetchUsers(`email=${user.email}&password=${user.password}`));

		if (!payload?.role) {
			setTimeout(() => setError((e) => (e = "")), 3000);
			return setError((e) => (e = "Email OR Password Is Not Correct"));
		}
		localStorage.setItem("user", JSON.stringify(payload));
		if (payload.role === "author") router.push("/pages/authors");
		if (payload.role === "reviewer") window.location.href = "/pages/reviews";
		if (payload.role === "organizer") window.location.href = "/pages/scheduals";
	};

	return (
		<div className="login-box box">
			<h2 className="homeTitle">Login</h2>
			<div id="error">{error}</div>
			<form className="logform">
				<div className="line">
					<label htmlFor="email">Email</label>
					<input type="text" className="usrpass" name="email" value={user.email} onChange={handleUser} required />
				</div>
				<div className="line">
					<label htmlFor="password">Password</label>
					<input type="password" className="usrpass" name="password" value={user.password} onChange={handleUser} required />
				</div>
				<div className="signup-btns">
					<button type="button" className="logbtn" onClick={handleSubmit}>
						Sign In
					</button>
					{providers?.google && (
						<button type="button" className="logbtn" onClick={() => handleSignIn(providers.google.id)}>
							<i className="fab fa-google" />
							Sign In By Google
						</button>
					)}
					{providers?.github && (
						<button type="button" className="logbtn" onClick={() => handleSignIn(providers.github.id)}>
							<i className="fab fa-github" />
							Sign In Github
						</button>
					)}
				</div>
			</form>
		</div>
	);
}
