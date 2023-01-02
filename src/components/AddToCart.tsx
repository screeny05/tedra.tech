import { useState } from 'preact/hooks';
import { useBasket } from '../hooks/basket';
import type { ProductBundleItem } from '../models/product';
import { BundlePicker } from './BundlePicker';
import Toastify from 'toastify-js';

export function AddToCart({ product }: any) {
  const [hasBundleSelection, setHasBundleSelection] = useState(!product.isBundle);
  const [bundleSelection, setBundleSelection] = useState<ProductBundleItem[] | undefined>(undefined);
  const [quantity, setQuantity] = useState(1);
  const isAddToCartEnabled = hasBundleSelection;
  const [, { add: addToBasket }] = useBasket();

  return (
    <>
      {product.isBundle ? (
        <BundlePicker
          product={product}
          onSelectionDone={(selection) => {
            setHasBundleSelection(true);
            setBundleSelection(selection);
          }}
        />
      ) : null}

      <div class="product-detail__cta">
        <select class="product-detail__quantity-picker" onChange={(e) => setQuantity(Number.parseInt((e.target as any).value))} value={quantity.toString()}>
          {new Array(product.maxQuantity ?? 10).fill(null).map((_, i) => (
            <option value={i + 1}>{i + 1}</option>
          ))}
        </select>
        <button
          class={'product-detail__add-to-cart button ' + (isAddToCartEnabled ? '' : 'button--disabled')}
          onClick={() => {
            if (!isAddToCartEnabled) {
              return;
            }
            Toastify({
              text: `${quantity}x ${product.title} added <div class="toastify__link">to the basket</div>.`,
              gravity: 'bottom',
              duration: -1,
              destination: '/basket',
              escapeMarkup: false,
            }).showToast();
            addToBasket(product, quantity, bundleSelection);
          }}
        >
          Add to basket
        </button>
      </div>
    </>
  );
}
