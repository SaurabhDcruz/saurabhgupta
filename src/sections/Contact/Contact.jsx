import React from 'react';
import { ScrollSection, MagneticButton } from '@/components/common';
import useContactForm from '@/hooks/useContactForm';
import content from '@/constants/content';

const Contact = React.memo(() => {
    const { formRef, isSending, statusMessage, errors, setErrors, sendEmail } = useContactForm();

    return (
        <ScrollSection id="contact" index={4} title="Contact With Me" subtitle="Reach out for projects, collaborations or a quick introduction.">
            <div className="contact-panel">
                <div className="contact-card contact-details">
                    <div className="contact-card-header">
                        <span className="contact-chip">Connect</span>
                        <h3>{content.contact.name}</h3>
                        <p className="contact-role">{content.contact.role}</p>
                    </div>
                    <div className="contact-info-grid">
                        <div className="contact-info-item">
                            <span>Phone</span>
                            <strong>{content.contact.phone}</strong>
                        </div>
                        <div className="contact-info-item">
                            <span>Email</span>
                            <strong>{content.contact.email}</strong>
                        </div>
                        <div className="contact-info-item contact-info-full">
                            <span>Address</span>
                            <strong>{content.contact.address}</strong>
                        </div>
                    </div>
                </div>
                <form ref={formRef} onSubmit={sendEmail} className="contact-card contact-form">
                    <div className="form-row">
                        <input
                            type="text"
                            name="name"
                            placeholder="Your name"
                            aria-label="Your name"
                            className={errors.name ? 'input-error' : ''}
                            onInput={() => setErrors(prev => ({ ...prev, name: false }))}
                            required
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder="Your email"
                            aria-label="Your email"
                            className={errors.email ? 'input-error' : ''}
                            onInput={() => setErrors(prev => ({ ...prev, email: false }))}
                            required
                        />
                    </div>
                    <div className="form-row">
                        <input
                            type="tel"
                            name="phone"
                            placeholder="Contact Number"
                            aria-label="Contact Number"
                            className={errors.phone ? 'input-error' : ''}
                            onInput={() => setErrors(prev => ({ ...prev, phone: false }))}
                            required
                        />
                        <input
                            type="text"
                            name="title"
                            placeholder="Subject"
                            aria-label="Subject"
                            className={errors.title ? 'input-error' : ''}
                            onInput={() => setErrors(prev => ({ ...prev, title: false }))}
                            required
                        />
                    </div>
                    <textarea
                        name="message"
                        placeholder="Your message"
                        aria-label="Your message"
                        rows="5"
                        className={errors.message ? 'input-error' : ''}
                        onInput={() => setErrors(prev => ({ ...prev, message: false }))}
                        required
                    />
                    <MagneticButton disabled={isSending} className="magnetic-button" style={{ width: '100%' }}>
                        {isSending ? 'Sending...' : 'Send Message'}
                    </MagneticButton>
                </form>
            </div>

            {/* Cinematic Toaster - Moved here for local section feedback if needed, 
          but usually better in a global Portal. For now keeping it simple as per original App.jsx */}
            <div className="toast-container">
                {statusMessage && (
                    <div key={statusMessage} className={`toast active ${statusMessage.includes('successfully') ? 'toast-success' : 'toast-error'}`}>
                        <span className="toast-icon">
                            {statusMessage.includes('successfully') ? '✨' : '❌'}
                        </span>
                        <span className="toast-text">{statusMessage}</span>
                        <div className="toast-progress" />
                    </div>
                )}
            </div>
        </ScrollSection>
    );
});

export default Contact;
