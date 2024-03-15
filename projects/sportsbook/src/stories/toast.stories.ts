import type { Meta, StoryObj } from '@storybook/angular';
import { ToastStoryComponent } from '../app/shared/toast-story/toast-story.component';
import { ToastComponent } from '../app/shared/toast/toast.component';
import { CommonModule } from '@angular/common';

// More on how to set up stories at: https://storybook.js.org/docs/angular/writing-stories/introduction
const meta: Meta<ToastStoryComponent> = {
  title: 'Toast',
  component: ToastStoryComponent,
  tags: ['autodocs'],
  render: (args: ToastStoryComponent) => ({
    props: {
      ...args,
    },
    moduleMetadata: { // (3) don't forget it
      declarations: [ToastComponent],
      imports: [CommonModule]
    }
  })
};

export default meta;
type Story = StoryObj<ToastStoryComponent>;

// More on writing stories with args: https://storybook.js.org/docs/angular/writing-stories/args
export const Story = {
};