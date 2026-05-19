import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { productApi } from "../api/endpoints";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import { Skeleton } from "../components/ui/skeleton";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";

export default function ProductDetail() {
  const { slug } = useParams();
  const { user } = useContext(AuthContext);
  const { addItem } = useContext(CartContext);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    setLoading(true);
    productApi
      .getBySlug(slug)
      .then(setProduct)
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [slug]);

  const handleAddToCart = async () => {
    if (!user) {
      toast.error("Please login to add items to cart");
      return;
    }
    setAdding(true);
    try {
      await addItem(product.id, quantity);
      toast.success("Added to cart");
    } catch (err) {
      toast.error(err.message);
    }
    setAdding(false);
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2">
          <Skeleton className="aspect-square" />
          <div>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="mt-4 h-6 w-24" />
            <Skeleton className="mt-6 h-32" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-muted-foreground">Product not found</p>
      </div>
    );
  }

  const inStock = (product.inventory?.quantity ?? 0) > 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid gap-8 md:grid-cols-2">
        <div className="flex aspect-square items-center justify-center rounded-lg bg-muted text-muted-foreground">
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.name} className="h-full w-full rounded-lg object-cover" />
          ) : (
            <span>No image</span>
          )}
        </div>

        <div>
          <p className="text-sm text-muted-foreground">{product.category?.name}</p>
          <h1 className="mt-1 text-3xl font-bold">{product.name}</h1>
          <div className="mt-4 flex items-center gap-3">
            <span className="text-3xl font-bold">${Number(product.price).toFixed(2)}</span>
            {product.compareAtPrice && (
              <span className="text-lg text-muted-foreground line-through">
                ${Number(product.compareAtPrice).toFixed(2)}
              </span>
            )}
            <Badge variant={inStock ? "success" : "destructive"}>
              {inStock ? `In Stock (${product.inventory?.quantity})` : "Out of Stock"}
            </Badge>
          </div>

          <Separator className="my-6" />

          {product.description && (
            <div>
              <h3 className="font-semibold">Description</h3>
              <p className="mt-1 text-muted-foreground">{product.description}</p>
            </div>
          )}

          <Separator className="my-6" />

          <div className="flex items-center gap-4">
            <div className="flex items-center rounded-md border">
              <Button
                variant="ghost"
                size="icon"
                disabled={quantity <= 1}
                onClick={() => setQuantity((q) => q - 1)}
              >
                -
              </Button>
              <span className="w-12 text-center">{quantity}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setQuantity((q) => q + 1)}
              >
                +
              </Button>
            </div>
            <Button
              className="flex-1"
              disabled={!inStock || adding}
              onClick={handleAddToCart}
            >
              {adding ? "Adding..." : "Add to Cart"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
