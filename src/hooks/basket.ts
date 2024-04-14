import { useStore } from '@nanostores/preact';
import { action, atom } from 'nanostores';
import type { Basket, BasketItem } from '../models/basket';
import type { Product, ProductBundleItem } from '../models/product';
import { isEnabled } from '../data/feature-flags';

interface BasketActions {
  add(toAdd: Product, quantity: number, bundleItems?: ProductBundleItem[]): void;
  remove(item: BasketItem): void;
  changeQuantity(item: BasketItem, quantity: number): void;
  clear(): void;
}

const noop = (): any => {};
const noopBasket: [Basket, BasketActions] = [
  { items: [], total: 0, shippingCosts: 0, subtotal: 0, tax: 0 },
  {
    add: noop,
    remove: noop,
    changeQuantity: noop,
    clear: noop,
  },
];

const STORAGE_ID = 'basket-items';
export const SHIPPING_COSTS = 399;

export const getItemsFromStorage = (): BasketItem[] => {
  const stored = localStorage.getItem(STORAGE_ID);
  let items: BasketItem[] = [];
  try {
    if (stored) {
      items = JSON.parse(stored);
    }
  } catch (e: any) {
    // noop
  }
  return Array.isArray(items) ? items : [];
};

const setItemsToStorage = (items: readonly BasketItem[]): void => {
  localStorage.setItem(STORAGE_ID, JSON.stringify(items));
};

export const renderHeaderBasketButton = (items: readonly BasketItem[]): void => {
  if (typeof window !== 'object' || !isEnabled('storefront')) {
    return;
  }
  const hasItems = items.length > 0;
  document.querySelector('.js--header-basket-link')!.classList.toggle('is-hidden', !hasItems);
  document.querySelector('.js--header-basket-count')!.textContent = items.length.toString();
};

const basketItemsAtom = atom<BasketItem[]>(getItemsFromStorage());
basketItemsAtom.subscribe((value) => {
  renderHeaderBasketButton(value);
  setItemsToStorage(value);
});
const basketAction = (name: string, fn: (value: BasketItem[], ...args: any[]) => BasketItem[]) =>
  action(basketItemsAtom, name, (store, ...args: any[]) => {
    const value = store.get();
    store.set(fn(value, ...args));
  });

const basketItemsToBasket = (items: BasketItem[]): Basket => {
  const subtotalValue = items.reduce((mem, item) => mem + item.product.price * item.quantity, 0);
  const taxValue = items.reduce((mem, item) => mem + item.product.tax * item.quantity, 0);

  return {
    items,
    shippingCosts: SHIPPING_COSTS,
    subtotal: subtotalValue,
    total: subtotalValue + SHIPPING_COSTS,
    tax: taxValue,
  };
};

const generateItemId = (): string =>
  Math.round(Math.random() * 100000)
    .toString()
    .padStart(5, '0');

export function useBasket(): [Basket, BasketActions] {
  if (typeof window === 'undefined') {
    return noopBasket;
  }

  const currentItems = useStore(basketItemsAtom);
  const basket = basketItemsToBasket(currentItems);

  const add = (items: BasketItem[], toAdd: Product, quantity: number, bundleItems?: ProductBundleItem[]): BasketItem[] => {
    const existingItem = items.find((item) => item.product.sku === toAdd.sku && !toAdd.isBundle);
    if (existingItem) {
      existingItem.quantity = Math.min(existingItem.quantity + quantity, toAdd.maxQuantity ?? Infinity);
      return [...items];
    }
    quantity = Math.min(quantity, toAdd.maxQuantity ?? Infinity);
    items.push({ product: toAdd, quantity, bundleItems, id: generateItemId() });
    return items;
  };

  const remove = (items: BasketItem[], toRemove: BasketItem): BasketItem[] => {
    const filteredItems = items.filter((item) => item.id !== toRemove.id);
    return filteredItems;
  };

  const changeQuantity = (items: BasketItem[], toChange: BasketItem, quantity: number): BasketItem[] => {
    const foundItem = items.find((item) => item.id === toChange.id);
    if (!foundItem) {
      return items;
    }
    foundItem.quantity = Math.min(quantity, toChange.product.maxQuantity ?? Infinity);
    return [...items];
  };

  const clear = (): BasketItem[] => [];

  return [
    basket,
    {
      add: basketAction('add', add),
      remove: basketAction('remove', remove),
      changeQuantity: basketAction('changeQuantity', changeQuantity),
      clear: basketAction('clear', clear),
    },
  ];
}
