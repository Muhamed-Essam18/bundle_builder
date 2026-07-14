'use client';

import type { BundleData, HomeAction, HomeState, Product } from "@/types/bundle_types";
import {
  buildInitialActiveVariants,
  buildInitialQuantities,
  buildProductsByStep,
  buildReviewLines,
  buildTotals,
  readPersistedBuilderState,
  STORAGE_KEY,
} from "@/lib/bundleBuilder";
import { useMemo, useReducer } from "react";
import ReviewPanel from "./ReviewPanel";
import StepSection from "./StepSection";

type HomeProps = {
  data: BundleData;
};

// Builds the initial page state from the bundled data and any saved values.
function buildInitialState(data: BundleData): HomeState {
  const persistedState = readPersistedBuilderState();

  return {
    quantities: {
      ...buildInitialQuantities(data.products),
      ...(persistedState.quantities ?? {}),
    },
    activeVariants: {
      ...buildInitialActiveVariants(data.products),
      ...(persistedState.activeVariants ?? {}),
    },
    openStepId: persistedState.openStepId ?? data.steps[0]?.id ?? "",
    saveMessage: "",
    checkoutMessage: "",
  };
}

// Handles all page state transitions in one place.
function homeReducer(state: HomeState, action: HomeAction): HomeState {
  switch (action.type) {
    case "set-open-step":
      return {
        ...state,
        openStepId: action.stepId,
      };
    case "set-active-variant":
      return {
        ...state,
        activeVariants: {
          ...state.activeVariants,
          [action.productId]: action.variantId,
        },
      };
    case "set-quantity":
      return {
        ...state,
        quantities: {
          ...state.quantities,
          [action.productId]: {
            ...(state.quantities[action.productId] ?? {}),
            [action.variantId]: Math.max(0, action.nextQty),
          },
        },
      };
    case "set-save-message":
      return {
        ...state,
        saveMessage: action.message,
      };
    case "set-checkout-message":
      return {
        ...state,
        checkoutMessage: action.message,
      };
    default:
      return state;
  }
}

const Home = ({ data }: HomeProps) => {
  const [state, dispatch] = useReducer(homeReducer, data, buildInitialState);
  const productsByStep = useMemo(() => {
    return buildProductsByStep(data.steps, data.products);
  }, [data.steps, data.products]);

  const selectedCountByStep = useMemo(() => {
    return data.steps.reduce<Record<string, number>>((acc, step) => {
      const selected = (productsByStep[step.id] ?? []).filter((product) => {
        const totalQty = Object.values(state.quantities[product.id] ?? {}).reduce(
          (sum, qty) => sum + qty,
          0,
        );
        return totalQty > 0;
      });

      acc[step.id] = selected.length;
      return acc;
    }, {});
  }, [data.steps, productsByStep, state.quantities]);

  const reviewLines = useMemo(() => {
    return buildReviewLines(data.products, state.quantities);
  }, [data.products, state.quantities]);

  const totals = useMemo(() => {
    return buildTotals(reviewLines);
  }, [reviewLines]);

  const updateQuantity = (productId: string, variantId: string, nextQty: number) => {
    dispatch({
      type: "set-quantity",
      productId,
      variantId,
      nextQty,
    });
  };

  const changeQuantity = (product: Product, variantId: string, delta: number) => {
    const current = state.quantities[product.id]?.[variantId] ?? 0;
    updateQuantity(product.id, variantId, current + delta);
  };

  const handleSave = () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        quantities: state.quantities,
        activeVariants: state.activeVariants,
        openStepId: state.openStepId,
      }),
    );
    dispatch({
      type: "set-save-message",
      message: "System saved. Reload this page and your choices are restored.",
    });
  };

  const handleCheckout = () => {
    dispatch({
      type: "set-checkout-message",
      message: "Prototype checkout complete. Your configuration is ready.",
    });
  };

  return (
    <div className="page-shell">
      <main className="builder-layout ">
        <section className="builder-panel">
         <h1 className="font-bold p-4 sm:hidden">Let's get started</h1>

          {data.steps.map((step, index) => {
            const nextStep = data.steps[index + 1];
            const isStepOpen = state.openStepId === step.id;

            return (
              <section key={step.id}><p className="m-0 px-4 py-1  text-[0.78rem] tracking-[0.18em] text-[#484848] font-semibold uppercase">
        {step.label}
      </p>
       <StepSection
                step={step}
                isOpen={isStepOpen}
                selectedCount={selectedCountByStep[step.id] ?? 0}
                products={productsByStep[step.id] ?? []}
                quantities={state.quantities}
                activeVariants={state.activeVariants}
                onOpen={() =>
                  dispatch({
                    type: "set-open-step",
                    stepId: isStepOpen ? "" : step.id,
                  })
                }
                onNext={() => {
                  if (nextStep) {
                    dispatch({ type: "set-open-step", stepId: nextStep.id });
                  }
                }}
                onChangeVariant={(productId, variantId) =>
                  dispatch({
                    type: "set-active-variant",
                    productId,
                    variantId,
                  })
                }
                onChangeQuantity={changeQuantity}
              /></section>
             
            );
          })}
        </section>

        <ReviewPanel
          reviewLines={reviewLines}
          totals={totals}
          checkoutMessage={state.checkoutMessage}
          saveMessage={state.saveMessage}
          onCheckout={handleCheckout}
          onSave={handleSave}
          onUpdateLineQuantity={updateQuantity}
        />
      </main>
    </div>
  );
};

export default Home;
