const { Op } = require("sequelize");
const db = require("../db");
const Message = require("./message");
const User = require("./user");

const Conversation = db.define("conversation", {});

// find conversation given two user Ids

Conversation.findConversation = async function (user1Id, user2Id) {
  const conversation = await Conversation.findOne({
    where: {
      user1Id: {
        [Op.or]: [user1Id, user2Id]
      },
      user2Id: {
        [Op.or]: [user1Id, user2Id]
      }
    }
  });

  // return conversation or null if it doesn't exist
  return conversation;
};

// Find a conversation and all its messages given two user Ids 
Conversation.findOneConversationAndMessages = async function (senderId, recieverId) {
  const conversation = await Conversation.findOne({
    where: {
      user1Id: {
        [Op.or]: [senderId, recieverId]
      },
      user2Id: {
        [Op.or]: [senderId, recieverId]
      }
    },
    attributes: ["id"],
    order: [[Message, "createdAt", "ASC"]],
    include: [
      { model: Message },
      {
        model: User,
        as: "user1",
        where: {
          id: {
            [Op.not]: senderId,
          },
        },
        attributes: ["id", "username", "photoUrl"],
        required: false,
      },
      {
        model: User,
        as: "user2",
        where: {
          id: {
            [Op.not]: senderId,
          },
        },
        attributes: ["id", "username", "photoUrl"],
        required: false,
      },
    ],
  });

  return conversation
}

// Find all conversations and their messages for a given user
Conversation.findAllConversationsAndMessages = async function (userId) {
  const conversations = await Conversation.findAll({
    where: {
      [Op.or]: {
        user1Id: userId,
        user2Id: userId,
      },
    },
    attributes: ["id"],
    order: [[Message, "createdAt", "ASC"]],
    include: [
      { model: Message },
      {
        model: User,
        as: "user1",
        where: {
          id: {
            [Op.not]: userId,
          },
        },
        attributes: ["id", "username", "photoUrl"],
        required: false,
      },
      {
        model: User,
        as: "user2",
        where: {
          id: {
            [Op.not]: userId,
          },
        },
        attributes: ["id", "username", "photoUrl"],
        required: false,
      },
    ],
  })

  return conversations
}

module.exports = Conversation;
