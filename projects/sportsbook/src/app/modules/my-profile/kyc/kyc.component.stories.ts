import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { KycComponent } from './kyc.component';
export default {
  title: 'Kyc Component',
  component: KycComponent,
  decorators: [
    moduleMetadata({
      declarations: [KycComponent],
    }),
  ],
} as Meta;

const Template: Story<KycComponent> = (args: KycComponent) => ({
  component: KycComponent,
  props: args,
});

export const Default = Template.bind({});
Default.args = {};

export const upload = Template.bind({});
upload.args = {
  showUploadModal: true,
  showStartKyc: false,
};

export const selected = Template.bind({});
selected.args = {
  showUploadModal: true,
  showStartKyc: false,
  selectedDoc: 'document',
  date: '30 Dec 2025',
  selectedFileName: 'My ID Document.jpg',
  cancel: true,
};

export const success = Template.bind({});
success.args = {
  showSuccess: true,
  showUploadModal: false,
  showStartKyc: false,
};
