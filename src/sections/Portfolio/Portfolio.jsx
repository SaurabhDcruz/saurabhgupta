import React from 'react';
import { ScrollSection } from '@/components/common';
import { PortfolioCard } from '@/components/ui';
import content from '@/constants/content';

const Portfolio = React.memo(() => {
    return (
        <ScrollSection id="portfolio" index={1} title="My Portfolio" subtitle="Creative work across product, app and brand experiences.">
            <div className="section-grid portfolio-grid">
                {content.portfolio.map((item) => (
                    <PortfolioCard key={item.title} {...item} />
                ))}
            </div>
        </ScrollSection>
    );
});

export default Portfolio;
