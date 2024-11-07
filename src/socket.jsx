// SOCKET CONTEXT PROVIDER -->

import { createContext, useContext, useMemo } from 'react';
import io from 'socket.io-client'
import { server } from './constants/config';



// to pass it every where i will use context to use it everywhere 

// cfeating context
const socketContext = createContext();


// i will use this 
const getSocket =()=> useContext(socketContext);


const SocketProvider = ({ children }) => {

    // here i will use the backend url to connect
    // and i don't want after each re render it creates a new socket
    // so i will wrap it in usememo , it will prevent from re rendering

    const socket = useMemo(() => io(server, { withCredentials: true }), []);


    return (
        <socketContext.Provider value={socket}>
            {children}
        </socketContext.Provider>
    )
}

export {SocketProvider, getSocket};