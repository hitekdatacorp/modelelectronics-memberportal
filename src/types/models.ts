

export enum Gender {
    Male = "Male",
    Female = "Female"
}

export interface IClient {
    id: string;
    isActive: boolean;
    age: number;
    name: string;
    gender: Gender;
    company: string;
    email: string;
    phone: string;
    address: string;
}


export class Client implements IClient {
    id: string;
    isActive: boolean;
    age: number;
    name: string;
    gender: Gender;
    company: string;
    email: string;
    phone: string;
    address: string;    

    constructor(){
        this.id = '';
        this.isActive = false;
        this.age = 0;
        this.name = '';
        this.gender = Gender.Female;
        this.company = '';
        this.email = '';
        this.phone = '';
        this.address = '';
    }
}

export class UserProfile {    
    token: string;
    userMustChangePassword: boolean;
    customer?: CustomerModel;

    constructor(token: string, userMustChangePassword: boolean, customer?: CustomerModel) {
        this.customer = customer;
        this.token = token;
        this.userMustChangePassword = userMustChangePassword;
    }
}

export class CustomerModel {
    customerNumber: string;
    friendlyCustomerNumber: string;
    name: string;
    phone: string;
    contactName: string;
    email: string;
    state: string;
    salesTerritory: string;
    salesRep: string;

    constructor(customerNumber: string, friendlyCustomerNumber: string, name: string, phone: string, contactName: string, email:string , state: string, salesTerritory: string, salesRep: string) {
        this.customerNumber = customerNumber;
        this.friendlyCustomerNumber = friendlyCustomerNumber;
        this.name = name;
        this.customerNumber = customerNumber;
        this.phone = phone;
        this.contactName = contactName;
        this.email = email;
        this.state = state;
        this.salesTerritory = salesTerritory;
        this.salesRep = salesRep;
    }
}

export class AuthenticateResponse {
    customer: CustomerModel;
    token: string;
    userMustChangePassword: boolean;
    authenticationSucceeded: boolean;

    constructor(customer: CustomerModel, token: string, userMustChangePassword: boolean, authenticationSucceeded: boolean){
        this.customer = customer;
        this.token = token;
        this.userMustChangePassword = userMustChangePassword;
        this.authenticationSucceeded = authenticationSucceeded;
    }
}