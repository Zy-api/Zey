import { FadeIn, Stagger, HoverLift } from '@/components/MotionPrimitives';
import GradientText from '@/components/reactbits/GradientText';
import SpotlightCard from '@/components/reactbits/SpotlightCard';
import { useFrontendContent, getSetting } from '@/hooks/useContent';
import { Target, Eye, Heart, GitBranch, Award, Users, Code, Rocket, Shield } from 'lucide-react';

const values = [
  {
    icon: Target,
    title: '使命',
    description: '为 Android 刷机社区提供安全、稳定、开源的工具模块，降低刷机门槛',
  },
  {
    icon: Eye,
    title: '愿景',
    description: '成为全球刷机爱好者和开发者最信赖的工具分享平台',
  },
  {
    icon: Heart,
    title: '价值观',
    description: '安全第一、开源透明、社区驱动、持续创新',
  },
];

const timeline = [
  {
    year: '2021',
    title: '项目起步',
    description: 'Tool-Vault 项目正式启动，发布首个 LSPosed 模块',
  },
  {
    year: '2022',
    title: '社区成长',
    description: 'GitHub Star 突破 3K， Telegram 社区突破 5000 人',
  },
  {
    year: '2023',
    title: '模块扩展',
    description: '新增 Zygisk Next 和 TEE Simulator 模块，覆盖更多刷机场景',
  },
  {
    year: '2024',
    title: '全面升级',
    description: 'Play Integrity Fix 上线，累计下载量突破 10 万次',
  },
  {
    year: '2025',
    title: '持续前行',
    description: '全面适配 Android 15，社区用户突破 15K',
  },
];

const team = [
  {
    name: '核心开发者',
    role: '架构设计与模块开发',
    description: '拥有多年 Android 底层开发经验，负责 LSPosed 和 Zygisk Next 核心开发',
    icon: Code,
  },
  {
    name: '安全研究员',
    role: '安全模块与 TEE 模拟',
    description: '专注于 Android 安全领域，负责 TEE Simulator 和安全审计工作',
    icon: Award,
  },
  {
    name: '社区运营',
    role: '社区建设与用户支持',
    description: '负责社区日常运营、用户反馈收集和技术文档编写',
    icon: Users,
  },
];

export default function About() {
  const { settings } = useFrontendContent();
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
            {getSetting(settings, 'about_badge')}
          </span>
        </FadeIn>
        <FadeIn delay={0.1}>
          <h1 className="font-bold mt-6" style={{ fontSize: 'var(--font-size-display)', letterSpacing: 'var(--letter-spacing-tight)' }}>
            <GradientText>{getSetting(settings, 'about_title')}</GradientText>
          </h1>
        </FadeIn>
        <FadeIn delay={0.2}>
          <p className="mx-auto mt-4" style={{ color: 'var(--muted-foreground)', fontSize: 'var(--font-size-headline)', maxWidth: '36rem', lineHeight: 'var(--line-height)' }}>
            {getSetting(settings, 'about_subtitle')}
          </p>
        </FadeIn>
      </section>

      {/* Mission/Vision/Values */}
      <section className="container" style={{ paddingTop: 'var(--spacing-2xl)', paddingBottom: 'var(--spacing-3xl)' }}>
        <Stagger className="grid grid-cols-1 md:grid-cols-3" stagger={0.12}>
          {values.map((value) => (
            <HoverLift key={value.title}>
              <SpotlightCard className="rounded-xl h-full">
              <div
                className="rounded-xl text-center"
                style={{
                  background: 'var(--card)',
                  border: '1px solid var(--border)',
                  padding: 'var(--spacing-xl)',
                  height: '100%',
                }}
              >
                <div
                  className="flex items-center justify-center rounded-xl mx-auto mb-4"
                  style={{
                    width: '3.5rem',
                    height: '3.5rem',
                    background: 'var(--accent) / 10%',
                  }}
                >
                  <value.icon size={28} style={{ color: 'var(--accent)' }} />
                </div>
                <h3 className="font-bold mb-2" style={{ fontSize: 'var(--font-size-title)' }}>
                  {value.title}
                </h3>
                <p style={{ color: 'var(--muted-foreground)', fontSize: 'var(--font-size-label)', lineHeight: 'var(--line-height)' }}>
                  {value.description}
                </p>
              </div>
              </SpotlightCard>
            </HoverLift>
          ))}
        </Stagger>
      </section>

      {/* Timeline */}
      <section className="border-y" style={{ borderColor: 'var(--border)', background: 'var(--card)' }}>
        <div className="container" style={{ paddingTop: 'var(--spacing-3xl)', paddingBottom: 'var(--spacing-3xl)' }}>
          <FadeIn className="text-center mb-12">
            <h2 className="font-bold" style={{ fontSize: 'var(--font-size-headline)', letterSpacing: 'var(--letter-spacing-tight)' }}>
              发展历程
            </h2>
            <p className="mt-3" style={{ color: 'var(--muted-foreground)', fontSize: 'var(--font-size-body)' }}>
              从一个小项目到刷机社区信赖的平台
            </p>
          </FadeIn>

          <div className="relative max-w-3xl mx-auto">
            {/* Vertical line */}
            <div
              className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2"
              style={{ background: 'var(--border)' }}
            />
            <Stagger className="flex flex-col" stagger={0.1}>
              {timeline.map((item, index) => (
                <FadeIn key={item.year}>
                  <div className={`relative flex items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} mb-8`}>
                    {/* Dot */}
                    <div
                      className="absolute left-4 md:left-1/2 w-3 h-3 rounded-full -translate-x-1/2 z-10"
                      style={{ background: 'var(--accent)', border: '3px solid var(--card)' }}
                    />
                    {/* Content */}
                    <div className={`ml-12 md:ml-0 md:w-1/2 ${index % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'}`}>
                      <span className="font-bold" style={{ fontSize: 'var(--font-size-headline)', color: 'var(--accent)' }}>
                        {item.year}
                      </span>
                      <h3 className="font-semibold mt-1" style={{ fontSize: 'var(--font-size-title)' }}>
                        {item.title}
                      </h3>
                      <p className="mt-2" style={{ color: 'var(--muted-foreground)', fontSize: 'var(--font-size-label)', lineHeight: 'var(--line-height)' }}>
                        {item.description}
                      </p>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </Stagger>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="container" style={{ paddingTop: 'var(--spacing-3xl)', paddingBottom: 'var(--spacing-3xl)' }}>
        <FadeIn className="text-center mb-12">
          <h2 className="font-bold" style={{ fontSize: 'var(--font-size-headline)', letterSpacing: 'var(--letter-spacing-tight)' }}>
            核心团队
          </h2>
          <p className="mt-3" style={{ color: 'var(--muted-foreground)', fontSize: 'var(--font-size-body)' }}>
            志同道合的开发者共同维护项目
          </p>
        </FadeIn>

        <Stagger className="grid grid-cols-1 md:grid-cols-3" stagger={0.12}>
          {team.map((member) => (
            <HoverLift key={member.name}>
              <SpotlightCard className="rounded-xl h-full">
              <div
                className="rounded-xl"
                style={{
                  background: 'var(--card)',
                  border: '1px solid var(--border)',
                  padding: 'var(--spacing-xl)',
                  height: '100%',
                }}
              >
                <div
                  className="flex items-center justify-center rounded-xl mb-4"
                  style={{
                    width: '3.5rem',
                    height: '3.5rem',
                    background: 'var(--accent) / 10%',
                  }}
                >
                  <member.icon size={28} style={{ color: 'var(--accent)' }} />
                </div>
                <h3 className="font-bold" style={{ fontSize: 'var(--font-size-title)' }}>
                  {member.name}
                </h3>
                <p style={{ color: 'var(--accent)', fontSize: 'var(--font-size-label)', marginTop: 'var(--spacing-xs)' }}>
                  {member.role}
                </p>
                <p style={{ color: 'var(--muted-foreground)', fontSize: 'var(--font-size-label)', marginTop: 'var(--spacing-sm)', lineHeight: 'var(--line-height)' }}>
                  {member.description}
                </p>
              </div>
              </SpotlightCard>
            </HoverLift>
          ))}
        </Stagger>
      </section>

      {/* Tech Stack */}
      <section className="border-t" style={{ borderColor: 'var(--border)', background: 'var(--card)' }}>
        <div className="container" style={{ paddingTop: 'var(--spacing-3xl)', paddingBottom: 'var(--spacing-3xl)' }}>
          <FadeIn className="text-center mb-12">
            <h2 className="font-bold" style={{ fontSize: 'var(--font-size-headline)', letterSpacing: 'var(--letter-spacing-tight)' }}>
              技术能力
            </h2>
            <p className="mt-3" style={{ color: 'var(--muted-foreground)', fontSize: 'var(--font-size-body)' }}>
              深耕 Android 底层，持续技术创新
            </p>
          </FadeIn>

          <Stagger className="grid grid-cols-2 md:grid-cols-4" stagger={0.08}>
            {[
              { icon: GitBranch, label: '底层框架开发', value: 'Xposed / Zygisk' },
              { icon: Rocket, label: '性能优化', value: '低占用高效率' },
              { icon: Shield, label: '安全研究', value: 'TEE / Play Integrity' },
              { icon: Code, label: '开源贡献', value: 'GitHub 8.5K Star' },
            ].map((tech) => (
              <FadeIn key={tech.label} className="text-center">
                <tech.icon size={32} className="mx-auto mb-3" style={{ color: 'var(--accent)' }} />
                <h3 className="font-semibold" style={{ fontSize: 'var(--font-size-label)' }}>
                  {tech.label}
                </h3>
                <p style={{ color: 'var(--muted-foreground)', fontSize: 'var(--font-size-small)', marginTop: 'var(--spacing-xs)' }}>
                  {tech.value}
                </p>
              </FadeIn>
            ))}
          </Stagger>
        </div>
      </section>
    </div>
  );
}
