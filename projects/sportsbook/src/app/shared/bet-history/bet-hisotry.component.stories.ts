import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { BetHistoryComponent } from './bet-history.component';
export default {
  title: 'Bet History Component',
  component: BetHistoryComponent,
  decorators: [
    moduleMetadata({
      declarations: [BetHistoryComponent],
    }),
  ],
} as Meta;
const Template: Story<BetHistoryComponent> = (args: BetHistoryComponent) => ({
  component: BetHistoryComponent,
  props: args,
});

export const Default = Template.bind({});
Default.args;

export const dropdown = Template.bind({});
dropdown.args = {
  isOpen: true,
  mobileOpen: true,
  tabOpen: true,
};

export const filter = Template.bind({});
filter.args = {
  showFilterModal: true,
};
