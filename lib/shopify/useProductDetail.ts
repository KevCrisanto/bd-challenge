import { useCallback, useEffect, useMemo, useReducer } from 'react';
import type { ShopifyProductDetail, ShopifyProductVariant } from './types';

interface SelectionFields {
  readonly selectedOptions: Readonly<Record<string, string>>;
  readonly setOption: (name: string, value: string) => void;
  readonly resolvedVariant: ShopifyProductVariant | undefined;
  readonly isOptionValueAvailable: (name: string, value: string) => boolean;
}

type UseProductDetailResult =
  | ({ readonly status: 'loading' } & SelectionFields)
  | ({ readonly status: 'error'; readonly error: Error } & SelectionFields)
  | ({
      readonly status: 'success';
      readonly product: ShopifyProductDetail;
    } & SelectionFields);

type FetchState =
  | { readonly status: 'loading' }
  | { readonly status: 'error'; readonly error: Error }
  | { readonly status: 'success'; readonly product: ShopifyProductDetail };

type State = {
  readonly fetchState: FetchState;
  readonly selectedOptions: Readonly<Record<string, string>>;
};

type Action =
  | { readonly type: 'FETCH_START' }
  | { readonly type: 'FETCH_SUCCESS'; readonly product: ShopifyProductDetail }
  | { readonly type: 'FETCH_ERROR'; readonly error: Error }
  | { readonly type: 'SET_OPTION'; readonly name: string; readonly value: string };

const INITIAL_STATE: State = {
  fetchState: { status: 'loading' },
  selectedOptions: {},
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'FETCH_START':
      return INITIAL_STATE;
    case 'FETCH_SUCCESS':
      return { ...state, fetchState: { status: 'success', product: action.product } };
    case 'FETCH_ERROR':
      return { ...state, fetchState: { status: 'error', error: action.error } };
    case 'SET_OPTION':
      return {
        ...state,
        selectedOptions: { ...state.selectedOptions, [action.name]: action.value },
      };
  }
};

export const useProductDetail = (handle: string): UseProductDetailResult => {
  const [{ fetchState, selectedOptions }, dispatch] = useReducer(reducer, INITIAL_STATE);

  useEffect(() => {
    const controller = new AbortController();

    dispatch({ type: 'FETCH_START' });

    fetch('/api/products/' + encodeURIComponent(handle), {
      signal: controller.signal,
    })
      .then(async (res) => {
        const body: { product?: ShopifyProductDetail; error?: string } =
          await res.json();

        if (!res.ok || !body.product) {
          dispatch({
            type: 'FETCH_ERROR',
            error: new Error(body.error ?? 'Product not found'),
          });
        } else {
          dispatch({ type: 'FETCH_SUCCESS', product: body.product });
        }
      })
      .catch((err: unknown) => {
        if (err instanceof Error && err.name === 'AbortError') return;
        dispatch({
          type: 'FETCH_ERROR',
          error: err instanceof Error ? err : new Error('Failed to fetch product'),
        });
      });

    return () => {
      controller.abort();
    };
  }, [handle]);

  const setOption = useCallback((name: string, value: string): void => {
    dispatch({ type: 'SET_OPTION', name, value });
  }, []);

  const resolvedVariant = useMemo((): ShopifyProductVariant | undefined => {
    if (fetchState.status !== 'success') return undefined;

    return fetchState.product.variants.find((variant) =>
      variant.selectedOptions.every(
        (opt) => selectedOptions[opt.name] === opt.value,
      ),
    );
  }, [fetchState, selectedOptions]);

  const isOptionValueAvailable = useCallback(
    (name: string, value: string): boolean => {
      if (fetchState.status !== 'success') return false;

      const hypothetical: Record<string, string> = {
        ...selectedOptions,
        [name]: value,
      };

      return fetchState.product.variants.some(
        (variant) =>
          variant.availableForSale &&
          variant.selectedOptions.every(
            (opt) =>
              !(opt.name in hypothetical) ||
              hypothetical[opt.name] === opt.value,
          ),
      );
    },
    [fetchState, selectedOptions],
  );

  const selectionFields: SelectionFields = {
    selectedOptions,
    setOption,
    resolvedVariant,
    isOptionValueAvailable,
  };

  return { ...fetchState, ...selectionFields };
};
