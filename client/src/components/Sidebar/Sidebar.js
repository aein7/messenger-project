import React from "react";
import { Box, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { Search, Chat, CurrentUser } from "./index.js";
import moment from "moment"

const useStyles = makeStyles(() => ({
  root: {
    paddingLeft: 21,
    paddingRight: 21,
    flexGrow: 1
  },
  title: {
    fontSize: 20,
    letterSpacing: -0.29,
    fontWeight: "bold",
    marginTop: 32,
    marginBottom: 15
  }
}));

const Sidebar = (props) => {
  const classes = useStyles();
  const conversations = props.conversations || [];
  const { handleChange, searchTerm } = props;

  const calculateUnreadCount = (convo) => {
    return convo.messages.filter(m => m.unread && m.senderId === convo.otherUser.id).length;
  }
  
  return (
    <Box className={classes.root}>
      <CurrentUser />
      <Typography className={classes.title}>Chats</Typography>
      <Search handleChange={handleChange} />
      {conversations 
        .filter((conversation) => conversation.otherUser.username.includes(searchTerm))
        .sort((a,b) => moment(b?.messages[b.messages.length - 1]?.createdAt) - moment(a?.messages[a.messages.length - 1]?.createdAt))
        .map((conversation) => {
          return <Chat conversation={conversation} key={conversation.otherUser.username} unreadCount={calculateUnreadCount(conversation)} />;
        })}
    </Box>
  );
};

const mapStateToProps = (state) => {
  return {
    conversations: state.conversations
  };
};

export default connect(mapStateToProps)(Sidebar);
