import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { AddForm } from 'components';

export const EditNoteModal = ({
    item,
    onClose,
    duplicatedError,
    updatedNote,
}) => {
    const handleClose = () => onClose();
    const createdNote = n => {
        updatedNote(n);
    };
    return (
        <Modal
            data-testid="edit-note-modal"
            show="true"
            onHide={handleClose}
        >
            <Modal.Header closeButton>
                <Modal.Title>Editar anotação #{item.id}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {/* This should just render a <NotesForm/> component */}
                <AddForm
                    duplicatedError={duplicatedError}
                    createdNote={n => createdNote(n)}
                    editNote={item}
                />
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleClose}>
                    Save Changes
                </Button>
            </Modal.Footer>
        </Modal>
    );
};
