import { combineReducers } from "redux";  // 여러 reducer를 하나로 통합하기위해
import user from '../_reducers/user_reducer'

const  rootReducer = combineReducers({
    user,
})

export default rootReducer;