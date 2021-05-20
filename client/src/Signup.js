import React, { useState } from "react";
import { Redirect, useHistory } from "react-router-dom";
import { connect } from "react-redux";
import {
  Grid,
  Box,
  Typography,
  Button,
  FormControl,
  TextField,
  FormHelperText,
  CssBaseline,
} from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import bgImg from './assets/bg-img.png';
import { register } from "./store/utils/thunkCreators";


const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
  },
  sideBanner: {
    backgroundImage: `linear-gradient(rgb(58 141 255 / 85%), rgb(134 185 255 / 85%)), url(${bgImg})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    minHeight: '100vh',
  },
  bannerText:{
    color: 'white',
    fontSize: '2.2rem',
    margin: '0px 2rem 0px 2rem',
  },
  bannerIcon: {
    color: 'white',
    alignSelf: 'center',
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

      {/* Side banner that should not show on small screens */}
      <Box component={Grid}  item sm={4} md={5} display={{ xs: 'none', md: 'block' }}>
        <Grid container className={classes.sideBanner}>
          <Grid item container direction='column' justify='center' >
            <svg width="150" viewBox="-15 0 110 95" preserveAspectRatio="xMidYMid meet" fill="none" xmlns="http://www.w3.org/2000/svg" className={classes.bannerIcon}>
              <path fillRule="evenodd" clipRule="evenodd" d="M33.866 0.5C42.8189 0.5 51.2194 3.93256 57.5516 10.1698C63.8838 16.407 67.3828 24.6814 67.3828 33.5C67.3828 42.3186 63.898 50.593 57.5658 56.8302C51.106 63.193 42.5214 66.5 33.8518 66.5C28.4545 66.5 23.0148 65.2163 18.0425 62.5791C13.5802 65.7465 9.21707 66.4302 6.25637 66.4302C5.15142 66.4302 4.24479 66.3326 3.60732 66.2349C2.24738 66.0256 1.1991 64.9791 0.986605 63.6395C0.774114 62.3 1.46825 61.0023 2.7007 60.4023C5.26475 59.1605 6.993 56.6767 8.06962 54.5419C-2.90906 41.5233 -2.05909 22.2256 10.1804 10.1698C16.5126 3.93256 24.913 0.5 33.866 0.5ZM18.8358 58.714C30.4803 65.4535 45.2838 63.5837 54.8459 54.1651C66.4195 42.7651 66.4195 24.2349 54.8317 12.8349C43.2722 1.43488 24.4456 1.43488 12.8719 12.8349C1.79407 23.7465 1.25576 41.3279 11.6253 52.8674C11.8945 53.1744 12.0503 53.5512 12.0928 53.9279C12.1919 54.3186 12.1636 54.7372 11.9936 55.1419C10.9312 57.5279 9.11791 60.5977 6.2422 62.6628H6.25637C8.74959 62.6628 12.5178 62.0488 16.3568 59.1186C16.3993 59.0767 16.4559 59.0349 16.5126 59.007C17.1217 58.407 18.0708 58.2674 18.8358 58.714Z" fill="white"/>
              <circle cx="33.8828" cy="34" r="2.5" fill="white"/>
              <circle cx="45.8828" cy="34" r="2.5" fill="white"/>
              <circle cx="21.8828" cy="34" r="2.5" fill="white"/>
            </svg>
            <Typography align="center" className={classes.bannerText}>Converse with anyone in any language</Typography>
          </Grid>
        </Grid>
      </Box>


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
