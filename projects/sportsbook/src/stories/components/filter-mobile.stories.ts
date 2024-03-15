import { Story, Meta } from '@storybook/angular/template/components';
import { FiltermobileComponent } from '../../app/components/filtermobile/filtermobile.component';

export default {
  title: 'Example/Filter-Mobile',
  component: FiltermobileComponent,
} as Meta;

const Template: Story<FiltermobileComponent> = (
  args: FiltermobileComponent
) => ({
  component: FiltermobileComponent,
  props: args,
});

export const ComponentView = Template.bind({});
ComponentView.args = {
  figCaptionTxt: '',
};
