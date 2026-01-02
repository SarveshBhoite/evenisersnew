const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://evenisersnew.onrender.com/api";

export async function getProducts() {
  const res = await fetch(`${API_URL}/products`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }

  return res.json();
}

export async function getProductById(id: string) {
  const res = await fetch(`${API_URL}/products/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch product");
  }

  return res.json();
}



export async function updateProduct(id: string, productData: any, token: string) {
  // Use FormData if you are uploading a new image, 
  // or JSON.stringify if it's just text.
  // This generic version works for JSON:
  const res = await fetch(`${API_URL}/admin/products/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(productData),
  });
  return res.json();
}
