import { useCallback, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import { productApi, categoryApi } from "../api/endpoints";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Skeleton } from "../components/ui/skeleton";

function ProductCard({ product }) {
  const inStock = (product.inventory?.quantity ?? 0) > 0;

  return (
    <Link to={`/products/${product.slug}`}>
      <Card className="h-full transition-shadow hover:shadow-md">
        <div className="flex aspect-square items-center justify-center bg-muted text-sm text-muted-foreground">
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
          ) : (
            <span>No image</span>
          )}
        </div>
        <CardContent className="p-4">
          <p className="text-xs text-muted-foreground">{product.category?.name}</p>
          <h3 className="mt-1 font-medium">{product.name}</h3>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-lg font-bold">${Number(product.price).toFixed(2)}</span>
            <Badge variant={inStock ? "success" : "destructive"}>
              {inStock ? "In Stock" : "Out of Stock"}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, total: 0, pages: 0 });
  const [loading, setLoading] = useState(true);

  const currentPage = Number(searchParams.get("page")) || 1;
  const currentCategory = searchParams.get("category") || "all";
  const currentSearch = searchParams.get("search") || "";
  const currentSort = searchParams.get("sort") || "createdAt";

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page: currentPage, limit: 12, sort: currentSort, order: "desc" };
      if (currentCategory && currentCategory !== "all") params.category = currentCategory;
      if (currentSearch) params.search = currentSearch;

      const [prods, cats] = await Promise.all([
        productApi.list(params),
        categoryApi.list(),
      ]);
      setProducts(prods.products);
      setPagination(prods.pagination);
      setCategories(cats);
    } catch { /* ignore */ }
    setLoading(false);
  }, [currentPage, currentCategory, currentSearch, currentSort]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const updateParams = (updates) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([k, v]) => {
      if (v) next.set(k, v);
      else next.delete(k);
    });
    if (updates.page === undefined) next.set("page", "1");
    setSearchParams(next);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold">Products</h1>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            className="pl-9"
            defaultValue={currentSearch}
            onKeyDown={(e) => {
              if (e.key === "Enter") updateParams({ search: e.target.value, page: "1" });
            }}
          />
        </div>
        <Select
          value={currentCategory}
          onValueChange={(v) => updateParams({ category: v === "all" ? "" : v, page: "1" })}
        >
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={currentSort} onValueChange={(v) => updateParams({ sort: v, page: "1" })}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="createdAt">Newest</SelectItem>
            <SelectItem value="price">Price</SelectItem>
            <SelectItem value="name">Name</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-72" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="mt-20 text-center">
          <p className="text-muted-foreground">No products found.</p>
        </div>
      ) : (
        <>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>

          {pagination.pages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              <Button
                variant="outline"
                disabled={currentPage <= 1}
                onClick={() => updateParams({ page: String(currentPage - 1) })}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {pagination.page} of {pagination.pages}
              </span>
              <Button
                variant="outline"
                disabled={currentPage >= pagination.pages}
                onClick={() => updateParams({ page: String(currentPage + 1) })}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
