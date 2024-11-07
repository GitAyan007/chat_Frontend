import { Button, Dialog, DialogTitle, Skeleton, Stack, Typography } from '@mui/material'
import React, { useState } from 'react'
import { SampleUSers } from "../../constants/SampleData";
import UserItem from "../shared/UserItem";
import { useAsyncMutationHook, useErrors } from '../../hooks/hook';
import { useAddMemberMutation, useAvailableFriendsQuery } from '../../redux/api/api';
import { useDispatch, useSelector } from 'react-redux';
import { setIsAddMember } from '../../redux/reducers/misc';

const AddMemberDialog = ({  chatId }) => {
    
    const [selectedMembers, setselectedMembers] = useState([]);

    const {isLoading, data, isError, error} = useAvailableFriendsQuery(chatId);

    // console.log("data", data.friends);
    
    const {isAddMember} = useSelector((state)=> state.misc);
    const dispatch = useDispatch();
    const [addMember, isLoadingaddMember] = useAsyncMutationHook(useAddMemberMutation);


    const selectMemberhandler = (_id) => {
        // add and remove members
        setselectedMembers((prev) => prev.includes(_id) ?
            prev.filter((currentID) => currentID !== _id) : [...prev, _id])
    }


    const addMemberHandler = () => {
        addMember("Adding new member", {chatId, members: selectedMembers})
        closeHandler();
    };
    const closeHandler = () => {
        dispatch(setIsAddMember(false));
    };

    useErrors([{isError, error}]);


    return (
        <Dialog open={isAddMember} onClose={closeHandler}>
            <Stack spacing={"2rem"} width={"20rem"} p={"2rem"}>
                <DialogTitle textAlign={"center"}>Add Member</DialogTitle>

                <Stack>
                    {isLoading? <Skeleton/> : data?.friends?.length > 0 ? (
                        data?.friends?.map((i) => (
                            <UserItem key={i._id} user={i} handler={selectMemberhandler}
                                isAdded={selectedMembers.includes(i._id)} />
                        ))) : (
                        <Typography textAlign={"center"}>No Friends</Typography>
                    )
                    }
                </Stack>
                <Stack direction={"row"} spacing={"2rem"} justifyContent={"center"}>
                    <Button variant='contained' disabled={isLoadingaddMember} onClick={addMemberHandler}>Add</Button>
                    <Button color='error' onClick={closeHandler}>Cancel</Button>
                </Stack>
            </Stack>
        </Dialog>
    )
}

export default AddMemberDialog