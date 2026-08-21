-- ============================================
-- Tool-Vault 数据库初始化脚本
-- 在 Supabase 控制台 → SQL Editor → New query 中粘贴运行
-- ============================================

-- 1. 创建 content_items 表
CREATE TABLE IF NOT EXISTS public.content_items (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  item_type TEXT NOT NULL DEFAULT 'module',
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  tagline TEXT DEFAULT '',
  description TEXT DEFAULT '',
  long_description TEXT DEFAULT '',
  version TEXT DEFAULT '',
  size TEXT DEFAULT '',
  update_date TEXT DEFAULT '',
  platform TEXT DEFAULT '',
  requirements TEXT DEFAULT '',
  icon TEXT DEFAULT '',
  accent TEXT DEFAULT '',
  github TEXT DEFAULT '',
  features TEXT[] DEFAULT '{}',
  changelog TEXT[] DEFAULT '{}',
  enabled BOOLEAN DEFAULT true,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. 创建 site_stats 表
CREATE TABLE IF NOT EXISTS public.site_stats (
  stat_key TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  value_text TEXT NOT NULL,
  suffix TEXT DEFAULT '',
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. 启用行级安全并允许匿名读写（后台管理需要）
ALTER TABLE public.content_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_stats ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "content_all" ON public.content_items;
CREATE POLICY "content_all" ON public.content_items FOR ALL TO anon USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "stats_all" ON public.site_stats;
CREATE POLICY "stats_all" ON public.site_stats FOR ALL TO anon USING (true) WITH CHECK (true);

-- 4. 清空已有数据（如需重置）
TRUNCATE public.content_items RESTART IDENTITY CASCADE;
TRUNCATE public.site_stats RESTART IDENTITY CASCADE;

-- 5. 插入初始数据
INSERT INTO public.content_items (item_type, slug, name, tagline, description, long_description, version, size, update_date, platform, requirements, icon, accent, github, features, changelog, enabled, sort_order) VALUES (
  'module', 'lsposed', 'LSPosed', '无根 Xposed 框架', '强大的无根框架模块加载方案，支持模块化修改系统行为', 'LSPosed 是一个基于 Riru/Zygisk 的 Xposed 框架实现，允许用户在不修改 APK 的情况下通过模块改变系统和应用的行为。它继承了原版 Xposed 的强大功能，同时提供了更现代化的界面和更稳定的运行环境。', 'v1.9.2', '12.5 MB', '2024-12-15', '', 'Android 8.1+，已安装 Magisk 或 KernelSU', 'puzzle', 'var(--theme-blue)', 'https://github.com/LSPosed/LSPosed', '{"兼容 Android 8.1 - 14","支持 Magisk / Zygisk 模式","模块化管理与一键启停","作用域精细控制","开源透明，社区活跃"}', '{"修复 Android 14 兼容性问题","优化模块加载速度","新增作用域备份功能"}', true, 1
);
INSERT INTO public.content_items (item_type, slug, name, tagline, description, long_description, version, size, update_date, platform, requirements, icon, accent, github, features, changelog, enabled, sort_order) VALUES (
  'module', 'zygisk-next', 'Zygisk Next', '下一代 Zygisk 实现', '独立于 Magisk 的 Zygisk 实现，更稳定更高效', 'Zygisk Next 是一个独立实现的 Zygisk 方案，不依赖 Magisk 即可运行 Zygisk 模块。它采用全新的注入机制，降低资源占用，提升稳定性，同时完美兼容现有的 Zygisk 模块生态。', 'v1.0.1', '3.2 MB', '2024-11-28', '', 'Android 8.0+，已安装 Magisk 或 KernelSU', 'layers', 'var(--theme-green)', 'https://github.com/Dr-TSNG/ZygiskNext', '{"独立于 Magisk 运行","低资源占用，高性能","完美兼容现有 Zygisk 模块","支持 Magisk / KernelSU","白名单模式优化"}', '{"新增 Compat 模式","修复部分设备启动卡顿","优化内存管理"}', true, 2
);
INSERT INTO public.content_items (item_type, slug, name, tagline, description, long_description, version, size, update_date, platform, requirements, icon, accent, github, features, changelog, enabled, sort_order) VALUES (
  'module', 'tee-simulator', 'TEE Simulator', '可信执行环境模拟器', '模拟可信执行环境，用于安全测试与开发', 'TEE Simulator 为开发者提供了一个软件层面的可信执行环境（TEE）模拟方案。它允许在无需硬件 TEE 支持的情况下进行安全相关功能的开发、测试与调试，极大降低了安全开发的门槛。', 'v0.4.0', '8.7 MB', '2024-10-10', '', 'Android 10+，开发者模式已开启', 'shield', 'var(--theme-gold)', 'https://github.com/tee-simulator', '{"硬件级 TEE 软件模拟","开发者友好 API","支持密钥认证测试","兼容 Keymaster / Gatekeeper","详细的调试日志"}', '{"新增 Keymaster 4.1 支持","修复模拟器偶发崩溃","优化调试日志输出"}', true, 3
);
INSERT INTO public.content_items (item_type, slug, name, tagline, description, long_description, version, size, update_date, platform, requirements, icon, accent, github, features, changelog, enabled, sort_order) VALUES (
  'module', 'play-integrity-fix', 'Play Integrity Fix', 'Google Play 完整性修复', '修复 Google Play 完整性检测，绕过安全限制', 'Play Integrity Fix 是一个用于修复 Google Play 完整性检测的模块。它能够在解锁 Bootloader、安装自定义系统等情况下保持 Play 服务的完整性检测通过，确保银行类应用和其他依赖 Play Integrity 的应用正常运行。', 'v18.0', '2.1 MB', '2025-01-05', '', 'Android 8.0+，已安装 Magisk 或 Zygisk', 'check-circle', 'var(--theme-red)', 'https://github.com/chiteroman/PlayIntegrityFix', '{"自动适配多设备指纹","保持 Play 服务正常运行","支持 SPIF / PIF 双模式","低占用，无感知运行","定期更新设备指纹库"}', '{"更新设备指纹数据库","修复 Android 15 兼容性","优化指纹生成算法"}', true, 4
);
INSERT INTO public.content_items (item_type, slug, name, tagline, description, long_description, version, size, update_date, platform, requirements, icon, accent, github, features, changelog, enabled, sort_order) VALUES (
  'software', 'violet-toolbox', '紫罗兰工具箱', '电脑端刷机管理工具', 'Windows / macOS 电脑软件，一站式管理刷机模块与设备', '紫罗兰工具箱是一款专为刷机爱好者和开发者打造的电脑桌面软件。它提供了直观的图形界面，帮助你管理已下载的刷机模块、一键刷写设备、备份恢复数据，并集成模块更新检测与社区资源浏览功能，让刷机操作更加简单高效。', 'v3.2.0', '85 MB', '2025-01-20', 'Windows / macOS', '', 'monitor', 'var(--accent)', 'https://github.com/violet-toolbox/desktop', '{"图形化模块管理界面","一键刷写与恢复功能","设备数据备份与还原","模块更新自动检测","内置社区资源浏览","多设备同时管理"}', '{"新增 macOS 原生支持","优化多设备管理体验","修复部分设备刷写兼容问题"}', true, 1
);

INSERT INTO public.site_stats (stat_key, label, value_text, suffix, sort_order) VALUES ('modules', '工具模块', '4', '+', 1);
INSERT INTO public.site_stats (stat_key, label, value_text, suffix, sort_order) VALUES ('downloads', '累计下载', '128', 'K', 2);
INSERT INTO public.site_stats (stat_key, label, value_text, suffix, sort_order) VALUES ('users', '社区用户', '15', 'K+', 3);
INSERT INTO public.site_stats (stat_key, label, value_text, suffix, sort_order) VALUES ('stars', 'GitHub Star', '8.5', 'K', 4);

-- 完成！现在可以返回网站预览查看数据。
