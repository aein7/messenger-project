import React from "react";
import { Redirect, useHistory } from "react-router-dom";
import { connect } from "react-redux";
import {
  Grid,
  Typography,
  Button,
  FormControl,
  TextField,
  CssBaseline,
} from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import { ImageSideBanner } from './components'
import bgImg from './assets/bg-img.png';
import { login } from "./store/utils/thunkCreators";

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
  },
  loginForm:{
    width: '100%',
  },
  formElem: {
    width: '50%'
  },
  register: {
    padding: '1rem',
    '& p':{
      margin: '0.4rem 1rem',
      color: "#B0B0B0"
    }
  },
  submitButton: {
    marginTop: '2rem',
  }

}));

const Login = (props) => {
  const history = useHistory();
  const { user, login } = props;
  const classes = useStyles();

  const handleLogin = async (event) => {
    event.preventDefault();
    const username = event.target.username.value;
    const password = event.target.password.value;

    await login({ username, password });
  };

  if (user.id) {
    return <Redirect to="/home" />;
  }

  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />

      <ImageSideBanner bgImg={bgImg}></ImageSideBanner>
      
      <Grid container item direction='row' sm={12} md={7}>
        <Grid container item justify='flex-end' alignItems='flex-start' className={classes.register}>
          <Typography >Don't have an account?</Typography>
          <Button onClick={() => history.push("/register")} variant="outlined" color="primary">Register</Button>
        </Grid>

        <Grid container item align='center' justify='center'>
        
        <form onSubmit={handleLogin} className={classes.loginForm}>
          <Typography gutterBottom={true} variant="h4">Welcome back!</Typography>
           <Grid>
             <Grid>
               <FormControl margin="normal" required className={classes.formElem}>
                 <TextField
                  aria-label="username"
                  label="Username"
                  name="username"
                  type="text"
                />
              </FormControl>
            </Grid>
            <FormControl margin="normal" required className={classes.formElem}>
              <TextField
                label="password"
                aria-label="password"
                type="password"
                name="password"
              />
            </FormControl>
            <Grid>
              <Button  type="submit" variant="contained" color="primary" size="large" className={classes.submitButton}>
                Login
              </Button>
            </Grid>
          </Grid>
        </form>
        </Grid>
      </Grid>
    </Grid>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    login: (credentials) => {
      dispatch(login(credentials));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
