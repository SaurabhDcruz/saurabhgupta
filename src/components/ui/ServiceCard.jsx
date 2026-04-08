import React from 'react';

const ServiceCard = ({ title, description, category }) => (
    <article className="feature-card">
        <div className="feature-meta">{category}</div>
        <h3>{title}</h3>
        <p>{description}</p>
    </article>
);

export default ServiceCard;
