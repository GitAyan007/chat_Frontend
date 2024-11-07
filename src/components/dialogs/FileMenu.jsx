import React, { useRef } from 'react'
import { ListItemText, Menu, MenuItem, MenuList, Tooltip } from "@mui/material";
import { useDispatch, useSelector } from 'react-redux';
import { setIsFileMenu, setuploadingLoader } from '../../redux/reducers/misc';
import { AudioFile as AudioFileIcon, Image as ImageIcon, UploadFile as UploadFileIcon, VideoFile as VideoFileIcon } from '@mui/icons-material';
import toast from 'react-hot-toast';
import { useSendAttachMentsMutation } from '../../redux/api/api';

const FileMenu = ({ anchorE1, chatId }) => {

    const { isFileMenu } = useSelector((state) => state.misc);
    const dispatch = useDispatch();

    const imageRef = useRef(null);
    const audioRef = useRef(null);
    const videoRef = useRef(null);
    const fileRef = useRef(null);

    const [sendAttachMents] = useSendAttachMentsMutation();

    const closeHandler = () => {
        dispatch(setIsFileMenu(false));
    }

    const selectRef = (ref) => {
        ref.current.click();
    };

    const fileChangeHandler = async(e, key) => {

        const files = Array.from(e.target.files);


        if(files.length <= 0) return;

        if(files.length > 5) toast.error(`You can only send 5 ${key} at a time.`);
         
        dispatch(setuploadingLoader(true));
        const toastId = toast.loading(`Sending ${files.length} ${key} ...`);
        closeHandler();

        // fetching starts
        try {
            const myform = new FormData();
            myform.append("chatId", chatId);
            files.forEach((file)=>myform.append("files", file));

            const res = await sendAttachMents(myform);

            
            if(res.data) toast.success(`${key} send successfully`, {id:toastId}); 
            else toast.error(`Failed to send ${key} pls try again`, {id:toastId});
        } catch (error) {
            toast.error(error, {id:toastId});
        }finally{
            dispatch(setuploadingLoader(false));
        }
    }




    return (
        <Menu open={isFileMenu} onClose={closeHandler} anchorEl={anchorE1}
        >
            <div style={{
                width: "10rem"
            }}>
                <MenuList>
                    <MenuItem onClick={()=>selectRef(imageRef)}>
                        <Tooltip title="Image ">
                            <ImageIcon />
                        </Tooltip>
                        <ListItemText style={{ marginLeft: "0.5rem" }}>Image</ListItemText>
                        <input type="file" multiple accept='image/png, image/jpeg, image/gif'
                            style={{ display: "none" }}
                            onChange={(e) => fileChangeHandler(e, "Images")}
                            ref={imageRef}
                        />
                    </MenuItem>


                    <MenuItem onClick={()=>selectRef(audioRef)}>
                        <Tooltip title="Audio ">
                            <AudioFileIcon />
                        </Tooltip>
                        <ListItemText style={{ marginLeft: "0.5rem" }}>Audio</ListItemText>
                        <input type="file" multiple accept='audio/mpeg, audio/wav'
                            style={{ display: "none" }}
                            onChange={(e) => fileChangeHandler(e, "Audios")}
                            ref={audioRef}
                        />
                    </MenuItem>


                    <MenuItem onClick={()=>selectRef(videoRef)}>
                        <Tooltip title="Video ">
                            <VideoFileIcon />
                        </Tooltip>
                        <ListItemText style={{ marginLeft: "0.5rem" }}>Video</ListItemText>
                        <input type="file" multiple accept='Video/mp4, Video/webm, Video/ogg'
                            style={{ display: "none" }}
                            onChange={(e) => fileChangeHandler(e, "Videos")}
                            ref={videoRef}
                        />
                    </MenuItem>


                    <MenuItem onClick={()=>selectRef(fileRef)}>
                        <Tooltip title="File ">
                            <UploadFileIcon />
                        </Tooltip>
                        <ListItemText style={{ marginLeft: "0.5rem" }}>File</ListItemText>
                        <input type="file" multiple accept='*'
                            style={{ display: "none" }}
                            onChange={(e) => fileChangeHandler(e, "Files")}
                            ref={fileRef}
                        />
                    </MenuItem>
                </MenuList>
            </div>
        </Menu>
    )
}

export default FileMenu