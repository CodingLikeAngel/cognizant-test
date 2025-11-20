import type { Meta, StoryObj } from '@storybook/angular';
import { InputField } from './input-field';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { userEvent, within } from 'storybook/internal/test';


const meta: Meta<InputField<string>> = {
  title: 'Components/InputField',
  component: InputField,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (story) => ({
      template: `<form [formGroup]="form">${story}</form>`,
      props: {
        form: new FormGroup({
          name: new FormControl(''),
        }),
      },
      moduleMetadata: {
        imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule],
      },
    }),
  ],
};
export default meta;

type Story = StoryObj<InputField<string>>;

export const Primary: Story = {
  args: {
    label: 'Nombre',
    placeholder: 'Escribe tu nombre',
    type: 'text',
  },
};

export const WithTyping: Story = {
  args: {
    label: 'Nombre',
    placeholder: 'Escribe tu nombre',
    type: 'text',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByPlaceholderText('Escribe tu nombre') as HTMLInputElement;

    await userEvent.type(input, 'Juan Rodríguez');
    await expect(input.value).toBe('Juan Rodríguez');

    const component = canvasElement.querySelector('lib-input-field') as any;
    await expect(component.control.value).toBe('Juan Rodríguez');
  },
};
