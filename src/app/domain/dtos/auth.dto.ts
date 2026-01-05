export interface AuthResponseDto{
    id : string;
    FirstName : string;
    LastName : string;
    email : string;
    token : string
}

export interface LoginCommand{
    email : string;
    password : string;
}

export interface RegisterCommand{
    firstName : string;
    lastName : string;
    email : string;
    password : string;
}