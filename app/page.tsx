import { useReducer } from "react";
import type { HomeState, HomeAction } from "@/types/bundle_types";
import { readPersistedBuilderState, buildInitialQuantities, buildInitialActiveVariants } from "@/lib/bundleBuilder";
import getProducts from "@/lib/getProducts";

// call products function to get the data
  const data = await getProducts();
  
// Builds the initial page state from the bundled data and any saved values.
function buildInitialState(): HomeState {
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

// Renders the bundle builder page and wires state into the sections.
export default async function Home() {

  const [state, dispatch] = useReducer(homeReducer, undefined, buildInitialState);

  return (
    <div className="">
      <main className="">
       
      </main>
    </div>
  );
}
