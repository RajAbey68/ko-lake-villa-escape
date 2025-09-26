export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string, countryCode: string): boolean => {
  const phoneRegex = /^\d{7,15}$/;
  return phoneRegex.test(phone.replace(/\s+/g, ''));
};

export const validateDateRange = (checkIn: string, checkOut: string): { isValid: boolean; error?: string } => {
  if (!checkIn || !checkOut) {
    return { isValid: false, error: "Please select both check-in and check-out dates" };
  }

  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (checkInDate < today) {
    return { isValid: false, error: "Check-in date cannot be in the past" };
  }

  if (checkOutDate <= checkInDate) {
    return { isValid: false, error: "Check-out date must be after check-in date" };
  }

  return { isValid: true };
};

export const validateBookingForm = (data: {
  checkIn: string;
  checkOut: string;
  name: string;
  email: string;
  guests: string;
}): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!data.name.trim()) errors.push("Name is required");
  if (!data.email.trim()) errors.push("Email is required");
  if (!validateEmail(data.email)) errors.push("Please enter a valid email address");

  const dateValidation = validateDateRange(data.checkIn, data.checkOut);
  if (!dateValidation.isValid && dateValidation.error) {
    errors.push(dateValidation.error);
  }

  const guestCount = parseInt(data.guests);
  if (isNaN(guestCount) || guestCount < 1 || guestCount > 10) {
    errors.push("Please select a valid number of guests (1-10)");
  }

  return { isValid: errors.length === 0, errors };
};

export const validateContactForm = (data: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  countryCode: string;
  subject: string;
  message: string;
}): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!data.firstName.trim()) errors.push("First name is required");
  if (!data.lastName.trim()) errors.push("Last name is required");
  if (!data.email.trim()) errors.push("Email is required");
  if (!validateEmail(data.email)) errors.push("Please enter a valid email address");
  if (!data.phone.trim()) errors.push("Phone number is required");
  if (!data.subject) errors.push("Please select a subject");
  if (!data.message.trim()) errors.push("Message is required");

  if (data.phone && !validatePhone(data.phone, data.countryCode)) {
    errors.push("Phone number format may be incorrect for the selected country");
  }

  return { isValid: errors.length === 0, errors };
};