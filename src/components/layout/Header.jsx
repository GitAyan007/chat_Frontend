import { AppBar, Backdrop, Badge, Box, IconButton, Toolbar, Tooltip, Typography } from '@mui/material'
import React, { Suspense, lazy, useState } from 'react'
import { gardient, orange } from '../../constants/color'
import {
  Menu as MenuIcon, Search as SearchIcon, Add as AddIcon,
  Group as GroupIcon, Logout as LogoutIcon, Notifications as NotificationsIcon
} from "@mui/icons-material";
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import axios from 'axios'
import { server } from '../../constants/config'
import { useDispatch, useSelector } from 'react-redux';
import { userNotExists } from '../../redux/reducers/auth';
import { setIsMobileMenu, setIsNewGroup, setIsNotification, setIsSearch } from '../../redux/reducers/misc';
import { resetNotificationCount } from '../../redux/reducers/chat';

const Search = lazy(() => import('../specific/Search'));
const NotificationDialog = lazy(() => import('../specific/Notification'));
const NewGroup = lazy(() => import('../specific/NewGroup'));

const Header = () => {

  const dispatch = useDispatch();
  const { isSearch, isNotification, isNewGroup } = useSelector((state) => state.misc);
  const { notificationCount } = useSelector((state) => state.chat);


  // const [isNewGroup, setisNewGroup] = useState(false);
  // const [isNotification, setisNotification] = useState(false);
  // const [isLogout, setisLogout] = useState(false);

  const navigate = useNavigate();
  const handleIcon = () => {
  }
  const handleMobile = () => {
    dispatch(setIsMobileMenu(true));
    // console.log("hello");
  }

  const searchHandler = () => {
    dispatch(setIsSearch(true));
  }

  const openNewGroup = () => {
    dispatch(setIsNewGroup(true));
  }

  const Notification = () => {
    dispatch(setIsNotification(true));
    dispatch(resetNotificationCount());
  }

  const LogoutHandler = async () => {
    // setisLogout((prev) => !prev);

    try {
      const { data } = await axios.get(`${server}/api/v1/user/logout`, { withCredentials: true })

      dispatch(userNotExists());
      toast.success(data.message);

    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong!!");
    }
  }

  const NavigateGroup = () => {
    navigate("/groups");
  }
  return (
    <>
      <Box sx={{ flexGrow: 1 }} height={"4rem"}>
        <AppBar
          position='static'
          sx={{
            backgroundImage: gardient
          }}
        >
          <Toolbar>
            <Typography variant='h6'
              sx={{
                display: { xs: "none", sm: "block" }
              }}
            >
              ChitChat
            </Typography>

            <Box sx={{
              display: { xs: "block", sm: "none" }
            }}>
              <IconButton color='inherit' onClick={handleMobile}>
                <MenuIcon />
              </IconButton>
            </Box>

            {/* for taking the middle space */}
            <Box sx={{ flexGrow: 1 }} />

            <Box>
              <IconBtn title={"Search"} icon={<SearchIcon />} onclick={searchHandler} />
              <IconBtn title={"New Group"} icon={<AddIcon />} onclick={openNewGroup} />
              <IconBtn title={"Manage Group"} icon={<GroupIcon />} onclick={NavigateGroup} />
              <IconBtn title={"Notifications"} icon={<NotificationsIcon />} onclick={Notification} value={notificationCount}/>
              <IconBtn title={"Logout"} icon={<LogoutIcon />} onclick={LogoutHandler} />
            </Box>

          </Toolbar>
        </AppBar>
      </Box>

      {
        isSearch && (
          <Suspense fallback={<Backdrop open />}>
            <Search />
          </Suspense>

        )
      }

      {
        isNotification && (
          <Suspense fallback={<Backdrop open />}>
            <NotificationDialog />
          </Suspense>

        )
      }

      {
        isNewGroup && (
          <Suspense fallback={<Backdrop open />}>
            <NewGroup />
          </Suspense>

        )
      }
    </>
  )
};

const IconBtn = ({ title, icon, onclick, value }) => {
  return (
    /* for hover effect */
    <Tooltip title={title}>
      <IconButton color='inherit' size='large' onClick={onclick}>
        {
          value? <Badge badgeContent={value}  color='error'>{icon}</Badge> : icon
        }
      </IconButton>
    </Tooltip>
  )
}

export default Header