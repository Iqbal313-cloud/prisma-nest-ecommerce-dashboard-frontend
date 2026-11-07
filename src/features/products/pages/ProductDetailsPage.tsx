import { Link, useNavigate, useParams } from "react-router-dom";
import { useGetProductQuery } from "@/api/productApi";
import Loading from "@/components/common/Loading";
import ErrorMessage from "@/components/common/ErrorMessage";

function ProductDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const productId = Number(id);
  const {
    data: product,
    isLoading,
    isError,
    error,
  } = useGetProductQuery(productId, { skip: !id || Number.isNaN(productId) });
  if (!id || Number.isNaN(productId)) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6">
        {" "}
        <h2 className="text-lg font-semibold text-red-800">
          {" "}
          Invalid Product ID{" "}
        </h2>{" "}
        <p className="mt-1 text-sm text-red-600">
          {" "}
          The product ID provided in the URL is not valid.{" "}
        </p>{" "}
        <Link
          to="/products"
          className="mt-4 inline-block text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          {" "}
          ← Back to Products{" "}
        </Link>{" "}
      </div>
    );
  }
  if (isLoading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        {" "}
        <Loading />{" "}
      </div>
    );
  }
  if (isError || !product) {
    console.error("Failed to load product:", error);
    return (
      <div className="space-y-4">
        {" "}
        <ErrorMessage />{" "}
        <button
          type="button"
          onClick={() => navigate("/products")}
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          {" "}
          ← Back to Products{" "}
        </button>{" "}
      </div>
    );
  }
  return (
    <div className="space-y-6">
      {" "}
      {/* ====================================== Header ======================================= */}{" "}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        {" "}
        <div>
          {" "}
          {/* Breadcrumb */}{" "}
          <div className="mb-2 flex items-center gap-2 text-sm text-slate-500">
            {" "}
            <Link to="/products" className="transition hover:text-blue-600">
              {" "}
              Products{" "}
            </Link>{" "}
            <span>/</span>{" "}
            <span className="max-w-[250px] truncate text-slate-700">
              {" "}
              {product.productName}{" "}
            </span>{" "}
          </div>{" "}
          <div className="flex flex-wrap items-center gap-3">
            {" "}
            <h1 className="text-2xl font-bold text-slate-900">
              {" "}
              {product.productName}{" "}
            </h1>{" "}
            {product.discontinued ? (
              <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-600">
                {" "}
                Discontinued{" "}
              </span>
            ) : (
              <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-600">
                {" "}
                Active{" "}
              </span>
            )}{" "}
          </div>{" "}
          <p className="mt-1 text-sm text-slate-500">
            {" "}
            SKU: {product.sku}{" "}
          </p>{" "}
        </div>{" "}
        {/* Actions */}{" "}
        <div className="flex items-center gap-2">
          {" "}
          <Link
            to="/products"
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            {" "}
            Back{" "}
          </Link>{" "}
          <Link
            to={`/products/${product.id}/edit`}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
          >
            {" "}
            Edit Product{" "}
          </Link>{" "}
        </div>{" "}
      </div>{" "}
      {/* ====================================== Basic Information ======================================= */}{" "}
      <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
        {" "}
        <div className="border-b border-slate-200 px-6 py-4">
          {" "}
          <h2 className="text-base font-semibold text-slate-900">
            {" "}
            Basic Information{" "}
          </h2>{" "}
        </div>{" "}
        <div className="grid gap-6 p-6 md:grid-cols-2">
          {" "}
          <InfoItem label="Product Name" value={product.productName} />{" "}
          <InfoItem label="SKU" value={product.sku} />{" "}
          <InfoItem label="Slug" value={product.slug} />{" "}
          <InfoItem label="Quantity Per Unit" value={product.quantityPerUnit} />{" "}
          <div className="md:col-span-2">
            {" "}
            <InfoItem
              label="Short Description"
              value={product.shortDescription}
            />{" "}
          </div>{" "}
          <div className="md:col-span-2">
            {" "}
            <InfoItem label="Description" value={product.description} />{" "}
          </div>{" "}
        </div>{" "}
      </section>{" "}
      {/* ====================================== Pricing & Inventory ======================================= */}{" "}
      <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
        {" "}
        <div className="border-b border-slate-200 px-6 py-4">
          {" "}
          <h2 className="text-base font-semibold text-slate-900">
            {" "}
            Pricing & Inventory{" "}
          </h2>{" "}
        </div>{" "}
        <div className="grid gap-6 p-6 sm:grid-cols-2 lg:grid-cols-4">
          {" "}
          <InfoItem
            label="Unit Price"
            value={
              product.unitPrice !== null && product.unitPrice !== undefined
                ? `৳${Number(product.unitPrice).toLocaleString()}`
                : "-"
            }
          />{" "}
          <InfoItem
            label="Units In Stock"
            value={String(product.unitsInStock ?? 0)}
          />{" "}
          <InfoItem
            label="Units On Order"
            value={String(product.unitsOnOrder ?? 0)}
          />{" "}
          <InfoItem
            label="Status"
            value={product.discontinued ? "Discontinued" : "Active"}
          />{" "}
        </div>{" "}
      </section>{" "}
      {/* ====================================== Classification ======================================= */}{" "}
      <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
        {" "}
        <div className="border-b border-slate-200 px-6 py-4">
          {" "}
          <h2 className="text-base font-semibold text-slate-900">
            {" "}
            Classification{" "}
          </h2>{" "}
        </div>{" "}
        <div className="grid gap-6 p-6 md:grid-cols-2">
          {" "}
          <div>
            {" "}
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">
              {" "}
              Category{" "}
            </p>{" "}
            {product.category ? (
              <div>
                {" "}
                <p className="text-sm font-medium text-slate-900">
                  {" "}
                  {product.category.categoryName}{" "}
                </p>{" "}
                <p className="mt-1 text-xs text-slate-500">
                  {" "}
                  Category ID: {product.category.id}{" "}
                </p>{" "}
              </div>
            ) : (
              <p className="text-sm text-slate-400"> No category assigned </p>
            )}{" "}
          </div>{" "}
          <div>
            {" "}
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">
              {" "}
              Supplier{" "}
            </p>{" "}
            {product.supplier ? (
              <div>
                {" "}
                <p className="text-sm font-medium text-slate-900">
                  {" "}
                  {product.supplier.supplierName}{" "}
                </p>{" "}
                <p className="mt-1 text-xs text-slate-500">
                  {" "}
                  Supplier ID: {product.supplier.id}{" "}
                </p>{" "}
              </div>
            ) : (
              <p className="text-sm text-slate-400"> No supplier assigned </p>
            )}{" "}
          </div>{" "}
        </div>{" "}
      </section>{" "}
      {/* ====================================== Metadata ======================================= */}{" "}
      <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
        {" "}
        <div className="border-b border-slate-200 px-6 py-4">
          {" "}
          <h2 className="text-base font-semibold text-slate-900">
            {" "}
            Metadata{" "}
          </h2>{" "}
        </div>{" "}
        <div className="grid gap-6 p-6 md:grid-cols-2">
          {" "}
          <InfoItem label="Product ID" value={String(product.id)} />{" "}
          <InfoItem label="SKU" value={product.sku} />{" "}
          <InfoItem label="Created At" value={formatDate(product.createdAt)} />{" "}
          <InfoItem label="Updated At" value={formatDate(product.updatedAt)} />
          <InfoItem
            label="Created By"
            value={product.createdBy?.name ?? "Unknown"}
          />
          <InfoItem label="Updated By" value={product.updatedBy?.name ?? "—"} />
        </div>{" "}
      </section>{" "}
    </div>
  );
}
interface InfoItemProps {
  label: string;
  value: string;
}
function InfoItem({ label, value }: InfoItemProps) {
  return (
    <div>
      {" "}
      <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-500">
        {" "}
        {label}{" "}
      </p>{" "}
      <p className="break-words text-sm font-medium text-slate-900">
        {" "}
        {value || "-"}{" "}
      </p>{" "}
    </div>
  );
}

function formatDate(value: string | Date | null | undefined) {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return String(value);

  return new Intl.DateTimeFormat("en-BD", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Dhaka",
  }).format(date);
}

export default ProductDetailsPage;
