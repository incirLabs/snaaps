import {Surface} from '../Surface/Surface';
import {ShowToastConfig} from './types';

import {CloseIcon} from '../../assets/Icons/CloseIcon';

export type ToastProps = Pick<ShowToastConfig, 'title' | 'message' | 'type'>;

export const Toast: React.FC<ToastProps> = (props) => {
  const {title, message} = props;

  return (
    <Surface className="c-toast-container_toast_card">
      <div className="c-toast-container_toast_top">
        <span className="c-toast-container_toast_title">{title}</span>

        <button className="c-toast-container_toast_close-button">
          <CloseIcon width={14} height={14} />
        </button>
      </div>
      <div className="c-toast-container_toast_content">{message}</div>
    </Surface>
  );
};
