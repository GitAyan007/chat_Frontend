import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./reducers/auth";
import api from "./api/api";
import miscSlice from "./reducers/misc";
import chatSlice from "./reducers/chat";


const store = configureStore({
    reducer: {
        [authSlice.name]: authSlice.reducer, // normal for react redux
        [miscSlice.name]: miscSlice.reducer,
        [chatSlice.name]: chatSlice.reducer,
        [api.reducerPath]:api.reducer,  // adding reducer of rtk query
    },
    middleware:(defaultMiddleWare)=>[...defaultMiddleWare(), api.middleware], // middle for rtk query
});

export default store;    
