import React from 'react';
import { ScrollSection } from '@/components/common';
import content from '@/constants/content';

const Clients = React.memo(() => {
    return (
        <ScrollSection id="clients" index={3} title="Awesome Clients" subtitle="Trusted by brands and partners across design, development and technology.">
            <div className="neural-blade-system">
                <div className="system-status-bar">
                    <span className="bit">SYS_ACTIVE</span>
                    <span className="line" />
                    <span className="bit">ID_VERIFIED</span>
                </div>
                <div className="blade-container">
                    {content.clients.map((client, i) => (
                        <div key={client} className="neural-blade">
                            <div className="blade-skew-fix">
                                <span className="blade-id">0{i + 1}</span>
                                <div className="blade-content">
                                    <h3 className="client-name">{client}</h3>
                                    <div className="data-bits">
                                        <span>NV_LINK_ESTABLISHED</span>
                                        <span>ENCRYPT_STABLE</span>
                                    </div>
                                </div>
                                <div className="blade-energy-core" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </ScrollSection>
    );
});

export default Clients;
