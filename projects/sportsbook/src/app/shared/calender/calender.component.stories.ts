import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { CalenderComponent } from './calender.component';

export default {
  title: 'Calendar Component',
  component: CalenderComponent,
  decorators: [
    moduleMetadata({
      declarations: [CalenderComponent],
    }),
  ],
} as Meta;

const Template: Story<CalenderComponent> = (args: CalenderComponent) => ({
  component: CalenderComponent,
  props: args,
});

export const Calender = Template.bind({});
Calender.args = {
  uploadNIN: true,
  selectedAmount: null,
};

