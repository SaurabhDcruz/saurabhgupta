import React from 'react';
import { AnimatedText, ScrollSection } from '@/components/common';
import content from '@/constants/content';

const Hero = ({ heroCardRef }) => {
    return (
        <ScrollSection id="hero" pure={true} className="section intro-section">
            <div className="hero-copy" ref={heroCardRef}>
                <p className="eyebrow">{content.hero.eyebrow}</p>
                <h1 className="hero-title">
                    Hi, I'm <span className="hero-accent">Saurabh Gupta</span>
                </h1>
                <AnimatedText className="hero-typewriter" />
                <p className="hero-description">{content.hero.description}</p>
                <div className="social-links">
                    {content.hero.social.map((item) => (
                        <a key={item.label} href={item.href} target="_blank" rel="noreferrer">
                            {item.label}
                        </a>
                    ))}
                </div>
            </div>
        </ScrollSection>
    );
};

export default Hero;
