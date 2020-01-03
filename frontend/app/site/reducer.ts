import {ContainerState, ContainerActions} from './types';
import {showLoading, hideLoading,
  SHOW_LOADING, HIDE_LOADING, RESET_LOADING} from 'site/actions';

export const initialState = {
  isLoading: false,
};

export default function(state: ContainerState = initialState,
                        action: ContainerActions) {
  const { type } = action;
  switch (type) {
    case SHOW_LOADING:
      return {
        ...state,
        isLoading: true,
      };
    case HIDE_LOADING:
    case RESET_LOADING:
      return {
        ...state,
        isLoading: false,
      };

    default:
      return state;
  }
}

export function isLoadingMiddleware() {
  return ({ dispatch }) => next => (action) => {
    const { type } = action;
    if (type) {
      const isRequest = new RegExp('REQUEST', 'g');
      const isFulfill = new RegExp('FULFILL', 'g');
      const isSuccess = new RegExp('SUCCESS', 'g');
      const isFailure = new RegExp('FAILURE', 'g');

      if (type.match(isRequest)) {
        dispatch(showLoading());
      } else if (type.match(isFulfill) || type.match(isSuccess) || type.match(isFailure)) {
        dispatch(hideLoading());
      }
    }

    return next(action);
  }
}

export const selectIsLoading = (state) => state.site.isLoading;
