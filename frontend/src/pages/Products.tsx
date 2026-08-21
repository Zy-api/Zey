import { Link } from 'react-router-dom';
import { FadeIn } from '@/components/MotionPrimitives';
import GradientText from '@/components/reactbits/GradientText';
import SpotlightCard from '@/components/reactbits/SpotlightCard';
import { useFrontendContent } from '@/hooks/useContent';
import { Puzzle, Layers, Shield, CheckCircle, Download, Check } from 'lucide-react';

const iconMap: Record<string, typeof Puzzle> = {
  puzzle: Puzzle,
  layers: Layers,
  shield: Shield,
  'check-circle': CheckCircle,
};

export default function Products() {
  const { modules } = useFrontendContent();
  return (
    <div className="min-h-screen" style={{ paddingTop: '4rem' }}>
      {/* Hero */}
      <section className="container text-center" style={{ paddingTop: 'var(--spacing-3xl)', paddingBottom: 'var(--spacing-2xl)' }}>
        <FadeIn>
          <span
            className="inline-flex items-center rounded-full font-medium"
            style={{
              background: 'var(--accent) / 10%',
              color: 'var(--accent)',
              padding: 'var(--spacing-xs) var(--spacing-lg)',
              fontSize: 'var(--font-size-label)',
              border: '1px solid var(--accent)',
            }}
          >
            产品服务
          </span>
        </FadeIn>
        <FadeIn delay={0.1}>
          <h1 className="font-bold mt-6" style={{ fontSize: 'var(--font-size-display)', letterSpacing: 'var(--letter-spacing-tight)' }}>
            <GradientText>工具模块详情</GradientText>
          </h1>
        </FadeIn>
        <FadeIn delay={0.2}>
          <p className="mx-auto mt-4" style={{ color: 'var(--muted-foreground)', fontSize: 'var(--font-size-headline)', maxWidth: '36rem', lineHeight: 'var(--line-height)' }}>
            每一个模块都经过精心打磨，覆盖刷机全场景
          </p>
        </FadeIn>
      </section>

      {/* Module Details */}
      <section style={{ paddingTop: 'var(--spacing-2xl)', paddingBottom: 'var(--spacing-3xl)' }}>
        <div className="container flex flex-col" style={{ gap: 'var(--spacing-3xl)' }}>
          {modules.map((module, index) => {
            const Icon = iconMap[module.icon] || Puzzle;
            const isReversed = index % 2 === 1;
            return (
              <FadeIn key={module.id}>
                <SpotlightCard className="rounded-2xl">
                  <div
                    className="rounded-2xl overflow-hidden"
                    style={{
                      background: 'var(--card)',
                      border: '1px solid var(--border)',
                    }}
                  >
                  <div className={`grid grid-cols-1 lg:grid-cols-2 ${isReversed ? 'lg:flex-row-reverse' : ''}`}>
                    {/* Visual Side */}
                    <div
                      className="flex items-center justify-center"
                      style={{
                        background: `linear-gradient(135deg, ${module.accent} / 15%, transparent)`,
                        padding: 'var(--spacing-2xl)',
                        minHeight: '20rem',
                      }}
                    >
                      <div className="text-center">
                        <div
                          className="flex items-center justify-center rounded-2xl mx-auto mb-6"
                          style={{
                            width: '5rem',
                            height: '5rem',
                            background: `${module.accent} / 20%`,
                            border: `2px solid ${module.accent}`,
                          }}
                        >
                          <Icon size={40} style={{ color: module.accent }} />
                        </div>
                        <h3 className="font-bold" style={{ fontSize: 'var(--font-size-headline)' }}>
                          {module.name}
                        </h3>
                        <p style={{ color: module.accent, fontSize: 'var(--font-size-body)', marginTop: 'var(--spacing-xs)' }}>
                          {module.tagline}
                        </p>
                        <div className="flex items-center justify-center mt-4" style={{ gap: 'var(--spacing-md)' }}>
                          <span
                            className="rounded-full"
                            style={{
                              background: 'var(--muted)',
                              color: 'var(--muted-foreground)',
                              padding: 'var(--spacing-xs) var(--spacing-md)',
                              fontSize: 'var(--font-size-small)',
                            }}
                          >
                            {module.version}
                          </span>
                          <span
                            className="rounded-full"
                            style={{
                              background: 'var(--muted)',
                              color: 'var(--muted-foreground)',
                              padding: 'var(--spacing-xs) var(--spacing-md)',
                              fontSize: 'var(--font-size-small)',
                            }}
                          >
                            {module.size}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Content Side */}
                    <div style={{ padding: 'var(--spacing-2xl)' }}>
                      <h2 className="font-bold mb-3" style={{ fontSize: 'var(--font-size-headline)' }}>
                        {module.name}
                      </h2>
                      <p style={{ color: 'var(--muted-foreground)', fontSize: 'var(--font-size-body)', lineHeight: 'var(--line-height)' }}>
                        {module.longDescription}
                      </p>

                      <h4 className="font-semibold mt-6 mb-3" style={{ fontSize: 'var(--font-size-label)' }}>
                        核心特性
                      </h4>
                      <ul className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: 'var(--spacing-sm)' }}>
                        {module.features.map((feature) => (
                          <li key={feature} className="flex items-start" style={{ gap: 'var(--spacing-xs)' }}>
                            <Check size={16} className="shrink-0 mt-0.5" style={{ color: 'var(--accent)' }} />
                            <span style={{ color: 'var(--foreground)', fontSize: 'var(--font-size-label)' }}>
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>

                      <h4 className="font-semibold mt-6 mb-2" style={{ fontSize: 'var(--font-size-label)' }}>
                        系统要求
                      </h4>
                      <p style={{ color: 'var(--muted-foreground)', fontSize: 'var(--font-size-label)' }}>
                        {module.requirements}
                      </p>

                      <div className="flex items-center mt-6" style={{ gap: 'var(--spacing-sm)' }}>
                        <Link
                          to="/downloads"
                          className="inline-flex items-center justify-center rounded-lg font-semibold transition-all hover:opacity-90"
                          style={{
                            background: 'var(--accent)',
                            color: 'var(--accent-foreground)',
                            padding: 'var(--spacing-xs) var(--spacing-lg)',
                            fontSize: 'var(--font-size-label)',
                            gap: 'var(--spacing-xs)',
                          }}
                        >
                          <Download size={16} />
                          立即下载
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
                </SpotlightCard>
              </FadeIn>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="container" style={{ paddingBottom: 'var(--spacing-3xl)' }}>
        <FadeIn>
          <div
            className="rounded-2xl text-center"
            style={{
              background: 'linear-gradient(135deg, var(--hero), var(--card))',
              border: '1px solid var(--border)',
              padding: 'var(--spacing-3xl) var(--spacing-xl)',
            }}
          >
            <h2 className="font-bold" style={{ fontSize: 'var(--font-size-headline)' }}>
              需要更多帮助？
            </h2>
            <p className="mt-3 mx-auto" style={{ color: 'var(--muted-foreground)', fontSize: 'var(--font-size-body)', maxWidth: '30rem' }}>
              查看使用文档或加入社区获取技术支持
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center mt-6" style={{ gap: 'var(--spacing-md)' }}>
              <Link
                to="/downloads"
                className="inline-flex items-center justify-center rounded-lg font-semibold transition-all hover:opacity-90"
                style={{
                  background: 'var(--accent)',
                  color: 'var(--accent-foreground)',
                  padding: 'var(--spacing-sm) var(--spacing-xl)',
                  fontSize: 'var(--font-size-label)',
                  gap: 'var(--spacing-xs)',
                }}
              >
                <Download size={16} />
                前往下载
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center rounded-lg font-semibold transition-all hover:opacity-80"
                style={{
                  background: 'transparent',
                  color: 'var(--foreground)',
                  border: '1px solid var(--border)',
                  padding: 'var(--spacing-sm) var(--spacing-xl)',
                  fontSize: 'var(--font-size-label)',
                }}
              >
                联系我们
              </Link>
            </div>
          </div>
        </FadeIn>
      </section>
    </div>
  );
}
