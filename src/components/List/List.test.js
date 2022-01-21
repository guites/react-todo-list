import { render, screen } from '@testing-library/react';
import { List } from './List';

test('Renders list of notes', async () => {
    const items = [
        { note: 'Now go', date: '20/01/2022 16:27', id: 1 },
        { note: 'asdasd', date: '20/01/2022 16:27', id: 2 },
        { note: 'Ok boys', date: '20/01/2022 16:27', id: 3 },
    ];

    render(<List items={items} />);

    let row;
    for (let i = 0; i < items.length; i++) {
        row = screen.getByTestId(`row-${items[i].id}`);
        expect(row).toHaveTextContent(items[i].note);
        expect(row).toHaveTextContent(items[i].date);
    }
});
