"use client";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchDates = createAsyncThunk("Dates", async () => {
	const response = await axios.get("/api/sessions?type=dates");
	return response.data;
});

export const fetchLocations = createAsyncThunk("Locations", async () => {
	const response = await axios.get("/api/sessions?type=locations");
	return response.data;
});

export const fetchPapers = createAsyncThunk("papers titles", async () => {
	const response = await axios.get("/api/sessions?type=papersTitles");
	return response.data;
});

export const fetchSessions = createAsyncThunk("Sessions", async () => {
	const response = await axios.get("/api/sessions?type=sessions");
	return response.data;
});

const sessionsSlice = createSlice({
	name: "sessions",
	initialState: {
		loading: "loading",
		locations: [],
		dates: [],
		papers: [],
		sessions: [],
		updatedSession: { name: "", paper: "", location: "", date: "", time: "" },
	},
	reducers: {
		addSession: (state, { payload }) => {
			try {
				axios.post("/api/sessions", payload);
				state.sessions.push(payload);
			} catch (error) {
				console.error(error);
			}
		},

		updatedSession: (state, { payload }) => {
			let { process, id, ...body } = payload;
			let index = state.sessions.findIndex((session) => session.id === id);

			if (process === "info" && index !== -1) state.updatedSession = state.sessions[index];
			if (process === "update" && index !== -1) {
				state.sessions.splice(index, 1, { id, ...body });
				axios.put(`/api/sessions?id=${id}`, body);
			}
		},

		deleteSession: (state, { payload }) => {
			let index = state.sessions.findIndex((session) => session.id === payload);
			state.sessions.splice(index, 1);
			axios.delete(`/api/sessions?id=${payload}`);
		},
	},

	extraReducers: {
		[fetchDates.pending]: (state) => {
			state.loading = "loading";
		},
		[fetchDates.fulfilled]: (state, { payload }) => {
			state.loading = "success";
			state.dates = payload;
		},
		[fetchDates.rejected]: (state) => {
			state.loading = "error";
		},

		[fetchLocations.pending]: (state) => {
			state.loading = "loading";
		},
		[fetchLocations.fulfilled]: (state, { payload }) => {
			state.loading = "success";
			state.locations = payload;
		},
		[fetchLocations.rejected]: (state) => {
			state.loading = "error";
		},

		[fetchPapers.pending]: (state) => {
			state.loading = "loading";
		},
		[fetchPapers.fulfilled]: (state, { payload }) => {
			state.loading = "success";
			state.papers = payload;
		},
		[fetchPapers.rejected]: (state) => {
			state.loading = "error";
		},

		[fetchSessions.pending]: (state) => {
			state.loading = "loading";
		},
		[fetchSessions.fulfilled]: (state, { payload }) => {
			state.loading = "success";
			state.sessions = payload;
		},
		[fetchSessions.rejected]: (state) => {
			state.loading = "error";
		},
	},
});

export const { addSession, updatedSession, deleteSession } = sessionsSlice.actions;
export default sessionsSlice.reducer;
