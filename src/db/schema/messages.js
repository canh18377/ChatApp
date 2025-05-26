export const MESSAGE_TABLE = 'messages';

export const MessageSchema = {
    name: MESSAGE_TABLE,
    columns: {
        id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
        conversationId: 'TEXT NOT NULL', // lưu _id conversation dưới dạng string
        sender: 'TEXT NOT NULL',
        receiver: 'TEXT NOT NULL',
        content: 'TEXT NOT NULL',
        timestamp: 'INTEGER NOT NULL' // lưu timestamp dưới dạng số (milliseconds)
    },
};

export const createMessageTableQuery = `
  CREATE TABLE IF NOT EXISTS ${MESSAGE_TABLE} (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    conversationId TEXT NOT NULL,
    sender TEXT NOT NULL,
    receiver TEXT NOT NULL,
    content TEXT NOT NULL,
    timestamp INTEGER NOT NULL
  );
`;
