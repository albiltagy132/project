"use client";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchUsers = createAsyncThunk("getUsers", async (query) => {
	const response = await axios.get(`/api/signIn?${query}`);
	return response.data;
});

const signInSlice = createSlice({
	name: "signIn",
	initialState: {
		loading: "loading",
		error: null,
		users: [],
		user: {},
	},
	reducers: {},

	extraReducers: {
		[fetchUsers.pending]: (state) => {
			state.loading = "loading";
		},
		[fetchUsers.fulfilled]: (state, { payload }) => {
			state.loading = "success";
			if (payload?.length) state.users = payload;
			else state.user = payload;
		},
		[fetchUsers.rejected]: (state, payload) => {
			state.loading = "error";
			state.error = "Email Or Password Is Not Currect";
		},
	},
});

export const {} = signInSlice.actions;
export default signInSlice.reducer;
