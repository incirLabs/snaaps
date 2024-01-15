import './styles.scss';

export type BubbleProps = JSX.IntrinsicElements['div'] & {
  content: string;
};

export const Bubble: React.FC<BubbleProps> = (props) => {
  const {content, children} = props;

  return (
    <div className="c-bubble">
      {children} <div className="c-bubble_content">{content}</div>
    </div>
  );
};
