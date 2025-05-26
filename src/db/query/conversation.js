import { getDBConnection } from "../connect";
const db = getDBConnection()
export async function saveConversationData(data) {
    const { conversation, lastMessage, plainUser } = data;
    try {
        await db.transaction(async (tx) => {
            await tx.executeSql(
                `INSERT OR REPLACE INTO conversations (id, isGroup, name, groupAvatar, createdAt, lastMessageId)
         VALUES (?, ?, ?, ?, ?, ?)`,
                [
                    conversation._id,
                    conversation.isGroup ? 1 : 0,
                    conversation.name || null,
                    conversation.groupAvatar || null,
                    new Date(conversation.createdAt).getTime(),
                    conversation.lastMessage || null,
                ]
            );

            // 2. Lưu last message
            if (lastMessage) {
                await tx.executeSql(
                    `INSERT OR REPLACE INTO messages (id, conversationId, sender, receiver, content, timestamp)
           VALUES (?, ?, ?, ?, ?, ?)`,
                    [
                        lastMessage._id,
                        lastMessage.conversationId,
                        lastMessage.sender,
                        lastMessage.receiver,
                        lastMessage.content,
                        new Date(lastMessage.timestamp).getTime(),
                    ]
                );
            }

            if (plainUser) {
                await tx.executeSql(
                    `INSERT OR REPLACE INTO users (idUser, name, avatar)
           VALUES (?, ?, ?)`,
                    [
                        plainUser.idUser,
                        plainUser.name,
                        plainUser.avatar || null,
                    ]
                );
            }

            // 4. Lưu participants (nếu bạn có bảng participants)
            // Xóa participants cũ
            await tx.executeSql(
                `DELETE FROM conversation_participants WHERE conversationId = ?`,
                [conversation._id]
            );
            for (const userId of conversation.participants) {
                await tx.executeSql(
                    `INSERT INTO conversation_participants (conversationId, userId) VALUES (?, ?)`,
                    [conversation._id, userId]
                );
            }
        });

        console.log('Conversation data saved to SQLite');
    } catch (error) {
        console.error('Error saving conversation data', error);
    }
}
export async function getConversations(db, currentUserId) {
    try {
        // 1. Lấy các conversation có currentUserId trong participants
        const [results] = await db.executeSql(
            `SELECT c.*
       FROM conversations c
       JOIN conversation_participants cp ON c.id = cp.conversationId
       WHERE cp.userId = ?
       GROUP BY c.id`,
            [currentUserId]
        );

        const conversations = [];
        const len = results.rows.length;
        for (let i = 0; i < len; i++) {
            const conv = results.rows.item(i);

            // 2. Lấy lastMessage
            let lastMessage = null;
            if (conv.lastMessageId) {
                const [msgResults] = await db.executeSql(
                    `SELECT * FROM messages WHERE id = ?`,
                    [conv.lastMessageId]
                );
                if (msgResults.rows.length > 0) {
                    lastMessage = msgResults.rows.item(0);
                }
            }

            if (conv.isGroup) {
                // 3a. Nếu là group, chỉ trả về conversation + lastMessage
                conversations.push({
                    conversation: conv,
                    lastMessage,
                });
            } else {
                // 3b. Nếu không phải group, lấy user khác currentUser trong participants
                const [participantResults] = await db.executeSql(
                    `SELECT userId FROM conversation_participants WHERE conversationId = ? AND userId != ? LIMIT 1`,
                    [conv.id, currentUserId]
                );
                if (participantResults.rows.length === 0) {
                    conversations.push({ conversation: conv, lastMessage, plainUser: null });
                    continue;
                }
                const receiverId = participantResults.rows.item(0).userId;

                // Lấy thông tin user đó
                const [userResults] = await db.executeSql(
                    `SELECT idUser, name, avatar FROM users WHERE idUser = ?`,
                    [receiverId]
                );

                let plainUser = null;
                if (userResults.rows.length > 0) {
                    plainUser = userResults.rows.item(0);
                }

                conversations.push({
                    conversation: conv,
                    lastMessage,
                    plainUser,
                });
            }
        }

        return conversations;
    } catch (error) {
        console.error('getConversations error', error);
        throw error;
    }
}
