import type { OrderType } from "./enumtypes";


export type OrderFormViewModel = {

  orderType: OrderType,

  partNumber: string,
  dealerName: string,
  dealerCode: string,
  contactName: string,
  emailAddress: string,
  phoneNumber: string,
  customerName: string,
  mileage: string,
  vin: string,
  partNumberObtained: string,

  isWarrantyExchange?: boolean,
  isCore?: boolean,
  isGoodwill?: boolean,

  roNumber: string,
  poNumber: string,
  serviceManagerFullName: string,
  deliveryDate?: Date,
  hours?: string,
  customerComplaint: string,

  address: string,
  city: string,
  state: string,
  zip: string,
  shippingMethod: string,
  comments?: string,

  isRadio?: boolean,
  isMediaStuck?: boolean,

  customerMailingAddress: string,
  customerMailingCity: string,
  customerMailingState: string,
  customerMailingZip: string,

  technicianName: string
};

export type NissanOrderFormViewModel = {

  orderType: OrderType,

  partNumber: string,
  dealerName: string,
  dealerCode: string,
  contactName: string,
  emailAddress: string,
  phoneNumber: string,

  address: string,
  city: string,
  state: string,
  zip: string,
  mileage: string,
  mileageType: string, // either MPH or KPH
  vin: string,
  dealerReferenceNumber: string,

  customerComplaint: string  
};

export type InternationalOrderFormViewModel = {

  orderType: OrderType,

  partNumber: string,
  dealerName: string,
  dealerCode: string,
  contactName: string,
  emailAddress: string,
  phoneNumber: string,

  address: string,
  city: string,
  state: string,
  zip: string,
  mileage: string,
  mileageType: string, // either MPH or KPH
  vin: string,
  dealerReferenceNumber: string,

  customerComplaint: string,
};