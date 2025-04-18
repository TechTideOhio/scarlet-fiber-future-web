
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Phone, Mail, MapPin } from 'lucide-react';

const ContactForm = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Normally would send data to server here
    
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
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Enter your name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      placeholder="Enter your phone number"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="company">Company</Label>
                    <Input
                      id="company"
                      name="company"
                      placeholder="Enter your company name"
                      value={formData.company}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="message">How can we help?</Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Tell us about your project or requirements"
                    rows={4}
                    required
                    value={formData.message}
                    onChange={handleChange}
                    className="resize-none"
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-buckeye-scarlet text-white hover:bg-buckeye-scarlet/90"
                >
                  Submit Request
                </Button>
              </form>
            </div>
          </div>
          
          <div>
            <div className="bg-white p-6 md:p-8 rounded-lg shadow-md h-full">
              <h3 className="text-2xl font-bold mb-6 text-buckeye-black">Contact Information</h3>
              
              <div className="space-y-8">
                {contactInfo.map((item, index) => (
                  <div key={index} className="flex items-start">
                    <div className="flex-shrink-0 mr-4">
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
