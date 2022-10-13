export type OrderFormViewModel = {

    partNumber: string,
    dealershipName: string,
    dealershipCode: string,
    contactName: string,
    emailAddress: string,
    phoneNumber: string,
    customerName: string,
    mileage: string,
    vin: string,
    partNumberObtained: string,
  
    isWarranty?: boolean,
    isCore?: boolean,
    isGoodwill?: boolean,
  
    roNumber: string,
    poNumber: string,
    serviceManagerFullName: string,
    deliveryDate?: Date,
    hours: string,
    customerComplaint: string,
  
    address: string,
    city: string,
    state: string,
    zip: string,
    shippingMethod: string,
    comments?: string,
  };

