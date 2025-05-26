import SQLite from 'react-native-sqlite-storage';

SQLite.enablePromise(true);

import { createUserTableQuery } from './schema/users';
import { createConversationTableQuery, createParticipantsTableQuery } from './schema/conversation';
import { createMessageTableQuery } from './schema/messages';
import { createFriendshipTableQuery } from './schema/friends';

export const getDBConnection = async () => {
    return SQLite.openDatabase({ name: 'chatapp.db', location: 'default' });
};

export const createTable = async () => {
    try {
        const db = await getDBConnection();
        db.executeSql(
            createUserTableQuery,
            [],
            (tx, results) => {
                console.log('Create table success:', results);
            },
            (tx, error) => {
                console.error('Create table error:', error);
            }
        );


        await db.executeSql(createUserTableQuery);
        await db.executeSql(createConversationTableQuery);
        await db.executeSql(createParticipantsTableQuery);
        await db.executeSql(createMessageTableQuery);
        await db.executeSql(createFriendshipTableQuery);

        console.log("Tables created successfully!");
    } catch (error) {
        console.log(error)
    }
};

createTable(); // chạy ngay khi import file
