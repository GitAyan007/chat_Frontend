import { AttachFile as AttachFileIcon, Send as SendIcon } from '@mui/icons-material';
import { IconButton, Skeleton, Stack } from '@mui/material';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import FileMenu from '../components/dialogs/FileMenu';
import AppLayout from '../components/layout/AppLayout';
import MessageComponent from '../components/shared/MessageComponent';
import { InputBox } from '../components/styles/StyledComponents';
import { ALERT, CHAT_JOINED, CHAT_LEFT, NEW_MESSAGE, START_TYPING, STOP_TYPING } from '../constants/events';
import { useErrors, useSocketEvents } from '../hooks/hook';
import { useChatDetailsQuery, useGetMyMessagesQuery } from '../redux/api/api';
import { getSocket } from '../socket';
import { useInfiniteScrollTop } from '6pp'
import { useDispatch, useSelector } from 'react-redux';
import { setIsFileMenu } from '../redux/reducers/misc';
import { removeNewMessagesAlert } from '../redux/reducers/chat';
import { TypingLoader } from '../components/layout/Loaders';
import { useNavigate } from 'react-router-dom';


const Chat = ({ chatId, user }) => {

  const containRef = useRef(null);

  const dispatch = useDispatch();

  const socket = getSocket();

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState(1);
  const [fileMenuAnchor, setFileMenuAnchor] = useState(null);
  const [IamTyping, setIamTyping] = useState(false);
  const [userTyping, setUserTyping] = useState(false);
  const navigate = useNavigate();

  const typingTimeout = useRef(null);
  const bottomRef = useRef(null);


  // agar chat id hain to call hoga nahi to call nahi hoga
  const chatDetails = useChatDetailsQuery({ chatId, skip: !chatId });

  const oldMessagesChunk = useGetMyMessagesQuery({ chatId, page });


  const { data: oldMessages, setData: setOldMessages } = useInfiniteScrollTop(
    containRef,
    oldMessagesChunk.data?.totalPages,
    page,
    setPage,
    oldMessagesChunk?.data?.messages
  )



  const errors = [
    { isError: chatDetails.isError, error: chatDetails.error },
    { isError: oldMessagesChunk.isError, error: oldMessagesChunk.error }
  ];


  const members = chatDetails?.data?.chat?.members;




  // handler-------> 
  const SubmitHandler = (e) => {
    e.preventDefault();

    if (!message.trim()) return;


    // Emitting message to the server .. (best Explanation at 2:46 and 3:00:52 listen to it again)
    socket.emit(NEW_MESSAGE, { chatId, members, message });
    setMessage("");


    // console.log(message);
  }

  const handleFileOpen = (e) => {
    dispatch(setIsFileMenu(true));
    setFileMenuAnchor(e.currentTarget);
  }

  const messageOnChangeHandler = (e) => {
    setMessage(e.target.value);

    // emitting
    if (!IamTyping) {
      socket.emit(START_TYPING, { members, chatId });
      setIamTyping(true);
    }

    if (typingTimeout.current) clearTimeout(typingTimeout.current);

    typingTimeout.current = setTimeout(() => {
      socket.emit(STOP_TYPING, { members, chatId })
      setIamTyping(false);
    }, [2000]);
  }

  // yeh hain --> jab main chat change karung her ek chat ka alag alag content hain uskley reset karne kliye 
  useEffect(() => {
    socket.emit(CHAT_JOINED, {userId:user._id, members});

    // message notification 
    dispatch(removeNewMessagesAlert(chatId));

    return () => {
      setMessage("");
      setMessages([]);
      setPage(1);
      setOldMessages([]);
      socket.emit(CHAT_LEFT, {userId:user._id, members});
    }
  }, [chatId]);

  // scroll down always 
  useEffect(() => {
    if (bottomRef.current) bottomRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages])


  useEffect(()=>{
    if(chatDetails.isError) return navigate("/");
  },[chatDetails.isError]);


  // to listen the msg from backend/server ------------->

  // to prevent it from recreating i will wrap it with useCallback
  const NewMsgListener = useCallback((data) => {
    // console.log("Data: ", data);

    if (data.chatId !== chatId) return;
    setMessages((prev) => [...prev, data.message]);
  }, [chatId]);


  const StartTypingListener = useCallback((data) => {

    if (data.chatId !== chatId) return;
    // console.log("start - Typing", data);
    setUserTyping(true);
  }, [chatId]);

  const StopTypingListener = useCallback((data) => {

    if (data.chatId !== chatId) return;
    // console.log("stop - Typing", data);
    setUserTyping(false);
  }, [chatId]);

  const AlertListener = useCallback((data) => {

    if(data.chatId !== chatId) return;
    
    const alertMessage = {
      content: data.message,
      sender: {
        _id: Math.random() * 1000,
        name: "Admin"
      },
      chat: chatId,
      createdAt: new Date().toISOString(),
    }

    setMessages((prev)=> [...prev, alertMessage])
  }, [chatId]);


  const eventHandlers = {
    [NEW_MESSAGE]: NewMsgListener,
    [START_TYPING]: StartTypingListener,
    [STOP_TYPING]: StopTypingListener,
    [ALERT]: AlertListener,
  };

  // custom hook 
  useSocketEvents(socket, eventHandlers);
  useErrors(errors);


  const allMessages = [...oldMessages, ...messages];





  return chatDetails.isLoading ? <Skeleton /> : (
    <>
      <Stack ref={containRef}
        boxSizing={"border-box"}
        padding={"1rem"}
        spacing={"1rem"}
        bgcolor={"rgba(0,0,0,0.2)"}
        height={"90%"}
        sx={{
          overflowX: "hidden",
          overflowY: "auto",
        }}>

        {
          allMessages?.map((i) => (
            <MessageComponent key={i._id} message={i} user={user} />
          ))
        }

        {userTyping && <div ref={bottomRef}><TypingLoader/></div>}
        <div ref={bottomRef} />
      </Stack>

      <form style={{
        height: "10%"
      }}
        onSubmit={SubmitHandler}
      >

        <Stack direction={"row"} height={"100%"}
          padding={"1rem"}
          alignItems={"center"}
          position={"relative"}
        >


          <IconButton sx={{
            position: "absolute",
            left: "1rem",
            rotate: "30deg"
          }}
            onClick={handleFileOpen}
          >
            <AttachFileIcon />
          </IconButton>

          <InputBox placeholder='Type message here .. ' value={message}
            onChange={messageOnChangeHandler}
          />

          <IconButton type='submit'
            sx={{
              backgroundColor: "rgba(0,0,0,0.6)",
              color: "white",
              marginLeft: "1rem",
              padding: "0.5rem",
              "&:hover": {
                bgcolor: "rgba(0,0,0,0.3)",
              }
            }}>
            <SendIcon />
          </IconButton>
        </Stack>
      </form>

      <FileMenu anchorE1={fileMenuAnchor} chatId={chatId} />
    </>
  )
}

export default AppLayout()(Chat);