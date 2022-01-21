import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { NotesForm } from 'components';

export const EditNoteModal = ({
    item,
    onClose,
    duplicatedError,
    updatedNote,
}) => {
    const handleClose = () => {
        onClose();
    };
    const createdNote = n => {
        updatedNote(n);
    };
    return (
        <Modal
            data-testid="edit-note-modal"
            show="true"
            onHide={handleClose}
        >
            <Modal.Header closeButton closeLabel="Fechar">
                <Modal.Title data-testid="edit-note-modal-title">
                    Editar anotação #{item.id}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <NotesForm
                    duplicatedError={duplicatedError}
                    createdNote={n => createdNote(n)}
                    editNote={item}
                />
            </Modal.Body>
        </Modal>
    );
};
