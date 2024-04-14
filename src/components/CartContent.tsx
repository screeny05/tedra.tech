import { SHIPPING_COSTS, useBasket } from '../hooks/basket';
import type { BasketItem } from '../models/basket';
import { formatCurrency } from '../utils/format-currency';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import Toastify from 'toastify-js';
import { useState } from 'preact/hooks';

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

function CheckoutButton({ onPaymentSuccess }: { onPaymentSuccess: (orderData: any) => void }) {
  const [basket] = useBasket();

  return (
    <PayPalButtons
      style={{ layout: 'vertical', color: 'black', label: 'buynow' }}
      createOrder={async (_: any, actions: any) => {
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
      onApprove={async (_: any, actions: any) => {
        const orderData = await actions.order.capture();

        if (orderData.status === 'COMPLETED') {
          onPaymentSuccess(orderData);
          return;
        }

        Toastify({
          text: `PayPal Error occurred: ${orderData.status}`,
          gravity: 'bottom',
          duration: -1,
          destination: '/basket',
          escapeMarkup: false,
        }).showToast();
      }}
    />
  );
}

export function CartContent() {
  const [basket, basketActions] = useBasket();
  const [orderData, setOrderData] = useState<null | any>(null);

  const handleOrderSuccess = (currentOrderData: any) => {
    setOrderData(currentOrderData);
    basketActions.clear();
  };

  if (orderData) {
    const shipping = orderData.purchase_units?.[0]?.shipping;

    return (
      <div class="section__text--center">
        <h2>Purchase successful.</h2>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" width="150px" height="150px">
          <path fill="currentColor" d="M 25 2 C 12.317 2 2 12.317 2 25 C 2 37.683 12.317 48 25 48 C 37.683 48 48 37.683 48 25 C 48 20.44 46.660281 16.189328 44.363281 12.611328 L 42.994141 14.228516 C 44.889141 17.382516 46 21.06 46 25 C 46 36.579 36.579 46 25 46 C 13.421 46 4 36.579 4 25 C 4 13.421 13.421 4 25 4 C 30.443 4 35.393906 6.0997656 39.128906 9.5097656 L 40.4375 7.9648438 C 36.3525 4.2598437 30.935 2 25 2 z M 43.236328 7.7539062 L 23.914062 30.554688 L 15.78125 22.96875 L 14.417969 24.431641 L 24.083984 33.447266 L 44.763672 9.046875 L 43.236328 7.7539062 z" />
        </svg>
        <p>Thank you for supporting TEDRA!</p>
        <p>You will receive an order-confirmation via mail, as soon as your order has been reviewed.</p>
        {shipping ? (
          <>
            <p>Your order data:</p>
            <code class="cart-content__order-data">
              <pre>
                {shipping.name.full_name}
                {'\n'}
                {shipping.address.address_line_1}
                {'\n'}
                {shipping.address.postal_code} {shipping.address.admin_area_1}
                {'\n\n'}
                Order ID: {orderData.id}
              </pre>
            </code>
          </>
        ) : null}
      </div>
    );
  }

  if (basket.items.length === 0) {
    return (
      <>
        <div class="section__title">Basket.</div>
        <div className="cart-content cart-content--empty">
          <div>
            <p>No items in the basket, yet.</p>
            <p>
              <a href="/#shop">Have a look at our items.</a>
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <PayPalScriptProvider options={{ 'client-id': import.meta.env.PUBLIC_PAYPAL_CLIENT_ID, currency: 'EUR' }}>
      <div class="section__title">Basket.</div>
      <div className="cart-content">
        <div className="cart-content__items">
          {basket.items.map((item) => (
            <CartLineItem item={item} onChangeQuantity={(quantity) => basketActions.changeQuantity(item, quantity)} onClickDelete={() => basketActions.remove(item)} />
          ))}
        </div>
        <div className="cart-content__sidebar">
          <div className="cart-content__sidebar-sticky">
            <CartSummary className="cart-content__summary" />
            <CheckoutButton onPaymentSuccess={handleOrderSuccess} />
          </div>
        </div>
      </div>
    </PayPalScriptProvider>
  );
}
