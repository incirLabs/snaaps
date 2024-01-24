import {memo} from 'react';
import {FAQContent} from './FAQContent';
import {Accordion, Surface} from '../../components';

export const FAQAccordion = memo(() => {
  return (
    <Accordion as={Surface} className="p-landing_faq">
      {FAQContent.map(([handle, content]) => (
        <Accordion.Item
          key={handle?.toString()}
          as={Surface}
          className="p-landing_faq_item"
          activeClassName="p-landing_faq_item--active"
        >
          <Accordion.Handle className="p-landing_faq_item_handle">
            <span>{handle}</span>

            <Accordion.Content>
              <div className="p-landing_faq_item_content">{content}</div>
            </Accordion.Content>
          </Accordion.Handle>
        </Accordion.Item>
      ))}
    </Accordion>
  );
});
