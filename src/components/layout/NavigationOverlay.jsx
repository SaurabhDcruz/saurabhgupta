import useStore from '@/store/index.js'
import { smoothScrollTo } from '@/utils/lenisRegistry.js'

const navItems = [
  { id: 'hero', label: 'Home' },
  { id: 'services', label: 'Services' },
  { id: 'portfolio', label: 'Portfolio' },
  { id: 'resume', label: 'Resume' },
  { id: 'clients', label: 'Clients' },
  { id: 'contact', label: 'Contact' },
]

export default function NavigationOverlay() {
  const menuOpen = useStore((state) => state.menuOpen)
  const toggleMenu = useStore((state) => state.toggleMenu)
  const currentSection = useStore((state) => state.currentSection)

  const scrollToSection = (id) => {
    const section = document.getElementById(id)
    if (section) {
      smoothScrollTo(section, { duration: 2.2 })
      toggleMenu()
    }
  }

  return (
    <div className={`navigation-overlay ${menuOpen ? 'open' : ''}`}>
      <button className="burger-button" type="button" aria-label="Toggle navigation" onClick={toggleMenu}>
        <span />
        <span />
        <span />
      </button>

      <nav className="nav-panel" aria-hidden={!menuOpen}>
        <ul>
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                className={`nav-link ${currentSection === item.id ? 'active' : ''}`}
                onClick={() => scrollToSection(item.id)}
              >
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
