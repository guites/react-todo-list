import { List, AddForm } from 'components';
import { useState } from 'react';
import Container from 'react-bootstrap/Container';

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
                status: 'text-danger',
                message: `Já existe uma anotação igual à esta para o dia ${dateOnly}`,
            });
            return;
        }
        setItems([...newItems, newNote]);
        setNoteStatus({
            status: 'text-success',
            message: 'Anotação criada com sucesso!',
        });
    };

    return (
        <div>
            <Container as="header" className="mb-5">
                <h1 className="h2">Criar anotação</h1>
                <AddForm
                    noteStatus={noteStatus}
                    note={note}
                    updateNoteDescription={val => {
                        if (val !== '') setNoteStatus({});
                        setNote(val);
                    }}
                    createNote={n => createNote(n)}
                />
            </Container>
            <Container as="main">
                <h2 className="h3">Anotações</h2>
                <List items={items} />
            </Container>
        </div>
    );
};
