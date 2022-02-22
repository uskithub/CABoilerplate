type User = {
    uid: String;
    photoURL: string | null;
    email: string;
    displayName: string | null;
}

export type Methods = {
    get: {
        resBody: User
    }

    put: {
        reqBody: {
            name: string
        }

        resBody: User
    }
}