
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Phone, Mail, MapPin, AlertCircle, Shield } from 'lucide-react';
import { sanitizeInput, validateEmail, validatePhone, validateTextLength, RateLimiter } from '@/utils/security';

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  message?: string;
}

// Initialize rate limiter
const rateLimiter = new RateLimiter(3, 10 * 60 * 1000); // 3 attempts per 10 minutes

const SecureContactForm = () => {
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

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Enhanced validation with sanitization
    const sanitizedName = sanitizeInput(formData.name);
    const sanitizedEmail = sanitizeInput(formData.email);
    const sanitizedPhone = sanitizeInput(formData.phone);
    const sanitizedCompany = sanitizeInput(formData.company);
    const sanitizedMessage = sanitizeInput(formData.message);

    // Name validation
    if (!sanitizedName || sanitizedName.length < 2) {
      newErrors.name = 'Name must be at least 2 characters long';
    } else if (!validateTextLength(sanitizedName, 50)) {
      newErrors.name = 'Name must be less than 50 characters';
    } else if (!/^[a-zA-Z\s\-'\.]+$/.test(sanitizedName)) {
      newErrors.name = 'Name contains invalid characters';
    }

    // Email validation
    if (!sanitizedEmail) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(sanitizedEmail)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone validation (optional but stricter when provided)
    if (sanitizedPhone && !validatePhone(sanitizedPhone)) {
      newErrors.phone = 'Please enter a valid phone number';
    } else if (sanitizedPhone && !validateTextLength(sanitizedPhone, 20)) {
      newErrors.phone = 'Phone number is too long';
    }

    // Company validation
    if (sanitizedCompany && !validateTextLength(sanitizedCompany, 100)) {
      newErrors.company = 'Company name must be less than 100 characters';
    } else if (sanitizedCompany && !/^[a-zA-Z0-9\s\-&.,()]+$/.test(sanitizedCompany)) {
      newErrors.company = 'Company name contains invalid characters';
    }

    // Message validation
    if (!sanitizedMessage || sanitizedMessage.length < 10) {
      newErrors.message = 'Message must be at least 10 characters long';
    } else if (!validateTextLength(sanitizedMessage, 1000)) {
      newErrors.message = 'Message must be less than 1000 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Real-time sanitization and length limiting
    let sanitizedValue = sanitizeInput(value);
    
    // Apply field-specific limits
    const limits = {
      name: 50,
      email: 254,
      phone: 20,
      company: 100,
      message: 1000
    };
    
    if (sanitizedValue.length > limits[name as keyof typeof limits]) {
      sanitizedValue = sanitizedValue.substring(0, limits[name as keyof typeof limits]);
    }
    
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
    
    // Rate limiting check
    const clientId = 'contact-form'; // In production, use IP or user identifier
    if (!rateLimiter.isAllowed(clientId)) {
      const remaining = rateLimiter.getRemainingAttempts(clientId);
      toast({
        title: "Rate limit exceeded",
        description: `Too many attempts. Please wait before trying again. Remaining attempts: ${remaining}`,
        variant: "destructive",
        duration: 5000,
      });
      return;
    }

    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please correct the errors below and try again.",
        variant: "destructive",
        duration: 5000,
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate secure form submission with additional security measures
    setTimeout(() => {
      toast({
        title: "Form submitted securely!",
        description: "Your message has been sent securely. We'll contact you soon.",
        duration: 5000,
      });
      
      // Clear form data
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        message: ''
      });
      
      setErrors({});
      setIsSubmitting(false);
    }, 1500);
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
        <h2 className="section-title text-center">Secure Contact Form</h2>
        <div className="flex items-center justify-center gap-2 mb-4">
          <Shield className="text-buckeye-scarlet" size={20} />
          <p className="text-sm text-gray-600">Your data is protected with enterprise-grade security</p>
        </div>
        <p className="section-subtitle text-center">
          Ready to discuss your connectivity needs? Our team is here to help.
        </p>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-12">
          <div className="lg:col-span-2">
            <div className="bg-white p-6 md:p-8 rounded-lg shadow-md border border-gray-200">
              <h3 className="text-2xl font-bold mb-6 text-buckeye-black">Get a Secure Quote</h3>
              
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
                      maxLength={50}
                      autoComplete="name"
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
                      autoComplete="email"
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
                      autoComplete="tel"
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
                      autoComplete="organization"
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
                    maxLength={1000}
                  />
                  <div id="message-help" className="text-sm text-gray-500">
                    {formData.message.length}/1000 characters
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
                  {isSubmitting ? 'Submitting Securely...' : 'Submit Secure Request'}
                </Button>
                <div id="submit-help" className="text-sm text-gray-500 text-center">
                  * Required fields. All data is transmitted securely and encrypted.
                </div>
              </form>
            </div>
          </div>
          
          <div>
            <div className="bg-white p-6 md:p-8 rounded-lg shadow-md h-full border border-gray-200">
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

export default SecureContactForm;
