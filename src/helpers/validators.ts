

// customer US phone number validation
const regexPhone = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im
export const usPhoneNumber = (phone: string) => {  
  let isValid = regexPhone.test(phone);
  return isValid;
}

const vinRegex = /^[a-hj-npr-z0-9\-]{17}/im
export const vinNumber = (vin: string) => {  
  return vinRegex.test(vin);
}
