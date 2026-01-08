export enum Role {
    NON = 0,
    ADMIN = 1,
    USER = 2,
}

export enum Module {
    USER = 1,
    TASK = 2,
}

export enum Action {
    READ = 1,
    CREATE = 2,
    UPDATE = 3,
    DELETE = 4,
}

export enum Permission {
    USER_READ = Module.USER * 1000 + Action.READ,
    USER_CREATE = Module.USER * 1000 + Action.CREATE,
    USER_UPDATE = Module.USER * 1000 + Action.UPDATE,
    USER_DELETE = Module.USER * 1000 + Action.DELETE,
}
