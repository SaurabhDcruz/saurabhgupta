import React from 'react';

const SciFiLogo = ({ className = '', size = 44 }) => {
    return (
        <div
            className={`scifi-logo-root ${className}`}
            style={{ '--logo-size': `${size}px` }}
        >
            <svg
                width={size}
                height={size}
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="scifi-logo-svg"
            >
                {/* OUTER ORBITAL RING */}
                <circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeDasharray="10 20"
                    className="logo-orbital"
                />

                {/* SECONDARY DECORATIVE RING */}
                <circle
                    cx="50"
                    cy="50"
                    r="38"
                    stroke="currentColor"
                    strokeWidth="0.5"
                    strokeDasharray="2 4"
                    opacity="0.3"
                    className="logo-orbital-inner"
                />

                {/* HEXAGON CORE FRAME */}
                <path
                    d="M50 20 L76 35 L76 65 L50 80 L24 65 L24 35 Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinejoin="round"
                    className="logo-hex-frame"
                />

                {/* CENTRAL "S" SYMBOL - GEOMETRIC (CORRECTED) */}
                <path
                    d="M60 40 L40 40 L40 50 L60 50 L60 60 L40 60"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="square"
                    className="logo-symbol-path"
                />

                {/* TACTICAL CORNER INDICATORS */}
                <rect x="48" y="10" width="4" height="4" fill="currentColor" className="logo-tick t" />
                <rect x="48" y="86" width="4" height="4" fill="currentColor" className="logo-tick b" />
                <rect x="10" y="48" width="4" height="4" fill="currentColor" className="logo-tick l" />
                <rect x="86" y="48" width="4" height="4" fill="currentColor" className="logo-tick r" />
            </svg>
            <div className="logo-glow-effect" />
        </div>
    );
};

export default SciFiLogo;
