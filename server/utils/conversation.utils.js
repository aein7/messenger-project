const onlineUsers = require("../onlineUsers");

class ConversationUtils {

    formatOneConversation(conversation) {
        const convoJSON = conversation.toJSON();

        // set a property "otherUser" so that frontend will have easier access
        if (convoJSON.user1) {
            convoJSON.otherUser = convoJSON.user1;
            delete convoJSON.user1;
        } else if (convoJSON.user2) {
            convoJSON.otherUser = convoJSON.user2;
            delete convoJSON.user2;
        }

        // set property for online status of the other user
        if (convoJSON.otherUser.id in onlineUsers) {
            convoJSON.otherUser.online = true;
        } else {
            convoJSON.otherUser.online = false;
        }

        // set properties for notification count and latest message preview
        convoJSON.latestMessageText = convoJSON.messages[convoJSON.messages.length - 1].text;
        convoJSON.unreadCount = convoJSON.messages.filter(m => m.unread && m.senderId === convoJSON.otherUser.id).length;

        return convoJSON
    }

    formatAllConversations(conversations){
        for(let i = 0; i < conversations.length; i++){
            const convo = conversations[i]
            const formattedConvo = this.formatOneConversation(convo);
            conversations[i] = formattedConvo
        }

        return conversations
    }
}

module.exports = ConversationUtils