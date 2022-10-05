

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

    constructor() {
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
    dealerManufacturer: string;

    constructor(customerNumber: string, friendlyCustomerNumber: string, name: string, phone: string, contactName: string, email: string, state: string, salesTerritory: string, salesRep: string, dealerManufacturer: string) {
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
        this.dealerManufacturer = dealerManufacturer;
    }
}


export class AuthenticateResponse {
    customer: CustomerModel;
    token: string;
    userMustChangePassword: boolean;
    authenticationSucceeded: boolean;

    constructor(customer: CustomerModel, token: string, userMustChangePassword: boolean, authenticationSucceeded: boolean) {
        this.customer = customer;
        this.token = token;
        this.userMustChangePassword = userMustChangePassword;
        this.authenticationSucceeded = authenticationSucceeded;
    }
}

export interface ItemModel {
    itemNumber: string;
    remanNumber: string;
    itemDescription1: string;
    itemDescription2: string;
    itemStatus: string;
    itemType: string;
    productCategory: string;
    userDefinedDescription2: string;
    price: number | null;
    retailPrice: number | null;
    replacementCost: number | null;
}

export interface IBaseItemAvailabilityResult {
    item: ItemModel;
    itemExists: boolean;
    remanNumber: string;
    yearRange: string;
    alternateItems: string[];
}

export class BaseItemAvailabilityResult {
    item: ItemModel;
    itemExists: boolean;
    remanNumber: string;
    yearRange: string;
    alternateItems: string[];

    constructor(
        item: ItemModel,
        itemExists: boolean,
        remanNumber: string,
        yearRange: string,
        alternateItems: string[]
    ) {
        this.item = item
        this.itemExists = itemExists
        this.remanNumber = remanNumber
        this.yearRange = yearRange
        this.alternateItems = alternateItems
    }
}

export interface ItemAvailability {
    availabilityOrderType: OrderType;
    partIsAvailable: boolean;
    partDoesNotExistInWarehouse: boolean;
    availableQuantity: number;
    partPriceMessage: string;
    partIsRestricted: boolean | null;
    partStatus: string;
    canOrder: boolean;
    repairOnly: boolean;
    isInStock: boolean;
    showRestrictedBulletin: boolean;
}

export enum OrderType {
    Purchase = 1,
    Exchange = 2,
    Nissan = 3,
    International = 4
}

export interface IItemAvailabilityResult extends IBaseItemAvailabilityResult{
    isOnBackorder: boolean;
    estimatedDeliveryDate: Date | null; 
    exchangeAvailability: ItemAvailability;
    purchaseAvailability: ItemAvailability;
    mileageToBeSetAtDealership: boolean;
    showOnBackorderMessage(): boolean;
    showNoEtaMessage(): boolean;
}

export class ItemAvailabilityResult extends BaseItemAvailabilityResult implements IItemAvailabilityResult{
    isOnBackorder: boolean;
    estimatedDeliveryDate: Date | null;
    exchangeAvailability: ItemAvailability;
    purchaseAvailability: ItemAvailability;
    mileageToBeSetAtDealership: boolean;

    public showOnBackorderMessage(): boolean {
        return this.isOnBackorder && this.estimatedDeliveryDate !== null;
    }

    public showNoEtaMessage(): boolean {
        return this.isOnBackorder && this.estimatedDeliveryDate === null;
    }

    constructor(
        item: ItemModel,
        itemExists: boolean,
        remanNumber: string,
        yearRange: string,
        alternateItems: string[],
        isOnBackorder: boolean,
        estimatedDeliveryDate: Date | null,
        exchangeAvailability: ItemAvailability,
        purchaseAvailability: ItemAvailability,
        mileageToBeSetAtDealership: boolean,
    ) {
        super(item, itemExists, remanNumber, yearRange, alternateItems)
        this.isOnBackorder = isOnBackorder
        this.estimatedDeliveryDate = estimatedDeliveryDate
        this.exchangeAvailability = exchangeAvailability
        this.purchaseAvailability = purchaseAvailability
        this.mileageToBeSetAtDealership = mileageToBeSetAtDealership
    }
}

export interface InternationalItemAvailabilityResult extends BaseItemAvailabilityResult {
    internationalAvailability: ItemAvailability;
    adjustedPartPrice: number;
}

export interface NissanItemAvailabilityResult extends BaseItemAvailabilityResult {
    subPart: string;
    subQty: number;
    isBackOrder: boolean;
    noEtaInformation: boolean;
    boCount: number;
    hardPartMessage: string;
    nissanAvailability: ItemAvailability;
    showCannotOrderForeignInventoryUsaMessage: boolean;
    showCannotOrderForeignInventoryCanadaMessage: boolean;
}

export interface SearchResult {
    count: number;
    item?: ItemAvailabilityResult | InternationalItemAvailabilityResult | NissanItemAvailabilityResult | null
}
