import type { OrderType } from "./enumtypes";


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

    address: string;
    city: string;
    state: string;
    zip: string;
    salesTerritory: string;
    salesRep: string;
    dealerManufacturer: string;
    accountType: string;

    constructor(customerNumber: string, friendlyCustomerNumber: string, name: string, phone: string, contactName: string, email: string, 
        address:string, city: string, state: string, zip: string, salesTerritory: string, salesRep: string, dealerManufacturer: string, accountType: string) {
        this.customerNumber = customerNumber;
        this.friendlyCustomerNumber = friendlyCustomerNumber;
        this.name = name;
        this.customerNumber = customerNumber;
        this.phone = phone;
        this.contactName = contactName;
        this.email = email;
        this.address = address;
        this.city = city;
        this.state = state;
        this.zip = zip;
        this.salesTerritory = salesTerritory;
        this.salesRep = salesRep;
        this.dealerManufacturer = dealerManufacturer;
        this.accountType = accountType;
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
    partType: string;
    price: number | null;
    retailPrice: number | null;
    replacementCost: number | null;
    itemStatusDescription: string | null;
}

export interface IBaseItemAvailabilityResult {
    item: ItemModel;
    itemExists: boolean;
    remanNumber: string;
    yearRange: string;
    alternateItems: string[];
    isRadio: boolean
}

export class BaseItemAvailabilityResult {
    siteId: string;
    item: ItemModel;
    itemExists: boolean;
    remanNumber: string;
    yearRange: string;
    alternateItems: string[];
    isRadio: boolean;

    constructor(
        siteId: string,
        item: ItemModel,
        itemExists: boolean,
        remanNumber: string,
        yearRange: string,
        alternateItems: string[],
        isRadio: boolean
    ) {
        this.siteId = siteId
        this.item = item
        this.itemExists = itemExists
        this.remanNumber = remanNumber
        this.yearRange = yearRange
        this.alternateItems = alternateItems
        this.isRadio = isRadio
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
        siteId: string,
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
        isRadio: boolean
    ) {
        super(siteId, item, itemExists, remanNumber, yearRange, alternateItems, isRadio)
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

// This model is a combined model that represents either an Exchange or Sale (Purchase). There are some differences in fields but for ease of use in the UI we combined
// both models into this one big model
export interface IInvoiceHistoryModel {

    orderDate: Date;
    orderNumber: number;
    dealerContact: string;
    roNumber: string; 
    poNumber: string;
    itemNumber: string;    // exchange
    partDescription: string; // exchange
    customerName: string;
    shipDate: string | null;
    trackingNumber: string;
    status: string;
    
    // sales order only
    totalSales: number | null;
    // sales order only
    totalQuantity: number | null;

    // exchange order only
    coreReturnedDate: Date | null;    
}

export interface IOrderModel {

    id: number;
    orderDate: string;
    orderTime: string;
    dealerCode: string | null;
    dealerName: string | null;
    contactName: string | null;
    email: string | null;
    customerName: string | null;
    roNumber: string | null;
    poNumber: string | null;
    partNumber: string | null;
    wnum: string | null;
    complaint: string | null;
    deliveryDate: string | null;
    vin: string | null;
    tacCaseNumber: string | null;
    mileage: number | null;
}


export interface CreateOrderResult {
    orderId: number;
}

export interface IBackOrderedPart {    
    partNumber: string;
    friendlyPartNumber: string;
    qtyOnBackOrder: number | null;
    isOnBackorder: boolean;
    expectedDeliveryDate: Date | null;
}