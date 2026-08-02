import { useState, useRef } from 'react';
import { Plus, Pencil, Trash2, Loader2, X, Upload, GripVertical, Image as ImageIcon } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export interface ProductRow {
  id: string;
  name: string;
  description: string;
  image: string;
  badge: string;
  sort_order: number;
}

interface FormState {
  name: string;
  description: string;
  image: string;
  badge: string;
  sort_order: number;
}

const EMPTY: FormState = { name: '', description: '', image: '', badge: 'Premium', sort_order: 0 };

export function ProductsManager({ products, setProducts }: {
  products: ProductRow[];
  setProducts: (p: ProductRow[]) => void;
}) {
  const [editing, setEditing] = useState<ProductRow | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const startAdd = () => {
    setEditing(null);
    setForm({ ...EMPTY, sort_order: products.length + 1 });
    setShowForm(true);
    setError('');
  };

  const startEdit = (p: ProductRow) => {
    setEditing(p);
    setForm({ name: p.name, description: p.description, image: p.image, badge: p.badge, sort_order: p.sort_order });
    setShowForm(true);
    setError('');
  };

  const uploadImage = async (file: File) => {
    setUploading(true);
    setError('');
    const ext = file.name.split('.').pop();
    const path = `products/${Date.now()}.${ext}`;
    const { error: upErr } = await supabase.storage.from('site-images').upload(path, file, { cacheControl: '3600', upsert: true });
    if (upErr) {
      setError('Upload failed. Please try again.');
      setUploading(false);
      return;
    }
    const { data } = supabase.storage.from('site-images').getPublicUrl(path);
    setForm((f) => ({ ...f, image: data.publicUrl }));
    setUploading(false);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      image: form.image.trim(),
      badge: form.badge.trim() || 'Premium',
      sort_order: form.sort_order,
    };

    if (!payload.name || !payload.description || !payload.image) {
      setError('Name, description, and image are all required.');
      setSaving(false);
      return;
    }

    if (editing) {
      const { data, error } = await supabase.from('products').update(payload).eq('id', editing.id).select().single();
      if (error) { setError('Could not save changes.'); setSaving(false); return; }
      setProducts(products.map((p) => (p.id === editing.id ? data : p)));
    } else {
      const { data, error } = await supabase.from('products').insert(payload).select().single();
      if (error) { setError('Could not add product.'); setSaving(false); return; }
      setProducts([...products, data]);
    }

    setShowForm(false);
    setSaving(false);
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this product? This cannot be undone.')) return;
    await supabase.from('products').delete().eq('id', id);
    setProducts(products.filter((p) => p.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h3 className="font-heading font-bold text-xl text-brand-green dark:text-brand-cream mb-1">Products</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Add, edit, or remove products shown on your website. Upload your own photo or paste an image URL.</p>
        </div>
        <button onClick={startAdd} className="btn-primary px-5">
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      {showForm && (
        <form onSubmit={save} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h4 className="font-heading font-semibold text-brand-green dark:text-brand-cream">{editing ? 'Edit Product' : 'New Product'}</h4>
            <button type="button" onClick={() => setShowForm(false)} className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"><X className="w-4 h-4" /></button>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Product Name">
              <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls} placeholder="Premium Cashew Kernels" />
            </Field>
            <Field label="Badge Label">
              <input type="text" value={form.badge} onChange={(e) => setForm({ ...form, badge: e.target.value })} className={inputCls} placeholder="Premium / Wholesale / B2B" />
            </Field>
          </div>

          <Field label="Description">
            <textarea required rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={`${inputCls} resize-none`} placeholder="Short description shown on the product card" />
          </Field>

          <Field label="Display Order">
            <input type="number" min={0} value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} className={inputCls} />
          </Field>

          <Field label="Product Image">
            <div className="flex flex-col gap-3">
              <div className="flex gap-3">
                <input type="text" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className={inputCls} placeholder="Paste an image URL, or upload below" />
                <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading} className="btn-primary px-4 disabled:opacity-60 whitespace-nowrap">
                  {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Upload className="w-4 h-4" /> Upload</>}
                </button>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadImage(f); }} />
              </div>
              {form.image && <img src={form.image} alt="Preview" className="w-full h-40 object-cover rounded-xl border border-gray-100 dark:border-gray-700" />}
            </div>
          </Field>

          {error && <p className="text-sm text-red-500 flex items-center gap-1.5"><X className="w-4 h-4" /> {error}</p>}

          <div className="flex gap-3">
            <button type="submit" disabled={saving} className="btn-primary px-6 disabled:opacity-60">{saving ? <Loader2 className="w-4 h-4 animate-spin" /> : editing ? 'Save Changes' : 'Add Product'}</button>
            <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2.5 rounded-full font-heading font-semibold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600">Cancel</button>
          </div>
        </form>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((p) => (
          <div key={p.id} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
            <div className="relative h-36">
              <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
              <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-brand-gold text-brand-green-dark text-xs font-bold">{p.badge}</span>
            </div>
            <div className="p-4">
              <h4 className="font-heading font-semibold text-brand-green dark:text-brand-cream text-sm">{p.name}</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mt-1 mb-3">{p.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400 inline-flex items-center gap-1"><GripVertical className="w-3 h-3" /> Order {p.sort_order}</span>
                <div className="flex gap-1.5">
                  <button onClick={() => startEdit(p)} className="w-7 h-7 rounded-full flex items-center justify-center text-gray-400 hover:text-brand-green hover:bg-brand-green/10 transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
                  <button onClick={() => remove(p.id)} className="w-7 h-7 rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {products.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
            <ImageIcon className="w-10 h-10 text-gray-300 dark:text-gray-600 mb-2" />
            <p className="text-gray-500 dark:text-gray-400 text-sm">No products yet. Click "Add Product" to create your first one.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export interface GalleryRow {
  id: string;
  src: string;
  alt: string;
  category: string;
  sort_order: number;
}

const GALLERY_CATS = ['Factory', 'Processing', 'Products', 'Packaging', 'Machinery'];
const EMPTY_G: { src: string; alt: string; category: string; sort_order: number } = { src: '', alt: '', category: 'Factory', sort_order: 0 };

export function GalleryManager({ images, setImages }: {
  images: GalleryRow[];
  setImages: (g: GalleryRow[]) => void;
}) {
  const [editing, setEditing] = useState<GalleryRow | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_G);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const startAdd = () => {
    setEditing(null);
    setForm({ ...EMPTY_G, sort_order: images.length + 1 });
    setShowForm(true);
    setError('');
  };

  const startEdit = (g: GalleryRow) => {
    setEditing(g);
    setForm({ src: g.src, alt: g.alt, category: g.category, sort_order: g.sort_order });
    setShowForm(true);
    setError('');
  };

  const uploadImage = async (file: File) => {
    setUploading(true);
    setError('');
    const ext = file.name.split('.').pop();
    const path = `gallery/${Date.now()}.${ext}`;
    const { error: upErr } = await supabase.storage.from('site-images').upload(path, file, { cacheControl: '3600', upsert: true });
    if (upErr) { setError('Upload failed. Please try again.'); setUploading(false); return; }
    const { data } = supabase.storage.from('site-images').getPublicUrl(path);
    setForm((f) => ({ ...f, src: data.publicUrl }));
    setUploading(false);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    const payload = { src: form.src.trim(), alt: form.alt.trim(), category: form.category, sort_order: form.sort_order };
    if (!payload.src || !payload.alt) { setError('Image and caption are required.'); setSaving(false); return; }

    if (editing) {
      const { data, error } = await supabase.from('gallery').update(payload).eq('id', editing.id).select().single();
      if (error) { setError('Could not save changes.'); setSaving(false); return; }
      setImages(images.map((g) => (g.id === editing.id ? data : g)));
    } else {
      const { data, error } = await supabase.from('gallery').insert(payload).select().single();
      if (error) { setError('Could not add image.'); setSaving(false); return; }
      setImages([...images, data]);
    }
    setShowForm(false);
    setSaving(false);
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this image? This cannot be undone.')) return;
    await supabase.from('gallery').delete().eq('id', id);
    setImages(images.filter((g) => g.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h3 className="font-heading font-bold text-xl text-brand-green dark:text-brand-cream mb-1">Gallery</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Manage the photos in your gallery. Upload your own or paste an image URL.</p>
        </div>
        <button onClick={startAdd} className="btn-primary px-5">
          <Plus className="w-4 h-4" /> Add Image
        </button>
      </div>

      {showForm && (
        <form onSubmit={save} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h4 className="font-heading font-semibold text-brand-green dark:text-brand-cream">{editing ? 'Edit Image' : 'New Image'}</h4>
            <button type="button" onClick={() => setShowForm(false)} className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"><X className="w-4 h-4" /></button>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Caption">
              <input type="text" required value={form.alt} onChange={(e) => setForm({ ...form, alt: e.target.value })} className={inputCls} placeholder="Modern food processing facility" />
            </Field>
            <Field label="Category">
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={inputCls}>
                {GALLERY_CATS.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>
          </div>

          <Field label="Display Order">
            <input type="number" min={0} value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} className={inputCls} />
          </Field>

          <Field label="Image">
            <div className="flex flex-col gap-3">
              <div className="flex gap-3">
                <input type="text" value={form.src} onChange={(e) => setForm({ ...form, src: e.target.value })} className={inputCls} placeholder="Paste an image URL, or upload below" />
                <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading} className="btn-primary px-4 disabled:opacity-60 whitespace-nowrap">
                  {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Upload className="w-4 h-4" /> Upload</>}
                </button>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadImage(f); }} />
              </div>
              {form.src && <img src={form.src} alt="Preview" className="w-full h-40 object-cover rounded-xl border border-gray-100 dark:border-gray-700" />}
            </div>
          </Field>

          {error && <p className="text-sm text-red-500 flex items-center gap-1.5"><X className="w-4 h-4" /> {error}</p>}

          <div className="flex gap-3">
            <button type="submit" disabled={saving} className="btn-primary px-6 disabled:opacity-60">{saving ? <Loader2 className="w-4 h-4 animate-spin" /> : editing ? 'Save Changes' : 'Add Image'}</button>
            <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2.5 rounded-full font-heading font-semibold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600">Cancel</button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((g) => (
          <div key={g.id} className="group relative rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700 shadow-sm">
            <img src={g.src} alt={g.alt} className="w-full h-28 object-cover" />
            <div className="p-2.5">
              <span className="text-[10px] text-brand-gold font-bold uppercase tracking-wide">{g.category}</span>
              <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-1 mt-0.5">{g.alt}</p>
            </div>
            <div className="absolute top-1.5 right-1.5 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => startEdit(g)} className="w-7 h-7 rounded-full bg-white/90 dark:bg-gray-800/90 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-brand-green"><Pencil className="w-3.5 h-3.5" /></button>
              <button onClick={() => remove(g.id)} className="w-7 h-7 rounded-full bg-white/90 dark:bg-gray-800/90 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          </div>
        ))}
        {images.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
            <ImageIcon className="w-10 h-10 text-gray-300 dark:text-gray-600 mb-2" />
            <p className="text-gray-500 dark:text-gray-400 text-sm">No images yet. Click "Add Image" to upload your first one.</p>
          </div>
        )}
      </div>
    </div>
  );
}

const inputCls = 'w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none transition-all text-sm';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{label}</label>
      {children}
    </div>
  );
}
