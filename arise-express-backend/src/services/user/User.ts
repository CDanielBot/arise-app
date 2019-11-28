export enum Language {
    RO = 'ro',
    EN = 'en'
}
export enum UserType {
    Admin = 0,
    User = 1,
    Evangelist = 2,
    PrayerTeam = 3
}

export enum UserTypeEnum {
    Admin = 0,
    User = 1,
    Evangelist = 2,
    PrayerTeam = 3
}

export default interface User extends UpdateUserReq, UserCredentials {
    UserId?: number
    User?: string
    Type: UserType
}

export interface UserCredentials {
    Email: string
    Password: string
}

export interface CreateUserReq extends UserCredentials {
    FirstName: string
    LastName: string
    Language?: Language
    Type?: UserType
}

export interface UpdateUserReq {
    FirstName?: string
    LastName?: string
    User?: string
    Mobile?: string
    Description?: string
    FirebaseUid?: string
    Language?: Language
    Country?: string
}

export interface ChangePasswordReq {
    OldPassword: string,
    NewPassword: string
}

export interface RegisterUserReq {
    Email: string,
    FirstName: string,
    LastName: string
}