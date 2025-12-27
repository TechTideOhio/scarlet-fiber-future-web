
import React, { useState, useEffect } from 'react';
import { Check, Network, Cable, Wrench, TrendingUp, Shield, Zap, Building, Factory, Hospital } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CTAButton from '../components/CTAButton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { LAYOUT_TOKENS, logLayoutToken } from '../constants';
import SEO from '../components/SEO';
import { ServiceSchema, BreadcrumbSchema } from '../components/StructuredData';
import { SEO_CONFIG } from '../config/seo';

const servicesData = [
  {
    name: 'Structured Fiber Cabling',
    description: 'Enterprise-grade fiber optic infrastructure delivering unmatched reliability and performance with lightning-fast data transmission and minimal latency.'
  },
  {
    name: 'Low-Voltage Installations',
    description: 'Comprehensive low-voltage solutions including voice/data systems, security cameras, access control, and building automation.'
  },
  {
    name: 'AI-Driven Network Monitoring',
    description: 'Intelligent monitoring using advanced AI algorithms to analyze performance, predict issues, and automatically optimize traffic flow.'
  }
];

const Services = () => {
  const [showStickyButton, setShowStickyButton] = useState(false);

  useEffect(() => {
    logLayoutToken('sticky-threshold', LAYOUT_TOKENS.scroll.stickyButtonThreshold);
    
    const handleScroll = () => {
      if (window.scrollY > LAYOUT_TOKENS.scroll.stickyButtonThreshold) {
        setShowStickyButton(true);
      } else {
        setShowStickyButton(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fiberBenefits = [
    'Lightning-fast data transmission speeds up to 10 Gbps',
    'Future-proof infrastructure that scales with your business',
    'Minimal signal loss over long distances',
    'Immune to electromagnetic interference',
    'Enhanced security with difficult signal interception',
    'Lower long-term maintenance costs'
  ];

  const fiberUseCases = [
    'Enterprise data centers requiring high-speed connectivity',
    'Healthcare facilities with critical patient data systems',
    'Educational institutions supporting thousands of users',
    'Financial services with real-time trading requirements',
    'Manufacturing plants with IoT and automation systems'
  ];

  const lowVoltageTypes = [
    'Voice and data cabling (Cat5e, Cat6, Cat6A)',
    'Security camera systems and access control',
    'Fire alarm and life safety systems',
    'Audio/visual and conference room setups',
    'Wireless access point installations',
    'Building automation and smart controls'
  ];

  const industriesServed = [
    { icon: <Building className="w-6 h-6" />, name: 'Corporate Offices' },
    { icon: <Hospital className="w-6 h-6" />, name: 'Healthcare' },
    { icon: <Factory className="w-6 h-6" />, name: 'Manufacturing' },
    { icon: <Building className="w-6 h-6" />, name: 'Retail' },
    { icon: <Building className="w-6 h-6" />, name: 'Education' },
    { icon: <Building className="w-6 h-6" />, name: 'Government' }
  ];

  const aiFeatures = [
    'Real-time network performance monitoring',
    'Predictive failure analysis and alerts',
    'Automated traffic optimization',
    'Security threat detection and response',
    'Bandwidth usage analytics and reporting',
    'Proactive maintenance scheduling'
  ];

  const roiStats = [
    { metric: 'Network Downtime Reduction', value: '85%' },
    { metric: 'Maintenance Cost Savings', value: '60%' },
    { metric: 'Issue Resolution Speed', value: '3x Faster' },
    { metric: 'Security Incident Prevention', value: '95%' }
  ];

  const comparisonData = [
    {
      feature: 'Installation Complexity',
      fiber: 'Advanced',
      lowVoltage: 'Moderate',
      aiMonitoring: 'Simple'
    },
    {
      feature: 'Scalability',
      fiber: 'Excellent',
      lowVoltage: 'Good',
      aiMonitoring: 'Excellent'
    },
    {
      feature: 'Maintenance',
      fiber: 'Low',
      lowVoltage: 'Moderate',
      aiMonitoring: 'Minimal'
    },
    {
      feature: 'ROI Timeline',
      fiber: '2-3 years',
      lowVoltage: '1-2 years',
      aiMonitoring: '6-12 months'
    },
    {
      feature: 'Best For',
      fiber: 'High-speed data',
      lowVoltage: 'Complete systems',
      aiMonitoring: 'Optimization'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <SEO 
        title={SEO_CONFIG.pages.services.title}
        description={SEO_CONFIG.pages.services.description}
        keywords={SEO_CONFIG.pages.services.keywords}
        canonicalUrl="/services"
      />
      <ServiceSchema services={servicesData} />
      <BreadcrumbSchema items={[
        { name: 'Home', url: '/' },
        { name: 'Services', url: '/services' }
      ]} />
      
      <Navbar />
      
      {/* Header */}
      <section className="bg-buckeye-black text-white py-16 mt-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Services</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Comprehensive network infrastructure solutions designed to power your business forward
          </p>
        </div>
      </section>

      {/* Service 1: Structured Fiber Cabling */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center mb-8">
              <Cable size={48} className="text-buckeye-scarlet mr-4" />
              <h2 className="text-3xl md:text-4xl font-bold text-buckeye-black">
                Structured Fiber Cabling
              </h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
              <div>
                <p className="text-lg text-buckeye-gray mb-6">
                  Our enterprise-grade fiber infrastructure delivers unmatched reliability and performance. 
                  We design, install, and maintain cutting-edge fiber optic networks that provide lightning-fast 
                  data transmission with minimal latency, ensuring your business stays connected and competitive.
                </p>
                
                <h3 className="text-xl font-bold text-buckeye-black mb-4">Key Benefits</h3>
                <ul className="space-y-3">
                  {fiberBenefits.map((benefit, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="w-5 h-5 text-buckeye-scarlet mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-buckeye-gray">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-buckeye-black mb-4">Perfect For</h3>
                <div className="space-y-4">
                  {fiberUseCases.map((useCase, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg border-l-4 border-buckeye-scarlet">
                      <p className="text-buckeye-gray">{useCase}</p>
                    </div>
                  ))}
                </div>
                
                <div className="mt-8">
                  <CTAButton variant="primary" size="lg">
                    Start Your Fiber Project
                  </CTAButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service 2: Low-Voltage Installations */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center mb-8">
              <Wrench size={48} className="text-buckeye-scarlet mr-4" />
              <h2 className="text-3xl md:text-4xl font-bold text-buckeye-black">
                Low-Voltage Installations
              </h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
              <div>
                <p className="text-lg text-buckeye-gray mb-6">
                  From voice and data systems to security and automation, our expert technicians handle 
                  all aspects of low-voltage installations. We ensure your infrastructure is reliable, 
                  scalable, and compliant with industry standards.
                </p>
                
                <h3 className="text-xl font-bold text-buckeye-black mb-4">Installation Types</h3>
                <ul className="space-y-3">
                  {lowVoltageTypes.map((type, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="w-5 h-5 text-buckeye-scarlet mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-buckeye-gray">{type}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-buckeye-black mb-4">Industries We Serve</h3>
                <div className="grid grid-cols-2 gap-4 mb-8">
                  {industriesServed.map((industry, index) => (
                    <div key={index} className="flex items-center p-3 bg-white rounded-lg border">
                      <div className="text-buckeye-scarlet mr-3">
                        {industry.icon}
                      </div>
                      <span className="text-buckeye-gray font-medium">{industry.name}</span>
                    </div>
                  ))}
                </div>
                
                <CTAButton variant="primary" size="lg">
                  Get Installation Quote
                </CTAButton>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service 3: AI-Driven Network Monitoring */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center mb-8">
              <Network size={48} className="text-buckeye-scarlet mr-4" />
              <h2 className="text-3xl md:text-4xl font-bold text-buckeye-black">
                AI-Driven Network Monitoring
              </h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
              <div>
                <p className="text-lg text-buckeye-gray mb-6">
                  Our intelligent monitoring system uses advanced AI algorithms to continuously analyze 
                  your network performance, predict potential issues, and automatically optimize traffic 
                  flow. Experience proactive network management that prevents problems before they impact your business.
                </p>
                
                <h3 className="text-xl font-bold text-buckeye-black mb-4">How It Works</h3>
                <div className="space-y-4 mb-6">
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-buckeye-scarlet text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-1">1</div>
                    <div>
                      <h4 className="font-semibold text-buckeye-black">Data Collection</h4>
                      <p className="text-buckeye-gray">Continuous monitoring of network metrics and traffic patterns</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-buckeye-scarlet text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-1">2</div>
                    <div>
                      <h4 className="font-semibold text-buckeye-black">AI Analysis</h4>
                      <p className="text-buckeye-gray">Machine learning algorithms identify patterns and anomalies</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-buckeye-scarlet text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-1">3</div>
                    <div>
                      <h4 className="font-semibold text-buckeye-black">Proactive Response</h4>
                      <p className="text-buckeye-gray">Automated alerts and optimizations prevent issues</p>
                    </div>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-buckeye-black mb-4">Features & Benefits</h3>
                <ul className="space-y-3">
                  {aiFeatures.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="w-5 h-5 text-buckeye-scarlet mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-buckeye-gray">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-buckeye-black mb-4">ROI Statistics</h3>
                <div className="grid grid-cols-1 gap-4 mb-8">
                  {roiStats.map((stat, index) => (
                    <div key={index} className="bg-gray-50 p-6 rounded-lg border-l-4 border-buckeye-scarlet">
                      <div className="flex justify-between items-center">
                        <span className="text-buckeye-gray">{stat.metric}</span>
                        <span className="text-2xl font-bold text-buckeye-scarlet">{stat.value}</span>
                      </div>
                    </div>
                  ))}
                </div>
                
                <CTAButton variant="primary" size="lg">
                  Implement AI Monitoring
                </CTAButton>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Comparison Table */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-buckeye-black">
              Service Comparison
            </h2>
            
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px] font-bold text-buckeye-black">Feature</TableHead>
                    <TableHead className="text-center font-bold text-buckeye-black">Fiber Cabling</TableHead>
                    <TableHead className="text-center font-bold text-buckeye-black">Low-Voltage</TableHead>
                    <TableHead className="text-center font-bold text-buckeye-black">AI Monitoring</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {comparisonData.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium text-buckeye-black">{row.feature}</TableCell>
                      <TableCell className="text-center">{row.fiber}</TableCell>
                      <TableCell className="text-center">{row.lowVoltage}</TableCell>
                      <TableCell className="text-center">{row.aiMonitoring}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky CTA Button */}
      <div className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${
        showStickyButton ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16 pointer-events-none'
      }`}>
        <CTAButton variant="primary" size="lg" className="shadow-2xl">
          Start Your Project
        </CTAButton>
      </div>

      <Footer />
    </div>
  );
};

export default Services;
