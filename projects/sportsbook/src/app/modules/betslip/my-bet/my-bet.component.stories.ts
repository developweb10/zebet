import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { MyBetComponent } from './my-bet.component';
import { MatSliderModule } from '@angular/material/slider';
export default {
  title: 'My Bet Component',
  component: MyBetComponent,
  decorators: [
    moduleMetadata({
      declarations: [MyBetComponent],
      imports: [MatSliderModule],
    }),
  ],
} as Meta;

const Template: Story<MyBetComponent> = (args: MyBetComponent) => ({
  component: MyBetComponent,
  props: args,
});

export const Default = Template.bind({});
Default.args;

export const Accordion = Template.bind({});
Accordion.args = {
  isOpen: true,
  cashOut: true,
  cashOut2: true,
};

export const autoCO = Template.bind({});
autoCO.args = {
  isOpen: false,
  autoCO: true,
  showBtnMobile: false,
};

export const partialCO = Template.bind({});
partialCO.args = {
  isOpen: false,
  partialCO: true,
  showBtnMobile: false,
};

export const congratulations = Template.bind({});
congratulations.args = {
  showWinModal: true,
};

export const cashOutUnavailable = Template.bind({});
cashOutUnavailable.args = {
  CoUnavailable: true,
  isOpen: false,
  autoCO: true,
  autoCoClicked: true,
  partialCoClicked: false,
  showBtnMobile: false,
};

export const live = Template.bind({});
live.args = {
  live: true,
  all: false,
};

export const liveDropDown = Template.bind({});
liveDropDown.args = {
  live: true,
  all: false,
  isOpen: true,
};

export const liveOdds = Template.bind({});
liveOdds.args = {
  live: true,
  all: false,
  isOpen: true,
  odds: true,
};
