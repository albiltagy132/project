"use client";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchMatchingPaper = createAsyncThunk("Get The Matching Paper With reviewersIds", async (query) => {
	const response = await axios.get(`/api/reviews?${query}`);
	return response.data;
});

const reviewsSlice = createSlice({
	name: "authors",
	initialState: {
		loading: "loading",
	},
	reducers: {
		addNewReview: async (state, { payload }) => {
			await new Promise(async (resolve, reject) => {
				let response = await axios.post("/api/reviews", payload);
				if (response?.data) resolve(response.data);
				else reject(response.response);
			});
			return state;
		},
	},
});

export const { addNewReview } = reviewsSlice.actions;
export default reviewsSlice.reducer;
