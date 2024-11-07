import React, { useState } from 'react'
import { Avatar, Button, Container, IconButton, Paper, Stack, TextField, Typography } from "@mui/material"
import { CameraAlt as CameraAltIcon } from "@mui/icons-material";
import { VisuallyHiddenInput } from '../components/styles/StyledComponents';
import { useFileHandler, useInputValidation, useStrongPassword } from "6pp";
import { usernameValidator } from '../utils/validators';
import { server } from '../constants/config';
import { useDispatch } from 'react-redux';
import { userExists } from '../redux/reducers/auth';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion'

const Login = () => {

    const [isLogin, SetisLogin] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const toggleLogin = () => SetisLogin(!isLogin);

    const name = useInputValidation("");
    const bio = useInputValidation("");
    const username = useInputValidation("", usernameValidator);

    // for strong password checking 
    // const password = useStrongPassword();
    const password = useInputValidation("");

    const avatar = useFileHandler("single");

    const dispatch = useDispatch();


    const handleSignup = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const formdata = new FormData();
        formdata.append("avatar", avatar.file);
        formdata.append("name", name.value);
        formdata.append("bio", bio.value);
        formdata.append("username", username.value);
        formdata.append("password", password.value);

        try {
            const { data } = await axios.post(
                `${server}/api/v1/user/newlogin`,
                formdata,
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            dispatch(userExists(data.user));
            toast.success(data.message);
        } catch (error) {
            toast.error(error?.response?.data?.message || "Something Went Wrong");
        }finally{
            setIsLoading(false);
        }

    }


    const handleLogin = async (e) => {
        e.preventDefault();

        const toastId = toast.loading("Logging In...");

        setIsLoading(true);
        const config = {
            withCredentials: true,
            headers: {
                "Content-Type": "application/json",
            },
        };

        try {
            const { data } = await axios.post(
                `${server}/api/v1/user/login`,
                {
                    username: username.value,
                    password: password.value,
                },
                config
            );
            dispatch(userExists(data.user));
            toast.success(data.message, {
                id: toastId,
            });
            navigate("/");
            window.location.reload();
        } catch (error) {
            toast.error(error?.response?.data?.message || "Something Went Wrong");
        }
        finally {
            setIsLoading(false);
        }
    }

    return (
        <motion.div

            initial={{ opacity: 0, x: "-100%" }}
            whileInView={{ opacity: 1, x: 0 }}
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
                    {
                        isLogin ? (
                            <>
                                <h1>Login</h1>
                                <form
                                    style={{
                                        width: "100%",
                                        marginTop: "1rem",
                                    }}
                                    onSubmit={handleLogin}
                                >
                                    <TextField required fullWidth
                                        label="Username"
                                        margin='normal'
                                        variant='outlined'
                                        value={username.value}
                                        onChange={username.changeHandler}
                                    />

                                    <TextField required fullWidth
                                        label="Password"
                                        type='password'
                                        margin='normal'
                                        variant='outlined'
                                        value={password.value}
                                        onChange={password.changeHandler}
                                    />

                                    <Button sx={{
                                        marginTop: "1rem",
                                        // backgroundColor:"wheat"
                                    }}
                                        fullWidth
                                        disabled={isLoading}
                                        variant='contained'
                                        color='primary'
                                        type='submit'
                                    >Login</Button>

                                    <Typography sx={{
                                        marginTop: "1rem",
                                        textAlign: "center",
                                    }}>Or</Typography>

                                    <Button sx={{
                                        marginTop: "1rem",
                                    }}
                                        fullWidth
                                        disabled={isLoading}
                                        variant='contained'
                                        onClick={toggleLogin}
                                    >Sign up Instead </Button>
                                </form>
                            </>
                        )
                            :
                            (
                                <>
                                    <h1>Sign Up</h1>
                                    <form
                                        style={{
                                            width: "100%",
                                            marginTop: "1rem",
                                        }}
                                        onSubmit={handleSignup}
                                    >

                                        <Stack position={"relative"} width={"10rem"} margin={"auto"}>
                                            <Avatar sx={{
                                                width: "10rem",
                                                height: "10rem",
                                                objectFit: "contain",
                                            }}
                                                src={avatar.preview}
                                            />

                                            <IconButton
                                                sx={{
                                                    position: "absolute",
                                                    bottom: "0",
                                                    right: "0",
                                                    color: "white",
                                                    bgcolor: "rgba(0,0,0,0.5)",
                                                    ":hover": {
                                                        bgcolor: "rgba(0,0,0,0.7)",
                                                    }
                                                }}
                                                component="label"
                                            >
                                                <>
                                                    <CameraAltIcon />
                                                    <VisuallyHiddenInput type='file' onChange={avatar.changeHandler} />
                                                </>
                                            </IconButton>
                                        </Stack>

                                        <TextField required fullWidth
                                            label="Name"
                                            margin='normal'
                                            variant='outlined'
                                            value={name.value}
                                            onChange={name.changeHandler}
                                        />
                                        <TextField required fullWidth
                                            label="Username"
                                            margin='normal'
                                            variant='outlined'
                                            value={username.value}
                                            onChange={username.changeHandler}
                                        />
                                        {
                                            username.error && (
                                                <Typography color="error" variant='caption'>
                                                    {username.error}
                                                </Typography>
                                            )
                                        }
                                        <TextField required fullWidth
                                            label="Bio"
                                            margin='normal'
                                            variant='outlined'
                                            value={bio.value}
                                            onChange={bio.changeHandler}
                                        />

                                        <TextField required fullWidth
                                            label="Password"
                                            type='password'
                                            margin='normal'
                                            variant='outlined'
                                            value={password.value}
                                            onChange={password.changeHandler}
                                        />
                                        {/* {
                                        password.error && (
                                            <Typography color="error" variant='caption'>
                                                {password.error}
                                            </Typography>
                                        )
                                    } */}

                                        <Button sx={{
                                            marginTop: "1rem",
                                            // backgroundColor:"wheat"
                                        }}
                                            fullWidth
                                            disabled={isLoading}
                                            variant='contained'
                                            color='primary'
                                            type='submit'
                                        >Sign UP</Button>

                                        <Typography sx={{
                                            marginTop: "1rem",
                                            textAlign: "center",
                                        }}>Or</Typography>

                                        <Button sx={{
                                            marginTop: "1rem",
                                        }}
                                            fullWidth
                                            disabled={isLoading}
                                            variant='contained'
                                            onClick={toggleLogin}
                                        >Login Instead </Button>
                                    </form>
                                </>
                            )
                    }

                </Paper>
            </Container>
        </motion.div>
    )
}

export default Login