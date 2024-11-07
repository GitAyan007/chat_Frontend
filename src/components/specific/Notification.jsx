import { Avatar, Button, Dialog, DialogTitle, ListItem, Skeleton, Stack, Typography } from '@mui/material'
import React, { memo } from 'react'
import toast from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import { useErrors } from '../../hooks/hook'
import { useAcceptORrejectFriendREQUESTMutation, useGetNotificationQuery } from '../../redux/api/api'
import { setIsNotification } from '../../redux/reducers/misc'

const Notification = () => {

  const { isNotification } = useSelector((state) => state.misc);
  const dispatch = useDispatch();
  const onCloseNotification = () => dispatch(setIsNotification(false));


  const { isLoading, data, error, isError } = useGetNotificationQuery();

  const [acceptRequest] = useAcceptORrejectFriendREQUESTMutation();


  const friendNotificationHandler = async ({ _id, accept }) => {
    dispatch(setIsNotification(false));
    try {
      const res = await acceptRequest({ requestId: _id, accept });

      // use of socket here
      if (res.data?.success) {
        console.log("Use Socket Here");
        toast.success(res.data.message);
      } else {
        toast.error(res?.data?.error || "Something went Wrong");
      }

    } catch (error) {
      toast.error("Something Went Wrong!!");
      console.log(error);
    }
  }

  useErrors([{ error, isError }]);
  // console.log("Data: ", data);

  return (
    <Dialog open={isNotification} onClose={onCloseNotification}>
      <Stack p={{ xs: "1rem", sm: "2rem" }} maxWidth={"25rem"}>
        <DialogTitle>
          Notifications
        </DialogTitle>

        {
          isLoading ? <Skeleton /> :
            <>
              {
                data?.requests.length > 0 ?
                  (
                    data?.requests.map(({ sender, _id }) => (
                      <NotificationItem key={_id}
                        sender={sender}
                        _id={_id}
                        handler={friendNotificationHandler}
                      />))
                  )
                  :
                  (<Typography textAlign={"center"}> No New Notification</Typography>)
              }
            </>
        }

      </Stack>
    </Dialog>
  )
}

const NotificationItem = memo(({ sender, _id, handler }) => {
  const { avatar, name } = sender;

  return (
    <ListItem>
      <Stack direction={"row"} spacing={"1rem"} width={"100%"}
        alignItems={"center"}
      >
        <Avatar src={avatar} />
        <Typography variant='body1'
          sx={{
            flexGrow: 1,
            //agar jada bara name hoto dot dot karke chota jo jata hain
            display: "-webkit-box",
            WebkitLineClamp: 1,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >{`${name} send you a friend Request`}
        </Typography>

        <Stack direction={{
          xs: "column",
          sm: "row",
        }}>
          <Button onClick={() => handler({ _id, accept: true })}>Accept</Button>
          <Button color='error' onClick={() => handler({ _id, accept: false })}>Reject</Button>
        </Stack>

      </Stack>
    </ListItem>
  )
});

export default Notification