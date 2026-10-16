import { DotLoader, SkeletonGrid } from "@/components/Skeleton";

export default function ShopLoading() {
  return (
    <div className="wrap section" aria-busy="true">
      <div className="load-brand">
        <DotLoader />
        <p className="page-loader-text">Loading the shop</p>
      </div>
      <div className="shop-layout">
        <aside className="filters skl-filters" aria-hidden="true">
          <span className="skl skl-line w60 tall" />
          <span className="skl skl-line w85" />
          <span className="skl skl-line w75" />
          <span className="skl skl-line w85" />
          <span className="skl skl-line w65" />
          <span className="skl skl-line w80" />
          <span className="skl skl-line w55" />
        </aside>
        <div>
          <span className="skl skl-line w40 tall" style={{ marginBottom: 14 }} aria-hidden="true" />
          <SkeletonGrid count={6} />
        </div>
      </div>
    </div>
  );
}
