import { useState, useRef } from 'react';
export const Form = ({ note, noteDescription, createNote }) => {
    const [validationError, setValidationError] = useState('');
    const inputEl = useRef(null);

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
            inputEl.current.value = '';
            noteDescription('');
        }
    };

    return (
        <form onSubmit={emitNote}>
            <label htmlFor="note">Anotação</label>
            <textarea
                ref={inputEl}
                placeholder="Descreva sua anotação..."
                id="note"
                type="text"
                onChange={e => {
                    const val = e.target.value;
                    noteDescription(val);
                    validateNote(val);
                }}
            />
            {validationError !== '' && (
                <small className="red">{validationError}</small>
            )}
            <input type="submit" value="Criar anotação" />
        </form>
    );
};
