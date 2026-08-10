import React from 'react';
import { ScrollSection } from '@/components/common';
import content from '@/constants/content';

const TechStack = React.memo(() => {
    return (
        <ScrollSection 
            id="skills-ecosystem" 
            index={3} 
            title="Tech Stack & Ecosystem" 
            subtitle="Production-proven frameworks, libraries, and tools used to build enterprise-grade frontend systems."
        >
            <div className="neural-blade-system">
                <div className="system-status-bar">
                    <span className="bit">STACK_ACTIVE</span>
                    <span className="line" />
                    <span className="bit">ENGINEERING_READY</span>
                </div>
                <div className="blade-container">
                    {content.competencies.map((item, i) => (
                        <div key={item.name} className="neural-blade">
                            <div className="blade-skew-fix">
                                <span className="blade-id">0{i + 1}</span>
                                <div className="blade-content">
                                    <h3 className="client-name">{item.name}</h3>
                                    <div className="data-bits">
                                        <span>CAT: {item.category}</span>
                                        <span>STATUS: {item.exp}</span>
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

export default TechStack;