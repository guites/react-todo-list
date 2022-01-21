import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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

test('Closes edit modal by pressing esc', () => {
    localStorage.setItem(
        'items',
        '[{"note":"Now go","date":"20/01/2022 16:27","id":1},{"note":"asdasd","date":"20/01/2022 16:27","id":2}]',
    );

    const items = JSON.parse(localStorage.getItem('items'));
    const firstItem = items[0];

    render(<App />);

    fireEvent.click(screen.getByTestId(`edit-btn-${firstItem.id}`));

    expect(screen.queryByTestId('edit-note-modal')).toBeInTheDocument();

    userEvent.keyboard('{esc}');

    expect(
        screen.queryByTestId('edit-note-modal'),
    ).not.toBeInTheDocument();
});

test('Closes edit modal by pressing close button', () => {
    localStorage.setItem(
        'items',
        '[{"note":"Now go","date":"20/01/2022 16:27","id":1},{"note":"asdasd","date":"20/01/2022 16:27","id":2}]',
    );

    const items = JSON.parse(localStorage.getItem('items'));
    const firstItem = items[0];

    render(<App />);

    fireEvent.click(screen.getByTestId(`edit-btn-${firstItem.id}`));

    expect(screen.queryByTestId('edit-note-modal')).toBeInTheDocument();

    const closeBtn = screen.queryByRole('button', { name: /fechar/i });

    expect(closeBtn).toBeInTheDocument();

    fireEvent.click(closeBtn);

    expect(
        screen.queryByTestId('edit-note-modal'),
    ).not.toBeInTheDocument();
});
