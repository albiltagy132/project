"use client";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchRandomReviewers = createAsyncThunk("Get Random Reviewers", async (query) => {
	const response = await axios.get(`/api/papers?${query}`);
	return response.data;
});

const papersSlice = createSlice({
	name: "authors",
	initialState: {
		loading: "loading",
		error: null,
	},
	reducers: {
		addNewPaper: async (state, { payload }) => {
			await new Promise(async (resolve, reject) => {
				let response = await axios.post("/api/papers", payload);
				if (response?.data) resolve(response.data);
				else reject(response?.response);
			});
		},
	},
});

export const { addNewPaper } = papersSlice.actions;
export default papersSlice.reducer;
