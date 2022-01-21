import { render, screen, fireEvent } from '@testing-library/react';
import { Item } from './Item';

test('Fires the EDIT function when edit button is clicked', async () => {
    const item = { note: 'Now go', date: '20/01/2022 16:27', id: 1 };

    const editFn = jest.fn();

    render(<Item item={item} editFn={editFn} />);

    const editBtn = screen.getByTestId(`edit-btn-${item.id}`);

    fireEvent.click(editBtn);

    expect(editFn).toHaveBeenCalledWith(item);
});

test('Fires the DELETE function when delete button is clicked', async () => {
    const item = { note: 'Now go', date: '20/01/2022 16:27', id: 1 };

    const deleteFn = jest.fn();

    render(<Item item={item} deleteFn={deleteFn} />);

    const deletetBtn = screen.getByTestId(`delete-btn-${item.id}`);

    fireEvent.click(deletetBtn);

    expect(deleteFn).toHaveBeenCalledWith(item);
});
