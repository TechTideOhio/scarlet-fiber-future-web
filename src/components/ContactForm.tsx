
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Phone, Mail, MapPin, AlertCircle } from 'lucide-react';

// Input validation utilities
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
};

const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};

const validateTextLength = (text: string, maxLength: number): boolean => {
  return text.length <= maxLength;
};

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  message?: string;
}

const ContactForm = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: ''
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitAttempts, setSubmitAttempts] = useState(0);
  const [lastSubmitTime, setLastSubmitTime] = useState(0);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Name validation
    if (!formData.name || formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters long';
    } else if (!validateTextLength(formData.name, 100)) {
      newErrors.name = 'Name must be less than 100 characters';
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    } else if (!validateTextLength(formData.email, 254)) {
      newErrors.email = 'Email must be less than 254 characters';
    }

    // Phone validation (optional but if provided must be valid)
    if (formData.phone && !validatePhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    } else if (formData.phone && !validateTextLength(formData.phone, 20)) {
      newErrors.phone = 'Phone number must be less than 20 characters';
    }

    // Company validation (optional)
    if (formData.company && !validateTextLength(formData.company, 100)) {
      newErrors.company = 'Company name must be less than 100 characters';
    }

    // Message validation
    if (!formData.message || formData.message.length < 10) {
      newErrors.message = 'Message must be at least 10 characters long';
    } else if (!validateTextLength(formData.message, 2000)) {
      newErrors.message = 'Message must be less than 2000 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const sanitizedValue = sanitizeInput(value);
    
    setFormData({
      ...formData,
      [name]: sanitizedValue
    });

    // Clear error for this field when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors({
        ...errors,
        [name]: undefined
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Rate limiting check (simple frontend implementation)
    const now = Date.now();
    if (now - lastSubmitTime < 5000) { // 5 second cooldown
      toast({
        title: "Please wait",
        description: "Please wait a moment before submitting again.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    // Attempt limiting
    if (submitAttempts >= 5) {
      toast({
        title: "Too many attempts",
        description: "Please refresh the page and try again later.",
        variant: "destructive",
        duration: 5000,
      });
      return;
    }

    if (!validateForm()) {
      setSubmitAttempts(prev => prev + 1);
      toast({
        title: "Validation Error",
        description: "Please correct the errors below and try again.",
        variant: "destructive",
        duration: 5000,
      });
      return;
    }

    setIsSubmitting(true);
    setLastSubmitTime(now);
    setSubmitAttempts(prev => prev + 1);

    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Form submitted successfully!",
        description: "We'll contact you soon about your inquiry.",
        duration: 5000,
      });
      
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        message: ''
      });
      
      setErrors({});
      setIsSubmitting(false);
      setSubmitAttempts(0);
    }, 1000);
  };

  const contactInfo = [
    {
      icon: <Phone size={24} className="text-buckeye-scarlet" />,
      title: 'Call Us',
      details: '(614) 555-0123'
    },
    {
      icon: <Mail size={24} className="text-buckeye-scarlet" />,
      title: 'Email Us',
      details: 'info@buckeyedatacom.com'
    },
    {
      icon: <MapPin size={24} className="text-buckeye-scarlet" />,
      title: 'Visit Us',
      details: 'Columbus, Ohio'
    }
  ];

  return (
    <section id="contact" className="section-padding bg-gray-50">
      <div className="container mx-auto">
        <h2 className="section-title text-center">Contact Us</h2>
        <p className="section-subtitle text-center">
          Ready to discuss your connectivity needs? Our team is here to help.
        </p>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-12">
          <div className="lg:col-span-2">
            <div className="bg-white p-6 md:p-8 rounded-lg shadow-md">
              <h3 className="text-2xl font-bold mb-6 text-buckeye-black">Get a Quote</h3>
              
              <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="required">
                      Full Name *
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Enter your name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      aria-invalid={!!errors.name}
                      aria-describedby={errors.name ? "name-error" : undefined}
                      className={errors.name ? "border-red-500 focus:border-red-500" : ""}
                      maxLength={100}
                    />
                    {errors.name && (
                      <div id="name-error" className="flex items-center gap-1 text-sm text-red-600" role="alert">
                        <AlertCircle size={16} />
                        <span>{errors.name}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email" className="required">
                      Email Address *
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? "email-error" : undefined}
                      className={errors.email ? "border-red-500 focus:border-red-500" : ""}
                      maxLength={254}
                    />
                    {errors.email && (
                      <div id="email-error" className="flex items-center gap-1 text-sm text-red-600" role="alert">
                        <AlertCircle size={16} />
                        <span>{errors.email}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="Enter your phone number"
                      value={formData.phone}
                      onChange={handleChange}
                      aria-invalid={!!errors.phone}
                      aria-describedby={errors.phone ? "phone-error" : undefined}
                      className={errors.phone ? "border-red-500 focus:border-red-500" : ""}
                      maxLength={20}
                    />
                    {errors.phone && (
                      <div id="phone-error" className="flex items-center gap-1 text-sm text-red-600" role="alert">
                        <AlertCircle size={16} />
                        <span>{errors.phone}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="company">Company</Label>
                    <Input
                      id="company"
                      name="company"
                      placeholder="Enter your company name"
                      value={formData.company}
                      onChange={handleChange}
                      aria-invalid={!!errors.company}
                      aria-describedby={errors.company ? "company-error" : undefined}
                      className={errors.company ? "border-red-500 focus:border-red-500" : ""}
                      maxLength={100}
                    />
                    {errors.company && (
                      <div id="company-error" className="flex items-center gap-1 text-sm text-red-600" role="alert">
                        <AlertCircle size={16} />
                        <span>{errors.company}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="message" className="required">
                    How can we help? *
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Tell us about your project or requirements (minimum 10 characters)"
                    rows={4}
                    required
                    value={formData.message}
                    onChange={handleChange}
                    className={`resize-none ${errors.message ? "border-red-500 focus:border-red-500" : ""}`}
                    aria-invalid={!!errors.message}
                    aria-describedby={errors.message ? "message-error" : "message-help"}
                    maxLength={2000}
                  />
                  <div id="message-help" className="text-sm text-gray-500">
                    {formData.message.length}/2000 characters
                  </div>
                  {errors.message && (
                    <div id="message-error" className="flex items-center gap-1 text-sm text-red-600" role="alert">
                      <AlertCircle size={16} />
                      <span>{errors.message}</span>
                    </div>
                  )}
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-buckeye-scarlet text-white hover:bg-buckeye-scarlet/90 disabled:opacity-50"
                  disabled={isSubmitting}
                  aria-describedby="submit-help"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Request'}
                </Button>
                <div id="submit-help" className="text-sm text-gray-500 text-center">
                  * Required fields. We'll respond within 24 hours.
                </div>
              </form>
            </div>
          </div>
          
          <div>
            <div className="bg-white p-6 md:p-8 rounded-lg shadow-md h-full">
              <h3 className="text-2xl font-bold mb-6 text-buckeye-black">Contact Information</h3>
              
              <div className="space-y-8">
                {contactInfo.map((item, index) => (
                  <div key={index} className="flex items-start">
                    <div className="flex-shrink-0 mr-4" aria-hidden="true">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="font-medium text-buckeye-black mb-1">{item.title}</h4>
                      <p className="text-buckeye-gray">{item.details}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <hr className="my-8 border-gray-200" />
              
              <div>
                <h4 className="font-medium text-buckeye-black mb-4">Business Hours</h4>
                <div className="space-y-2 text-buckeye-gray">
                  <p>Monday - Friday: 8am - 6pm</p>
                  <p>Saturday: 9am - 1pm</p>
                  <p>Sunday: Closed</p>
                </div>
                <p className="mt-4 text-buckeye-gray">
                  24/7 emergency support available for existing clients
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
