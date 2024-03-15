import type { Meta, StoryObj } from '@storybook/angular';
import { FavoritesComponent } from '../app/modules/a-z/favorites/favorites.component';
import { FavoritesItemComponent } from '../app/modules/a-z/favorites-item/favorites-item.component';

// More on how to set up stories at: https://storybook.js.org/docs/angular/writing-stories/introduction
const meta: Meta<FavoritesComponent> = {
  title: 'Favorites',
  component: FavoritesComponent,
  tags: ['autodocs'],
  render: (args: FavoritesComponent) => ({
    props: {
      ...args,
    },
    moduleMetadata: { // (3) don't forget it
      declarations: [FavoritesItemComponent],
    }
  })
};

export default meta;
type Story = StoryObj<FavoritesComponent>;

// More on writing stories with args: https://storybook.js.org/docs/angular/writing-stories/args
export const NoFavorites: Story = {
  args: {
    isDataExists: false,
  },
};

export const Favorites: Story = {
  args: {
    isDataExists: true,
  },
};