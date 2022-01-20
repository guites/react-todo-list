import { List, AddForm } from 'components';
import { useState } from 'react';
import Container from 'react-bootstrap/Container';

export const App = () => {
    const [items, setItems] = useState(
        JSON.parse(localStorage.getItem('items')) || [],
    );
    const [duplicatedError, setDuplicatedError] = useState(false);

    const createdNote = newNote => {
        const newItems = items.slice();
        const newNoteDate = newNote.date.replace(/\s\d{2}:\d{2}/g, '');
        const duplicates = newItems.filter(
            item =>
                item.note.trim() === newNote.note.trim() &&
                item.date.replace(/\s\d{2}:\d{2}/g, '') === newNoteDate,
        );
        if (duplicates.length > 0) {
            setDuplicatedError({ ...newNote, date: newNoteDate });
            return;
        }
        setDuplicatedError({});
        newItems.push({ ...newNote, id: newItems.length + 1 });
        localStorage.setItem('items', JSON.stringify(newItems));
        setItems(newItems);
    };

    return (
        <div>
            <Container as="header" className="mb-5">
                <h1 className="h2">Criar anotação</h1>
                <AddForm
                    duplicatedError={duplicatedError}
                    createdNote={n => createdNote(n)}
                />
            </Container>
            <Container as="main">
                <h2 className="h3">Anotações</h2>
                <List items={items} />
            </Container>
        </div>
    );
};
