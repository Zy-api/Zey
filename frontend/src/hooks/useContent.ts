import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { modules, software, siteStats } from '@/data/modules'
import type { ModuleItem } from '@/data/modules'

// ============================================
// Frontend content data — reads directly from Supabase.
// Falls back to local hardcoded data if the database is unreachable.
// Works on any static host (Vercel) — no backend needed.
// ============================================

export interface ApiModule {
  id: number
  item_type: string
  slug: string
  name: string
  tagline: string
  description: string
  long_description: string
  version: string
  size: string
  update_date: string
  platform: string
  requirements: string
  icon: string
  accent: string
  github: string
  download_url: string
  features: string[]
  changelog: string[]
  enabled: boolean
  sort_order: number
}

export interface ApiStat {
  stat_key: string
  label: string
  value_text: string
  suffix: string
  sort_order: number
}

// 站点设置：key-value，存首页/各页面文案
export interface ApiSetting {
  key: string
  value: string
}

interface ContentState {
  items: ApiModule[]
  stats: ApiStat[]
  settings: Record<string, string>
  loading: boolean
  error: string | null
}

// 默认站点设置（数据库不可用或未设置时的回退值）
export const defaultSettings: Record<string, string> = {
  site_name: 'Tool-Vault',
  hero_badge: '全新 v18.0 已发布',
  hero_title: '刷机工具一站式平台',
  hero_subtitle: '分享 LSPosed、Zygisk Next、TEE Simulator、Play Integrity Fix 等核心刷机工具模块，以及紫罗兰工具箱电脑软件，安全、稳定、开源',
  hero_cta_primary: '立即下载',
  hero_cta_secondary: '查看产品',
  modules_section_title: '核心工具模块',
  modules_section_subtitle: '四大模块覆盖刷机全场景需求',
  features_section_title: '为什么选择我们',
  features_section_subtitle: '为刷机爱好者和开发者提供值得信赖的工具平台',
  cta_section_title: '准备好开始了吗？',
  cta_section_subtitle: '立即前往下载中心，获取所有刷机工具模块与电脑软件',
  cta_section_button: '前往下载',
  downloads_badge: '下载中心',
  downloads_title: '获取最新版本',
  downloads_subtitle: '所有模块均可免费下载，持续更新中',
  software_section_title: '电脑软件',
  software_section_subtitle: '桌面端工具，帮你更高效地管理刷机模块与设备',
  modules_section_title_dl: '刷机工具模块',
  modules_section_subtitle_dl: 'Android 刷机工具模块，适用于 Magisk / Zygisk / KernelSU',
  about_badge: '关于我们',
  about_title: '我们是 Tool-Vault',
  about_subtitle: '一群热爱 Android 刷机的开发者，致力于为社区打造最好的工具模块',
  contact_badge: '联系我们',
  contact_title: '加入我们',
  contact_subtitle: '有问题或建议？我们随时欢迎你的反馈',
}

// Map database item to frontend module shape used by pages
export function toModule(item: ApiModule) {
  return {
    id: item.slug,
    name: item.name,
    tagline: item.tagline,
    description: item.description,
    longDescription: item.long_description,
    version: item.version,
    size: item.size,
    updateDate: item.update_date,
    requirements: item.requirements,
    platform: item.platform,
    features: item.features || [],
    icon: item.icon,
    accent: item.accent,
    github: item.github,
    downloadUrl: item.download_url || '',
    changelog: item.changelog || [],
  }
}

// Fetch content from Supabase, fallback to local data
export function useContent() {
  const [state, setState] = useState<ContentState>({
    items: [],
    stats: [],
    settings: {},
    loading: true,
    error: null,
  })

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const [itemsRes, statsRes, settingsRes] = await Promise.all([
          supabase
            .from('content_items')
            .select('*')
            .eq('enabled', true)
            .order('sort_order', { ascending: true }),
          supabase
            .from('site_stats')
            .select('*')
            .order('sort_order', { ascending: true }),
          supabase
            .from('site_settings')
            .select('*'),
        ])

        if (cancelled) return

        if (itemsRes.error || statsRes.error) {
          setState({
            items: [], stats: [], settings: {},
            loading: false,
            error: itemsRes.error?.message || statsRes.error?.message || 'DB error',
          })
          return
        }

        const items = (itemsRes.data as ApiModule[]) || []
        const stats = (statsRes.data as ApiStat[]) || []
        const settingsArr = (settingsRes.data as ApiSetting[]) || []
        const settings: Record<string, string> = {}
        for (const s of settingsArr) settings[s.key] = s.value

        setState({ items, stats, settings, loading: false, error: null })
      } catch (err: any) {
        if (cancelled) return
        setState({
          items: [], stats: [], settings: {},
          loading: false,
          error: err?.message || 'DB unavailable',
        })
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  return state
}

// Helper: map API stats to frontend stat shape
export function toStats(apiStats: ApiStat[]) {
  return apiStats.map((s) => ({
    label: s.label,
    value: s.value_text,
    suffix: s.suffix,
  }))
}

// 获取站点设置值（带默认值回退）
export function getSetting(settings: Record<string, string>, key: string): string {
  const v = settings[key]
  return (v !== undefined && v !== '') ? v : (defaultSettings[key] || '')
}

// 分类（item_type）的中文显示名；未映射的分类显示原始英文
export const CATEGORY_LABELS: Record<string, string> = {
  module: '刷机工具模块',
  software: '电脑软件',
}

export function categoryLabel(type: string): string {
  return CATEGORY_LABELS[type] || type
}

// 前台按分类动态分组：[{ type, label, items }]
export interface FrontendCategory {
  type: string
  label: string
  items: ModuleItem[]
}

// Frontend-facing hook: returns data in the shape pages expect.
// Falls back to local hardcoded data when the database is unavailable.
export function useFrontendContent() {
  const { items: apiItems, stats: apiStats, settings, loading, error } = useContent()

  if (loading && apiItems.length === 0) {
    return {
      items: [...modules, ...software] as any[],
      software,
      modules,
      categories: [] as FrontendCategory[],
      stats: siteStats,
      settings,
      loading: true,
      error,
    }
  }

  if (apiItems.length === 0 && error) {
    return {
      items: [...modules, ...software] as any[],
      software,
      modules,
      categories: [] as FrontendCategory[],
      stats: siteStats,
      settings,
      loading: false,
      error,
    }
  }

  // 按数据库里的 item_type 动态分类
  const typeMap = new Map<string, typeof modules>()
  for (const it of apiItems) {
    const arr = typeMap.get(it.item_type) || []
    arr.push(toModule(it) as any)
    typeMap.set(it.item_type, arr)
  }
  // 保持兼容：module / software 两个固定键
  const mappedModules = typeMap.get('module') || (apiItems.length === 0 ? modules : [])
  const mappedSoftware = typeMap.get('software') || (apiItems.length === 0 ? software : [])
  const mappedStats = apiStats.length > 0 ? toStats(apiStats) : siteStats

  // 生成所有分类的有序列表（按首次出现顺序）
  const categories: FrontendCategory[] = Array.from(typeMap.entries()).map(([type, list]) => ({
    type,
    label: categoryLabel(type),
    items: list,
  }))

  return {
    items: apiItems.map(toModule),
    software: mappedSoftware,
    modules: mappedModules,
    categories,
    stats: mappedStats,
    settings,
    loading: false,
    error: null,
  }
}
