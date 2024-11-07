import { Avatar, Stack, ListItem, Typography, IconButton } from '@mui/material';
import React, { memo } from 'react'
import { Add as AddIcon, Remove as RemoveIcon } from "@mui/icons-material";
import {transformImage} from '../../lib/features'

const UserItem = ({ user, handler, handlerIsLoading, isAdded = false, styling={} }) => {
    const { name, _id, avatar } = user;
    return (
        <ListItem>
            <Stack direction={"row"} spacing={"1rem"} width={"100%"}
                alignItems={"center"}
                {...styling}
            >
                <Avatar src={avatar}/>
                <Typography variant='body1'
                    sx={{
                        flexGrow:1,
                        //agar jada bara name hoto dot dot karke chota jo jata hain
                        display: "-webkit-box",
                        WebkitLineClamp:1,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        fontWeight: "600"
                    }}
                >{name}
                </Typography>

                <IconButton 
                size='small'
                sx={{
                    bgcolor: isAdded? "error.main":  "primary.main",
                    color:"white",
                    "&:hover":{
                        bgcolor: isAdded? "error.dark":  "primary.dark"
                    }
                }}
                onClick={()=>handler(_id)} disabled={handlerIsLoading}>
                     {
                        isAdded ? <RemoveIcon/> : <AddIcon />
                     }
                    
                </IconButton>
            </Stack>
        </ListItem>
    )
}

export default memo(UserItem);