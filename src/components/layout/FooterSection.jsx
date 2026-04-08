import { useState } from 'react'
import content from '@/constants/content';
import { smoothScrollTo } from '@/utils/lenisRegistry.js'

const quickLinks = [
    { label: 'Portfolio', id: 'portfolio' },
    { label: 'Resume', id: 'resume', highlight: true },
    { label: 'Services', id: 'services' },
    { label: 'Contact', id: 'contact' },
]

const socialIcons = {
    Facebook: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
    ),
    Instagram: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
            <circle cx="12" cy="12" r="4" />
            <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
        </svg>
    ),
    LinkedIn: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
            <rect x="2" y="9" width="4" height="12" />
            <circle cx="4" cy="4" r="2" />
        </svg>
    ),
}

export default function FooterSection() {
    const [email, setEmail] = useState('')
    const [subscribed, setSubscribed] = useState(false)

    const handleSubscribe = (e) => {
        e.preventDefault()
        if (!email.trim()) return
        setSubscribed(true)
        setEmail('')
        setTimeout(() => setSubscribed(false), 4000)
    }

    const scrollTo = (id) => {
        const el = document.getElementById(id)
        if (el) smoothScrollTo(el, { duration: 2.2 })
    }

    return (
        <footer className="footer-section">
            {/* Top divider */}
            <div className="footer-divider" />

            <div className="footer-inner">
                {/* Col 1 – About */}
                <div className="footer-col">
                    <h4 className="footer-col-title">About Me</h4>
                    <p className="footer-body">
                        Professional developer specialising in creating exceptional digital
                        experiences. Available for freelance opportunities.
                    </p>
                    <div className="footer-social">
                        {content.hero.social.map((item) => (
                            <a
                                key={item.label}
                                href={item.href}
                                target="_blank"
                                rel="noreferrer"
                                aria-label={item.label}
                                className="footer-social-link"
                            >
                                {socialIcons[item.label]}
                            </a>
                        ))}
                    </div>
                </div>

                {/* Col 2 – Quick Links */}
                <div className="footer-col">
                    <h4 className="footer-col-title">Quick Links</h4>
                    <ul className="footer-links">
                        {quickLinks.map((link) => (
                            <li key={link.id}>
                                <button
                                    type="button"
                                    className={`footer-link ${link.highlight ? 'footer-link--accent' : ''}`}
                                    onClick={() => scrollTo(link.id)}
                                >
                                    {link.label}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Col 3 – Contact Info */}
                <div className="footer-col">
                    <h4 className="footer-col-title">Contact Info</h4>
                    <ul className="footer-contact-list">
                        <li>
                            <span className="footer-contact-label">Phone</span>
                            <a href={`tel:${content.contact.phone}`} className="footer-contact-value">
                                {content.contact.phone}
                            </a>
                        </li>
                        <li>
                            <span className="footer-contact-label">Email</span>
                            <a href={`mailto:${content.contact.email}`} className="footer-contact-value">
                                {content.contact.email}
                            </a>
                        </li>
                        <li>
                            <span className="footer-contact-label">Address</span>
                            <span className="footer-contact-value">{content.contact.address}</span>
                        </li>
                    </ul>
                </div>

                {/* Col 4 – Newsletter */}
                <div className="footer-col">
                    <h4 className="footer-col-title">Newsletter</h4>
                    <p className="footer-body">Get updates on new projects and blog posts.</p>
                    <form className="footer-newsletter" onSubmit={handleSubscribe}>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Your email"
                            aria-label="Newsletter email"
                            className="footer-input"
                            required
                        />
                        <button type="submit" className="footer-subscribe-btn">
                            {subscribed ? '✓ Subscribed!' : 'Subscribe'}
                        </button>
                    </form>
                </div>
            </div>

            {/* Bottom bar */}
            <div className="footer-bottom">
                <p className="footer-copyright">© 2026 All rights reserved.</p>
                <div className="footer-bottom-social">
                    {content.hero.social.map((item) => (
                        <a
                            key={item.label}
                            href={item.href}
                            target="_blank"
                            rel="noreferrer"
                            aria-label={item.label}
                            className="footer-bottom-icon"
                        >
                            {socialIcons[item.label]}
                        </a>
                    ))}
                </div>
            </div>
        </footer>
    )
}
