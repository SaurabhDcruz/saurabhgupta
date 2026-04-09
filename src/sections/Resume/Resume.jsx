import React from 'react';
import { ScrollSection } from '@/components/common';
import { ResumeCard } from '@/components/ui';
import content from '@/constants/content';

const Resume = React.memo(() => {
    return (
        <ScrollSection id="resume" index={2} title="My Resume" subtitle="Education and professional milestones that define my journey.">
            <div className="resume-timeline">
                <div className="timeline-line"></div>

                {[...content.resume.experience].reverse().map((item, idx) => (
                    <div key={`exp-${idx}`} className={`timeline-item ${idx % 2 === 0 ? 'left' : 'right'}`}>
                        <div className="timeline-node"></div>
                        <div className="timeline-content">
                            <ResumeCard
                                title={item.title}
                                subtitle={item.company}
                                years={item.years}
                                score=""
                                description={item.description}
                            />
                        </div>
                    </div>
                ))}

                {[...content.resume.education].reverse().map((item, idx) => {
                    const globalIdx = content.resume.experience.length + idx;
                    return (
                        <div key={`edu-${idx}`} className={`timeline-item ${globalIdx % 2 === 0 ? 'left' : 'right'}`}>
                            <div className="timeline-node"></div>
                            <div className="timeline-content">
                                <ResumeCard
                                    title={item.title}
                                    subtitle={item.school}
                                    years={item.years}
                                    score={item.score}
                                    description={item.description}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </ScrollSection>
    );
});

export default Resume;
