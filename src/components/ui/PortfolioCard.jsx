import React from 'react';

const PortfolioCard = ({ image, title, type }) => (
    <article className="portfolio-card">
        <div className="portfolio-image-wrapper">
            <img
                src={image}
                alt={`${title} - ${type} projects by Saurabh Gupta`}
                loading="lazy"
                width="640"
                height="360"
                className="portfolio-image"
            />
        </div>
        <div className="portfolio-copy">
            <span>{type}</span>
            <h3>{title}</h3>
        </div>
    </article>
);

export default PortfolioCard;
