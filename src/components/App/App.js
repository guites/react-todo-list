import { List, AddForm, EditNoteModal } from 'components';
import { useState } from 'react';
import Container from 'react-bootstrap/Container';

export const App = () => {
    const [items, setItems] = useState(
        JSON.parse(localStorage.getItem('items')) || [],
    );
    const [duplicatedError, setDuplicatedError] = useState(false);
    const [duplicatedEditError, setDuplicatedEditError] = useState(false);
    const [isEditingNote, setIsEditingNote] = useState(false);

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

    const updatedNote = updatedNote => {
        const newItems = items.slice();
        const updatedNoteDate = updatedNote.date.replace(
            /\s\d{2}:\d{2}/g,
            '',
        );
        const duplicates = newItems.filter(
            item =>
                item.note.trim() === updatedNote.note.trim() &&
                item.date.replace(/\s\d{2}:\d{2}/g, '') ===
                    updatedNoteDate,
        );
        if (duplicates.length > 0) {
            setDuplicatedEditError({
                ...updatedNote,
                date: updatedNoteDate,
            });
            return;
        }
        setDuplicatedEditError({});
    };

    const handleEdit = item => {
        console.log(item);
        setIsEditingNote(item);
    };

    const handleDelete = item => {
        console.log(item);
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
                <List
                    onEditClick={handleEdit}
                    onDeleteClick={handleDelete}
                    items={items}
                />
            </Container>
            {isEditingNote && (
                <EditNoteModal
                    duplicatedError={duplicatedEditError}
                    onClose={() => setIsEditingNote(false)}
                    item={isEditingNote}
                    updatedNote={n => updatedNote(n)}
                />
            )}
        </div>
    );
};
