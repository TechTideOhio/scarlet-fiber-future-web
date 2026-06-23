import React from 'react';
import corporateImg from '@/assets/industries/corporate.jpg';
import healthcareImg from '@/assets/industries/healthcare.jpg';
import educationImg from '@/assets/industries/education.jpg';
import manufacturingImg from '@/assets/industries/manufacturing.jpg';
import retailImg from '@/assets/industries/retail.jpg';
import governmentImg from '@/assets/industries/government.jpg';

const industries = [
  { label: 'Corporate', image: corporateImg, note: 'Headquarters & multi-floor offices' },
  { label: 'Healthcare', image: healthcareImg, note: 'Hospitals, clinics, telemedicine' },
  { label: 'Education', image: educationImg, note: 'K-12, higher-ed, research labs' },
  { label: 'Manufacturing', image: manufacturingImg, note: 'Plants, warehouses, logistics' },
  { label: 'Retail', image: retailImg, note: 'Flagship stores, POS networks' },
  { label: 'Government', image: governmentImg, note: 'Municipal, civic, secure facilities' },
];

const IndustriesStrip = () => {
  return (
    <section className="w-full py-20 md:py-28 bg-white" aria-labelledby="industries-heading">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.2em] text-buckeye-scarlet font-medium mb-4">
              01 / Industries
            </p>
            <h2
              id="industries-heading"
              className="font-display text-4xl md:text-5xl lg:text-6xl text-buckeye-black leading-[1.05]"
            >
              Built for the places <em className="italic font-normal text-buckeye-scarlet">work happens</em>.
            </h2>
          </div>
          <p className="text-buckeye-gray text-base md:text-lg max-w-sm">
            Six industries. One standard of installation. Every cable certified, every cabinet labeled.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {industries.map(({ label, image, note }, i) => (
            <figure
              key={label}
              className="group relative overflow-hidden rounded-md bg-buckeye-black aspect-[4/5] cursor-default"
            >
              <img
                src={image}
                alt={`${label} environment served by Buckeye DataCom`}
                loading="lazy"
                width={1024}
                height={1280}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
              <figcaption className="absolute inset-x-0 bottom-0 p-6 md:p-7 text-white">
                <div className="flex items-center gap-3 mb-2 text-[10px] uppercase tracking-[0.25em] text-white/60">
                  <span>0{i + 1}</span>
                  <span className="h-px flex-1 bg-white/20" />
                </div>
                <h3 className="font-display text-2xl md:text-3xl leading-tight mb-1">{label}</h3>
                <p className="text-sm text-white/75">{note}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
};

export default IndustriesStrip;
