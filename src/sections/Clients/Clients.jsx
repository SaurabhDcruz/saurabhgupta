import React from 'react';
import { ScrollSection } from '@/components/common';
import content from '@/constants/content';

const Clients = () => {
    return (
        <ScrollSection id="clients" index={3} title="Awesome Clients" subtitle="Trusted by brands and partners across design, development and technology.">
            <div className="client-grid">
                {content.clients.map((client) => (
                    <div key={client} className="client-pill">
                        {client}
                    </div>
                ))}
            </div>
        </ScrollSection>
    );
};

export default Clients;
