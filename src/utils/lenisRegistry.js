/**
 * Lightweight Lenis instance registry so any component can trigger
 * smooth programmatic scrolls through the same Lenis instance that
 * drives the page animations.
 */
let _lenis = null

export function setLenis(instance) {
    _lenis = instance
}

export function getLenis() {
    return _lenis
}

/**
 * Scroll to a target using Lenis for buttery smooth easing.
 * Falls back to native scrollIntoView if Lenis isn't ready yet.
 *
 * @param {string | HTMLElement} target  – CSS selector, element, or numeric offset
 * @param {object} options               – Lenis scrollTo options
 */
export function smoothScrollTo(target, options = {}) {
    if (_lenis) {
        _lenis.scrollTo(target, {
            duration: 1.8,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            offset: 0,
            ...options,
        })
    } else if (typeof target === 'string') {
        document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' })
    } else if (target instanceof HTMLElement) {
        target.scrollIntoView({ behavior: 'smooth' })
    }
}
