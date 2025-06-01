
import React from 'react';
import { Clock, Shield, Award, Users, CheckCircle, Star } from 'lucide-react';

const WhyChooseUsDetailed = () => {
  const advantages = [
    {
      icon: <Award className="w-16 h-16 text-buckeye-scarlet" />,
      title: '20+ Years of Excellence',
      subtitle: 'Industry Leadership Since 2003',
      description: 'Over two decades of experience in data communications has given us unparalleled expertise. We\'ve successfully completed over 500 projects across Ohio, from small office networks to enterprise-scale data centers. Our team has witnessed and adapted to every major technological shift, ensuring we always provide cutting-edge solutions.',
      highlights: [
        '500+ successful projects completed',
        'Serving clients across all major Ohio cities',
        'Expertise spanning multiple technology generations',
        'Proven track record with Fortune 500 companies'
      ]
    },
    {
      icon: <Star className="w-16 h-16 text-buckeye-scarlet" />,
      title: '99.999% Uptime Achievement',
      subtitle: 'Unmatched Reliability Standards',
      description: 'Our commitment to excellence is measured in our industry-leading 99.999% uptime achievement. This translates to less than 5 minutes of downtime per year – a standard that demonstrates our meticulous approach to system design, implementation, and maintenance.',
      highlights: [
        'Less than 5 minutes downtime annually',
        'Redundant system architectures',
        'Proactive monitoring and maintenance',
        'Emergency response within 15 minutes'
      ]
    },
    {
      icon: <Shield className="w-16 h-16 text-buckeye-scarlet" />,
      title: 'Enterprise Security Standards',
      subtitle: 'Military-Grade Protection',
      description: 'Security isn\'t an afterthought – it\'s built into every solution we design. Our enterprise security standards include multi-layered protection protocols, advanced encryption, and compliance with industry regulations including HIPAA, PCI DSS, and SOC 2.',
      highlights: [
        'Multi-layered security architecture',
        'HIPAA and PCI DSS compliance',
        '24/7 security monitoring',
        'Regular penetration testing'
      ]
    },
    {
      icon: <Users className="w-16 h-16 text-buckeye-scarlet" />,
      title: '24/7 Ohio-Based Support',
      subtitle: 'Local Expertise, Always Available',
      description: 'When issues arise, you need support from people who understand your business and your local environment. Our entire support team is based in Ohio, providing round-the-clock assistance with average response times under 15 minutes for critical issues.',
      highlights: [
        'Average 15-minute response time',
        '100% Ohio-based support staff',
        'Fluent in local business practices',
        'On-site support available statewide'
      ]
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-buckeye-black mb-4">
            Why Choose Buckeye DataCom
          </h2>
          <p className="text-xl text-buckeye-gray max-w-3xl mx-auto">
            Our commitment to excellence is backed by measurable results and unwavering dedication to Ohio businesses.
          </p>
        </div>
        
        <div className="space-y-16">
          {advantages.map((advantage, index) => (
            <div 
              key={index} 
              className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''
              }`}
            >
              <div className={index % 2 === 1 ? 'lg:col-start-2' : ''}>
                <div className="flex items-center mb-6">
                  {advantage.icon}
                  <div className="ml-4">
                    <h3 className="text-2xl font-bold text-buckeye-black">
                      {advantage.title}
                    </h3>
                    <p className="text-buckeye-scarlet font-medium">
                      {advantage.subtitle}
                    </p>
                  </div>
                </div>
                
                <p className="text-gray-600 leading-relaxed mb-6">
                  {advantage.description}
                </p>
                
                <div className="space-y-3">
                  {advantage.highlights.map((highlight, idx) => (
                    <div key={idx} className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-buckeye-scarlet mr-3" />
                      <span className="text-gray-700">{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className={index % 2 === 1 ? 'lg:col-start-1' : ''}>
                <div className="bg-white p-8 rounded-lg shadow-lg">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-buckeye-scarlet mb-2">
                      {index === 0 && '20+'}
                      {index === 1 && '99.999%'}
                      {index === 2 && '100%'}
                      {index === 3 && '24/7'}
                    </div>
                    <div className="text-gray-600">
                      {index === 0 && 'Years of Experience'}
                      {index === 1 && 'Uptime Achievement'}
                      {index === 2 && 'Security Compliance'}
                      {index === 3 && 'Local Support'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUsDetailed;
