
import React from 'react';
import { Award, Shield, Users, Building } from 'lucide-react';

const CertificationsSection = () => {
  const certifications = [
    {
      category: 'Industry Certifications',
      icon: <Award className="w-8 h-8 text-buckeye-scarlet" />,
      items: [
        'BICSI Registered Communications Distribution Designer (RCDD)',
        'BICSI Outside Plant Designer (OSP)',
        'CompTIA Network+',
        'Cisco Certified Network Associate (CCNA)',
        'Fiber Optic Association (FOA) Certified'
      ]
    },
    {
      category: 'Security & Compliance',
      icon: <Shield className="w-8 h-8 text-buckeye-scarlet" />,
      items: [
        'SOC 2 Type II Compliance',
        'HIPAA Business Associate Certified',
        'PCI DSS Compliance',
        'ISO 27001 Information Security',
        'NIST Cybersecurity Framework'
      ]
    },
    {
      category: 'Strategic Partnerships',
      icon: <Users className="w-8 h-8 text-buckeye-scarlet" />,
      items: [
        'Cisco Gold Partner',
        'CommScope Authorized Partner',
        'Panduit Certified Installer',
        'Corning Fiber Solutions Partner',
        'Leviton Preferred Partner'
      ]
    },
    {
      category: 'Business Credentials',
      icon: <Building className="w-8 h-8 text-buckeye-scarlet" />,
      items: [
        'Ohio Department of Commerce Licensed',
        'Better Business Bureau A+ Rating',
        'OSHA 30-Hour Construction Certified',
        'Minority Business Enterprise (MBE)',
        'Small Business Administration Certified'
      ]
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-buckeye-black mb-4">
            Certifications & Partnerships
          </h2>
          <p className="text-xl text-buckeye-gray max-w-3xl mx-auto">
            Our credentials and partnerships demonstrate our commitment to excellence and industry leadership.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {certifications.map((section, index) => (
            <div key={index} className="bg-white p-8 rounded-lg shadow-md">
              <div className="flex items-center mb-6">
                {section.icon}
                <h3 className="text-xl font-bold text-buckeye-black ml-3">
                  {section.category}
                </h3>
              </div>
              
              <ul className="space-y-3">
                {section.items.map((item, idx) => (
                  <li key={idx} className="flex items-start">
                    <div className="w-2 h-2 bg-buckeye-scarlet rounded-full mt-2 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <p className="text-buckeye-gray">
            All certifications are current and regularly updated to maintain compliance and industry standards.
          </p>
        </div>
      </div>
    </section>
  );
};

export default CertificationsSection;
