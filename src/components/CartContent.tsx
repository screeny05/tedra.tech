import { SHIPPING_COSTS, useBasket } from '../hooks/basket';
import type { BasketItem } from '../models/basket';
import { formatCurrency } from '../utils/format-currency';
import { PayPalScriptProvider, PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';

function CartSummary({ className }: { className?: string }) {
  const [basket] = useBasket();

  return (
    <div className={'cart-summary ' + (className ?? '')}>
      <div className="cart-summary__row cart-summary__row--subtotal">
        <div className="cart-summary__label">Subtotal</div>
        <div className="cart-summary__value">{formatCurrency(basket.subtotal)}</div>
      </div>
      <div className="cart-summary__row cart-summary__row--shipping">
        <div className="cart-summary__label">Included VAT (19%)</div>
        <div className="cart-summary__value">{formatCurrency(basket.tax)}</div>
      </div>
      <div className="cart-summary__row cart-summary__row--shipping">
        <div className="cart-summary__label">Shipping costs</div>
        <div className="cart-summary__value">{formatCurrency(basket.shippingCosts)}</div>
      </div>
      <div className="cart-summary__row cart-summary__row--total">
        <div className="cart-summary__label">Total</div>
        <div className="cart-summary__value">{formatCurrency(basket.total)}</div>
      </div>
    </div>
  );
}

function CartLineItem({ item, onClickDelete, onChangeQuantity }: { item: BasketItem; onClickDelete(): void; onChangeQuantity(quantity: number): void }) {
  return (
    <div class="cart-item">
      <a href={`/p/${item.product.slug}`} class="cart-item__image-link">
        <img src={item.product.images[0]} class="cart-item__image" alt={item.product.title}></img>
      </a>
      {item.product.isBundle ? (
        <div class="cart-item__flags">
          <div class="flag">Set</div>
        </div>
      ) : null}
      <div className="cart-item__content">
        <a href={`/p/${item.product.slug}`} className="cart-item__title">
          {item.product.title}
        </a>
        {item.product.subtitle ? <div className="cart-item__subtitle">{item.product.subtitle}</div> : null}
        {item.bundleItems ? <div class="cart-item__bundle-items">{item.bundleItems.map((bundleItem) => bundleItem.title).join(', ')}</div> : null}
      </div>
      <div className="cart-item__price">{formatCurrency(item.product.price)}</div>
      <div class="cart-item__actions">
        <button className="cart-item__delete" title="Delete from basket" onClick={onClickDelete}>
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M18.75 5.25V19.5a.75.75 0 01-.75.75H6a.75.75 0 01-.75-.75V5.25m4.528 4.5v6m4.5-6v6M20.25 5.278H3.75m12-.028v-1.5a1.5 1.5 0 00-1.5-1.5h-4.5a1.5 1.5 0 00-1.5 1.5v1.5" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>
        <select className="cart-item__quantity select--small" value={item.quantity} onChange={(e) => onChangeQuantity(Number.parseInt((e.target as any).value))}>
          {new Array(item.product.maxQuantity ?? 10).fill(null).map((_, i) => (
            <option value={i + 1}>{i + 1}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

function CheckoutButton() {
  const [basket] = useBasket();

  return (
    <PayPalButtons
      style={{ layout: 'vertical', color: 'black', label: 'buynow' }}
      createOrder={async (data: any, actions: any) => {
        const orderId = await actions.order.create({
          purchase_units: [
            {
              amount: {
                currency_code: 'EUR',
                value: basket.total / 100,
                breakdown: {
                  item_total: {
                    currency_code: 'EUR',
                    value: basket.subtotal / 100,
                  },
                  shipping: {
                    currency_code: 'EUR',
                    value: basket.shippingCosts / 100,
                  },
                },
              },
              items: basket.items.map((item) => ({
                name: item.product.title,
                sku: item.product.sku,
                quantity: item.quantity,
                unit_amount: {
                  currency_code: 'EUR',
                  value: item.product.price / 100,
                },
                category: 'PHYSICAL_GOODS',
                description: item.bundleItems ? item.bundleItems.map((bundleItem) => bundleItem.title).join(', ') : undefined,
              })),
            },
          ],
        });
        return orderId;
      }}
      onApprove={async (data: any, actions: any) => {
        const orderData = await actions.order.capture();
        console.log('orderData', orderData);
      }}
    />
  );
}

export function CartContent() {
  const [basket, basketActions] = useBasket();

  if (basket.items.length === 0) {
    return (
      <div className="cart-content cart-content--empty">
        <div>
          <p>No items in the basket.</p>
          <p>
            <a href="/#shop">Have a look at our items.</a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <PayPalScriptProvider options={{ 'client-id': import.meta.env.PUBLIC_PAYPAL_CLIENT_ID, currency: 'EUR' }}>
      <div className="cart-content">
        <div className="cart-content__items">
          {basket.items.map((item) => (
            <CartLineItem item={item} onChangeQuantity={(quantity) => basketActions.changeQuantity(item, quantity)} onClickDelete={() => basketActions.remove(item)} />
          ))}
        </div>
        <div className="cart-content__sidebar">
          <div className="cart-content__sidebar-sticky">
            <CartSummary className="cart-content__summary" />
            {/*<button className="cart-content__checkout button">Commit to Buy</button>*/}
            <CheckoutButton />
          </div>
        </div>
      </div>
    </PayPalScriptProvider>
  );
}
