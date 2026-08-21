-- ============================================
-- Tool-Vault 站点文案管理表 (site_settings)
-- 在 Supabase SQL Editor 中运行本脚本
-- 可重复运行（幂等）
-- ============================================

-- 1. 建表
CREATE TABLE IF NOT EXISTS public.site_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL DEFAULT '',
  label TEXT NOT NULL DEFAULT ''
);

-- 2. 行级安全策略（允许匿名公钥读写，与 content_items 一致）
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='site_settings' AND policyname='site_settings_anon_select') THEN
    CREATE POLICY site_settings_anon_select ON public.site_settings FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='site_settings' AND policyname='site_settings_anon_insert') THEN
    CREATE POLICY site_settings_anon_insert ON public.site_settings FOR INSERT WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='site_settings' AND policyname='site_settings_anon_update') THEN
    CREATE POLICY site_settings_anon_update ON public.site_settings FOR UPDATE USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='site_settings' AND policyname='site_settings_anon_delete') THEN
    CREATE POLICY site_settings_anon_delete ON public.site_settings FOR DELETE USING (true);
  END IF;
END $$;

-- 3. 插入默认文案（已存在的键不会覆盖，若想重置可先 TRUNCATE）
INSERT INTO public.site_settings (key, value, label) VALUES
  ('site_name', "Tool-Vault", '站点名称'),
  ('hero_badge', "全新 v18.0 已发布", '首页·顶部徽标'),
  ('hero_title', "刷机工具一站式平台", '首页·主标题'),
  ('hero_subtitle', "分享 LSPosed、Zygisk Next、TEE Simulator、Play Integrity Fix 等核心刷机工具模块，以及紫罗兰工具箱电脑软件，安全、稳定、开源", '首页·副标题'),
  ('hero_cta_primary', "立即下载", '首页·主按钮'),
  ('hero_cta_secondary', "查看产品", '首页·次按钮'),
  ('modules_section_title', "核心工具模块", '首页·模块区标题'),
  ('modules_section_subtitle', "四大模块覆盖刷机全场景需求", '首页·模块区副标题'),
  ('features_section_title', "为什么选择我们", '首页·优势区标题'),
  ('features_section_subtitle', "为刷机爱好者和开发者提供值得信赖的工具平台", '首页·优势区副标题'),
  ('cta_section_title', "准备好开始了吗？", '首页·底部横幅标题'),
  ('cta_section_subtitle', "立即前往下载中心，获取所有刷机工具模块与电脑软件", '首页·底部横幅副标题'),
  ('cta_section_button', "前往下载", '首页·底部横幅按钮'),
  ('downloads_badge', "下载中心", '下载页·徽标'),
  ('downloads_title', "获取最新版本", '下载页·主标题'),
  ('downloads_subtitle', "所有模块均可免费下载，持续更新中", '下载页·副标题'),
  ('software_section_title', "电脑软件", '下载页·软件区标题'),
  ('software_section_subtitle', "桌面端工具，帮你更高效地管理刷机模块与设备", '下载页·软件区副标题'),
  ('modules_section_title_dl', "刷机工具模块", '下载页·模块区标题'),
  ('modules_section_subtitle_dl', "Android 刷机工具模块，适用于 Magisk / Zygisk / KernelSU", '下载页·模块区副标题'),
  ('about_badge', "关于我们", '关于页·徽标'),
  ('about_title', "我们是 Tool-Vault", '关于页·主标题'),
  ('about_subtitle', "一群热爱 Android 刷机的开发者，致力于为社区打造最好的工具模块", '关于页·副标题'),
  ('contact_badge', "联系我们", '联系页·徽标'),
  ('contact_title', "加入我们", '联系页·主标题'),
  ('contact_subtitle', "有问题或建议？我们随时欢迎你的反馈", '联系页·副标题')
ON CONFLICT (key) DO NOTHING;
