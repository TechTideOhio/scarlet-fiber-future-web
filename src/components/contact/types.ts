
export interface FormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  message: string;
}

export interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  message?: string;
}

export interface ContactInfoItem {
  icon: React.ReactNode;
  title: string;
  details: string;
}
