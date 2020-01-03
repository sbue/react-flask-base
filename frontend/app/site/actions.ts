export const SHOW_LOADING = 'loading/SHOW';
export const HIDE_LOADING = 'loading/HIDE';
export const RESET_LOADING = 'loading/RESET';

export const showLoading = () => ({
  type: SHOW_LOADING,
  payload: {},
});
export const hideLoading = () => ({
  type: HIDE_LOADING,
  payload: {},
});
export const resetLoading = () => ({
  type: RESET_LOADING,
  payload: {},
});
