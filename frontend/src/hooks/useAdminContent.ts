import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'

// ============================================
// Admin content API — full CRUD via Supabase directly.
// Works on any static host (Vercel) — no backend needed.
// RLS allows the anon role to manage public content.
// ============================================

export interface AdminItem {
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

export interface AdminStat {
  stat_key: string
  label: string
  value_text: string
  suffix: string
  sort_order: number
}

export interface AdminSetting {
  key: string
  value: string
  label: string
}

// ---- content items ----
export async function listItems(): Promise<AdminItem[]> {
  const { data, error } = await supabase
    .from('content_items')
    .select('*')
    .order('sort_order', { ascending: true })
  if (error) throw new Error(error.message)
  return (data as AdminItem[]) || []
}

export async function createItem(payload: Partial<AdminItem>) {
  const { error } = await supabase.from('content_items').insert(payload)
  if (error) throw new Error(error.message)
}

export async function updateItem(id: number, payload: Partial<AdminItem>) {
  const { error } = await supabase.from('content_items').update(payload).eq('id', id)
  if (error) throw new Error(error.message)
}

export async function deleteItem(id: number) {
  const { error } = await supabase.from('content_items').delete().eq('id', id)
  if (error) throw new Error(error.message)
}

// ---- site stats ----
export async function listStats(): Promise<AdminStat[]> {
  const { data, error } = await supabase
    .from('site_stats')
    .select('*')
    .order('sort_order', { ascending: true })
  if (error) throw new Error(error.message)
  return (data as AdminStat[]) || []
}

export async function updateStat(key: string, payload: Partial<AdminStat>) {
  const { error } = await supabase.from('site_stats').update(payload).eq('stat_key', key)
  if (error) throw new Error(error.message)
}

// ---- site settings (page copy) ----
export async function listSettings(): Promise<AdminSetting[]> {
  const { data, error } = await supabase
    .from('site_settings')
    .select('*')
    .order('key', { ascending: true })
  if (error) throw new Error(error.message)
  return (data as AdminSetting[]) || []
}

export async function upsertSetting(key: string, value: string) {
  // Supabase upsert：按主键 key 插入或更新
  const { error } = await supabase
    .from('site_settings')
    .upsert({ key, value })
  if (error) throw new Error(error.message)
}

// ---- React hooks ----
export function useAdminContent() {
  const [items, setItems] = useState<AdminItem[]>([])
  const [stats, setStats] = useState<AdminStat[]>([])
  const [settings, setSettings] = useState<AdminSetting[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [i, s, st] = await Promise.all([listItems(), listStats(), listSettings()])
      setItems(i)
      setStats(s)
      setSettings(st)
    } catch (err: any) {
      setError(err?.message || '加载失败')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  return { items, stats, settings, loading, error, refresh }
}
