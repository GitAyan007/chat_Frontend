import { Drawer, Grid, Skeleton } from "@mui/material";
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useErrors, useSocketEvents } from '../../hooks/hook';
import { useMyChatsQuery } from '../../redux/api/api';
import { setIsDeleteMenu, setIsMobileMenu, setselectedDeleteChat } from '../../redux/reducers/misc';
import { getSocket } from '../../socket';
import Title from '../shared/Title';
import ChatList from '../specific/ChatList';
import Profile from '../specific/Profile';
import Header from './Header';
import { NEW_MESSAGE_ALERT, NEW_REQUEST, ONLINE_USERS, REFETCH_CHATS } from "../../constants/events";
import { incrementNotification, setNewMessagesAlert } from "../../redux/reducers/chat";
import { getOrSaveFromLocalStorage } from "../../lib/features";
import DeleteChatMenu from "../dialogs/DeleteChatMenu";

const AppLayout = () => (WrappedComponent) => {
    return (props) => {

        const params = useParams();
        const chatId = params.chatId;

        const deleteMenuAnchor = useRef(null);

        const navigate = useNavigate();

        const socket = getSocket();
        // console.log(socket.id);

        const { isMobileMenu } = useSelector((state) => state.misc);
        const { user } = useSelector((state) => state.auth);
        const { newMessagesAlert } = useSelector((state) => state.chat);
        // console.log("newMessagesAlert",newMessagesAlert);
        const [onlineUsers, setOnlineUsers] = useState([]);


        // console.log(isMobileMenu);
        const dispatch = useDispatch();

        const { isLoading, data, isError, error, refetch } = useMyChatsQuery("");
        // console.log("User", data);



        useErrors([{ isError, error }]);

        useEffect(() => {
            getOrSaveFromLocalStorage({ key: NEW_MESSAGE_ALERT, value: newMessagesAlert })
        }, [newMessagesAlert]);



        const handleDeleteChat = (e, chatId, groupChat) => {
            dispatch(setIsDeleteMenu(true));
            dispatch(setselectedDeleteChat({ chatId, groupChat }))
            e.preventDefault();
            deleteMenuAnchor.current = e.currentTarget;
        }

        const handleMobileClose = () => dispatch(setIsMobileMenu(false));

        const NewMsgAlertListener = useCallback((data) => {
            // usko msg wala notifcation nahi dikhega Example:2 New Messages nahi dikhega 
            if (data.chatId === chatId) return;
            dispatch(setNewMessagesAlert(data));
        }, [chatId]);

        const NewRequestListener = useCallback(() => {
            dispatch(incrementNotification());
        }, [dispatch]);

        const refetchListener = useCallback(() => {
            refetch();
            navigate("/");
        }, [refetch, navigate]);

        const OnlineUserListener = useCallback((data) => {
            setOnlineUsers(data);
        }, []);

        const eventHandlers = {
            [NEW_MESSAGE_ALERT]: NewMsgAlertListener,
            [NEW_REQUEST]: NewRequestListener,
            [REFETCH_CHATS]: refetchListener,
            [ONLINE_USERS]: OnlineUserListener,
        };

        // custom hook 
        useSocketEvents(socket, eventHandlers);


        return (
            <>
                <Title />
                <Header />

                <DeleteChatMenu dispatch={dispatch} deleteMenuAnchor={deleteMenuAnchor} />

                {
                    isLoading ? <Skeleton /> : (
                        <Drawer open={isMobileMenu} onClose={handleMobileClose}>
                            <ChatList
                                w="70vw"
                                chats={data?.chats} chatId={chatId}
                                handleDeleteChat={handleDeleteChat}
                                // newMessagesAlert={newMessagesAlert}
                                onlineUers={onlineUsers}
                            />
                        </Drawer>
                    )
                }

                <Grid container height={"calc(100vh - 4rem)"}>
                    <Grid item
                        sm={4}
                        md={3}
                        sx={{
                            display: { xs: "none", sm: "block" },
                        }}
                        height={"100%"}>

                        {
                            isLoading ? (<Skeleton />) :
                                <ChatList chats={data?.chats} chatId={chatId}
                                    handleDeleteChat={handleDeleteChat}
                                    onlineUers={onlineUsers}
                                />
                        }



                    </Grid>

                    <Grid item xs={4} sm={8} md={5} lg={6} height={"100%"} >
                        <WrappedComponent {...props} chatId={chatId} user={user} />
                    </Grid>

                    <Grid item md={4} lg={3} height={"100%"}
                        sx={{
                            display: { xs: "none", md: "block" },
                            padding: "2rem",
                            bgcolor: "black",
                        }}
                    >


                        <Profile user={user} />
                    </Grid>
                </Grid>



            </>
        );
    };
};

export default AppLayout;