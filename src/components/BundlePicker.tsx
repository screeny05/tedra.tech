import Sheet from 'react-modal-sheet';
import { useState } from 'preact/hooks';
import type { Product, ProductBundleItem } from '../models/product';

function SelectedItem({ onClick, item }: any) {
  return (
    <button class="product-bundle__selected-item" onClick={onClick}>
      {item ? (
        <img src={item.image} alt={item.title} />
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12.021 12.021">
          <path d="m7.647 8.353-3.4-3.4-3.4 3.4a.5.5 0 0 1-.707-.706l3.4-3.4L.146.853A.5.5 0 0 1 .853.146l3.4 3.4 3.4-3.4a.5.5 0 0 1 .706.707l-3.4 3.4 3.4 3.4a.5.5 0 1 1-.706.706z" transform="rotate(45 3.004 7.255)" style="fill:#fff"></path>
        </svg>
      )}
    </button>
  );
}

function AvailableItem({ src, title, onClick }: any) {
  return (
    <button class="product-bundle__available-item bundle-item" onClick={onClick}>
      <img src={src} alt={title} class="bundle-item__image" draggable={false} />
      <div class="bundle-item__title">{title}</div>
    </button>
  );
}

function SelectionSheet({ isOpen, onClose, onSelect, bundleItems }: any) {
  return (
    <Sheet isOpen={isOpen} onClose={onClose} detent="content-height">
      <Sheet.Container>
        <Sheet.Header />
        <Sheet.Content className="product-bundle__available-items">
          {bundleItems.map((item: ProductBundleItem) => (
            <AvailableItem
              src={item.image}
              title={item.title}
              onClick={() => {
                onSelect(item);
                onClose();
              }}
            />
          ))}
        </Sheet.Content>
      </Sheet.Container>

      <Sheet.Backdrop onClick={onClose} />
    </Sheet>
  );
}

export function BundlePicker({ product, onSelectionDone }: { product: Product; onSelectionDone: (selection: ProductBundleItem[]) => void }) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectionItems, setSelectionItems] = useState(new Array(product.bundleSlots).fill(null));
  const [clickedSelectionItem, setClickedSelectionItem] = useState(0);

  return (
    <div class="product-detail__bundle product-bundle">
      <div class="product-bundle__title">Select exactly {product.bundleSlots} items to purchase in this set</div>
      <div class="product-bundle__selected-items">
        {selectionItems.map((selectionItem, i) => (
          <SelectedItem
            item={selectionItem}
            onClick={() => {
              setIsSheetOpen(true);
              setClickedSelectionItem(i);
            }}
          />
        ))}
      </div>

      {typeof window !== 'undefined' && (
        <SelectionSheet
          bundleItems={product.bundleItems}
          isOpen={isSheetOpen}
          onClose={() => setIsSheetOpen(false)}
          onSelect={(selection: any) => {
            const newSelection = [...selectionItems];
            newSelection[clickedSelectionItem] = selection;
            setSelectionItems(newSelection);
            if (!newSelection.some((selectionItem) => selectionItem === null)) {
              onSelectionDone(newSelection);
            }
          }}
        />
      )}
    </div>
  );
}
