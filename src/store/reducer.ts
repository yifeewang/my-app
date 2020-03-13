import { add_compony } from "./action"
import { StoreState,Action } from './types/types'

const initState={
    list:[]
}
export default function reducer(state: StoreState= initState,action:Action):StoreState {    
    switch( action.type ){
        case add_compony:
            return { ...state, list: Array.from(action.data)  }
        default:
            return state
    }
}