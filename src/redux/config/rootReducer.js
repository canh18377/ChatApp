import { combineReducers } from 'redux';
import authReducer from '../reducers/authReducer';
import userReducer from '../reducers/userReducer';
import conversationReducer from '../reducers/conversationReducer';
import messageReducer from '../reducers/messageReducer';

const rootReducer = combineReducers({
  authReducer,
  userReducer,
  conversationReducer,
  messageReducer
});

export default rootReducer;
