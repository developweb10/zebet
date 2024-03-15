import { Story, Meta } from '@storybook/angular/template/components';

import {  } from '../app/side-bar/side-bar.component';
import { SearchMenuComponent } from '../app/modules/sports-book/search-menu/search-menu.component';

export default {
  title: 'Example/Sidebar',
  component: SearchMenuComponent,
} as Meta;

const Template: Story<SearchMenuComponent> = (args: SearchMenuComponent) => ({
  component: SearchMenuComponent,
  props: args,
});

export const ComponentView = Template.bind({});
ComponentView.args = {
  figCaptionTxt: '',
};
