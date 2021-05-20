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
import ChatBubbleOutlineRoundedIcon from '@material-ui/icons/ChatBubbleOutlineRounded';
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
    fontSize: '8rem',
    alignSelf: 'center',
    marginBottom: '5%',
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
      margin: '0.4rem 1rem'
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
            <ChatBubbleOutlineRoundedIcon align='center' className={classes.bannerIcon} />
            <Typography align="center" className={classes.bannerText}>Converse with anyone in any language</Typography>
          </Grid>
        </Grid>
      </Box>


      <Grid container item direction='row' sm={12} md={7}>
        <Grid container item justify='flex-end' alignItems='flex-start' className={classes.login}>
          <Typography>Need to log in?</Typography>
          <Button onClick={() => history.push("/login")} variant="outlined" color="primary">Login</Button>
        </Grid>

        <Grid container item align='center' justify='center'>
          <form onSubmit={handleRegister} className={classes.signupForm}>
            <Grid>
              <Grid>
                <FormControl className={classes.formElem}>
                  <TextField
                    aria-label="username"
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
