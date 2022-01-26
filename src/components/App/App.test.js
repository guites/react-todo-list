import { render, screen, fireEvent, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { formatForDateInput, formatForTimeInput } from 'shared';
import { App } from './App';

beforeEach(() => {
    // to fully reset the state between tests, clear the storage
    localStorage.clear();
    // and reset all mocks
    jest.clearAllMocks();
});

describe('Edit note', () => {
    test('Shows edit modal when edit button is clicked', () => {
        localStorage.setItem(
            'items',
            '[{"note":"Now go","dateTime":"20/01/2022 16:27","id":1},{"note":"asdasd","dateTime":"20/01/2022 16:27","id":2}]',
        );

        const items = JSON.parse(localStorage.getItem('items'));
        const secondItem = items[1];

        render(<App />);

        expect(
            screen.queryByTestId('edit-note-modal'),
        ).not.toBeInTheDocument();

        fireEvent.click(screen.getByTestId(`edit-btn-${secondItem.id}`));

        expect(
            screen.queryByTestId('edit-note-modal'),
        ).toBeInTheDocument();
    });

    test('Closes edit modal by pressing esc and close button', () => {
        localStorage.setItem(
            'items',
            '[{"note":"Now go","dateTime":"20/01/2022 16:27","id":1},{"note":"asdasd","dateTime":"20/01/2022 16:27","id":2}]',
        );

        const items = JSON.parse(localStorage.getItem('items'));
        const firstItem = items[0];

        render(<App />);

        fireEvent.click(screen.getByTestId(`edit-btn-${firstItem.id}`));

        expect(
            screen.queryByTestId('edit-note-modal'),
        ).toBeInTheDocument();

        userEvent.keyboard('{esc}');

        expect(
            screen.queryByTestId('edit-note-modal'),
        ).not.toBeInTheDocument();

        fireEvent.click(screen.getByTestId(`edit-btn-${firstItem.id}`));

        expect(
            screen.queryByTestId('edit-note-modal'),
        ).toBeInTheDocument();

        const closeBtn = screen.getByRole('button', {
            name: /fechar/i,
        });

        fireEvent.click(closeBtn);

        expect(
            screen.queryByTestId('edit-note-modal'),
        ).not.toBeInTheDocument();
    });

    test('Changes item listed data and calls localStorage correctly when edit form is submitted', () => {
        const ogItem = {
            note: 'Adding a note via test suite.',

            dateTime: '12/01/2022 13:22',
            id: 1, // id is auto generated but increments by 1
        };

        localStorage.setItem('items', JSON.stringify([ogItem]));

        const editedItem = {
            note: ' This item has been edited.',
            dateTime: '18/02/2022 18:05',
            id: 1,
        };

        render(<App />);

        fireEvent.click(screen.getByTestId(`edit-btn-${ogItem.id}`));

        const editModal = screen.getByTestId('edit-note-modal');

        const noteInput = within(editModal).getByRole('textbox', {
            name: /anotação/i,
        });
        const dateInput = within(editModal).getByLabelText(/data/i);
        const timeInput = within(editModal).getByRole('textbox', {
            name: /hora/i,
        });
        const submitButton = within(editModal).getByRole('button', {
            name: /atualizar anotação/i,
        });

        expect(noteInput).toHaveValue(ogItem.note);
        expect(dateInput).toHaveValue(formatForDateInput(ogItem.dateTime));
        expect(timeInput).toHaveValue(formatForTimeInput(ogItem.dateTime));

        userEvent.type(noteInput, editedItem.note);

        fireEvent.change(timeInput, {
            target: { value: formatForTimeInput(editedItem.dateTime) },
        });

        fireEvent.change(dateInput, {
            target: { value: formatForDateInput(editedItem.dateTime) },
        });

        fireEvent.click(submitButton);

        // edit form doenst close automatically!
        userEvent.keyboard('{esc}');

        expect(editModal).not.toBeInTheDocument();

        expect(localStorage.setItem).toHaveBeenCalledWith(
            'items',
            JSON.stringify([
                { ...editedItem, note: ogItem.note + editedItem.note },
            ]),
        );

        const editedRow = screen.getByTestId(`row-${ogItem.id}`);
        within(editedRow).getByRole('cell', {
            name: ogItem.note + editedItem.note,
        });
        within(editedRow).getByRole('cell', {
            name: editedItem.dateTime,
        });
        within(editedRow).getByRole('cell', {
            name: ogItem.id,
        });
    });
});

describe('Add note', () => {
    const addNoteToForm = item => {
        const dateInput = screen.getByLabelText(/data/i);
        const timeInput = screen.getByRole('textbox', { name: /hora/i });
        const noteInput = screen.getByRole('textbox', {
            name: /anotação/i,
        });
        const submitButton = screen.getByRole('button', {
            name: /criar anotação/i,
        });
        const form = screen.getByTestId('add-note-form');

        fireEvent.change(timeInput, {
            target: { value: formatForTimeInput(item.dateTime) },
        });

        fireEvent.change(dateInput, {
            target: { value: formatForDateInput(item.dateTime) },
        });

        fireEvent.change(noteInput, {
            target: { value: item.note },
        });

        fireEvent.click(submitButton);
    };

    test('Appends item to list and calls localStorage correctly when add form is submitted', () => {
        const items = [
            {
                note: 'Adding a note via test suite.',
                dateTime: '12/01/2022 13:22',
                id: 1, // id is auto generated but increments by 1
            },
            {
                note: 'Adding a second note to be sure.',
                dateTime: '19/02/2022 18:07',
                id: 2,
            },
        ];

        render(<App />);

        addNoteToForm(items[0]);

        expect(
            screen.queryByTestId('validation-success'),
        ).toBeInTheDocument();

        expect(localStorage.setItem).toHaveBeenCalledWith(
            'items',
            JSON.stringify([items[0]]),
        );

        expect(
            screen.queryByTestId(`row-${items[0].id}`),
        ).toBeInTheDocument();

        addNoteToForm(items[1]);

        expect(
            screen.queryByTestId('validation-success'),
        ).toBeInTheDocument();

        expect(localStorage.setItem).toHaveBeenCalledWith(
            'items',
            JSON.stringify(items),
        );

        expect(
            screen.queryByTestId(`row-${items[1].id}`),
        ).toBeInTheDocument();
    });
});

describe('Delete Note', () => {
    test('Delete button toggles confirm modal for correct note and modal can be closed by pressing ESC or clicking close button', () => {
        localStorage.setItem(
            'items',
            '[{"note":"Now go","dateTime":"20/01/2022 16:27","id":1},{"note":"asdasd","dateTime":"20/01/2022 16:27","id":2}]',
        );

        render(<App />);

        const items = JSON.parse(localStorage.getItem('items'));
        const firstItem = items[0];

        const deleteButton = screen.queryByTestId(
            `delete-btn-${firstItem.id}`,
        );

        expect(deleteButton).toBeInTheDocument();

        fireEvent.click(deleteButton);

        // checks that modal pops up
        const modalTitle = screen.queryByTestId('delete-note-modal-title');

        expect(modalTitle).toBeInTheDocument();

        // checks that title corresponds to correct note
        expect(modalTitle).toHaveTextContent(
            `Deletar anotação #${firstItem.id}`,
        );

        // both note description and date are inside a <figure> tag in the modal
        const figure = screen.getByRole('figure');

        const noteDescription = new RegExp(firstItem.note, 'i');

        const noteDate = new RegExp(`Datada ${firstItem.dateTime}`, 'i');

        // checks that description corresponds to correct note
        expect(
            within(figure).queryByText(noteDescription),
        ).toBeInTheDocument();

        // checks that date correspond to correct note
        expect(within(figure).queryByText(noteDate)).toBeInTheDocument();

        // closes modal by pressing <ESC> key
        userEvent.keyboard('{esc}');

        expect(modalTitle).not.toBeInTheDocument();

        fireEvent.click(deleteButton);

        // closes modal by pressing the X button
        const closeModalButton = screen.getByRole('button', {
            name: /fechar/i,
        });

        fireEvent.click(closeModalButton);

        expect(modalTitle).not.toBeInTheDocument();

        fireEvent.click(deleteButton);

        // closes modal by pressing 'cancelar' button
        const cancelButton = screen.getByRole('button', {
            name: /cancelar/i,
        });

        fireEvent.click(cancelButton);

        expect(modalTitle).not.toBeInTheDocument();
    });

    test('Confirming deletion removes note from listing and calls localStorage.setItem accordingly', () => {
        const itemsBeforeDeletion = JSON.stringify([
            {
                note: 'I am a note that will be deleted',
                dateTime: '20/01/2022 16:27',
                id: 1,
            },
            {
                note: 'I will persist',
                dateTime: '20/01/2022 16:27',
                id: 2,
            },
        ]);

        const itemsAfterDeletion = JSON.stringify([
            {
                note: 'I will persist',
                dateTime: '20/01/2022 16:27',
                id: 2,
            },
        ]);

        localStorage.setItem('items', itemsBeforeDeletion);

        render(<App />);

        const items = JSON.parse(localStorage.getItem('items'));
        const firstItem = items[0];

        const rowToDelete = screen.queryByTestId(`row-${firstItem.id}`);

        // checks that the row containing the note, in fact, exists
        expect(rowToDelete).toBeInTheDocument();

        const deleteButton = screen.getByTestId(
            `delete-btn-${firstItem.id}`,
        );

        fireEvent.click(deleteButton);

        const confirmDeleteButton = screen.getByRole('button', {
            name: /deletar nota/i,
        });

        fireEvent.click(confirmDeleteButton);

        // checks that note has been removed from list
        expect(rowToDelete).not.toBeInTheDocument();

        // checks that localStorage.setItem has been called without the deleted note
        expect(localStorage.setItem).toHaveBeenCalledWith(
            'items',
            itemsAfterDeletion,
        );
    });
});
