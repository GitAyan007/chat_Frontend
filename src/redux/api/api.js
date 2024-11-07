import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { server } from "../../constants/config";


const api = createApi({

    reducerPath: "api",
    baseQuery: fetchBaseQuery({ baseUrl: `${server}/api/v1/` }),

    tagTypes: ["Chat", "User", "Message"],

    endpoints: (builder) => ({
        // queries 👇👇
        myChats: builder.query({
            query: () => ({
                url: "chat/getmyChat",
                credentials: "include",
            }),
            providesTags: ["Chat"], // for query only
        }),

        myGroups: builder.query({
            query: () => ({
                url: "chat/getmyGroups",
                credentials: "include",
            }),
            providesTags: ["Chat"],
        }),


        searchUser: builder.query({
            query: (name) => ({
                url: `user/searchUser?name=${name}`,
                credentials: "include",
            }),
            providesTags: ["User"]
        }),

        getNotification: builder.query({
            query: () => ({
                url: "user/notifications",
                credentials: "include",
            }),
            keepUnusedDataFor: 0, // this means no caching
        }),

        chatDetails: builder.query({
            query: ({ chatId, populate = false }) => {

                let url = `chat/${chatId}`;
                if (populate) url += "?populate=true";

                return {
                    url,
                    credentials: "include",
                }
            },
            providesTags: ["Chat"],
        }),

        availableFriends: builder.query({
            query: (chatId) => {

                let url = `user/friends`;
                if (chatId) url += `?chatId=${chatId}`;

                return {
                    url,
                    credentials: "include",
                }
            },
            providesTags: ["Chat"],
        }),

        getMyMessages: builder.query({
            query: ({ chatId, page }) => ({
                url: `chat/getMessage/${chatId}?page=${page}`,
                credentials: "include",
            }),
            keepUnusedDataFor: 0,
        }),




        // Mutation👇👇
        sendFriendREQUEST: builder.mutation({
            query: (data) => ({
                url: "user/sendrequest",
                method: "PUT",
                credentials: "include",
                body: data,
            }),
            invalidatesTags: ["User"],
        }),

        acceptORrejectFriendREQUEST: builder.mutation({
            query: (data) => ({
                url: "user/acceptorRejectRequest",
                method: "PUT",
                credentials: "include",
                body: data,
            }),
            invalidatesTags: ["Chat"],
        }),

        sendAttachMents: builder.mutation({
            query: (data) => ({
                url: "chat/message",
                method: "POST",
                credentials: "include",
                body: data,
            }),
        }),

        newGroup: builder.mutation({
            query: ({ name, members }) => ({
                url: "chat/newGroupChat",
                method: "POST",
                credentials: "include",
                body: { name, members },
            }),
            invalidatesTags: ["Chat"],
        }),

        reNameGroup: builder.mutation({
            query: ({ chatId, name }) => ({
                url: `chat/${chatId}`,
                method: "PUT",
                credentials: "include",
                body: { name },
            }),
            invalidatesTags: ["Chat"],
        }),

        removeMember: builder.mutation({
            query: ({ userId ,chatId }) => ({
                url: "chat/removeMember",
                method: "PUT",
                credentials: "include",
                body: { userId ,chatId },
            }),
            invalidatesTags: ["Chat"],
        }),

        addMember: builder.mutation({
            query: ({ chatId, members }) => ({
                url: "chat/addMembers",
                method: "PUT",
                credentials: "include",
                body: { chatId, members },
            }),
            invalidatesTags: ["Chat"],
        }),


        deleteChatGroup: builder.mutation({
            query: (chatId) => ({
                url: `chat/${chatId}`,
                method: "DELETE",
                credentials: "include",
            }),
            invalidatesTags: ["Chat"],
        }),

        leaveGroup: builder.mutation({
            query: (chatId) => ({
                url: `chat/leaveGroup/${chatId}`,
                method: "DELETE",
                credentials: "include",
            }),
            invalidatesTags: ["Chat"],
        }),

    }),
});

export default api;
export const { useMyChatsQuery,
    useLazySearchUserQuery,
    useSendFriendREQUESTMutation, 
    useGetNotificationQuery,
    useAcceptORrejectFriendREQUESTMutation,
    useChatDetailsQuery,
    useGetMyMessagesQuery,
    useSendAttachMentsMutation,
    useMyGroupsQuery,
    useAvailableFriendsQuery,
    useNewGroupMutation,
    useReNameGroupMutation,
    useRemoveMemberMutation,
    useAddMemberMutation,
    useDeleteChatGroupMutation,
    useLeaveGroupMutation
} = api; // as custom hook