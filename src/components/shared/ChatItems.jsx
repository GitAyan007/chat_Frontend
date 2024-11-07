import React from 'react'
import { Link } from '../styles/StyledComponents'
import { Box, Stack, Typography } from '@mui/material'
import AvtarCard from './AvtarCard'
import { motion } from 'framer-motion';

const ChatItems = ({
  avatar = [],
  name,
  _id,
  groupChat = false,
  sameSender,
  newMessageAlert,
  index = 0,
  handleDeleteChat,
  isOnline
}) => {

  // console.log("newMessagesAlert2",newMessageAlert);
  return (
    <Link
      sx={{
        padding: "0"
      }}
      to={`/chat/${_id}`}

      onContextMenu={(e) => handleDeleteChat(e, _id, groupChat)}
    >

      <motion.div
        initial={{ opacity: 0, y: "-100%" }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{delay: index *0.1}}
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '1rem',
          backgroundColor: sameSender ? 'black' : 'unset',
          color: sameSender ? 'white' : 'unset',
          gap: '1rem',
          position: 'relative',
        }}>

        <AvtarCard avatar={avatar} />

        <Stack>
          <Typography>{name}</Typography>
          {
            newMessageAlert && (
              <Typography>
                {newMessageAlert.count} New {newMessageAlert.count > 0 ? "Messages" : "Message"}
              </Typography>)
          }
        </Stack>

        {
          isOnline && (
            <Box
              sx={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                backgroundColor: "green",
                position: "absolute",
                top: "50%",
                right: "1rem",
                transform: "translateY(-50%)",
              }}
            />
          )
        }
      </motion.div>
    </Link>
  )
}

export default ChatItems