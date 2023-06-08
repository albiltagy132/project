"use client";
import { configureStore } from "@reduxjs/toolkit";
import signInSlice from "@/redux/slices/signIn-slice";
import papersSlice from "@/redux/slices/papers-slice";
import reviewsSlice from "@/redux/slices/reviews-slice";
import sessionsSlice from "@/redux/slices/sessions-slice";

export const store = configureStore({
	reducer: {
		signIn: signInSlice,
		authors: papersSlice,
		reviews: reviewsSlice,
		sessions: sessionsSlice,
	},
});
