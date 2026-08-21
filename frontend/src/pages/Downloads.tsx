import { useState } from 'react';
import { FadeIn, Stagger, HoverLift } from '@/components/MotionPrimitives';
import SpotlightCard from '@/components/reactbits/SpotlightCard';
import { useFrontendContent, getSetting } from '@/hooks/useContent';
import { toast } from 'sonner';
import { Puzzle, Layers, Shield, CheckCircle, Monitor, Download, Calendar, HardDrive, Tag, Search, Laptop, Package } from 'lucide-react';

const iconMap: Record<string, typeof Puzzle> = {
  puzzle: Puzzle,
  layers: Layers,
  shield: Shield,
  'check-circle': CheckCircle,
  monitor: Monitor,
};

export default function Downloads() {
  const { categories, settings } = useFrontendContent();
  const [searchQuery, setSearchQuery] = useState('');
  const [downloading, setDownloading] = useState<string | null>(null);

  // 点击下载：有链接则真实下载/打开，无链接给出提示
  const handleDownload = (item: { id: string; name: string; downloadUrl?: string }) => {
    const url = item.downloadUrl?.trim();
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
      toast.success(`开始下载「${item.name}」`);
      setDownloading(item.id);
      setTimeout(() => setDownloading(null), 3000);
    } else {
      toast.error(`「${item.name}」暂未提供下载链接`);
    }
  };

  const filteredCategories = categories
    .map((cat) => ({
      ...cat,
      items: cat.items.filter(
        (m) =>
          m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.description.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    }))
    .filter((cat) => cat.items.length > 0);

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
            {getSetting(settings, 'downloads_badge')}
          </span>
        </FadeIn>
        <FadeIn delay={0.1}>
          <h1 className="font-bold mt-6" style={{ fontSize: 'var(--font-size-display)', letterSpacing: 'var(--letter-spacing-tight)' }}>
            {getSetting(settings, 'downloads_title')}
          </h1>
        </FadeIn>
        <FadeIn delay={0.2}>
          <p className="mx-auto mt-4" style={{ color: 'var(--muted-foreground)', fontSize: 'var(--font-size-headline)', maxWidth: '36rem', lineHeight: 'var(--line-height)' }}>
            {getSetting(settings, 'downloads_subtitle')}
          </p>
        </FadeIn>
      </section>

      {/* Search */}
      <section className="container" style={{ paddingBottom: 'var(--spacing-xl)' }}>
        <FadeIn>
          <div
            className="flex items-center rounded-xl mx-auto max-w-md"
            style={{
              background: 'var(--card)',
              border: '1px solid var(--border)',
              padding: 'var(--spacing-sm) var(--spacing-md)',
              gap: 'var(--spacing-sm)',
            }}
          >
            <Search size={18} style={{ color: 'var(--muted-foreground)' }} />
            <input
              type="text"
              placeholder="搜索模块或软件..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent outline-none"
              style={{
                color: 'var(--foreground)',
                fontSize: 'var(--font-size-body)',
              }}
            />
          </div>
        </FadeIn>
      </section>

      {filteredCategories.length === 0 ? (
        <section className="container" style={{ paddingBottom: 'var(--spacing-3xl)' }}>
          <FadeIn className="text-center" >
            <p style={{ color: 'var(--muted-foreground)', fontSize: 'var(--font-size-body)', paddingBlock: 'var(--spacing-3xl)' }}>
              未找到匹配的内容
            </p>
          </FadeIn>
        </section>
      ) : (
        // 动态渲染所有分类
        filteredCategories.map((cat) => (
          <section key={cat.type} className="container" style={{ paddingBottom: 'var(--spacing-3xl)' }}>
            <FadeIn className="mb-8">
              <h2 className="font-bold flex items-center" style={{ fontSize: 'var(--font-size-headline)', letterSpacing: 'var(--letter-spacing-tight)', gap: 'var(--spacing-sm)' }}>
                <Package size={26} style={{ color: 'var(--accent)' }} />
                {cat.label}
              </h2>
              <p className="mt-2" style={{ color: 'var(--muted-foreground)', fontSize: 'var(--font-size-body)' }}>
                {cat.items.length} 个下载项
              </p>
            </FadeIn>

            <Stagger className="grid grid-cols-1 md:grid-cols-2" stagger={0.1}>
              {cat.items.map((item) => {
                const Icon = iconMap[item.icon] || Puzzle;
                const isDownloading = downloading === item.id;
                return (
                  <HoverLift key={item.id}>
                    <SpotlightCard className="rounded-xl h-full">
                    <div
                      className="rounded-xl flex flex-col"
                      style={{
                        background: 'var(--card)',
                        border: '1px solid var(--accent)',
                        padding: 'var(--spacing-xl)',
                        height: '100%',
                      }}
                    >
                      {/* Header */}
                      <div className="flex items-start" style={{ gap: 'var(--spacing-md)' }}>
                        <div
                          className="flex items-center justify-center rounded-lg shrink-0"
                          style={{
                            width: '3rem',
                            height: '3rem',
                            background: `${item.accent} / 10%`,
                          }}
                        >
                          <Icon size={24} style={{ color: item.accent }} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold" style={{ fontSize: 'var(--font-size-title)' }}>
                            {item.name}
                          </h3>
                          <p style={{ color: 'var(--muted-foreground)', fontSize: 'var(--font-size-label)', marginTop: 'var(--spacing-xs)' }}>
                            {item.tagline}
                          </p>
                        </div>
                      </div>

                      {/* Description */}
                      <p style={{ color: 'var(--muted-foreground)', fontSize: 'var(--font-size-label)', marginTop: 'var(--spacing-md)', lineHeight: 'var(--line-height)', flex: 1 }}>
                        {item.description}
                      </p>

                      {/* Meta Info */}
                      <div className="grid grid-cols-2 mt-4" style={{ gap: 'var(--spacing-sm)' }}>
                        <div className="flex items-center" style={{ gap: 'var(--spacing-xs)' }}>
                          <Tag size={14} style={{ color: 'var(--accent)' }} />
                          <span style={{ color: 'var(--muted-foreground)', fontSize: 'var(--font-size-small)' }}>
                            {item.version}
                          </span>
                        </div>
                        <div className="flex items-center" style={{ gap: 'var(--spacing-xs)' }}>
                          <HardDrive size={14} style={{ color: 'var(--accent)' }} />
                          <span style={{ color: 'var(--muted-foreground)', fontSize: 'var(--font-size-small)' }}>
                            {item.size}
                          </span>
                        </div>
                        <div className="flex items-center" style={{ gap: 'var(--spacing-xs)' }}>
                          <Calendar size={14} style={{ color: 'var(--accent)' }} />
                          <span style={{ color: 'var(--muted-foreground)', fontSize: 'var(--font-size-small)' }}>
                            {item.updateDate}
                          </span>
                        </div>
                        <div className="flex items-center" style={{ gap: 'var(--spacing-xs)' }}>
                          <Laptop size={14} style={{ color: 'var(--accent)' }} />
                          <span style={{ color: 'var(--muted-foreground)', fontSize: 'var(--font-size-small)' }}>
                            {item.platform || '—'}
                          </span>
                        </div>
                      </div>

                      {/* Changelog Preview */}
                      {item.changelog && (
                        <div className="mt-4 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
                          <p className="font-semibold mb-2" style={{ fontSize: 'var(--font-size-small)', color: 'var(--muted-foreground)' }}>
                            更新内容
                          </p>
                          <ul className="flex flex-col" style={{ gap: 'var(--spacing-xs)' }}>
                            {item.changelog.map((log, i) => (
                              <li key={i} className="flex items-start" style={{ gap: 'var(--spacing-xs)' }}>
                                <span style={{ color: 'var(--accent)', fontSize: 'var(--font-size-small)' }}>
                                  -
                                </span>
                                <span style={{ color: 'var(--muted-foreground)', fontSize: 'var(--font-size-small)' }}>
                                  {log}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Download Button */}
                      <button
                        onClick={() => handleDownload(item)}
                        disabled={isDownloading}
                        className="w-full mt-4 inline-flex items-center justify-center rounded-lg font-semibold transition-all hover:opacity-90 disabled:opacity-50"
                        style={{
                          background: isDownloading ? 'var(--muted)' : 'var(--accent)',
                          color: isDownloading ? 'var(--muted-foreground)' : 'var(--accent-foreground)',
                          padding: 'var(--spacing-sm) var(--spacing-lg)',
                          fontSize: 'var(--font-size-label)',
                          gap: 'var(--spacing-xs)',
                        }}
                      >
                        <Download size={16} />
                        {isDownloading ? '准备下载...' : '立即下载'}
                      </button>
                    </div>
                    </SpotlightCard>
                  </HoverLift>
                );
              })}
            </Stagger>
          </section>
        ))
      )}

      {/* Installation Guide */}
      <section className="border-t" style={{ borderColor: 'var(--border)', background: 'var(--card)' }}>
        <div className="container" style={{ paddingTop: 'var(--spacing-3xl)', paddingBottom: 'var(--spacing-3xl)' }}>
          <FadeIn className="text-center mb-12">
            <h2 className="font-bold" style={{ fontSize: 'var(--font-size-headline)', letterSpacing: 'var(--letter-spacing-tight)' }}>
              安装教程
            </h2>
            <p className="mt-3" style={{ color: 'var(--muted-foreground)', fontSize: 'var(--font-size-body)' }}>
              三步轻松完成模块安装
            </p>
          </FadeIn>

          <Stagger className="grid grid-cols-1 md:grid-cols-3" stagger={0.12}>
            {[
              {
                step: '01',
                title: '下载模块',
                description: '选择需要的模块，点击下载获取 ZIP 文件',
              },
              {
                step: '02',
                title: '导入框架',
                description: '将 ZIP 文件导入 Magisk 或 KernelSU 的模块管理',
              },
              {
                step: '03',
                title: '重启生效',
                description: '安装完成后重启设备，模块即可生效',
              },
            ].map((item) => (
              <FadeIn key={item.step}>
                <div className="text-center">
                  <div
                    className="flex items-center justify-center rounded-xl mx-auto mb-4 font-bold"
                    style={{
                      width: '3.5rem',
                      height: '3.5rem',
                      background: 'var(--accent) / 10%',
                      color: 'var(--accent)',
                      fontSize: 'var(--font-size-title)',
                    }}
                  >
                    {item.step}
                  </div>
                  <h3 className="font-semibold mb-2" style={{ fontSize: 'var(--font-size-title)' }}>
                    {item.title}
                  </h3>
                  <p style={{ color: 'var(--muted-foreground)', fontSize: 'var(--font-size-label)', lineHeight: 'var(--line-height)', maxWidth: '16rem', margin: '0 auto' }}>
                    {item.description}
                  </p>
                </div>
              </FadeIn>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Notice */}
      <section className="container" style={{ paddingBottom: 'var(--spacing-3xl)' }}>
        <FadeIn>
          <div
            className="rounded-xl"
            style={{
              background: 'var(--warning) / 10%',
              border: '1px solid var(--warning)',
              padding: 'var(--spacing-lg)',
            }}
          >
            <h3 className="font-semibold mb-2" style={{ fontSize: 'var(--font-size-label)', color: 'var(--warning)' }}>
              注意事项
            </h3>
            <ul className="flex flex-col" style={{ gap: 'var(--spacing-xs)' }}>
              <li style={{ color: 'var(--muted-foreground)', fontSize: 'var(--font-size-label)' }}>
                - 请确保设备已 Root 并安装 Magisk 或 KernelSU
              </li>
              <li style={{ color: 'var(--muted-foreground)', fontSize: 'var(--font-size-label)' }}>
                - 安装前请备份重要数据，避免意外情况
              </li>
              <li style={{ color: 'var(--muted-foreground)', fontSize: 'var(--font-size-label)' }}>
                - 如遇兼容性问题，请查看更新日志或加入社区求助
              </li>
              <li style={{ color: 'var(--muted-foreground)', fontSize: 'var(--font-size-label)' }}>
                - 本站所有模块仅供学习研究使用，请遵守当地法律法规
              </li>
            </ul>
          </div>
        </FadeIn>
      </section>
    </div>
  );
}
