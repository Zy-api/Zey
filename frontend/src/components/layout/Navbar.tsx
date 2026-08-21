import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { navLinks } from '@/data/modules';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all"
      style={{
        background: scrolled ? 'color-mix(in srgb, var(--card) 80%, transparent)' : 'transparent',
        borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(12px)' : 'none',
        transition: 'var(--duration-normal) var(--ease-default)',
      }}
    >
      <nav className="container flex items-center justify-between" style={{ height: '4rem' }}>
        {/* Logo */}
        <Link to="/" className="flex items-center" style={{ gap: 'var(--spacing-sm)' }}>
          <div
            className="flex items-center justify-center rounded-lg"
            style={{
              width: '2rem',
              height: '2rem',
              background: 'linear-gradient(135deg, var(--accent), var(--info))',
              boxShadow: '0 2px 12px oklch(0.72 0.19 150 / 0.3)',
            }}
          >
            <span className="font-bold text-sm" style={{ color: 'var(--accent-foreground)' }}>
              TV
            </span>
          </div>
            <span
              className="font-bold"
              style={{ fontSize: 'var(--font-size-title)', letterSpacing: 'var(--letter-spacing-tight)' }}
            >
              Tool-Vault
            </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center" style={{ gap: 'var(--spacing-xl)' }}>
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className="relative font-medium transition-colors"
                style={{
                  color: isActive ? 'var(--accent)' : 'var(--muted-foreground)',
                  fontSize: 'var(--font-size-label)',
                }}
              >
                {link.name}
                {isActive && (
                  <motion.div
                    layoutId="navbar-active"
                    className="absolute -bottom-2 left-0 right-0 h-0.5 rounded-full"
                    style={{ background: 'var(--accent)' }}
                  />
                )}
              </Link>
            );
          })}
          <Link
            to="/downloads"
            className="rounded-lg font-semibold transition-all hover:opacity-90"
            style={{
              background: 'var(--accent)',
              color: 'var(--accent-foreground)',
              padding: 'var(--spacing-xs) var(--spacing-lg)',
              fontSize: 'var(--font-size-label)',
            }}
          >
            立即下载
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden"
          onClick={() => setIsOpen(!isOpen)}
          style={{ color: 'var(--foreground)' }}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden"
            style={{ background: 'var(--card)', borderTop: '1px solid var(--border)' }}
          >
            <div className="container flex flex-col" style={{ paddingBlock: 'var(--spacing-md)', gap: 'var(--spacing-sm)' }}>
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="font-medium transition-colors"
                  style={{
                    color: location.pathname === link.path ? 'var(--accent)' : 'var(--muted-foreground)',
                    fontSize: 'var(--font-size-body)',
                    paddingBlock: 'var(--spacing-xs)',
                  }}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
