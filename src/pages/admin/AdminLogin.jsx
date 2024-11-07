import { useInputValidation } from "6pp";
import { Button, Container, Paper, TextField, } from "@mui/material";
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { adminLogin, fetchAdminDetails } from '../../redux/thunks/admin';


const AdminLogin = () => {

    const {isAdmin} = useSelector((state)=>state.auth);
    const dispatch = useDispatch();

    const secretKey = useInputValidation("")
    const submitHandler=(e) => {
        e.preventDefault();
        dispatch(adminLogin(secretKey.value))
    };

    useEffect(()=>{
        dispatch(fetchAdminDetails());
    },[dispatch]);

    if(isAdmin) return <Navigate to="/admin/dashboard"/>


    return (
        <div
            style={{
                backgroundImage:
                    "linear-gradient(rgba(200,200,200,0.5), rgba(120,110,220,0.5))"
            }}
        >

            <Container component={"main"} maxWidth="md" sx={{
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }} >
                <Paper
                    // elevation for shadows
                    elevation={5}
                    sx={{
                        // marginTop:"5rem",
                        padding: 10,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        // backgroundColor: "rgb(255, 98, 71)",
                    }}
                >
                    
                            <>
                                <h1>Admin Login</h1>
                                <form
                                    onSubmit={submitHandler}
                                >

                                    <TextField required fullWidth
                                        label="secretKey"
                                        type='password'
                                        margin='normal'
                                        variant='outlined'
                                        value={secretKey.value}
                                        onChange={secretKey.changeHandler}
                                    />

                                    <Button sx={{
                                        marginTop: "1rem",
                                        // backgroundColor:"wheat"
                                    }}
                                        fullWidth
                                        variant='contained'
                                        color='primary'
                                        type='submit'
                                    >Login
                                    </Button>
                                </form>
                            </>
                       

                </Paper>
            </Container>
        </div>
    )
}

export default AdminLogin