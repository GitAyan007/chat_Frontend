import { Stack } from '@mui/material'
import React from 'react'
import ChatItems from '../shared/ChatItems'
import { gardient } from "../../constants/color";
import { useSelector } from 'react-redux';

const ChatList = ({ w = "100%", chats = [], chatId, onlineUers = [],
    handleDeleteChat }) => {

    const {newMessagesAlert} = useSelector((state)=>state.chat);


    // console.log("newMessagesAlert1", newMessagesAlert);
    return (
        <Stack width={w} direction={"column"}
            overflow={"auto"}
            height={"100%"}
            sx={{
                backgroundImage: gardient
            }}
        >
            {
                chats?.map((data, index) => {

                    const { avatar, _id, name, groupChat, members } = data;

                    const newMessageAlert = newMessagesAlert.find(
                        ({ chatId }) => chatId === _id
                    );

                    const isOnline = members?.some((member) => onlineUers.includes(member));
                    return (
                        <ChatItems
                            key={index}
                            index={index}
                            newMessageAlert={newMessageAlert}
                            isOnline={isOnline}
                            avatar={avatar}
                            name={name}
                            _id={_id}
                            groupChat={groupChat}
                            sameSender={chatId === _id}
                            handleDeleteChat={handleDeleteChat}
                        />
                    )
                })
            }
        </Stack>
    )
}

export default ChatList;