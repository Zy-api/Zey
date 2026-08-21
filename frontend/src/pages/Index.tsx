import { Link } from 'react-router-dom';
import { FadeIn, Stagger, HoverLift } from '@/components/MotionPrimitives';
import GridBackground from '@/components/reactbits/GridBackground';
import GradientText from '@/components/reactbits/GradientText';
import Counter from '@/components/reactbits/Counter';
import SpotlightCard from '@/components/reactbits/SpotlightCard';
import { useFrontendContent, getSetting } from '@/hooks/useContent';
import { Download, ArrowRight, Puzzle, Layers, Shield, CheckCircle, Zap, ShieldCheck, Users, Sparkles } from 'lucide-react';

const iconMap: Record<string, typeof Puzzle> = {
  puzzle: Puzzle,
  layers: Layers,
  shield: Shield,
  'check-circle': CheckCircle,
};

const featureHighlights = [
  {
    icon: Zap,
    title: '高效稳定',
    description: '所有模块经过严格测试，确保在各种设备上稳定运行',
  },
  {
    icon: ShieldCheck,
    title: '安全开源',
    description: '完全开源透明，社区共同审计，无后门无暗桩',
  },
  {
    icon: Users,
    title: '社区驱动',
    description: '活跃的开发者社区，持续更新与问题反馈',
  },
];

// 从统计值字符串解析数字（支持 "4"、"128"、"8.5"、"15"）
function parseStatNumber(value: string): number {
  const n = parseFloat(value);
  return Number.isNaN(n) ? 0 : n;
}

export default function Index() {
  const { modules, stats, settings } = useFrontendContent();
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative flex items-center overflow-hidden" style={{ minHeight: '100vh', paddingTop: '4rem' }}>
        <GridBackground />
        {/* 浮动光斑背景 */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at top, oklch(0.2 0.03 256 / 0.6), transparent 60%)',
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: '30rem',
            height: '30rem',
            top: '10%',
            left: '5%',
            background: 'radial-gradient(circle, oklch(0.6 0.18 255 / 0.15), transparent 70%)',
            filter: 'blur(40px)',
            animation: 'float-blob 12s ease-in-out infinite',
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: '25rem',
            height: '25rem',
            bottom: '15%',
            right: '8%',
            background: 'radial-gradient(circle, oklch(0.72 0.19 150 / 0.15), transparent 70%)',
            filter: 'blur(40px)',
            animation: 'float-blob 15s ease-in-out infinite reverse',
          }}
        />
        <div className="container relative z-10 text-center" style={{ paddingTop: 'var(--spacing-3xl)', paddingBottom: 'var(--spacing-3xl)' }}>
          <FadeIn variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}>
            <span
              className="inline-flex items-center rounded-full font-medium"
              style={{
                background: 'var(--accent) / 10%',
                color: 'var(--accent)',
                padding: 'var(--spacing-xs) var(--spacing-lg)',
                fontSize: 'var(--font-size-label)',
                border: '1px solid var(--accent)',
                gap: 'var(--spacing-xs)',
                backdropFilter: 'blur(8px)',
              }}
            >
              <Sparkles size={14} />
              {getSetting(settings, 'hero_badge')}
            </span>
          </FadeIn>

          <FadeIn delay={0.1} variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7 } } }}>
            <h1
              className="font-bold mx-auto"
              style={{
                fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
                lineHeight: 1.1,
                letterSpacing: 'var(--letter-spacing-tight)',
                maxWidth: '56rem',
                marginTop: 'var(--spacing-lg)',
              }}
            >
              Tool-Vault
              <span style={{ display: 'block', marginTop: 'var(--spacing-sm)' }}>
                <GradientText>{getSetting(settings, 'hero_title')}</GradientText>
              </span>
            </h1>
          </FadeIn>

          <FadeIn delay={0.2} variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}>
            <p
              className="mx-auto"
              style={{
                color: 'var(--muted-foreground)',
                fontSize: 'var(--font-size-headline)',
                maxWidth: '40rem',
                marginTop: 'var(--spacing-lg)',
                lineHeight: 'var(--line-height)',
              }}
            >
              {getSetting(settings, 'hero_subtitle')}
            </p>
          </FadeIn>

          <FadeIn delay={0.3} variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}>
            <div className="flex flex-col sm:flex-row items-center justify-center" style={{ gap: 'var(--spacing-md)', marginTop: 'var(--spacing-2xl)' }}>
              <Link
                to="/downloads"
                className="inline-flex items-center justify-center rounded-lg font-semibold transition-all hover:opacity-90 hover:scale-105"
                style={{
                  background: 'linear-gradient(90deg, var(--accent), var(--theme-green))',
                  color: 'var(--accent-foreground)',
                  padding: 'var(--spacing-sm) var(--spacing-2xl)',
                  fontSize: 'var(--font-size-body)',
                  gap: 'var(--spacing-xs)',
                  boxShadow: '0 4px 20px oklch(0.72 0.19 150 / 0.3)',
                }}
              >
                <Download size={18} />
                {getSetting(settings, 'hero_cta_primary')}
              </Link>
              <Link
                to="/products"
                className="inline-flex items-center justify-center rounded-lg font-semibold transition-all hover:opacity-80"
                style={{
                  background: 'transparent',
                  color: 'var(--foreground)',
                  border: '1px solid var(--border)',
                  padding: 'var(--spacing-sm) var(--spacing-2xl)',
                  fontSize: 'var(--font-size-body)',
                  gap: 'var(--spacing-xs)',
                  backdropFilter: 'blur(8px)',
                }}
              >
                {getSetting(settings, 'hero_cta_secondary')}
                <ArrowRight size={18} />
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y" style={{ borderColor: 'var(--border)', background: 'var(--card)' }}>
        <div className="container" style={{ paddingTop: 'var(--spacing-2xl)', paddingBottom: 'var(--spacing-2xl)' }}>
          <Stagger className="grid grid-cols-2 md:grid-cols-4" stagger={0.1}>
            {stats.map((stat) => {
              const num = parseStatNumber(stat.value);
              const decimals = Number.isInteger(num) ? 0 : 1;
              return (
                <FadeIn key={stat.label} className="text-center">
                  <div className="font-bold" style={{ fontSize: 'var(--font-size-display)' }}>
                    <GradientText>
                      <Counter
                        to={num}
                        decimals={decimals}
                        suffix={stat.suffix}
                      />
                    </GradientText>
                  </div>
                  <div style={{ color: 'var(--muted-foreground)', fontSize: 'var(--font-size-label)', marginTop: 'var(--spacing-xs)' }}>
                    {stat.label}
                  </div>
                </FadeIn>
              );
            })}
          </Stagger>
        </div>
      </section>

      {/* Modules Section */}
      <section className="container" style={{ paddingTop: 'var(--spacing-3xl)', paddingBottom: 'var(--spacing-3xl)' }}>
        <FadeIn className="text-center mb-12">
          <h2 className="font-bold" style={{ fontSize: 'var(--font-size-headline)', letterSpacing: 'var(--letter-spacing-tight)' }}>
            {getSetting(settings, 'modules_section_title')}
          </h2>
          <p className="mt-3" style={{ color: 'var(--muted-foreground)', fontSize: 'var(--font-size-body)' }}>
            {getSetting(settings, 'modules_section_subtitle')}
          </p>
        </FadeIn>

        <Stagger className="grid grid-cols-1 md:grid-cols-2" stagger={0.12}>
          {modules.map((module) => {
            const Icon = iconMap[module.icon] || Puzzle;
            return (
              <HoverLift key={module.id}>
                <SpotlightCard className="rounded-xl transition-shadow duration-300 hover:shadow-lg">
                  <Link
                    to="/products"
                    className="block rounded-xl"
                    style={{
                      background: 'var(--card)',
                      border: '1px solid var(--border)',
                      padding: 'var(--spacing-xl)',
                      height: '100%',
                    }}
                  >
                    <div className="flex items-start" style={{ gap: 'var(--spacing-md)' }}>
                      <div
                        className="flex items-center justify-center rounded-lg shrink-0 transition-transform duration-300"
                        style={{
                          width: '3rem',
                          height: '3rem',
                          background: `${module.accent} / 12%`,
                          border: `1px solid ${module.accent} / 30%`,
                        }}
                      >
                        <Icon size={24} style={{ color: module.accent }} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-bold" style={{ fontSize: 'var(--font-size-title)' }}>
                            {module.name}
                          </h3>
                          <span
                            className="rounded-full px-2 py-0.5"
                            style={{
                              background: 'var(--muted)',
                              color: 'var(--muted-foreground)',
                              fontSize: 'var(--font-size-small)',
                            }}
                          >
                            {module.version}
                          </span>
                        </div>
                        <p style={{ color: module.accent, fontSize: 'var(--font-size-label)', marginTop: 'var(--spacing-xs)' }}>
                          {module.tagline}
                        </p>
                        <p style={{ color: 'var(--muted-foreground)', fontSize: 'var(--font-size-label)', marginTop: 'var(--spacing-sm)', lineHeight: 'var(--line-height)' }}>
                          {module.description}
                        </p>
                        <div className="flex items-center mt-4" style={{ gap: 'var(--spacing-xs)', color: module.accent, fontSize: 'var(--font-size-label)' }}>
                          了解更多 <ArrowRight size={14} />
                        </div>
                      </div>
                    </div>
                  </Link>
                </SpotlightCard>
              </HoverLift>
            );
          })}
        </Stagger>
      </section>

      {/* Features Section */}
      <section className="border-t" style={{ borderColor: 'var(--border)', background: 'var(--card)' }}>
        <div className="container" style={{ paddingTop: 'var(--spacing-3xl)', paddingBottom: 'var(--spacing-3xl)' }}>
          <FadeIn className="text-center mb-12">
            <h2 className="font-bold" style={{ fontSize: 'var(--font-size-headline)', letterSpacing: 'var(--letter-spacing-tight)' }}>
              {getSetting(settings, 'features_section_title')}
            </h2>
            <p className="mt-3" style={{ color: 'var(--muted-foreground)', fontSize: 'var(--font-size-body)' }}>
              {getSetting(settings, 'features_section_subtitle')}
            </p>
          </FadeIn>

          <Stagger className="grid grid-cols-1 md:grid-cols-3" stagger={0.1}>
            {featureHighlights.map((feature) => (
              <FadeIn key={feature.title} className="text-center">
                <div
                  className="flex items-center justify-center rounded-xl mx-auto mb-4"
                  style={{
                    width: '3.5rem',
                    height: '3.5rem',
                    background: 'var(--accent) / 10%',
                  }}
                >
                  <feature.icon size={28} style={{ color: 'var(--accent)' }} />
                </div>
                <h3 className="font-semibold mb-2" style={{ fontSize: 'var(--font-size-title)' }}>
                  {feature.title}
                </h3>
                <p style={{ color: 'var(--muted-foreground)', fontSize: 'var(--font-size-label)', lineHeight: 'var(--line-height)', maxWidth: '18rem', margin: '0 auto' }}>
                  {feature.description}
                </p>
              </FadeIn>
            ))}
          </Stagger>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container" style={{ paddingTop: 'var(--spacing-3xl)', paddingBottom: 'var(--spacing-3xl)' }}>
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
              {getSetting(settings, 'cta_section_title')}
            </h2>
            <p className="mt-3 mx-auto" style={{ color: 'var(--muted-foreground)', fontSize: 'var(--font-size-body)', maxWidth: '30rem' }}>
              {getSetting(settings, 'cta_section_subtitle')}
            </p>
            <Link
              to="/downloads"
              className="inline-flex items-center justify-center rounded-lg font-semibold transition-all hover:opacity-90 mt-6"
              style={{
                background: 'var(--accent)',
                color: 'var(--accent-foreground)',
                padding: 'var(--spacing-sm) var(--spacing-2xl)',
                fontSize: 'var(--font-size-body)',
                gap: 'var(--spacing-xs)',
              }}
            >
              <Download size={18} />
              {getSetting(settings, 'cta_section_button')}
            </Link>
          </div>
        </FadeIn>
      </section>
    </div>
  );
}
