
import { Story, Meta } from '@storybook/angular/template/components';
import { VirtualsComponent } from '../app/components/virtuals/virtuals.component';
import { MatTabsModule } from '@angular/material/tabs';
import { moduleMetadata } from '@storybook/angular/dist/client/decorators';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
// import { BookABetComponent } from '../app/shared/book-a-bet-desktop/book-a-bet-desktop.component';

export default {
  title: 'Example/Virtual-Games',
  component: VirtualsComponent,
  decorators: [
    moduleMetadata({
      imports: [MatTabsModule,NoopAnimationsModule,MatIconModule],
    }),
  ],
} as Meta;

const Template: Story<VirtualsComponent> = (args: VirtualsComponent) => ({
  component: VirtualsComponent,
  props: args,
});

export const ComponentView = Template.bind({});
ComponentView.args = {
  figCaptionTxt: '',
};