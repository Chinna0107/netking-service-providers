import { MdAdd, MdDeleteOutline } from 'react-icons/md';
import {
  SERVICE_PRODUCT_OPTIONS,
  formatCurrency,
  getEmptyProduct,
  getProductLineTotal,
  normalizeProduct,
} from './adminData';

export default function ProductLineEditor({
  service = 'cctv',
  products = [],
  onChange,
  title = 'Products',
  subtitle = 'Track the items linked to this customer.',
  actionLabel = 'Add Product',
}) {
  const productOptions = SERVICE_PRODUCT_OPTIONS[service] || SERVICE_PRODUCT_OPTIONS.cctv;
  const lineItems = products.map((product) => normalizeProduct(product, service));
  const totalValue = lineItems.reduce((sum, product) => sum + getProductLineTotal(product), 0);

  const updateProduct = (index, field, value) => {
    const nextProducts = lineItems.map((product, productIndex) =>
      productIndex === index
        ? normalizeProduct({ ...product, [field]: value }, service)
        : product
    );
    onChange(nextProducts);
  };

  const addProduct = () => {
    onChange([...lineItems, getEmptyProduct(service)]);
  };

  const removeProduct = (index) => {
    onChange(lineItems.filter((_, productIndex) => productIndex !== index));
  };

  return (
    <div className="admin-card">
      <div className="admin-card-header">
        <div>
          <span className="admin-card-eyebrow">Customer Assets</span>
          <h3>{title}</h3>
          <p>{subtitle}</p>
        </div>
        <div className="product-total-chip">
          <span>Line Value</span>
          <strong>{formatCurrency(totalValue)}</strong>
        </div>
      </div>

      <div className="product-line-list">
        {lineItems.length === 0 ? (
          <div className="product-empty-state">
            No items added yet. Add the installed devices, package, or accessories for this customer.
          </div>
        ) : (
          lineItems.map((product, index) => (
            <div key={`${product.type}-${index}`} className="product-line-row">
              <input
                type="text"
                placeholder={service === 'cctv' ? 'Product Type (e.g., DVR/NVR, Camera)' : 'Service Item (e.g., Router, Modem)'}
                value={product.type}
                onChange={(event) => updateProduct(index, 'type', event.target.value)}
              />

              <input
                type="text"
                placeholder={service === 'cctv' ? 'Model / Description' : 'Plan / Device details'}
                value={product.model}
                onChange={(event) => updateProduct(index, 'model', event.target.value)}
              />

              <input
                type="text"
                placeholder="Serial / Ref No"
                value={product.serialNo}
                onChange={(event) => updateProduct(index, 'serialNo', event.target.value)}
              />

              <input
                type="text"
                placeholder="Vendor Code"
                value={product.vendorCode}
                onChange={(event) => updateProduct(index, 'vendorCode', event.target.value)}
              />

              <input
                type="number"
                min="1"
                placeholder="Qty"
                value={product.quantity}
                onChange={(event) => updateProduct(index, 'quantity', event.target.value)}
              />

              <input
                type="number"
                min="0"
                placeholder="Unit Price"
                value={product.unitPrice}
                onChange={(event) => updateProduct(index, 'unitPrice', event.target.value)}
              />

              <div className="product-line-total">
                <span>Subtotal</span>
                <strong>{formatCurrency(getProductLineTotal(product))}</strong>
              </div>

              <button
                type="button"
                className="icon-action-btn danger"
                onClick={() => removeProduct(index)}
                aria-label={`Remove product ${index + 1}`}
              >
                <MdDeleteOutline />
              </button>
            </div>
          ))
        )}
      </div>

      <button type="button" className="secondary-action-btn" onClick={addProduct}>
        <MdAdd /> {actionLabel}
      </button>
    </div>
  );
}
