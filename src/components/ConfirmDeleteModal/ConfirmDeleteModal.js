import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

export const ConfirmDeleteModal = ({ item, onClose, confirmDelete }) => {
    const handleClose = () => {
        onClose();
    };
    return (
        <Modal
            data-testid="delete-note-modal"
            show="true"
            onHide={handleClose}
        >
            <Modal.Header closeButton closeLabel="Fechar">
                <Modal.Title data-testid="delete-note-modal-title">
                    Deletar anotação #{item.id}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>Você escolheu deletar a nota:</p>
                <figure>
                    <blockquote className="blockquote">
                        {item.note}
                    </blockquote>
                    <figcaption className="blockquote-footer">
                        Datada {item.dateTime}
                    </figcaption>
                </figure>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={handleClose} variant="secondary">
                    Cancelar
                </Button>
                <Button
                    onClick={() => confirmDelete(item)}
                    variant="primary"
                >
                    Deletar Nota
                </Button>
            </Modal.Footer>
        </Modal>
    );
};
