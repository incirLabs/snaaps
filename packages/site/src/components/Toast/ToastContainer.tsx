import {createElement} from 'react';
import {renderToString} from 'react-dom/server';
import {Toast} from './Toast';
import {ShowToastConfig} from './types';

import './styles.scss';

const createToastContainer = () => {
  const element = document.getElementById('root-toast');
  if (!element) throw new Error('No element with id root-toast found');

  const toastContainer = document.createElement('div');
  toastContainer.className = 'c-toast-container';

  element.appendChild(toastContainer);

  const showToast = (config: ShowToastConfig) => {
    const {type = 'info', timeout = 7500, animated = true} = config;

    const toast = document.createElement('div');
    toast.className = `c-toast-container_toast c-toast-container_toast--${type}`;

    toast.innerHTML = renderToString(createElement(Toast, config));

    const hideToast = async (immediate?: boolean) => {
      if (!immediate && animated) {
        const animation = toast.animate(
          [
            {transform: 'translateY(0%)', opacity: 1},
            {transform: 'translateY(-100%)', opacity: 0},
          ],
          {
            duration: 300,
            iterations: 1,
          },
        );

        await animation.finished;
      }

      toast.remove();
    };

    toast
      .querySelector('.c-toast-container_toast_close-button')
      ?.addEventListener?.('click', () => hideToast());

    if (Number.isFinite(timeout)) setTimeout(hideToast, timeout);

    toastContainer.appendChild(toast);

    return hideToast;
  };

  return showToast;
};

export const showToast = createToastContainer();
