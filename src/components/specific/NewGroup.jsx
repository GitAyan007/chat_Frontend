import { useInputValidation } from "6pp";
import { Button, Dialog, DialogTitle, Skeleton, Stack, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useAsyncMutationHook, useErrors } from '../../hooks/hook';
import { useAvailableFriendsQuery, useNewGroupMutation } from '../../redux/api/api';
import { setIsNewGroup } from '../../redux/reducers/misc';
import UserItem from '../shared/UserItem';

const NewGroup = () => {

  const dispatch = useDispatch();
  const {isNewGroup} = useSelector((state)=>state.misc);

  const { isError, isLoading, error, data } = useAvailableFriendsQuery();
  const [newGroup, isNewGroupLoading] = useAsyncMutationHook(useNewGroupMutation)

  const groupName = useInputValidation("");

  const [selectedMembers, setselectedMembers] = useState([]);

  const Errors = [{
    isError,
    error
  }]
  useErrors(Errors);


  const selectMemberhandler = (_id) => {
    // add and remove members
    setselectedMembers((prev) => prev.includes(_id) ?
      prev.filter((currentID) => currentID !== _id) : [...prev, _id])
  }

  const submitHandler = () => {
    if(!groupName.value) return toast.error("Provide the Group Name");
    if(selectedMembers.length < 2) return toast.error("Atleast 3 members is required");
    

    newGroup("Creating New Group...",{name: groupName.value, members: selectedMembers})
    closeHandler();
  }

  const closeHandler=()=>{
    dispatch(setIsNewGroup(false));
  }

  return (
    <Dialog open={isNewGroup} onClose={closeHandler}>
      <Stack p={{ xs: "1rem", sm: "3rem" }} maxWidth={"25rem"} spacing={"2rem"} >
        <DialogTitle textAlign={"center"} variant='h4'>
          New Group
        </DialogTitle>

        <TextField
          label="Group Name"
          value={groupName.value}
          onChange={groupName.changeHandler}
          sx={{
            width: "100%"
          }}
        />

        <Typography variant='body1'>Members</Typography>

        <Stack>
          {
            isLoading ? (<Skeleton />) :
              data?.friends?.map((i) => (
                <UserItem user={i} key={i._id} handler={selectMemberhandler}
                  isAdded={selectedMembers.includes(i._id)}
                />
              ))
          }
        </Stack>

        <Stack direction={"row"} justifyContent={"space-evenly"}>
          <Button color='error' variant='text' size='large' onClick={closeHandler }>Cancel</Button>
          <Button variant='contained' size='large' onClick={submitHandler} disabled={isNewGroupLoading}>Create</Button>
        </Stack>
      </Stack>
    </Dialog>
  )
}

export default NewGroup