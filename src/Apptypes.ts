import {listArray, AddComponyFunction} from './store/types/types'

export interface AppProps {
    list: Array<listArray>,
    addCompony: AddComponyFunction
}

export interface ReactOptions {

}

export interface AppState {
    startTime: string | undefined,
    endTime: string | undefined,  
    options: Array<any>, 
    selectOptions:  Array<listArray>,
    accurateOptions:  Array<listArray>,
    timeOptions:Array<listArray>
}