import { Story, Meta } from '@storybook/angular/template/components';
import { SpecialsComponent } from '../app/modules/sports-book/specials/specials.component';
import { moduleMetadata } from '@storybook/angular';
import { MatTabsModule } from '@angular/material/tabs';
import {
  NoopAnimationsModule,
} from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { HttpClientModule } from '@angular/common/http';

export default {
  title: 'Example/Specials',
  component: SpecialsComponent,
  decorators: [
    moduleMetadata({
      imports: [
        MatTabsModule,
        NoopAnimationsModule,
        MatIconModule,
        HttpClientModule,
      ],
    }),
  ],
} as Meta;

const Template: Story<SpecialsComponent> = (args: SpecialsComponent) => ({
  component: SpecialsComponent,
  props: args,
});

export const ComponentView = Template.bind({});
ComponentView.args = {
  figCaptionTxt: '',
};
