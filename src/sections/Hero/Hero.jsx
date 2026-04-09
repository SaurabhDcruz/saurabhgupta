import React from 'react';
import { AnimatedText, ScrollSection } from '@/components/common';
import content from '@/constants/content';
import FloatingCV from '@/components/ui/FloatingCV';

const socialIcons = {
    Facebook: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff">
            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
    ),
    Instagram: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
            <circle cx="12" cy="12" r="4" />
            <circle cx="17.5" cy="6.5" r="1" fill="#fff" stroke="none" />
        </svg>
    ),
    LinkedIn: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff">
            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
            <rect x="2" y="9" width="4" height="12" />
            <circle cx="4" cy="4" r="2" />
        </svg>
    ),
};

const Hero = React.memo(({ heroCardRef }) => {
    return (
        <ScrollSection id="hero" pure={true} className="section intro-section">
            <div className="hero-copy" ref={heroCardRef}>
                <p className="eyebrow">{content.hero.eyebrow}</p>
                <h1 className="hero-title">
                    Hi, I'm <span className="hero-accent">Saurabh Gupta</span>
                </h1>
                <AnimatedText className="hero-typewriter" />
                <p className="hero-description">{content.hero.description}</p>
                <FloatingCV />
                <div className="social-links">
                    {content.hero.social.map((item) => (
                        <a
                            key={item.label}
                            href={item.href}
                            target="_blank"
                            rel="noreferrer"
                            className="hero-social-node"
                        >
                            <span className="icon-wrap">{socialIcons[item.label] || item.label}</span>
                            <span className="social-label">{item.label}</span>
                        </a>
                    ))}
                </div>
            </div>
        </ScrollSection>
    );
});

export default Hero;
