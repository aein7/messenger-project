import React, { useState } from "react";
import { Redirect, useHistory } from "react-router-dom";
import { connect } from "react-redux";
import {
  Grid,
  Typography,
  Button,
  FormControl,
  TextField,
  FormHelperText,
  CssBaseline,
} from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import { ImageSideBanner } from './components'
import bgImg from './assets/bg-img.png';
import { register } from "./store/utils/thunkCreators";


const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
  },
  signupForm:{
    width: '100%',
  },
  formElem: {
    width: '50%'
  },
  login: {
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

const Signup = (props) => {
  const history = useHistory();
  const { user, register } = props;
  const [formErrorMessage, setFormErrorMessage] = useState({});
  const classes = useStyles();

  const handleRegister = async (event) => {
    event.preventDefault();
    const username = event.target.username.value;
    const email = event.target.email.value;
    const password = event.target.password.value;
    const confirmPassword = event.target.confirmPassword.value;

    if (password !== confirmPassword) {
      setFormErrorMessage({ confirmPassword: "Passwords must match" });
      return;
    }

    await register({ username, email, password });
  };

  if (user.id) {
    return <Redirect to="/home" />;
  }

  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />

      <ImageSideBanner bgImg={bgImg}></ImageSideBanner>

      <Grid container item direction='row' sm={12} md={7}>
        <Grid container item justify='flex-end' alignItems='flex-start' className={classes.login}>
          <Typography >Already have an account?</Typography>
          <Button onClick={() => history.push("/login")} variant="outlined" color="primary">Login</Button>
        </Grid>

        <Grid container item align='center' justify='center'>
        
          <form onSubmit={handleRegister} className={classes.signupForm}>
            <Typography gutterBottom={true} variant="h4">Create Your Account</Typography>
            <Grid>
              <Grid>
                <FormControl className={classes.formElem}>
                  <TextField
                    aria-label="username"
                    margin="normal"
                    label="Username"
                    name="username"
                    type="text"
                    required
                  />
                </FormControl>
              </Grid>
              <Grid>
                <FormControl className={classes.formElem}>
                  <TextField
                    label="E-mail address"
                    margin="normal"
                    aria-label="e-mail address"
                    type="email"
                    name="email"
                    required
                  />
                </FormControl>
              </Grid>
              <Grid>
                <FormControl className={classes.formElem} error={!!formErrorMessage.confirmPassword}>
                  <TextField
                    aria-label="password"
                    margin="normal"
                    label="Password"
                    type="password"
                    inputProps={{ minLength: 6 }}
                    name="password"
                    required
                  />
                  <FormHelperText>
                    {formErrorMessage.confirmPassword}
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid>
                <FormControl className={classes.formElem} error={!!formErrorMessage.confirmPassword}>
                  <TextField
                    label="Confirm Password"
                    margin="normal"
                    aria-label="confirm password"
                    type="password"
                    inputProps={{ minLength: 6 }}
                    name="confirmPassword"
                    required
                  />
                  <FormHelperText>
                    {formErrorMessage.confirmPassword}
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Button type="submit" variant="contained" color="primary" size="large" className={classes.submitButton}>
                Create
            </Button>
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
    register: (credentials) => {
      dispatch(register(credentials));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Signup);
