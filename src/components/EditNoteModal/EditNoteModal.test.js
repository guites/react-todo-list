import { fireEvent, render, screen } from '@testing-library/react';
import { EditNoteModal } from './EditNoteModal';

test('Calls close function when close button is clicked', () => {
    const item = {
        id: 1,
        dateTime: '19/01/2022 22:54',
        note: 'A note taken for testing!',
    };

    const onClose = jest.fn();

    render(<EditNoteModal onClose={onClose} item={item} />);

    const closeBtn = screen.queryByRole('button', { name: /fechar/i });

    fireEvent.click(closeBtn);

    expect(onClose).toHaveBeenCalled();
});

test('Modal shows correct item id', () => {
    const item = {
        id: 1234,
        dateTime: '19/01/2022 22:54',
        note: 'editar anotação #1234',
    };

    render(<EditNoteModal item={item} />);

    // cannot query by text as setting note to the
    // expected title text would cause test to fail
    const modalTitle = screen.queryByTestId('edit-note-modal-title');

    expect(modalTitle).toBeInTheDocument();

    expect(modalTitle).toHaveTextContent(`Editar anotação #${item.id}`);
});
