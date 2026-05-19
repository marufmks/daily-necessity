import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { categoryApi, productApi } from "../api/endpoints";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Skeleton } from "../components/ui/skeleton";

function CategoryCard({ category }) {
  return (
    <Link to={`/products?category=${category.id}`}>
      <Card className="transition-shadow hover:shadow-md">
        <CardContent className="flex items-center justify-between p-4">
          <span className="font-medium">{category.name}</span>
          <Badge variant="secondary">{category._count.products}</Badge>
        </CardContent>
      </Card>
    </Link>
  );
}

function ProductCard({ product }) {
  const inStock = (product.inventory?.quantity ?? 0) > 0;

  return (
    <Link to={`/products/${product.slug}`}>
      <Card className="h-full transition-shadow hover:shadow-md">
        <div className="aspect-square bg-muted flex items-center justify-center text-muted-foreground text-sm">
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

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      categoryApi.list(),
      productApi.list({ limit: 8, sort: "createdAt", order: "desc" }),
    ])
      .then(([cats, prods]) => {
        setCategories(cats);
        setProducts(prods.products);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <section className="bg-gradient-to-b from-primary/5 to-background py-20">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Fresh groceries, delivered
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Shop from a wide selection of fresh produce, dairy, bakery, and pantry essentials.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              to="/products"
              className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold">Categories</h2>
        {loading ? (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-16" />
            ))}
          </div>
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
            {categories.map((cat) => (
              <CategoryCard key={cat.id} category={cat} />
            ))}
          </div>
        )}
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">New Arrivals</h2>
          <Link to="/products" className="text-sm text-primary hover:underline">
            View all
          </Link>
        </div>
        {loading ? (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 md:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-72" />
            ))}
          </div>
        ) : (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 md:grid-cols-4">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
