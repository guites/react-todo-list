import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getCurrentDate, getCurrentTime } from 'shared';
import { NotesForm } from './NotesForm';

describe('Create Note', () => {
    test('Initializes empty form', () => {
        render(<NotesForm />);

        const dateInput = screen.queryByLabelText(/data/i);
        const timeInput = screen.queryByRole('textbox', { name: /hora/i });
        const noteInput = screen.queryByRole('textbox', {
            name: /anotação/i,
        });
        const submitButton = screen.queryByRole('button', {
            name: /criar anotação/i,
        });

        expect(dateInput).toBeInTheDocument();
        expect(timeInput).toBeInTheDocument();
        expect(noteInput).toBeInTheDocument();
        expect(submitButton).toBeInTheDocument();

        expect(dateInput).toHaveValue(getCurrentDate());
        expect(timeInput).toHaveValue(getCurrentTime());
        expect(noteInput).toHaveValue('');

        expect(
            screen.queryByTestId('validation-error'),
        ).not.toBeInTheDocument();
        expect(
            screen.queryByTestId('validation-success'),
        ).not.toBeInTheDocument();
    });

    test('Inputs are required', async () => {
        render(<NotesForm />);

        const dateInput = screen.getByLabelText(/data/i);
        const timeInput = screen.getByRole('textbox', { name: /hora/i });
        const noteInput = screen.getByRole('textbox', {
            name: /anotação/i,
        });
        const submitButton = screen.getByRole('button', {
            name: /criar anotação/i,
        });

        expect(noteInput).toHaveValue('');
        fireEvent.click(submitButton);
        // declare var below using let as I have to query for it again later
        let validationErrorMessage =
            screen.queryByTestId('validation-error');
        expect(validationErrorMessage).toBeInTheDocument();
        expect(validationErrorMessage).toHaveTextContent(
            'Preencha a descrição!',
        );

        // userEvent here instead of fireEvent.change as it triggers onBlur effects
        userEvent.type(timeInput, '{space}');
        fireEvent.click(submitButton);
        expect(timeInput).toHaveValue(getCurrentTime());

        // fill note input as it's validated first
        fireEvent.change(noteInput, {
            target: { value: 'Test note.' },
        });
        fireEvent.change(dateInput, {
            target: { value: '' },
        });
        fireEvent.click(submitButton);
        validationErrorMessage = screen.queryByTestId('validation-error');
        expect(validationErrorMessage).toBeInTheDocument();
        expect(validationErrorMessage).toHaveTextContent(
            'Preencha a data!',
        );
    });

    test('Submit function is not called if invalid', () => {
        const onSubmit = jest.fn();

        render(<NotesForm createdNote={onSubmit} />);

        const dateInput = screen.getByLabelText(/data/i);
        const timeInput = screen.getByRole('textbox', { name: /hora/i });
        const noteInput = screen.getByRole('textbox', {
            name: /anotação/i,
        });
        const submitButton = screen.getByRole('button', {
            name: /criar anotação/i,
        });
        const form = screen.getByTestId('add-note-form');

        expect(noteInput).toHaveValue('');

        fireEvent.submit(form);

        expect(onSubmit).not.toHaveBeenCalled();

        fireEvent.change(noteInput, {
            target: { value: 'Nota de teste.' },
        });

        expect(noteInput).toHaveValue('Nota de teste.');

        fireEvent.change(dateInput, {
            target: { value: '' },
        });

        fireEvent.submit(form);

        expect(onSubmit).not.toHaveBeenCalled();

        fireEvent.change(dateInput, {
            target: { value: getCurrentDate() },
        });

        // timeInputs onBlur auto fill will allow submitting
        userEvent.type(timeInput, '{space}');

        fireEvent.submit(form);

        expect(onSubmit).toHaveBeenCalled();
    });
});

describe('Edit Note', () => {
    test('Initializes form with note info', () => {
        render(
            <NotesForm
                editNote={{
                    id: 1,
                    dateTime: '19/01/2022 22:54',
                    note: 'A note taken for testing!',
                }}
            />,
        );

        // should be an input (readonly/disabled) for the id

        const dateInput = screen.queryByLabelText(/data/i);
        const timeInput = screen.queryByRole('textbox', { name: /hora/i });
        const noteInput = screen.queryByRole('textbox', {
            name: /anotação/i,
        });
        const submitButton = screen.queryByRole('button', {
            name: /criar anotação/i,
        });

        expect(timeInput).toBeInTheDocument();
        expect(dateInput).toBeInTheDocument();
        expect(noteInput).toBeInTheDocument();
        expect(submitButton).toBeInTheDocument();

        expect(timeInput).toHaveValue('22:54');
        expect(dateInput).toHaveValue('2022-01-19');
        expect(noteInput).toHaveValue('A note taken for testing!');

        expect(
            screen.queryByTestId('validation-error'),
        ).not.toBeInTheDocument();

        expect(
            screen.queryByTestId('validation-success'),
        ).not.toBeInTheDocument();
    });
});
