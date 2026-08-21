export interface ModuleItem {
  id: string;
  name: string;
  tagline: string;
  description: string;
  longDescription: string;
  version: string;
  size: string;
  updateDate: string;
  features: string[];
  requirements: string;
  platform?: string;
  icon: string;
  accent: string;
  github?: string;
  downloadUrl?: string;
  changelog?: string[];
}

export const modules: ModuleItem[] = [
  {
    id: 'lsposed',
    name: 'LSPosed',
    tagline: '无根 Xposed 框架',
    description: '强大的无根框架模块加载方案，支持模块化修改系统行为',
    longDescription: 'LSPosed 是一个基于 Riru/Zygisk 的 Xposed 框架实现，允许用户在不修改 APK 的情况下通过模块改变系统和应用的行为。它继承了原版 Xposed 的强大功能，同时提供了更现代化的界面和更稳定的运行环境。',
    version: 'v1.9.2',
    size: '12.5 MB',
    updateDate: '2024-12-15',
    features: [
      '兼容 Android 8.1 - 14',
      '支持 Magisk / Zygisk 模式',
      '模块化管理与一键启停',
      '作用域精细控制',
      '开源透明，社区活跃',
    ],
    requirements: 'Android 8.1+，已安装 Magisk 或 KernelSU',
    icon: 'puzzle',
    accent: 'var(--theme-blue)',
    github: 'https://github.com/LSPosed/LSPosed',
    changelog: [
      '修复 Android 14 兼容性问题',
      '优化模块加载速度',
      '新增作用域备份功能',
    ],
  },
  {
    id: 'zygisk-next',
    name: 'Zygisk Next',
    tagline: '下一代 Zygisk 实现',
    description: '独立于 Magisk 的 Zygisk 实现，更稳定更高效',
    longDescription: 'Zygisk Next 是一个独立实现的 Zygisk 方案，不依赖 Magisk 即可运行 Zygisk 模块。它采用全新的注入机制，降低资源占用，提升稳定性，同时完美兼容现有的 Zygisk 模块生态。',
    version: 'v1.0.1',
    size: '3.2 MB',
    updateDate: '2024-11-28',
    features: [
      '独立于 Magisk 运行',
      '低资源占用，高性能',
      '完美兼容现有 Zygisk 模块',
      '支持 Magisk / KernelSU',
      '白名单模式优化',
    ],
    requirements: 'Android 8.0+，已安装 Magisk 或 KernelSU',
    icon: 'layers',
    accent: 'var(--theme-green)',
    github: 'https://github.com/Dr-TSNG/ZygiskNext',
    changelog: [
      '新增 Compat 模式',
      '修复部分设备启动卡顿',
      '优化内存管理',
    ],
  },
  {
    id: 'tee-simulator',
    name: 'TEE Simulator',
    tagline: '可信执行环境模拟器',
    description: '模拟可信执行环境，用于安全测试与开发',
    longDescription: 'TEE Simulator 为开发者提供了一个软件层面的可信执行环境（TEE）模拟方案。它允许在无需硬件 TEE 支持的情况下进行安全相关功能的开发、测试与调试，极大降低了安全开发的门槛。',
    version: 'v0.4.0',
    size: '8.7 MB',
    updateDate: '2024-10-10',
    features: [
      '硬件级 TEE 软件模拟',
      '开发者友好 API',
      '支持密钥认证测试',
      '兼容 Keymaster / Gatekeeper',
      '详细的调试日志',
    ],
    requirements: 'Android 10+，开发者模式已开启',
    icon: 'shield',
    accent: 'var(--theme-gold)',
    github: 'https://github.com/tee-simulator',
    changelog: [
      '新增 Keymaster 4.1 支持',
      '修复模拟器偶发崩溃',
      '优化调试日志输出',
    ],
  },
  {
    id: 'play-integrity-fix',
    name: 'Play Integrity Fix',
    tagline: 'Google Play 完整性修复',
    description: '修复 Google Play 完整性检测，绕过安全限制',
    longDescription: 'Play Integrity Fix 是一个用于修复 Google Play 完整性检测的模块。它能够在解锁 Bootloader、安装自定义系统等情况下保持 Play 服务的完整性检测通过，确保银行类应用和其他依赖 Play Integrity 的应用正常运行。',
    version: 'v18.0',
    size: '2.1 MB',
    updateDate: '2025-01-05',
    features: [
      '自动适配多设备指纹',
      '保持 Play 服务正常运行',
      '支持 SPIF / PIF 双模式',
      '低占用，无感知运行',
      '定期更新设备指纹库',
    ],
    requirements: 'Android 8.0+，已安装 Magisk 或 Zygisk',
    icon: 'check-circle',
    accent: 'var(--theme-red)',
    github: 'https://github.com/chiteroman/PlayIntegrityFix',
    changelog: [
      '更新设备指纹数据库',
      '修复 Android 15 兼容性',
      '优化指纹生成算法',
    ],
  },
];

export const siteStats = [
  { label: '工具模块', value: '4', suffix: '+' },
  { label: '累计下载', value: '128', suffix: 'K' },
  { label: '社区用户', value: '15', suffix: 'K+' },
  { label: 'GitHub Star', value: '8.5', suffix: 'K' },
];

// 电脑软件（与刷机模块区分，用于下载中心展示）
export interface SoftwareItem {
  id: string;
  name: string;
  tagline: string;
  description: string;
  longDescription: string;
  version: string;
  size: string;
  updateDate: string;
  platform: string;
  features: string[];
  icon: string;
  accent: string;
  github?: string;
  downloadUrl?: string;
  changelog?: string[];
}

export const software: SoftwareItem[] = [
  {
    id: 'violet-toolbox',
    name: '紫罗兰工具箱',
    tagline: '电脑端刷机管理工具',
    description: 'Windows / macOS 电脑软件，一站式管理刷机模块与设备',
    longDescription: '紫罗兰工具箱是一款专为刷机爱好者和开发者打造的电脑桌面软件。它提供了直观的图形界面，帮助你管理已下载的刷机模块、一键刷写设备、备份恢复数据，并集成模块更新检测与社区资源浏览功能，让刷机操作更加简单高效。',
    version: 'v3.2.0',
    size: '85 MB',
    updateDate: '2025-01-20',
    platform: 'Windows / macOS',
    features: [
      '图形化模块管理界面',
      '一键刷写与恢复功能',
      '设备数据备份与还原',
      '模块更新自动检测',
      '内置社区资源浏览',
      '多设备同时管理',
    ],
    icon: 'monitor',
    accent: 'var(--accent)',
    github: 'https://github.com/violet-toolbox/desktop',
    changelog: [
      '新增 macOS 原生支持',
      '优化多设备管理体验',
      '修复部分设备刷写兼容问题',
    ],
  },
];

export const navLinks = [
  { name: '首页', path: '/' },
  { name: '关于我们', path: '/about' },
  { name: '产品服务', path: '/products' },
  { name: '下载中心', path: '/downloads' },
  { name: '联系我们', path: '/contact' },
];

export const socialLinks = [
  { name: 'GitHub', url: 'https://github.com/violet-toolbox', icon: 'github' },
  { name: 'Telegram', url: 'https://t.me/violettoolbox', icon: 'send' },
  { name: 'QQ群', url: 'https://qm.qq.com/violet', icon: 'message-circle' },
];
