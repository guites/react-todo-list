import {
    List,
    NotesForm,
    EditNoteModal,
    ConfirmDeleteModal,
    ToastPortal,
} from 'components';
import { useState, useRef } from 'react';
import Container from 'react-bootstrap/Container';

export const App = () => {
    const [items, setItems] = useState(
        JSON.parse(localStorage.getItem('items')) || [],
    );
    const [duplicatedError, setDuplicatedError] = useState(false);
    const [duplicatedEditError, setDuplicatedEditError] = useState(false);
    const [isEditingNote, setIsEditingNote] = useState(false);
    const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
    // toast related definitions
    const toastRef = useRef();
    const [autoCloseToast, setAutoCloseToast] = useState({
        shouldAutoClose: false,
        toastId: null,
    });
    const addToast = (_mode, _text, _title) => {
        const toastId = toastRef.current.addMessage({
            mode: _mode,
            title: _title,
            message: _text,
        });
        return toastId;
    };

    const createdNote = newNote => {
        const newItems = items.slice();
        const newNoteDate = newNote.dateTime.replace(/\s\d{2}:\d{2}/g, '');
        const duplicates = newItems.filter(
            item =>
                item.note.trim() === newNote.note.trim() &&
                item.dateTime.replace(/\s\d{2}:\d{2}/g, '') ===
                    newNoteDate,
        );
        if (duplicates.length > 0) {
            setDuplicatedError({ ...newNote, date: newNoteDate });
            return;
        }
        setDuplicatedError({});
        //TODO #7 Duplicated ids being generated
        newItems.push({ ...newNote, id: newItems.length + 1 });
        localStorage.setItem('items', JSON.stringify(newItems));
        setItems(newItems);
    };

    const updatedNote = updatedNote => {
        const newItems = items.slice();
        const updatedNoteDate = updatedNote.dateTime.replace(
            /\s\d{2}:\d{2}/g,
            '',
        );
        const duplicates = newItems.filter(
            item =>
                item.note.trim() === updatedNote.note.trim() &&
                item.dateTime.replace(/\s\d{2}:\d{2}/g, '') ===
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
        for (let i = 0; i < newItems.length; i++) {
            if (newItems[i].id === updatedNote.id) {
                newItems[i].dateTime = updatedNote.dateTime;
                newItems[i].note = updatedNote.note;
                break;
            }
        }
        localStorage.setItem('items', JSON.stringify(newItems));
        setItems(newItems);
    };

    const handleEdit = item => {
        setIsEditingNote(item);
    };

    const handleDelete = item => {
        setIsConfirmingDelete(item);
    };

    const deleteItem = item => {
        const newItems = items.slice();
        const filteredItems = newItems.filter(i => i.id !== item.id);
        localStorage.setItem('items', JSON.stringify(filteredItems));
        setItems(filteredItems);
        setIsConfirmingDelete(false);
        //TODO #1 add a toast with deletion info (maybe auto closing?)
        const toastId = addToast(
            'success',
            `Você deletou a nota #${item.id} datada ${item.dateTime}`,
            `Nota deletada!`,
        );
        //TODO #3 glitch: progress bar only shows for latest toast
        setAutoCloseToast({ shouldAutoClose: true, toastId: toastId });
        // TODO #4 implementation: soft delete notes and show option to undo removal/list deleted notes
    };

    //TODO #6 search note by text/date
    return (
        <div>
            <Container as="header" className="mb-5">
                <h1 className="h2">Criar anotação</h1>
                <NotesForm
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
            {isConfirmingDelete && (
                <ConfirmDeleteModal
                    confirmDelete={i => deleteItem(i)}
                    onClose={() => setIsConfirmingDelete(false)}
                    item={isConfirmingDelete}
                />
            )}
            <ToastPortal ref={toastRef} autoClose={autoCloseToast} />
        </div>
    );
};
