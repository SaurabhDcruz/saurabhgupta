import React from 'react';
import { ScrollSection } from '@/components/common';
import { ServiceCard } from '@/components/ui';
import content from '@/constants/content';

const Services = () => {
    return (
        <ScrollSection id="services" index={0} title="What I Do" subtitle="A comprehensive set of services rooted in design and development.">
            <div className="section-grid feature-grid">
                {content.services.map((service) => (
                    <ServiceCard key={service.title} {...service} />
                ))}
            </div>
        </ScrollSection>
    );
};

export default Services;
