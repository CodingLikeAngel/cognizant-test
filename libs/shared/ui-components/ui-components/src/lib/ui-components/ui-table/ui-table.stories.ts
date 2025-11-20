import type { Meta, StoryObj } from '@storybook/angular';
import { UiTable, TableColumn } from './ui-table';
import { userEvent, within } from 'storybook/internal/test';

const columns: TableColumn[] = [
  { key: 'name', header: 'Nombre' },
  { key: 'seniority', header: 'Nivel' },
  { key: 'role', header: 'Rol' },
];

const data = [
  { name: 'Juan', seniority: 'Senior', role: 'Frontend' },
  { name: 'María', seniority: 'Junior', role: 'Backend' },
  { name: 'Pedro', seniority: 'Mid', role: 'Fullstack' },
];

const meta: Meta<UiTable> = {
  title: 'Components/UiTable',
  component: UiTable,
};
export default meta;

type Story = StoryObj<UiTable>;

export const Primary: Story = {
  args: {
    columns,
    data,
  },
};

export const EmptyTable: Story = {
  args: {
    columns: [],
    data: [],
  },
};

export const Heading: Story = {
  args: {
    columns,
    data,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Nombre')).toBeTruthy();
    await expect(canvas.getByText('Nivel')).toBeTruthy();
    await expect(canvas.getByText('Rol')).toBeTruthy();
  },
};
