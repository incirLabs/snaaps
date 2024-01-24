export type ShowToastConfig = {
  /**
   * The title of the toast.
   */
  title: React.ReactNode;

  /**
   * The message of the toast.
   */
  message: React.ReactNode;

  /**
   * The type of the toast. Defaults to 'info'.
   */
  type?: 'success' | 'error' | 'warning' | 'info';

  /**
   * The time in milliseconds to show the toast. Defaults to 7500.
   */
  timeout?: number;

  /**
   * Whether to animate the toast on show and hide. Defaults to true.
   */
  animated?: boolean;
};
