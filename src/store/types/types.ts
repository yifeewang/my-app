export type AddComponyFunction = (data: Array<listArray>)=> Action;

export interface Action {
    type: string,
    data: Array<listArray>
}
// {
//     key: '2',
//     compony:'t腾讯',
//     userId: '654321',
//     telephone: '1246554747',
//     cardId: 'zdzdgrsgrs'
// }
export interface listArray {
    key: string,
    compony: string,
    userId: string,
    telephone: string,
    cardId: string,
    time: string
}

export interface StoreState {
    list: Array<listArray>
}