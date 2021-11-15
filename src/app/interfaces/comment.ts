export interface Comment {
    id: number,
    userID: number,
    username: string,
    commentID: number,
    content: string,
    edited: boolean,
    dateCreated: string,
    replies: Reply[]
}

export interface Reply {
    id: number,
    userID: number,
    username: string,
    commentID: number,
    content: string,
    edited: boolean,
    dateCreated: string
}