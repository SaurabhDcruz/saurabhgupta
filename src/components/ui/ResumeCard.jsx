import React from 'react';

const ResumeCard = ({ title, subtitle, years, score, description }) => (
    <article className="resume-card">
        <div className="resume-header">
            <div>
                <h3>{title}</h3>
                <p>{subtitle}</p>
            </div>
            <span className="year">{years}</span>
        </div>
        {score && <p className="resume-score">{score}</p>}
        <p>{description}</p>
    </article>
);

export default ResumeCard;
