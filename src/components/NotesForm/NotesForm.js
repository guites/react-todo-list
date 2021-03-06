import PropTypes from 'prop-types';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import {
    getCurrentTime,
    getCurrentDate,
    formatForDateInput,
    formatForTimeInput,
    formatAsBrDate,
} from 'shared';

import { useState, useRef, useEffect } from 'react';

export const NotesForm = ({ createdNote, duplicatedError, editNote }) => {
    const [id] = useState(editNote?.id || null);
    const [note, setNote] = useState(editNote?.note || '');
    const [date, setDate] = useState(
        formatForDateInput(editNote?.dateTime),
    );
    const [time, setTime] = useState(
        formatForTimeInput(editNote?.dateTime),
    );
    const [status, setStatus] = useState({});
    const inputEl = useRef(null);
    const timeEl = useRef(null);
    const dateEl = useRef(null);

    const emitNote = e => {
        e.preventDefault();
        if (validateNote(note) && validateDateTime()) {
            createNote(note);
        }
    };

    const createNote = n => {
        const newNote = {
            note: n,
            dateTime: formatAsBrDate(date) + ' ' + time,
        };
        if (editNote) newNote.id = id;
        createdNote(newNote);
    };

    useEffect(() => {
        if (duplicatedError === false) return;
        const hasError = Object.keys(duplicatedError).length > 0;
        setStatus({
            status: hasError ? 'text-danger' : 'text-success',
            message: hasError
                ? `Anotação duplicada para o dia ${duplicatedError.dateTime}`
                : editNote
                ? 'Anotação atualizada com sucesso!'
                : 'Anotação criada com sucesso!',
        });
    }, [duplicatedError]);

    useEffect(() => {
        if (typeof status === 'object') {
            if (status.status === 'text-success') {
                if (!editNote) {
                    setNote('');
                    setDate(getCurrentDate());
                    setTime(getCurrentTime());
                }
            }
        }
    }, [status]);

    // prevents message from a an edit modal
    // showing on another item's modal
    useEffect(() => {
        setStatus({});
        if (editNote) {
            // sets focus to text area and sets cursor to end
            // of existing text
            inputEl.current.focus();
            inputEl.current.selectionStart = inputEl.current.value.length;
        }
    }, []);

    const validateNote = val => {
        if (val.length > 0) {
            setStatus({});
            return true;
        }
        setStatus({
            status: 'text-danger',
            message: 'Preencha a descrição!',
        });
        inputEl.current.focus();
        return false;
    };

    const validateDateTime = () => {
        const s = {
            status: 'text-danger',
        };
        if (date === '') {
            s.message = 'Preencha a data!';
            dateEl.current.focus();
            setStatus(s);
            return false;
        }
        if (time === '') {
            // TODO #11 validate that time is correctly formatted, ex using regex /\d{2}\/\d{2}\/\d{4}\s\d{2}:\d{2}/.test(time)
            s.message = 'Preencha a hora!';
            timeEl.current.focus();
            setStatus(s);
            return false;
        }
        setStatus({});
        return true;
    };

    return (
        <Form onSubmit={emitNote} data-testid="add-note-form">
            <Row>
                <Col>
                    <Form.Group
                        className="mb-3"
                        controlId={editNote ? `date-edit` : 'date'}
                    >
                        <Form.Label>Data</Form.Label>
                        <Form.Control
                            ref={dateEl}
                            value={date}
                            type="date"
                            onChange={e => {
                                let val = e.target.value;
                                setDate(val);
                            }}
                        />
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group
                        className="mb-3"
                        controlId={editNote ? `time-edit` : 'time'}
                    >
                        <Form.Label>Hora</Form.Label>
                        <Form.Control
                            ref={timeEl}
                            value={time}
                            onBlur={e => {
                                if (e.currentTarget.value === '')
                                    editNote
                                        ? setTime(
                                              formatForTimeInput(
                                                  editNote.dateTime,
                                              ),
                                          )
                                        : setTime(getCurrentTime());
                            }}
                            onChange={e => {
                                e.currentTarget.maxLength = 5;
                                let val = e.currentTarget.value;
                                val = val.replace(/\D/g, '');
                                val = val.replace(
                                    /(\d{2})(\d{1,2})/,
                                    '$1:$2',
                                );
                                setTime(val);
                            }}
                        />
                    </Form.Group>
                </Col>
            </Row>
            <Form.Group
                className="mb-3"
                controlId={editNote ? `note-edit` : 'note'}
            >
                <Form.Label>Anotação</Form.Label>
                <Form.Control
                    as="textarea"
                    placeholder="Descreva sua anotação..."
                    ref={inputEl}
                    value={note}
                    onChange={e => {
                        const val = e.target.value;
                        setNote(val);
                        validateNote(val);
                    }}
                />
            </Form.Group>
            <Container style={{ minHeight: '25px' }} className="mb-2">
                {status.status && (
                    <Row className="text-center">
                        <small
                            data-testid={
                                status.status === 'text-danger'
                                    ? 'validation-error'
                                    : 'validation-success'
                            }
                            className={status.status}
                        >
                            {status.message}
                        </small>
                    </Row>
                )}
            </Container>
            <Container className="text-center">
                <Button className="block" variant="primary" type="submit">
                    {editNote ? 'Atualizar anotação' : 'Criar anotação'}
                </Button>
            </Container>
        </Form>
    );
};

NotesForm.propTypes = {
    createdNote: PropTypes.func,
    duplicatedError: PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.object,
    ]),
};

NotesForm.defaultProps = {
    duplicatedError: false,
    createdNote: () => {},
};
