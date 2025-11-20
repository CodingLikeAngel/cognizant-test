import type { Meta, StoryObj } from '@storybook/angular';
import { FileReaderField } from './file-reader-field';
import { userEvent, within } from 'storybook/internal/test';

const meta: Meta<FileReaderField> = {
  title: 'Components/FileReaderField',
  component: FileReaderField,
  parameters: {
    layout: 'centered',
  },
};
export default meta;

type Story = StoryObj<FileReaderField>;

// Historia principal
export const Primary: Story = {
  args: {},
};

// Historia con interacción: simula seleccionar un archivo
export const WithFileSelect: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Encontrar el input oculto
    const input = canvas.getByRole('textbox', { hidden: true }) as HTMLInputElement;

    // Simular usuario seleccionando un archivo
    const file = new File(['hello world'], 'hello.txt', { type: 'text/plain' });
    await userEvent.upload(input, file);

    // Verificar que el archivo se haya asignado
    const component = canvasElement.querySelector('lib-file-reader-field') as any;
    await expect(component.selectedFile).toEqual(file);
  },
};
