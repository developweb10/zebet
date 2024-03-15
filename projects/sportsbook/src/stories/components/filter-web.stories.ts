import { Story, Meta } from '@storybook/angular/template/components';
import { FilterdesktopComponent } from '../../app/components/filterdesktop/filterdesktop.component';

export default {
  title: 'Example/Filter-Web',
  component: FilterdesktopComponent,
} as Meta;

const Template: Story<FilterdesktopComponent> = (
  args: FilterdesktopComponent
) => ({
  component: FilterdesktopComponent,
  props: args,
});

export const ComponentView = Template.bind({});
ComponentView.args = {
  figCaptionTxt: '',
};
