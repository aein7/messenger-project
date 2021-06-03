const router = require("express").Router();
const { Conversation, Message } = require("../../db/models");
const { Op } = require("sequelize");
const onlineUsers = require("../../onlineUsers");
const ConversationUtils = require("../../utils/conversation.utils");
const convoUtil = new ConversationUtils();

// expects {recipientId, text, conversationId } in body (conversationId will be null if no conversation exists yet)
router.post("/", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const senderId = req.user.id;
    const { recipientId, text, conversationId, sender } = req.body;

    let conversation = await Conversation.findConversation(
      senderId,
      recipientId
    );

    // Verify that the conversation between the sender/recipient exists and matches the request
    if (conversation && conversationId === conversation.id) {
      const message = await Message.create({ senderId, text, conversationId });
      return res.json({ message, sender });
    } else if (conversation && conversationId != conversation.id) {
      return res.sendStatus(403)
    }
   
    if (!conversation) {
      // create conversation
      conversation = await Conversation.create({
        user1Id: senderId,
        user2Id: recipientId,
      });
      if (sender.id in onlineUsers) {
        sender.online = true;
      }
    }
    const message = await Message.create({
      senderId,
      text,
      conversationId: conversation.id,
    });
    res.json({ message, sender });
  } catch (error) {
    next(error);
  }
});

router.patch("/updateReadStatus", async (req, res, next) => {
  try {
    const senderId = req.user.id;
    const { otherUser, messages, id: conversationId } = req.body;

    const conversation = await Conversation.findConversation(
      senderId,
      otherUser.id
    );

    // Verify that the conversation between the sender/recipient exists and matches the request
    if (conversation && conversationId === conversation.id) {
        await Message.update({
          unread: false,
        }, {
          where: {
            senderId: {
              [Op.not]: senderId
            },
            unread: {
              [Op.is]: true
            }
          }
        });
    } else if (conversation && conversationId != conversation.id) {
      return res.sendStatus(403)
    }

    const updatedConversation = await Conversation.findOneConversationAndMessages(
      senderId, 
      otherUser.id
    );

    const formattedConvo = convoUtil.formatOneConversation(updatedConversation);

    res.json(formattedConvo);
  } catch (error) {
    next(error)
  }
})

module.exports = router;
