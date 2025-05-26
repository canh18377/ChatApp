export const CONVERSATION_TABLE = 'conversations';

export const ConversationSchema = {
    name: CONVERSATION_TABLE,
    columns: {
        id: 'TEXT PRIMARY KEY NOT NULL', // id dạng string, giống _id mongoose
        isGroup: 'INTEGER NOT NULL', // 0 hoặc 1 (false/true)
        name: 'TEXT',
        groupAvatar: 'TEXT',
        createdAt: 'INTEGER NOT NULL',
        lastMessageId: 'TEXT' // lưu _id message dạng string
    },
};

export const createConversationTableQuery = `
  CREATE TABLE IF NOT EXISTS ${CONVERSATION_TABLE} (
    id TEXT PRIMARY KEY NOT NULL,
    isGroup INTEGER NOT NULL,
    name TEXT,
    groupAvatar TEXT,
    createdAt INTEGER NOT NULL,
    lastMessageId TEXT
  );
`;

// Phần participants tách riêng bảng liên kết (Many-to-Many)
export const PARTICIPANTS_TABLE = 'conversation_participants';

export const ParticipantsSchema = {
    name: PARTICIPANTS_TABLE,
    columns: {
        conversationId: 'TEXT NOT NULL',
        userId: 'TEXT NOT NULL'
    }
};

export const createParticipantsTableQuery = `
  CREATE TABLE IF NOT EXISTS ${PARTICIPANTS_TABLE} (
    conversationId TEXT NOT NULL,
    userId TEXT NOT NULL,
    PRIMARY KEY (conversationId, userId)
  );
`;
