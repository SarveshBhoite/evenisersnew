import axios from "axios";

// ✅ FIXED: clean, predictable base URL
const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api`;

export async function getProducts() {
  const res = await axios.get(`${API_URL}/products`);

  // ✅ axios auto-throws on non-2xx
  return res.data;
}

export async function getProductById(id: string) {
  const res = await axios.get(`${API_URL}/products/${id}`);

  return res.data;
}

export async function updateProduct(
  id: string,
  productData: any,
  token: string
) {
  const res = await axios.put(
    `${API_URL}/admin/products/${id}`,
    productData,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
}
