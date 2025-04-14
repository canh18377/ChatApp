import { combineReducers } from 'redux';
import authReducer from '../reducers/authReducer';
import userReducer from '../reducers/userReducer';
import conversationReducer from '../reducers/conversationReducer';

const rootReducer = combineReducers({
  authReducer,
  userReducer,
  conversationReducer
});

export default rootReducer;
