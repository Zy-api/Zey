import { Link } from 'react-router-dom';
import { navLinks, socialLinks } from '@/data/modules';
import { Github, Send, MessageCircle } from 'lucide-react';

const iconMap = {
  github: Github,
  send: Send,
  'message-circle': MessageCircle,
};

export default function Footer() {
  return (
    <footer
      className="border-t"
      style={{ borderColor: 'var(--border)', background: 'var(--card)' }}
    >
      <div className="container" style={{ paddingTop: 'var(--spacing-3xl)', paddingBottom: 'var(--spacing-xl)' }}>
        <div className="grid grid-cols-1 md:grid-cols-4" style={{ gap: 'var(--spacing-2xl)' }}>
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center" style={{ gap: 'var(--spacing-sm)' }}>
              <div
                className="flex items-center justify-center rounded-lg"
                style={{
                  width: '2rem',
                  height: '2rem',
                  background: 'var(--accent)',
                }}
              >
                <span className="font-bold text-sm" style={{ color: 'var(--accent-foreground)' }}>
                  TV
                </span>
              </div>
              <span className="font-bold" style={{ fontSize: 'var(--font-size-title)' }}>
                Tool-Vault
              </span>
            </div>
            <p
              className="mt-4 max-w-md"
              style={{
                color: 'var(--muted-foreground)',
                fontSize: 'var(--font-size-label)',
                lineHeight: 'var(--line-height)',
              }}
            >
              专注于 Android 刷机工具模块的分享与推广，为开发者和刷机爱好者提供安全、稳定、开源的工具资源。
            </p>
            <div className="flex items-center mt-4" style={{ gap: 'var(--spacing-md)' }}>
              {socialLinks.map((social) => {
                const Icon = iconMap[social.icon as keyof typeof iconMap];
                return (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center rounded-lg transition-all hover:opacity-80"
                    style={{
                      width: '2.5rem',
                      height: '2.5rem',
                      background: 'var(--muted)',
                      color: 'var(--muted-foreground)',
                    }}
                  >
                    <Icon size={18} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4" style={{ fontSize: 'var(--font-size-label)' }}>
              快速导航
            </h4>
            <ul className="flex flex-col" style={{ gap: 'var(--spacing-sm)' }}>
              {navLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="transition-colors hover:text-accent"
                    style={{
                      color: 'var(--muted-foreground)',
                      fontSize: 'var(--font-size-label)',
                    }}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-4" style={{ fontSize: 'var(--font-size-label)' }}>
              资源
            </h4>
            <ul className="flex flex-col" style={{ gap: 'var(--spacing-sm)' }}>
              <li>
                <a
                  href="#"
                  className="transition-colors hover:text-accent"
                  style={{ color: 'var(--muted-foreground)', fontSize: 'var(--font-size-label)' }}
                >
                  使用文档
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="transition-colors hover:text-accent"
                  style={{ color: 'var(--muted-foreground)', fontSize: 'var(--font-size-label)' }}
                >
                  常见问题
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="transition-colors hover:text-accent"
                  style={{ color: 'var(--muted-foreground)', fontSize: 'var(--font-size-label)' }}
                >
                  更新日志
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="transition-colors hover:text-accent"
                  style={{ color: 'var(--muted-foreground)', fontSize: 'var(--font-size-label)' }}
                >
                  开源许可
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div
          className="mt-8 pt-6 border-t flex flex-col md:flex-row items-center justify-between"
          style={{ borderColor: 'var(--border)', gap: 'var(--spacing-sm)' }}
        >
          <p style={{ color: 'var(--muted-foreground)', fontSize: 'var(--font-size-small)' }}>
            (c) 2025 Tool-Vault. All rights reserved.
          </p>
          <p style={{ color: 'var(--muted-foreground)', fontSize: 'var(--font-size-small)' }}>
            本站所有模块仅供学习研究使用
          </p>
        </div>
      </div>
    </footer>
  );
}
