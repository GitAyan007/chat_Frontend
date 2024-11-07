import { Add as AddIcon, Delete as DeleteIcon, Done as DoneIcon, Edit as EditIcon, KeyboardBackspace as KeyboardBackspaceIcon, Menu as MenuIcon } from "@mui/icons-material";
import { Backdrop, Box, Button, CircularProgress, Drawer, Grid, IconButton, Stack, TextField, Tooltip, Typography } from "@mui/material";
import React, { lazy, memo, Suspense, useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from 'react-router-dom';
import { LayoutLoader } from '../components/layout/Loaders';
import AvtarCard from '../components/shared/AvtarCard';
import UserItem from '../components/shared/UserItem';
import { Link } from '../components/styles/StyledComponents';
import { gardient } from "../constants/color";
import { useAsyncMutationHook, useErrors } from '../hooks/hook';
import { useChatDetailsQuery, useDeleteChatGroupMutation, useMyGroupsQuery, useRemoveMemberMutation, useReNameGroupMutation } from '../redux/api/api';
import { setIsAddMember } from "../redux/reducers/misc";
// import {LayoutLoader} from "../components/layout/Loaders" 

const ConfirmDeleteDialog = lazy(() => import("../components/dialogs/ConfirmDeleteDialog"));
const AddMemberDialog = lazy(() => import("../components/dialogs/AddMemberDialog"));



const Groups = () => {

  const chatId = useSearchParams()[0].get('group');

  const { isAddMember } = useSelector((state) => state.misc);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const myGroups = useMyGroupsQuery("");

  const groupDetails = useChatDetailsQuery({ chatId, populate: true }, { skip: !chatId });

  const [renameGroup, isLoadingGroupName] = useAsyncMutationHook(useReNameGroupMutation);
  const [removeMember, isLoadingRemoveMember] = useAsyncMutationHook(useRemoveMemberMutation);
  const [deleteGroup, isLoadingDeleteGroup] = useAsyncMutationHook(useDeleteChatGroupMutation);

  // for mobile view
  const [isMobileMenu, setisMobileMenu] = useState(false);
  // for enabling / disabling drawer
  const [isEdit, setisEdit] = useState(false);
  // edit group name
  const [groupName, setgroupName] = useState("");
  const [groupNameUpdated, setgroupNameUpdated] = useState("");
  // for deleting group
  const [confirmDeleteDialog, setconfirmDeleteDialog] = useState(false);

  const [members, setMembers] = useState([]);

  const Errors = [
    {
      isError: myGroups.isError,
      error: myGroups.error
    },
    {
      isError: groupDetails.isError,
      error: groupDetails.error
    },
  ];

  useErrors(Errors);

  useEffect(() => {
    // during unmount cleaning up 
    if (groupDetails.data) {
      setgroupName(groupDetails.data.chat.name);
      setgroupNameUpdated(groupDetails.data.chat.name);
      setMembers(groupDetails.data.chat.members);
    }

    return () => {
      setgroupName("");
      setgroupNameUpdated("");
      setMembers([]);
      setisEdit(false);
    }
  }, [groupDetails.data])


  const handleMobile = () => {
    setisMobileMenu((prev) => !prev);
  };

  const handleMobileClose = () => setisMobileMenu(false);

  const navigateBack = () => {
    navigate("/");
  };

  const updateGroupName = () => {
    setisEdit(false);
    renameGroup("Updating Group Name...", {
      chatId,
      name: groupNameUpdated
    })
  }

  const openConfirmDeletHandler = () => {
    setconfirmDeleteDialog(true)

  }

  const closeConfirmDeletHandler = () => {
    setconfirmDeleteDialog(false)
  }


  const openAddMemberHandler = () => {
    dispatch(setIsAddMember(true));
  };

  const deleteHandler = () => {
    deleteGroup("Deleteting Group ...", {chatId});
    closeConfirmDeletHandler();
    navigate("/groups");
    window.location.reload();
  }

  const removememberHanler = (_id) => {
    removeMember("Removing Member...", { userId: _id, chatId });
  }





  // ------------------>

  const IconBtns = (
    <>
      <Box sx={{
        display: {
          xs: "block",
          sm: "none",
          position: "fixed",
          right: "1rem",
          top: "1rem",
        }
      }}>
        <IconButton onClick={handleMobile}>
          <MenuIcon />
        </IconButton>
      </Box>

      <Tooltip title="back">
        <IconButton
          sx={{
            position: "absolute",
            top: "2rem",
            left: "2rem",
            backgroundColor: "#1c1c1c",
            color: "white",
            "&:hover": {
              bgcolor: "rgba(0,0,0,0.6)",
            }
          }}
          onClick={navigateBack}>
          <KeyboardBackspaceIcon />
        </IconButton>
      </Tooltip>
    </>
  );

  // --------------------------->

  const GroupName = (
    <Stack direction={"row"} alignItems={"center"} justifyContent={"center"} spacing={"1rem"}
      padding={"3rem"}>
      {
        isEdit ? (<>
          <TextField value={groupNameUpdated}
            onChange={(e) => setgroupNameUpdated(e.target.value)} />
          <IconButton onClick={updateGroupName} disabled={isLoadingGroupName}>
            <DoneIcon />
          </IconButton>
        </>) : (<>
          <Typography variant='h4'>{groupName}</Typography>
          <IconButton onClick={() => setisEdit(true)}>
            <EditIcon />
          </IconButton>
        </>)
      }
    </Stack>
  )

  // ---------------------->
  const ButtonGroup = (
    <Stack
      direction={{
        sm: "row",
        xs: "column-reverse",
      }}
      spacing={"1rem"}
      p={{
        xs: "0",
        sm: "1rem",
        md: "1rem 4rem",
      }}
    >
      <Button size='large' variant='contained' startIcon={<AddIcon />} onClick={openAddMemberHandler}>Add Member</Button>
      <Button size='large' color='error' startIcon={<DeleteIcon />} onClick={openConfirmDeletHandler}>Delete Group</Button>
    </Stack>
  )


  return myGroups.isLoading ? <LayoutLoader /> : (
    <Grid container height={"100vh"}>
      <Grid item
        sm={4}
        sx={{
          display: {
            xs: "none",
            sm: "block",
          },

        }}

      >
        <GroupList myGroups={myGroups?.data?.groups} chatId={chatId} />
      </Grid>

      <Grid item xs={12} sm={8}
        sx={{
          display: "flex",
          flexDirection: "column",
          position: "relative",
          padding: "1rem 3rem",
          alignItems: "center",
        }}
      >
        {IconBtns}
        {groupName &&
          <>
            {GroupName}

            <Typography margin={"2rem"} alignSelf={"flex-start"}
              variant='body1'
            >Members</Typography>
            <Stack
              maxWidth={"45rem"}
              borderRadius={"2rem"}
              width={"100%"}
              boxSizing={"border-box"}
              padding={{
                sm: "1rem",
                xs: "0",
                md: "1rem 4rem",
              }}
              spacing={"2rem"}
              sx={{
                backgroundImage: gardient
              }}
              height={"50vh"}
              overflow={"auto"}
            >
              {/* members */}
              {
                isLoadingRemoveMember ? <CircularProgress /> :
                  members.map((i) => (
                    <UserItem key={i._id} user={i} isAdded
                      styling={{
                        boxShadow: " 0 0 0.5rem rgba(0,0,0,0.2)",
                        padding: "1rem 2rem",
                        borderRadius: "1rem",
                      }}
                      handler={removememberHanler}
                    />
                  ))
              }
            </Stack>
            {ButtonGroup}
          </>
        }
      </Grid>

      {/* add members */}
      {
        isAddMember && (
          <Suspense fallback={<Backdrop open />}>
            <AddMemberDialog chatId={chatId} />
          </Suspense>
        )
      }

      {
        confirmDeleteDialog && (
          <Suspense fallback={<Backdrop open />}>
            <ConfirmDeleteDialog
              open={confirmDeleteDialog}
              handleClose={closeConfirmDeletHandler}
              deleteHandler={deleteHandler}
            />
          </Suspense>
        )
      }

      <Drawer open={isMobileMenu} onClose={handleMobileClose}
        sx={{
          display: {
            xs: "block",
            sm: "none",
          },

        }}
      >
        <GroupList w={'50vw'} myGroups={myGroups?.data?.groups} chatId={chatId} />
      </Drawer>
    </Grid>
  );
};

// ---------------------->

const GroupList = ({ w = "100%", myGroups = [], chatId }) => (
  <Stack width={w} sx={{
    backgroundImage: gardient,
    height: "100vh",
    overflow: "auto"
  }}>
    {
      myGroups.length > 0 ? (
        myGroups.map((group) => (
          <GroupListItems key={group._id} group={group} chatId={chatId} />
        ))
      ) : (<Typography textAlign={"center"} padding="1rem">No Groups </Typography>)
    }
  </Stack>
)

const GroupListItems = ({ group, chatId }) => {
  const { name, avatar, _id } = group;

  return <Link to={`?group=${_id}`} onClick={e => {
    if (chatId == _id) e.preventDefault();
  }}>
    <Stack direction={"row"} spacing={"1rem"} alignItems={"center"}>
      <AvtarCard avatar={avatar} />
      <Typography>{name}</Typography>
    </Stack>
  </Link>
}

export default memo(Groups)