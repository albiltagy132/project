import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { PrismaClient } from "@prisma/client";

const handler = NextAuth({
	providers: [
		GithubProvider({
			clientId: process.env.GITHUB_ID,
			clientSecret: process.env.GITHUB_SECRET,
		}),
		GoogleProvider({
			clientId: process.env.GOOGLE_ID,
			clientSecret: process.env.GOOGLE_SECRET,
		}),
	],
	callbacks: {
		async session({ session, a, b, c, d }) {
			const prisma = new PrismaClient();
			try {
				await prisma.$connect();
				const sessionUser = await prisma.users.findFirst({ where: { email: session.user.email } });
				session.user = sessionUser;
				return session;
			} catch (error) {
				console.log(error);
			} finally {
				await prisma.$disconnect();
			}
		},
		async signIn({ account, profile, user, credentials }) {
			const prisma = new PrismaClient();
			try {
				await prisma.$connect();

				const userExists = await prisma.users.findMany({ where: { email: profile.email } });

				if (!userExists.length) {
					let [fName, lName] = profile.name.split(" ");
					if (account.provider === "google") {
						await prisma.users.create({
							data: {
								email: profile.email,
								fName: fName,
								lName: lName || "",
								password: "password123",
								role: "reviewer",
							},
						});
					}
					if (account.provider === "github") {
						await prisma.users.create({
							data: {
								email: profile.email,
								fName: fName,
								lName: lName || "",
								password: "password123",
								role: "organizer",
							},
						});
					}
				} else {
					if (account.provider === "github") {
						await prisma.users.update({
							where: { email: userExists[0].email },
							data: { role: "organizer" },
						});
					}
					if (account.provider === "google") {
						await prisma.users.update({
							where: { email: userExists[0].email },
							data: { role: "reviewer" },
						});
					}
				}

				return true;
			} catch (error) {
				console.log("Error checking if user exists: ", error.message);
				return false;
			} finally {
				await prisma.$disconnect();
			}
		},
	},
});

export { handler as GET, handler as POST };
