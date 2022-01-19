import { List, Form } from 'components';
import { useState } from 'react';

export const App = () => {
    const [items, setItems] = useState([]);
    const [note, setNote] = useState('');
    const [noteStatus, setNoteStatus] = useState({});

    const createNote = n => {
        const newDateTime = new Date();
        const dateOnly = new Intl.DateTimeFormat('pt-br').format(
            newDateTime,
        );
        const newNote = {
            id: items.length + 1,
            note: n,
            date: new Intl.DateTimeFormat('pt-br', {
                dateStyle: 'short',
                timeStyle: 'short',
            }).format(newDateTime),
        };
        const newItems = items.slice();
        const duplicates = newItems.filter(
            item =>
                item.note.trim() === newNote.note.trim() &&
                item.date.replace(/\s\d{2}:\d{2}/g, '') === dateOnly,
        );
        if (duplicates.length > 0) {
            setNoteStatus({
                status: 'red',
                message: `Já existe uma anotação igual à esta para o dia ${dateOnly}`,
            });
            return;
        }
        setItems([...newItems, newNote]);
        setNoteStatus({
            status: 'green',
            message: 'Anotação criada com sucesso!',
        });
    };

    return (
        <div>
            <header>
                <h1>Anotações na web</h1>
                <Form
                    noteStatus={noteStatus}
                    note={note}
                    noteDescription={val => {
                        if (val !== '') setNoteStatus('');
                        setNote(val);
                    }}
                    createNote={n => createNote(n)}
                />
            </header>
            <main>
                <List items={items} />
            </main>
        </div>
    );
};
