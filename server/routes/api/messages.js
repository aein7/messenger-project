const router = require("express").Router();
const { Conversation, Message } = require("../../db/models");
const { Op } = require("sequelize");
const onlineUsers = require("../../onlineUsers");

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
    let messagesToUpdate = [];

    let conversation = await Conversation.findConversation(
      senderId,
      otherUser.id
    );

    // Verify that the conversation between the sender/recipient exists and matches the request
    if (conversation && conversationId === conversation.id) {
      messagesToUpdate = messages
          .filter(message => message.senderId != senderId && message.unread)
          .map(message => message.id);

      console.log(`messages to update: ${messagesToUpdate}`)
      if(messagesToUpdate.length > 0){
        
        await Message.update({
          unread: false,
        }, {
          where: {
            id: {
              [Op.in]: messagesToUpdate
            }
          }
        });

      }
    } else if (conversation && conversationId != conversation.id) {
      return res.sendStatus(403)
    }

    console.log(req.body)
    res.send(messagesToUpdate);
  } catch (error) {
    next(error)
  }
})

module.exports = router;
