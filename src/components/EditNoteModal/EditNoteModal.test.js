import { fireEvent, render, screen } from '@testing-library/react';
import { EditNoteModal } from './EditNoteModal';
import userEvent from '@testing-library/user-event';
import { formatForDateInput, formatForTimeInput } from 'shared';

let item;

beforeEach(() => {
    item = {
        id: 1,
        dateTime: '19/01/2022 22:54',
        note: 'A note taken for testing!',
    };
});

test('Calls close function when close button is clicked', () => {
    const onClose = jest.fn();

    render(<EditNoteModal onClose={onClose} item={item} />);

    const closeBtn = screen.queryByRole('button', { name: /fechar/i });

    fireEvent.click(closeBtn);

    expect(onClose).toHaveBeenCalled();
});

test('Calls close function by pressing esc', () => {
    const onClose = jest.fn();

    render(<EditNoteModal onClose={onClose} item={item} />);

    expect(screen.queryByTestId('edit-note-modal')).toBeInTheDocument();

    userEvent.keyboard('{esc}');

    expect(onClose).toHaveBeenCalled();
});

test('Modal shows correct item', () => {
    render(<EditNoteModal item={item} />);

    const timeValue = new RegExp(formatForTimeInput(item.dateTime), 'i');
    const dateValue = new RegExp(formatForDateInput(item.dateTime), 'i');

    // cannot query by text as setting note to the
    // expected title text would cause test to fail
    const modalTitle = screen.getByTestId('edit-note-modal-title');

    expect(modalTitle).toHaveTextContent(`Editar anotação #${item.id}`);

    screen.getByDisplayValue(timeValue);
    screen.getByDisplayValue(dateValue);
});
