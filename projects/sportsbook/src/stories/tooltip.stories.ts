import type { Meta, StoryObj } from '@storybook/angular';
import { TooltipStoryComponent } from '../app/shared/tooltip-story/tooltip-story.component';
import { TooltipModule } from '../app/shared/tooltip/tooltip.module';

// More on how to set up stories at: https://storybook.js.org/docs/angular/writing-stories/introduction
const meta: Meta<TooltipStoryComponent> = {
  title: 'Tooltip',
  component: TooltipStoryComponent,
  tags: ['autodocs'],
  render: (args: TooltipStoryComponent) => ({
    props: {
      ...args,
    },
    moduleMetadata: { // (3) don't forget it
      imports: [TooltipModule]
    }
  })
};

export default meta;
type Story = StoryObj<TooltipStoryComponent>;

// More on writing stories with args: https://storybook.js.org/docs/angular/writing-stories/args
export const Above: Story = {
  args: {
    position: 'above',
  },
};

export const Below: Story = {
  args: {
    position: 'below',
  },
};

export const Left: Story = {
  args: {
    position: 'left',
  },
};

export const Right: Story = {
  args: {
    position: 'right',
  },
};
