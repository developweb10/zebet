import { Story, Meta } from '@storybook/angular/template/components';
import { AZMenuComponent } from './a-z-menu.component';

export default {
  title: 'Example/Menu',
  component: AZMenuComponent,
} as Meta;

const Template: Story<AZMenuComponent> = (args: AZMenuComponent) => ({
  component: AZMenuComponent,
  props: args,
});

export const ComponentView = Template.bind({});
ComponentView.args = {
  figCaptionTxt: '',
};
