import { List, Form } from 'components';
import { useState } from 'react';

export const App = () => {
    const [items, setItems] = useState([]);
    const [note, setNote] = useState('');

    const createNote = n => {
        const newNote = {
            id: items.length + 1,
            note: n,
            date: new Intl.DateTimeFormat('pt-br', {
                dateStyle: 'short',
                timeStyle: 'short',
            }).format(new Date()),
        };
        const newItems = items.slice();
        setItems([...newItems, newNote]);
    };

    return (
        <div>
            <header>
                <h1>Anotações na web</h1>
                <Form
                    note={note}
                    noteDescription={val => setNote(val)}
                    createNote={n => createNote(n)}
                />
            </header>
            <main>
                <List items={items} />
            </main>
        </div>
    );
};
