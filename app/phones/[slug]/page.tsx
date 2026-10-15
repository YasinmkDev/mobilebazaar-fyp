import { notFound } from "next/navigation";
import { getCatalogue, getPhoneBySlug } from "@/lib/catalog";
import { lowestPrice } from "@/lib/types";
import ProductDetail from "@/components/ProductDetail";

export async function generateStaticParams() {
  const phones = await getCatalogue();
  return phones.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const phone = await getPhoneBySlug(slug);
  if (!phone) return { title: "Phone not found — MobileBazaar" };
  return {
    title: `${phone.brand} ${phone.model} — ${phone.tagline} | MobileBazaar`,
    description: `Buy ${phone.brand} ${phone.model} (${phone.specs.display}, ${phone.specs.mainCameraMp}MP camera) PTA approved with official warranty and COD in Pakistan.`,
  };
}

export default async function PhonePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const phone = await getPhoneBySlug(slug);
  if (!phone) notFound();
  const price = lowestPrice(phone);
  const all = await getCatalogue();
  const similar = all.filter(
    (p) => p.id !== phone.id && (p.brand === phone.brand || Math.abs(lowestPrice(p) - price) / price < 0.25)
  ).slice(0, 6);
  return <ProductDetail phone={phone} similar={similar} />;
}
