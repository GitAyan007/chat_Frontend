import React, { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import ProtectRoute from './components/auth/ProtectRoute';
import {LayoutLoader} from './components/layout/Loaders';
import { useEffect } from 'react';
import axios from "axios";
import { server } from './constants/config';
import { useDispatch, useSelector } from "react-redux";
import { userExists, userNotExists } from './redux/reducers/auth'
import { Toaster } from "react-hot-toast";
import { SocketProvider } from './socket';

// import AdminLayout from './components/layout/AdminLayout';


const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Chat = lazy(() => import("./pages/Chat"));
const Groups = lazy(() => import("./pages/Groups"));
const NotFound = lazy(() => import("./pages/NotFound"));
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const UserManegement = lazy(() => import("./pages/admin/UserManegement"));
const MessageManegement = lazy(() => import("./pages/admin/MessageManegement"));
const ChatManegement = lazy(() => import("./pages/admin/ChatManegement"));
// for now




const App = () => {

  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    axios.get(`${server}/api/v1/user/myProfile`, { withCredentials: true })
      .then(({ data }) => dispatch(userExists(data.data)))
      .catch((err) => dispatch(userNotExists()));
  }, [dispatch]);

  return (
    <BrowserRouter>

      <Suspense fallback={<LayoutLoader />}>
        <Routes>
          {/* protected */}

          {/* these three routes under socket provider , socket only opens when you are logged in and u r on these pages */}
          <Route element={
            <SocketProvider>
              <ProtectRoute user={user} />
            </SocketProvider>}>
            <Route path='/' element={<Home />} />
            <Route path='/chat/:chatId' element={<Chat />} />
            <Route path='/groups' element={<Groups />} />
          </Route>

          <Route path='/login' element={
            <ProtectRoute user={!user} redirect='/'>
              <Login />
            </ProtectRoute>} />

          <Route path='/admin' element={<AdminLogin />} />
          <Route path='/admin/dashboard' element={<Dashboard />} />

          <Route path='/admin/users-management' element={<UserManegement />} />
          <Route path='/admin/chats-management' element={<ChatManegement />} />
          <Route path='/admin/messages' element={<MessageManegement />} />

          <Route path='*' element={<NotFound />} />
        </Routes>
      </Suspense>

      <Toaster position='bottom-center' />
    </BrowserRouter>
  )
}

export default App
