export const FRIENDSHIP_TABLE = 'friendships';

export const FriendshipSchema = {
    name: FRIENDSHIP_TABLE,
    columns: {
        id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
        requester: 'TEXT NOT NULL',
        recipient: 'TEXT NOT NULL',
        status: 'TEXT NOT NULL',
        createdAt: 'INTEGER NOT NULL'
    },
};

export const createFriendshipTableQuery = `
  CREATE TABLE IF NOT EXISTS ${FRIENDSHIP_TABLE} (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    requester TEXT NOT NULL,
    recipient TEXT NOT NULL,
    status TEXT NOT NULL,
    createdAt INTEGER NOT NULL
  );
`;
