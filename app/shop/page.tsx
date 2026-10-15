import { Suspense } from "react";
import ShopClient from "@/components/ShopClient";
import { getCatalogue, brandsOf } from "@/lib/catalog";

export const metadata = { title: "Shop Phones — MobileBazaar" };

export default async function ShopPage() {
  const phones = await getCatalogue();
  return (
    <Suspense fallback={<div className="wrap" style={{ padding: 32 }}>Loading phones…</div>}>
      <ShopClient phones={phones} brands={brandsOf(phones)} />
    </Suspense>
  );
}
