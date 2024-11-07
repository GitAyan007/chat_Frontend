import { Menu, Stack, Typography } from '@mui/material'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { setIsDeleteMenu } from '../../redux/reducers/misc';
import { Delete as DeleteIcon, ExitToApp as ExitToAppIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAsyncMutationHook } from '../../hooks/hook';
import { useDeleteChatGroupMutation, useLeaveGroupMutation } from '../../redux/api/api';

const DeleteChatMenu = ({ dispatch, deleteMenuAnchor }) => {

    const { isDeleteMenu, selectedDeleteChat } = useSelector((state) => state.misc);
    const navigate = useNavigate();

    // console.log(selectedDeleteChat);
    const closeHandler = () => {
        dispatch(setIsDeleteMenu(false));
        deleteMenuAnchor.current = null;
    }

    const [DeleteChat, _, DeleteChatdata] = useAsyncMutationHook(useDeleteChatGroupMutation);
    const [LeaveGroup, __, LeaveGroupdata] = useAsyncMutationHook(useLeaveGroupMutation);

    const isGroup =  selectedDeleteChat.groupChat;

    const leaveGroup = () => {
        closeHandler();
        LeaveGroup("Leaving Group", selectedDeleteChat.chatId);
    };
    const deleteChat = () => {
        closeHandler();
        DeleteChat("Deleting Chat", selectedDeleteChat.chatId);
    };

    useEffect(() => {
        if (DeleteChatdata || LeaveGroupdata) navigate("/");
    }, [DeleteChatdata, LeaveGroupdata]);

    return (
        <Menu open={isDeleteMenu} onClose={closeHandler} anchorEl={deleteMenuAnchor.current}
            anchorOrigin={{
                vertical: "bottom",
                horizontal: "right"
            }}
            transformOrigin={{
                vertical: "center",
                horizontal: "center"
            }}
        >
            <Stack
                sx={{
                    width: "10rem",
                    padding: "0.5rem",
                    cursor: "pointer",
                }}

                direction={"row"}
                alignItems={"center"}
                spacing={"0.5rem"}
                onClick={isGroup ? leaveGroup : deleteChat}
            >
                {
                    selectedDeleteChat.groupChat ?
                        <>
                            <ExitToAppIcon />
                            <Typography>Leave Group</Typography>
                        </> :
                        <>
                            <DeleteIcon />
                            <Typography>Delete Chat</Typography>
                        </>
                }
            </Stack>
        </Menu>
    )
}

export default DeleteChatMenu