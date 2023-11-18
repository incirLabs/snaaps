import {Surface} from '../../components';

export type PluginsItemProps = {
  name: string;
};

export const PluginsItem: React.FC<PluginsItemProps> = ({name}) => {
  return (
    <Surface className="p-plugins_list_item p-plugins_plugin">
      <h4 className="p-plugins_plugin_title">{name}</h4>
    </Surface>
  );
};
