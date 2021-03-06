import {
    List,
    NotesForm,
    EditNoteModal,
    ConfirmDeleteModal,
    ToastPortal,
} from 'components';
import { useState, useRef, useEffect } from 'react';
import Container from 'react-bootstrap/Container';

export const App = () => {
    const [items, setItems] = useState([]);
    const [duplicatedError, setDuplicatedError] = useState(false);
    const [duplicatedEditError, setDuplicatedEditError] = useState(false);
    const [isEditingNote, setIsEditingNote] = useState(false);
    const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
    // toast related definitions
    const toastRef = useRef();
    const [autoCloseToasts, setAutoCloseToasts] = useState([]);
    const addToast = (_mode, _text, _title) => {
        const toastId = toastRef.current.addMessage({
            mode: _mode,
            title: _title,
            message: _text,
        });
        return toastId;
    };

    useEffect(() => {
        const itemsInStorage = localStorage.getItem('items');
        // adapted from https://stackoverflow.com/a/3710226/14427854
        let itemsArray;
        try {
            itemsArray = JSON.parse(itemsInStorage);
        } catch (e) {
            itemsArray = false;
        }
        // prevents app from breaking if localStorage.getItem('items') is invalid json
        if (itemsArray && Array.isArray(itemsArray)) {
            // filters badly formatted note objects
            itemsArray = itemsArray.filter(
                item =>
                    item.hasOwnProperty('id') &&
                    !isNaN(Number(item.id)) &&
                    item.hasOwnProperty('note') &&
                    item.hasOwnProperty('dateTime') &&
                    /\d{2}\/\d{2}\/\d{4}\s\d{2}:\d{2}/.test(item.dateTime),
            );
            return setItems(itemsArray);
        }
        return [];
    }, []);

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
            setDuplicatedError({ ...newNote, dateTime: newNoteDate });
            return;
        }
        setDuplicatedError({});
        const biggestItemId =
            newItems.length === 0
                ? 0
                : Math.max.apply(
                      Math,
                      newItems.map(function (_item) {
                          return _item.id;
                      }),
                  );
        newItems.push({ ...newNote, id: biggestItemId + 1 });
        localStorage.setItem('items', JSON.stringify(newItems));
        setItems(newItems);
        const toastId = addToast(
            'success',
            `Voc?? criou a nota #${biggestItemId + 1}!`,
            `Nota registrada!`,
        );
        setAutoCloseToasts([
            ...autoCloseToasts,
            { shouldAutoClose: true, toastId: toastId },
        ]);
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
        const toastId = addToast(
            'info',
            `Voc?? editou a nota #${updatedNote.id}!`,
            `Nota atualizada!`,
        );
        setAutoCloseToasts([
            ...autoCloseToasts,
            { shouldAutoClose: true, toastId: toastId },
        ]);
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
        const toastId = addToast(
            'danger',
            `Voc?? deletou a nota #${item.id} datada ${item.dateTime}`,
            `Nota deletada!`,
        );
        setAutoCloseToasts([
            ...autoCloseToasts,
            { shouldAutoClose: true, toastId: toastId },
        ]);
        // TODO #4 implementation: soft delete notes and show option to undo removal/list deleted notes
    };

    //TODO #6 search note by text/date
    return (
        <div>
            <Container as="header" className="mb-5">
                <h1 className="h2">Criar anota????o</h1>
                <NotesForm
                    duplicatedError={duplicatedError}
                    createdNote={n => createdNote(n)}
                />
            </Container>
            <Container as="main">
                <h2 className="h3">Anota????es</h2>
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
            <ToastPortal ref={toastRef} autoClose={autoCloseToasts} />
        </div>
    );
};
