import { useState } from 'react';
import { FadeIn, Stagger, HoverLift } from '@/components/MotionPrimitives';
import GradientText from '@/components/reactbits/GradientText';
import SpotlightCard from '@/components/reactbits/SpotlightCard';
import { socialLinks } from '@/data/modules';
import { useFrontendContent, getSetting } from '@/hooks/useContent';
import { Mail, MessageCircle, Send, Github, MapPin, Clock, CheckCircle } from 'lucide-react';

const iconMap = {
  github: Github,
  send: Send,
  'message-circle': MessageCircle,
};

const contactInfo = [
  {
    icon: Mail,
    label: '邮箱',
    value: 'contact@violet-toolbox.dev',
    description: '工作日 24 小时内回复',
  },
  {
    icon: MessageCircle,
    label: 'QQ群',
    value: '123456789',
    description: '加入交流群获取帮助',
  },
  {
    icon: Send,
    label: 'Telegram',
    value: '@violettoolbox',
    description: '关注频道获取最新动态',
  },
];

const faqs = [
  {
    question: '模块安装后无法启动怎么办？',
    answer: '请检查设备是否已正确 Root，并确保 Magisk 或 KernelSU 版本符合要求。如问题依旧，请加入 QQ 群或 Telegram 寻求帮助。',
  },
  {
    question: '支持哪些 Android 版本？',
    answer: '各模块支持的 Android 版本不同，具体请查看产品服务页面的系统要求说明。大部分模块支持 Android 8.0 至 15。',
  },
  {
    question: '模块是免费的吗？',
    answer: '是的，Tool-Vault 所有模块完全免费开源，欢迎在 GitHub 上给我们 Star。',
  },
  {
    question: '如何反馈 Bug 或建议？',
    answer: '可以通过 GitHub Issues、邮箱或社区群组反馈，我们会认真对待每一个反馈。',
  },
];

export default function Contact() {
  const { settings } = useFrontendContent();
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setForm({ name: '', email: '', message: '' });
    }, 3000);
  };

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
            {getSetting(settings, 'contact_badge')}
          </span>
        </FadeIn>
        <FadeIn delay={0.1}>
          <h1 className="font-bold mt-6" style={{ fontSize: 'var(--font-size-display)', letterSpacing: 'var(--letter-spacing-tight)' }}>
            与<GradientText>取得联系</GradientText>
          </h1>
        </FadeIn>
        <FadeIn delay={0.2}>
          <p className="mx-auto mt-4" style={{ color: 'var(--muted-foreground)', fontSize: 'var(--font-size-headline)', maxWidth: '36rem', lineHeight: 'var(--line-height)' }}>
            {getSetting(settings, 'contact_subtitle')}
          </p>
        </FadeIn>
      </section>

      {/* Contact Info Cards */}
      <section className="container" style={{ paddingBottom: 'var(--spacing-2xl)' }}>
        <Stagger className="grid grid-cols-1 md:grid-cols-3" stagger={0.1}>
          {contactInfo.map((info) => (
            <HoverLift key={info.label}>
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
                  <info.icon size={28} style={{ color: 'var(--accent)' }} />
                </div>
                <h3 className="font-semibold mb-1" style={{ fontSize: 'var(--font-size-label)', color: 'var(--muted-foreground)' }}>
                  {info.label}
                </h3>
                <p className="font-bold mb-2" style={{ fontSize: 'var(--font-size-body)' }}>
                  {info.value}
                </p>
                <p style={{ color: 'var(--muted-foreground)', fontSize: 'var(--font-size-small)' }}>
                  {info.description}
                </p>
              </div>
              </SpotlightCard>
            </HoverLift>
          ))}
        </Stagger>
      </section>

      {/* Form + FAQ */}
      <section className="container" style={{ paddingBottom: 'var(--spacing-3xl)' }}>
        <div className="grid grid-cols-1 lg:grid-cols-2" style={{ gap: 'var(--spacing-2xl)' }}>
          {/* Contact Form */}
          <FadeIn>
            <div
              className="rounded-2xl"
              style={{
                background: 'var(--card)',
                border: '1px solid var(--border)',
                padding: 'var(--spacing-xl)',
              }}
            >
              <h2 className="font-bold mb-6" style={{ fontSize: 'var(--font-size-headline)' }}>
                发送消息
              </h2>

              {submitted ? (
                <div className="flex flex-col items-center justify-center text-center" style={{ paddingBlock: 'var(--spacing-3xl)' }}>
                  <CheckCircle size={48} style={{ color: 'var(--accent)' }} />
                  <h3 className="font-semibold mt-4" style={{ fontSize: 'var(--font-size-title)' }}>
                    消息已发送！
                  </h3>
                  <p className="mt-2" style={{ color: 'var(--muted-foreground)', fontSize: 'var(--font-size-label)' }}>
                    感谢你的反馈，我们会尽快回复
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col" style={{ gap: 'var(--spacing-md)' }}>
                  <div>
                    <label className="block mb-2 font-medium" style={{ fontSize: 'var(--font-size-label)' }}>
                      姓名
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full rounded-lg outline-none transition-colors"
                      style={{
                        background: 'var(--background)',
                        border: '1px solid var(--border)',
                        color: 'var(--foreground)',
                        padding: 'var(--spacing-sm) var(--spacing-md)',
                        fontSize: 'var(--font-size-body)',
                      }}
                      placeholder="你的名字"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 font-medium" style={{ fontSize: 'var(--font-size-label)' }}>
                      邮箱
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full rounded-lg outline-none transition-colors"
                      style={{
                        background: 'var(--background)',
                        border: '1px solid var(--border)',
                        color: 'var(--foreground)',
                        padding: 'var(--spacing-sm) var(--spacing-md)',
                        fontSize: 'var(--font-size-body)',
                      }}
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 font-medium" style={{ fontSize: 'var(--font-size-label)' }}>
                      消息
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="w-full rounded-lg outline-none transition-colors resize-none"
                      style={{
                        background: 'var(--background)',
                        border: '1px solid var(--border)',
                        color: 'var(--foreground)',
                        padding: 'var(--spacing-sm) var(--spacing-md)',
                        fontSize: 'var(--font-size-body)',
                      }}
                      placeholder="告诉我们你的问题或建议..."
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center rounded-lg font-semibold transition-all hover:opacity-90"
                    style={{
                      background: 'var(--accent)',
                      color: 'var(--accent-foreground)',
                      padding: 'var(--spacing-sm) var(--spacing-lg)',
                      fontSize: 'var(--font-size-body)',
                      gap: 'var(--spacing-xs)',
                    }}
                  >
                    <Send size={16} />
                    发送消息
                  </button>
                </form>
              )}
            </div>
          </FadeIn>

          {/* FAQ */}
          <FadeIn delay={0.1}>
            <div>
              <h2 className="font-bold mb-6" style={{ fontSize: 'var(--font-size-headline)' }}>
                常见问题
              </h2>
              <Stagger className="flex flex-col" stagger={0.08}>
                {faqs.map((faq, index) => (
                  <FadeIn key={index}>
                    <SpotlightCard className="rounded-xl mb-3">
                    <div
                      className="rounded-xl"
                      style={{
                        background: 'var(--card)',
                        border: '1px solid var(--border)',
                        padding: 'var(--spacing-md)',
                      }}
                    >
                      <h3 className="font-semibold mb-2" style={{ fontSize: 'var(--font-size-label)' }}>
                        {faq.question}
                      </h3>
                      <p style={{ color: 'var(--muted-foreground)', fontSize: 'var(--font-size-label)', lineHeight: 'var(--line-height)' }}>
                        {faq.answer}
                      </p>
                    </div>
                    </SpotlightCard>
                  </FadeIn>
                ))}
              </Stagger>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Social Links */}
      <section className="border-t" style={{ borderColor: 'var(--border)', background: 'var(--card)' }}>
        <div className="container text-center" style={{ paddingTop: 'var(--spacing-3xl)', paddingBottom: 'var(--spacing-3xl)' }}>
          <FadeIn>
            <h2 className="font-bold" style={{ fontSize: 'var(--font-size-headline)', letterSpacing: 'var(--letter-spacing-tight)' }}>
              加入社区
            </h2>
            <p className="mt-3 mx-auto" style={{ color: 'var(--muted-foreground)', fontSize: 'var(--font-size-body)', maxWidth: '30rem' }}>
              关注我们的社交媒体，获取最新动态和技术支持
            </p>
          </FadeIn>

          <Stagger className="flex flex-wrap items-center justify-center mt-8" stagger={0.1}>
            {socialLinks.map((social) => {
              const Icon = iconMap[social.icon as keyof typeof iconMap];
              return (
                <FadeIn key={social.name}>
                  <a
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center rounded-xl transition-all hover:opacity-80"
                    style={{
                      background: 'var(--background)',
                      border: '1px solid var(--border)',
                      padding: 'var(--spacing-sm) var(--spacing-lg)',
                      gap: 'var(--spacing-sm)',
                      fontSize: 'var(--font-size-label)',
                      color: 'var(--foreground)',
                      margin: 'var(--spacing-xs)',
                    }}
                  >
                    <Icon size={18} style={{ color: 'var(--accent)' }} />
                    {social.name}
                  </a>
                </FadeIn>
              );
            })}
          </Stagger>

          <FadeIn delay={0.3}>
            <div className="flex flex-wrap items-center justify-center mt-8" style={{ gap: 'var(--spacing-xl)' }}>
              <div className="flex items-center" style={{ gap: 'var(--spacing-xs)' }}>
                <MapPin size={16} style={{ color: 'var(--muted-foreground)' }} />
                <span style={{ color: 'var(--muted-foreground)', fontSize: 'var(--font-size-label)' }}>
                  开源社区 · 全球协作
                </span>
              </div>
              <div className="flex items-center" style={{ gap: 'var(--spacing-xs)' }}>
                <Clock size={16} style={{ color: 'var(--muted-foreground)' }} />
                <span style={{ color: 'var(--muted-foreground)', fontSize: 'var(--font-size-label)' }}>
                  工作日 24h 内回复
                </span>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
