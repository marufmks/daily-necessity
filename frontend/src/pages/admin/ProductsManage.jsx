import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { productApi, categoryApi } from "../../api/endpoints";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Separator } from "../../components/ui/separator";

const emptyProduct = {
  name: "", slug: "", description: "", price: "", compareAtPrice: "",
  imageUrl: "", unit: "piece", categoryId: "", isActive: true,
};

export default function ProductsManage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyProduct);
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    setLoading(true);
    try {
      const [prods, cats] = await Promise.all([
        productApi.list({ limit: 100 }),
        categoryApi.list(),
      ]);
      setProducts(prods.products);
      setCategories(cats);
    } catch { /* ignore */ }
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { ...form, price: parseFloat(form.price) };
    if (form.compareAtPrice) data.compareAtPrice = parseFloat(form.compareAtPrice);
    else delete data.compareAtPrice;

    try {
      if (editing) {
        await productApi.update(editing, data);
        toast.success("Product updated");
      } else {
        await productApi.create(data);
        toast.success("Product created");
      }
      setEditing(null);
      setForm(emptyProduct);
      fetch();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleEdit = (product) => {
    setEditing(product.id);
    setForm({
      name: product.name,
      slug: product.slug,
      description: product.description || "",
      price: String(product.price),
      compareAtPrice: product.compareAtPrice ? String(product.compareAtPrice) : "",
      imageUrl: product.imageUrl || "",
      unit: product.unit,
      categoryId: product.categoryId,
      isActive: product.isActive,
    });
  };

  const handleDelete = async (id) => {
    try {
      await productApi.remove(id);
      toast.success("Product deleted");
      fetch();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const cancel = () => {
    setEditing(null);
    setForm(emptyProduct);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold">Products</h1>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>{editing ? "Edit Product" : "New Product"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} required />
              </div>
              <div className="space-y-2">
                <Label>Slug</Label>
                <Input value={form.slug} onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))} required />
              </div>
              <div className="space-y-2">
                <Label>Price</Label>
                <Input type="number" step="0.01" value={form.price}
                  onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))} required />
              </div>
              <div className="space-y-2">
                <Label>Compare At Price</Label>
                <Input type="number" step="0.01" value={form.compareAtPrice}
                  onChange={(e) => setForm((p) => ({ ...p, compareAtPrice: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Unit</Label>
                <Input value={form.unit} onChange={(e) => setForm((p) => ({ ...p, unit: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={form.categoryId} onValueChange={(v) => setForm((p) => ({ ...p, categoryId: v }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>Image URL</Label>
                <Input value={form.imageUrl} onChange={(e) => setForm((p) => ({ ...p, imageUrl: e.target.value }))} />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>Description</Label>
                <textarea
                  className="flex h-20 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                  value={form.description}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button type="submit">{editing ? "Update" : "Create"}</Button>
              {editing && <Button type="button" variant="outline" onClick={cancel}>Cancel</Button>}
            </div>
          </form>
        </CardContent>
      </Card>

      <Separator className="my-8" />

      {loading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : products.length === 0 ? (
        <p className="text-muted-foreground">No products yet.</p>
      ) : (
        <div className="space-y-3">
          {products.map((p) => (
            <div key={p.id} className="flex items-center justify-between rounded-md border p-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{p.name}</span>
                  <Badge variant={p.isActive ? "success" : "destructive"}>
                    {p.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  ${Number(p.price).toFixed(2)} &middot; {p.slug}
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handleEdit(p)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" className="text-destructive" onClick={() => handleDelete(p.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
