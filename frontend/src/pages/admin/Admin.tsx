import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import {
  Table, TableHeader, TableBody, TableHead, TableRow, TableCell,
} from '@/components/ui/table'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose,
} from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import {
  useAdminContent, createItem, updateItem, deleteItem, updateStat, upsertSetting,
} from '@/hooks/useAdminContent'
import type { AdminItem, AdminStat, AdminSetting } from '@/hooks/useAdminContent'
import { categoryLabel } from '@/hooks/useContent'
import {
  Plus, Pencil, Trash2, ArrowLeft, LayoutDashboard, BarChart3, Settings2,
  Loader2, RefreshCw, Package, FolderPlus,
} from 'lucide-react'

const ICON_OPTIONS = ['puzzle', 'layers', 'shield', 'check-circle', 'monitor', 'cpu', 'box', 'terminal']
const ACCENT_OPTIONS = [
  { label: '科技蓝', value: 'var(--theme-blue)' },
  { label: '科技绿', value: 'var(--theme-green)' },
  { label: '金色', value: 'var(--theme-gold)' },
  { label: '红色', value: 'var(--theme-red)' },
  { label: '主强调色', value: 'var(--accent)' },
]

// 类型中文显示名（共用 useContent 的映射，支持自定义分类回退显示英文）
function typeLabel(t: string) {
  return categoryLabel(t)
}

// Empty draft for new items
const emptyDraft = (itemType: string): AdminItem => ({
  id: 0,
  item_type: itemType,
  slug: '',
  name: '',
  tagline: '',
  description: '',
  long_description: '',
  version: '',
  size: '',
  update_date: '',
  platform: itemType === 'software' ? 'Windows / macOS' : '',
  requirements: '',
  icon: 'puzzle',
  accent: 'var(--accent)',
  github: '',
  download_url: '',
  features: [],
  changelog: [],
  enabled: true,
  sort_order: 0,
})

export default function Admin() {
  const { items, stats, settings, loading, error, refresh } = useAdminContent()

  // 动态从数据库里的 item_type 生成分类标签
  const types = Array.from(new Set(items.map((i) => i.item_type)))
  // 默认显示第一个分类，没有就显示设置页
  const [activeTab, setActiveTab] = useState(types[0] || 'settings')
  // 新建分类弹窗
  const [newTypeOpen, setNewTypeOpen] = useState(false)
  const [newTypeName, setNewTypeName] = useState('')

  // 确认新建分类：预设该分类并直接打开新增卡片弹窗
  const handleCreateType = () => {
    const name = newTypeName.trim()
    if (!name) { toast.error('请输入分类名称'); return }
    setNewTypeOpen(false)
    setNewTypeName('')
    // 记录要创建的临时分类，让 ItemsTable 能打开空分类的新增弹窗
    pendingCreateType.current = name
    setActiveTab(name)
  }

  return (
    <div className="min-h-screen" style={{ paddingTop: '4rem' }}>
      <div className="container py-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
              <Link to="/" className="inline-flex items-center gap-1 hover:text-foreground">
                <ArrowLeft size={14} /> 返回前台
              </Link>
            </div>
            <h1 className="text-3xl font-bold flex items-center gap-2" style={{ letterSpacing: '-0.02em' }}>
              <LayoutDashboard size={26} style={{ color: 'var(--accent)' }} />
              后台管理系统
            </h1>
            <p className="mt-1 text-muted-foreground">管理前台的内容分类、模块/软件、首页统计与各页面文案</p>
          </div>
          <Button variant="outline" onClick={() => { refresh(); toast.success('已刷新数据') }} disabled={loading}>
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            刷新
          </Button>
        </div>

        {error && !loading && (
          <div className="mb-6 rounded-lg border px-4 py-3 text-sm" style={{ borderColor: 'var(--warning)', background: 'var(--warning) / 10%', color: 'var(--warning)' }}>
            数据加载失败：{error}。请确认数据库连接配置正确。
          </div>
        )}

        {loading ? (
          <div className="space-y-3">
            {[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-16 w-full" />)}
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex flex-col lg:flex-row lg:items-start gap-3 mb-2">
              <TabsList className="w-fit flex-wrap h-auto p-1">
                {types.map((t) => {
                  const count = items.filter((i) => i.item_type === t).length
                  return (
                    <TabsTrigger key={t} value={t} className="gap-1.5 min-h-[2.5rem]">
                      <Package size={16} /> {typeLabel(t)} <Badge variant="secondary">{count}</Badge>
                    </TabsTrigger>
                  )
                })}
                <TabsTrigger value="stats" className="gap-1.5 min-h-[2.5rem]">
                  <BarChart3 size={16} /> 统计数字 <Badge variant="secondary">{stats.length}</Badge>
                </TabsTrigger>
                <TabsTrigger value="settings" className="gap-1.5 min-h-[2.5rem]">
                  <Settings2 size={16} /> 站点文案
                </TabsTrigger>
              </TabsList>
              {/* 新建分类入口：独立在标签栏右侧，避免和 tab 点击区域重叠 */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setNewTypeOpen(true)}
                className="shrink-0 min-h-[2.5rem] border-dashed"
                style={{ color: 'var(--accent)', borderColor: 'var(--accent)' }}
              >
                <FolderPlus size={16} /> 新建分类
              </Button>
            </div>

            {types.map((t) => (
              <TabsContent key={t} value={t}>
                <ItemsTable
                  items={items.filter((i) => i.item_type === t)}
                  itemType={t}
                  onRefresh={refresh}
                />
              </TabsContent>
            ))}

            {/* 自定义新建分类：首次切换时没有 items，需要能新增 */}
            {pendingCreateType.current && !types.includes(activeTab) && activeTab !== 'stats' && activeTab !== 'settings' && (
              <TabsContent value={activeTab}>
                <ItemsTable
                  items={[]}
                  itemType={activeTab}
                  onRefresh={refresh}
                  autoOpenCreate={true}
                />
              </TabsContent>
            )}

            <TabsContent value="stats">
              <StatsTable stats={stats} onRefresh={refresh} />
            </TabsContent>

            <TabsContent value="settings">
              <SettingsTable settings={settings} onRefresh={refresh} />
            </TabsContent>
          </Tabs>
        )}
      </div>

      {/* 新建分类对话框 */}
      <Dialog open={newTypeOpen} onOpenChange={setNewTypeOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>新建内容分类</DialogTitle>
            <DialogDescription>输入分类名称（如"Recovery""内核""Magisk 模块"等）。保存后前台下载页会自动新增该分类区块，并立即创建一张卡片。</DialogDescription>
          </DialogHeader>
          <div className="py-2">
            <Label>分类名称</Label>
            <Input
              autoFocus
              value={newTypeName}
              onChange={(e) => setNewTypeName(e.target.value)}
              placeholder="如：内核 / Recovery / Magisk 模块"
              onKeyDown={(e) => { if (e.key === 'Enter') handleCreateType() }}
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">取消</Button>
            </DialogClose>
            <Button onClick={handleCreateType}>
              <Plus size={16} /> 创建并添加卡片
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// 会话级：新建分类后跳转的空分类标记
const pendingCreateType = { current: '' }

// ============================================
// Items Table — 支持任意分类
// ============================================
function ItemsTable({
  items, itemType, onRefresh, autoOpenCreate,
}: {
  items: AdminItem[]
  itemType: string
  onRefresh: () => void
  autoOpenCreate?: boolean
}) {
  const [editorOpen, setEditorOpen] = useState(false)
  const [editing, setEditing] = useState<AdminItem | null>(null)
  // 新建时是否用自定义类型
  const [createType, setCreateType] = useState(itemType)

  const openCreate = () => {
    setCreateType(itemType)
    setEditing(emptyDraft(itemType))
    setEditorOpen(true)
  }
  const openEdit = (item: AdminItem) => {
    setCreateType(item.item_type)
    setEditing({ ...item, download_url: item.download_url || '' })
    setEditorOpen(true)
  }

  // 新建分类后自动打开新增弹窗（仅首次渲染时）
  const autoOpened = useRef(false)
  useEffect(() => {
    if (autoOpenCreate && !autoOpened.current) {
      autoOpened.current = true
      openCreate()
    }
  }, [autoOpenCreate])

  const handleDelete = async (item: AdminItem) => {
    if (!window.confirm(`确定删除「${item.name}」吗？此操作不可撤销。`)) return
    try {
      await deleteItem(item.id)
      toast.success(`已删除「${item.name}」`)
      onRefresh()
    } catch (err: any) {
      toast.error(err?.message || '删除失败')
    }
  }

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">{typeLabel(itemType)}列表</h2>
        <Button onClick={openCreate}>
          <Plus size={16} /> 新增
        </Button>
      </div>

      {items.length === 0 ? (
        <div className="rounded-lg border border-dashed p-10 text-center text-muted-foreground">
          暂无{typeLabel(itemType)}，点击右上角「新增」创建
        </div>
      ) : (
        <div className="rounded-xl border" style={{ borderColor: 'var(--border)', overflow: 'hidden' }}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>名称</TableHead>
                <TableHead>标识 slug</TableHead>
                <TableHead>版本</TableHead>
                <TableHead>更新日期</TableHead>
                <TableHead>排序</TableHead>
                <TableHead>状态</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="font-medium">{item.name}</div>
                    <div className="text-xs text-muted-foreground">{item.tagline}</div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{item.slug}</TableCell>
                  <TableCell>{item.version}</TableCell>
                  <TableCell className="text-muted-foreground">{item.update_date}</TableCell>
                  <TableCell className="text-muted-foreground">{item.sort_order}</TableCell>
                  <TableCell>
                    <Badge variant={item.enabled ? 'default' : 'secondary'}>
                      {item.enabled ? '已发布' : '已隐藏'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon-sm" onClick={() => openEdit(item)}>
                        <Pencil size={16} />
                      </Button>
                      <Button variant="ghost" size="icon-sm" className="text-destructive" onClick={() => handleDelete(item)}>
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {editorOpen && editing && (
        <ItemEditor
          item={editing}
          itemType={createType}
          onClose={() => setEditorOpen(false)}
          onSaved={() => { setEditorOpen(false); onRefresh() }}
        />
      )}
    </div>
  )
}

// ============================================
// Item Create/Edit Dialog — 重做布局，修复比例
// ============================================
function ItemEditor({
  item, itemType, onClose, onSaved,
}: {
  item: AdminItem
  itemType: string
  onClose: () => void
  onSaved: () => void
}) {
  const [form, setForm] = useState<AdminItem>(item)
  const [featuresText, setFeaturesText] = useState((item.features || []).join('\n'))
  const [changelogText, setChangelogText] = useState((item.changelog || []).join('\n'))
  const [saving, setSaving] = useState(false)
  const isEdit = item.id > 0

  const set = <K extends keyof AdminItem>(key: K, value: AdminItem[K]) =>
    setForm((f) => ({ ...f, [key]: value }))

  const handleSave = async () => {
    if (!form.name.trim()) { toast.error('请填写名称'); return }
    if (!form.slug.trim()) { toast.error('请填写标识 slug'); return }
    const features = featuresText.split('\n').map((s) => s.trim()).filter(Boolean)
    const changelog = changelogText.split('\n').map((s) => s.trim()).filter(Boolean)
    // 新建时移除 id，避免 Supabase 报 "cannot insert a non-DEFAULT value into column 'id'"
    const { id, ...rest } = form
    const payload = { ...rest, features, changelog }
    setSaving(true)
    try {
      if (isEdit) {
        await updateItem(form.id, payload)
        toast.success('已保存修改')
      } else {
        await createItem(payload)
        toast.success('已创建新内容')
      }
      onSaved()
    } catch (err: any) {
      toast.error(err?.message || '保存失败')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? '编辑' : '新增'} - {typeLabel(itemType)}</DialogTitle>
          <DialogDescription>修改后保存，前台页面会同步更新。</DialogDescription>
        </DialogHeader>

        {/* 基本信息区 */}
        <div className="space-y-4">
          <div>
            <Label className="text-xs text-muted-foreground uppercase tracking-wide">基本信息</Label>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>名称 *</Label>
              <Input value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="如 LSPosed" />
            </div>
            <div>
              <Label>标识 slug *（英文）</Label>
              <Input value={form.slug} onChange={(e) => set('slug', e.target.value)} placeholder="lsposed" />
            </div>
            <div className="col-span-2">
              <Label>副标题 tagline</Label>
              <Input value={form.tagline} onChange={(e) => set('tagline', e.target.value)} placeholder="无根 Xposed 框架" />
            </div>
            <div className="col-span-2">
              <Label>简介 description（卡片上显示）</Label>
              <Input value={form.description} onChange={(e) => set('description', e.target.value)} />
            </div>
            <div className="col-span-2">
              <Label>详细介绍 long_description</Label>
              <Textarea value={form.long_description} onChange={(e) => set('long_description', e.target.value)} rows={3} />
            </div>
          </div>
        </div>

        {/* 版本信息区 */}
        <div className="space-y-4">
          <div>
            <Label className="text-xs text-muted-foreground uppercase tracking-wide">版本信息</Label>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>版本</Label>
              <Input value={form.version} onChange={(e) => set('version', e.target.value)} placeholder="v1.9.2" />
            </div>
            <div>
              <Label>大小</Label>
              <Input value={form.size} onChange={(e) => set('size', e.target.value)} placeholder="12.5 MB" />
            </div>
            <div>
              <Label>更新日期</Label>
              <Input value={form.update_date} onChange={(e) => set('update_date', e.target.value)} placeholder="2024-12-15" />
            </div>
            <div>
              <Label>排序（数字越小越靠前）</Label>
              <Input type="number" value={form.sort_order} onChange={(e) => set('sort_order', Number(e.target.value))} />
            </div>
            <div>
              <Label>平台</Label>
              <Input value={form.platform} onChange={(e) => set('platform', e.target.value)} placeholder="Windows / macOS" />
            </div>
            <div>
              <Label>系统要求</Label>
              <Input value={form.requirements} onChange={(e) => set('requirements', e.target.value)} placeholder="Android 8.1+" />
            </div>
          </div>
        </div>

        {/* 外观区 */}
        <div className="space-y-4">
          <div>
            <Label className="text-xs text-muted-foreground uppercase tracking-wide">外观</Label>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>图标</Label>
              <Select value={form.icon} onValueChange={(v) => set('icon', v)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="选择图标" />
                </SelectTrigger>
                <SelectContent>
                  {ICON_OPTIONS.map((opt) => (
                    <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>强调色</Label>
              <Select value={form.accent} onValueChange={(v) => set('accent', v)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="选择颜色" />
                </SelectTrigger>
                <SelectContent>
                  {ACCENT_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* 链接区 */}
        <div className="space-y-4">
          <div>
            <Label className="text-xs text-muted-foreground uppercase tracking-wide">链接</Label>
          </div>
          <div className="grid grid-cols-1 gap-3">
            <div>
              <Label>GitHub 链接（可留空）</Label>
              <Input value={form.github} onChange={(e) => set('github', e.target.value)} placeholder="https://github.com/..." />
            </div>
            <div>
              <Label>下载链接（前台点击「立即下载」时打开）</Label>
              <Input value={form.download_url || ''} onChange={(e) => set('download_url', e.target.value)} placeholder="https://... 文件直链或发布页" />
            </div>
          </div>
        </div>

        {/* 内容列表区 */}
        <div className="space-y-4">
          <div>
            <Label className="text-xs text-muted-foreground uppercase tracking-wide">内容列表（每行一条）</Label>
          </div>
          <div className="grid grid-cols-1 gap-3">
            <div>
              <Label>核心特性</Label>
              <Textarea value={featuresText} onChange={(e) => setFeaturesText(e.target.value)} rows={4} placeholder={'兼容 Android 8.1 - 14\n支持 Magisk / Zygisk 模式\n...'} />
            </div>
            <div>
              <Label>更新日志</Label>
              <Textarea value={changelogText} onChange={(e) => setChangelogText(e.target.value)} rows={3} placeholder={'修复 Android 14 兼容性问题\n优化模块加载速度\n...'} />
            </div>
          </div>
        </div>

        {/* 发布开关 */}
        <div className="flex items-center gap-2 pt-2 border-t" style={{ borderColor: 'var(--border)' }}>
          <Switch checked={form.enabled} onCheckedChange={(v) => set('enabled', v)} id="enabled" />
          <Label htmlFor="enabled">发布到前台（关闭则不在前台显示）</Label>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">取消</Button>
          </DialogClose>
          <Button onClick={handleSave} disabled={saving}>
            {saving && <Loader2 size={16} className="animate-spin" />}
            保存
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ============================================
// Stats Table
// ============================================
function StatsTable({ stats, onRefresh }: { stats: AdminStat[]; onRefresh: () => void }) {
  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold mb-2">首页统计数字</h2>
      <p className="text-sm text-muted-foreground mb-4">显示在首页统计区块，可修改数值与后缀。</p>

      {stats.length === 0 ? (
        <div className="rounded-lg border border-dashed p-10 text-center text-muted-foreground">暂无统计数据</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {stats.map((stat) => (
            <StatCard key={stat.stat_key} stat={stat} onSaved={onRefresh} />
          ))}
        </div>
      )}
    </div>
  )
}

function StatCard({ stat, onSaved }: { stat: AdminStat; onSaved: () => void }) {
  const [label, setLabel] = useState(stat.label)
  const [value, setValue] = useState(stat.value_text)
  const [suffix, setSuffix] = useState(stat.suffix)
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    if (!label.trim()) { toast.error('请填写标签'); return }
    setSaving(true)
    try {
      await updateStat(stat.stat_key, { label, value_text: value, suffix })
      toast.success(`已更新「${label}」`)
      onSaved()
    } catch (err: any) {
      toast.error(err?.message || '保存失败')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="rounded-xl border p-4" style={{ borderColor: 'var(--border)' }}>
      <div className="flex items-center gap-2 mb-3">
        <BarChart3 size={16} style={{ color: 'var(--accent)' }} />
        <span className="text-xs font-mono text-muted-foreground">{stat.stat_key}</span>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div>
          <Label>标签</Label>
          <Input value={label} onChange={(e) => setLabel(e.target.value)} />
        </div>
        <div>
          <Label>数值</Label>
          <Input value={value} onChange={(e) => setValue(e.target.value)} placeholder="4" />
        </div>
        <div>
          <Label>后缀</Label>
          <Input value={suffix} onChange={(e) => setSuffix(e.target.value)} placeholder="+" />
        </div>
      </div>
      <div className="flex justify-end mt-3">
        <Button size="sm" onClick={handleSave} disabled={saving}>
          {saving && <Loader2 size={14} className="animate-spin" />}
          保存
        </Button>
      </div>
    </div>
  )
}

// ============================================
// Settings Table — 站点文案
// ============================================
function SettingsTable({ settings, onRefresh }: { settings: AdminSetting[]; onRefresh: () => void }) {
  // 按前缀分组，方便展示
  const groups: Record<string, AdminSetting[]> = {}
  for (const s of settings) {
    const prefix = s.key.split('_')[0] || '其他'
    if (!groups[prefix]) groups[prefix] = []
    groups[prefix].push(s)
  }

  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold mb-2">站点文案</h2>
      <p className="text-sm text-muted-foreground mb-4">编辑前台各页面的标题、副标题、按钮文案等。修改后保存即生效。</p>

      {settings.length === 0 ? (
        <div className="rounded-lg border border-dashed p-10 text-center text-muted-foreground">
          暂无可编辑文案。请先在 Supabase 的 site_settings 表插入数据，或运行建表脚本。
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groups).map(([group, items]) => (
            <div key={group}>
              <h3 className="text-sm font-semibold mb-3 capitalize text-muted-foreground">{group}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {items.map((s) => (
                  <SettingCard key={s.key} setting={s} onSaved={onRefresh} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function SettingCard({ setting, onSaved }: { setting: AdminSetting; onSaved: () => void }) {
  const [value, setValue] = useState(setting.value)
  const [saving, setSaving] = useState(false)
  const isLong = value.length > 60 || value.includes('\n')

  const handleSave = async () => {
    setSaving(true)
    try {
      await upsertSetting(setting.key, value)
      toast.success(`已更新「${setting.label || setting.key}」`)
      onSaved()
    } catch (err: any) {
      toast.error(err?.message || '保存失败')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="rounded-xl border p-4" style={{ borderColor: 'var(--border)' }}>
      <div className="flex items-center gap-2 mb-2">
        <Settings2 size={14} style={{ color: 'var(--accent)' }} />
        <span className="text-xs font-mono text-muted-foreground">{setting.key}</span>
      </div>
      <Label className="text-sm">{setting.label || setting.key}</Label>
      {isLong ? (
        <Textarea value={value} onChange={(e) => setValue(e.target.value)} rows={3} className="mt-2" />
      ) : (
        <Input value={value} onChange={(e) => setValue(e.target.value)} className="mt-2" />
      )}
      <div className="flex justify-end mt-2">
        <Button size="sm" onClick={handleSave} disabled={saving}>
          {saving && <Loader2 size={14} className="animate-spin" />}
          保存
        </Button>
      </div>
    </div>
  )
}
