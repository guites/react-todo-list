import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';

import { useState, useRef, useEffect } from 'react';
export const AddForm = ({
    note,
    noteDescription,
    createNote,
    noteStatus,
}) => {
    const [validationError, setValidationError] = useState('');
    const inputEl = useRef(null);

    useEffect(() => {
        if (typeof noteStatus === 'object') {
            if (noteStatus.status === 'text-success') {
                inputEl.current.value = '';
                noteDescription('');
            }
            if (noteStatus.status === 'text-danger')
                inputEl.current.focus();
        }
    }, [noteStatus]);

    const validateNote = val => {
        if (val.length > 0) {
            setValidationError('');
            return true;
        }
        setValidationError('Preencha a descrição!');
        inputEl.current.focus();
        return false;
    };

    const emitNote = e => {
        e.preventDefault();
        if (validateNote(note)) {
            createNote(note);
        }
    };

    // todo: find a way to keep only one validation error at a time. this way i dont have
    // to dismiss noteStatus when submitting the form, and instead wait until another action is taken
    // another error pops for the 'success' msg to go away
    return (
        <Form onSubmit={emitNote}>
            <Form.Group className="mb-3" controlId="note">
                <Form.Label>Anotação</Form.Label>
                <Form.Control
                    as="textarea"
                    placeholder="Descreva sua anotação..."
                    ref={inputEl}
                    onChange={e => {
                        const val = e.target.value;
                        noteDescription(val);
                        validateNote(val);
                    }}
                />
            </Form.Group>
            <Container style={{ minHeight: '25px' }} className="mb-2">
                {validationError !== '' && (
                    <Row className="text-center">
                        <small className="text-danger">
                            {validationError}
                        </small>
                    </Row>
                )}
                {noteStatus.status && (
                    <Row className="text-center">
                        <small className={noteStatus.status}>
                            {noteStatus.message}
                        </small>
                    </Row>
                )}
            </Container>
            <Container className="text-center">
                <Button className="block" variant="primary" type="submit">
                    Criar anotação
                </Button>
            </Container>
        </Form>
    );
};
