import type { BundleData } from "@/types/bundle_types";

function getBaseUrl() {
  if (typeof window !== "undefined") {
    return "";
  }

  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}

const getProducts = async (): Promise<BundleData> => {
  try {
    const response = await fetch(`${getBaseUrl()}/api/products`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch steps and products");
    }

    const data = (await response.json()) as BundleData;
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return { steps: [], products: [] };
  }
};

export default getProducts;