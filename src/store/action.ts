import {AddComponyFunction} from './types/types'

export const add_compony = "FIND_COMPONY"



export const addCompony: AddComponyFunction = ( data ) => {
  return {
    type: add_compony,
    data: data
  }
}