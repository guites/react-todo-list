import {
    render,
    screen,
    fireEvent,
    waitFor,
} from '@testing-library/react';
import { App } from './App';

test('Shows edit modal when edit button is clicked', () => {
    localStorage.setItem(
        'items',
        '[{"note":"Now go","date":"20/01/2022 16:27","id":1},{"note":"asdasd","date":"20/01/2022 16:27","id":2}]',
    );

    const items = JSON.parse(localStorage.getItem('items'));
    const firstItem = items[0];

    render(<App />);

    expect(
        screen.queryByTestId('edit-note-modal'),
    ).not.toBeInTheDocument();

    fireEvent.click(screen.getByTestId(`edit-btn-${firstItem.id}`));

    expect(screen.queryByTestId('edit-note-modal')).toBeInTheDocument();
});
