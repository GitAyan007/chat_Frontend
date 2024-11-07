import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

const ProtectRoute = ({ children, user, redirect = "/login" }) => {
    if (!user)
        return <Navigate to={redirect}/>;
    return children? children : <Outlet/>;
}

export default ProtectRoute


// example
// any component between the ProtectRoute will be the children which is a default behavoiur of react
// <ProtectRoute>
//     <Home/>
// </ProtectRoute>

// home is the children of ProtectRoute