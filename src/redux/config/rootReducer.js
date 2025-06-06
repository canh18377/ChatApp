import { combineReducers } from 'redux';
import authReducer from '../reducers/authReducer';
import userReducer from '../reducers/userReducer';
import conversationReducer from '../reducers/conversationReducer';
import messageReducer from '../reducers/messageReducer';
import friendReducer from '../reducers/friendReducer';
import groupReducer from '../reducers/groupReducer';
const rootReducer = combineReducers({
  authReducer,
  userReducer,
  conversationReducer,
  messageReducer,
  friendReducer,
  groupReducer
});

export default rootReducer;
