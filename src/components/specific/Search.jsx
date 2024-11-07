import { useInputValidation } from "6pp";
import { Search as SearchIcon } from '@mui/icons-material';
import { Dialog, DialogTitle, InputAdornment, List, Stack, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAsyncMutationHook } from '../../hooks/hook';
import { useLazySearchUserQuery, useSendFriendREQUESTMutation } from '../../redux/api/api';
import { setIsSearch } from '../../redux/reducers/misc';
import UserItem from '../shared/UserItem';


const Search = () => {
  const search = useInputValidation("");


  // custom hook
  const [sendFriendRequest, isLoadingSendFriendRequest] = useAsyncMutationHook(useSendFriendREQUESTMutation);

  const addFriendHandler = async (_id) => {
    await sendFriendRequest("Sending friend request...", {userId: _id});
  }

  const { isSearch } = useSelector((state) => state.misc);
  const dispatch = useDispatch();

  // api from rtk
  const [searchUser] = useLazySearchUserQuery();


  const [users, setusers] = useState([]);

  const searchCloseHandler = () => dispatch(setIsSearch(false));


  // fetching users handling -------->

  useEffect(() => {

    // Debouncing

    const timeOutID = setTimeout(() => {
      searchUser(search.value)
        .then(({ data }) => setusers(data.users))
        .catch((e) => console.log(e));
    }, 500);

    return () => {
      clearTimeout(timeOutID);
    }
  }, [search.value])



  return (
    <Dialog open={isSearch} onClose={searchCloseHandler}>
      <Stack padding={"2rem"} direction={"column"} width={"25rem"}>
        <DialogTitle textAlign={"center"}>Find People</DialogTitle>
        <TextField label="Find.."
          value={search.value}
          onChange={search.changeHandler}
          variant='outlined'
          size='small'
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>

            )
          }}
        />
        {/* list of user whom u can add as your friend to chat  */}
        <List>
          {
            users.map((i) => (
              <UserItem user={i} key={i._id} handler={addFriendHandler}
                handlerIsLoading={isLoadingSendFriendRequest}
              />
            ))
          }
        </List>
      </Stack>
    </Dialog>
  )
}

export default Search