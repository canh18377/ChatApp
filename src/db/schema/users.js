export const USER_TABLE = 'users';

export const UserSchema = {
  name: USER_TABLE,
  columns: {
    idUser: 'TEXT PRIMARY KEY NOT NULL',
    name: 'TEXT',
    email: 'TEXT',
    avatar: 'TEXT',
    password: 'TEXT'
  },
};

export const createUserTableQuery = `
  CREATE TABLE IF NOT EXISTS ${USER_TABLE} (
    idUser TEXT PRIMARY KEY NOT NULL,
    name TEXT,
    email TEXT,
    avatar TEXT
  );
`;
