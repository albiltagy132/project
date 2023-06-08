"use client";
import { SessionProvider } from "next-auth/react";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "@/redux/store";

export const Provider = ({ children, session }) => {
	return (
		<SessionProvider session={session}>
			<ReduxProvider store={store}>{children}</ReduxProvider>
		</SessionProvider>
	);
};
