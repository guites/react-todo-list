import { useState, useRef, useEffect } from 'react';
export const Form = ({
    note,
    noteDescription,
    createNote,
    noteStatus,
}) => {
    const [validationError, setValidationError] = useState('');
    const inputEl = useRef(null);

    useEffect(() => {
        if (typeof noteStatus === 'object') {
            if (noteStatus.status === 'green') {
                inputEl.current.value = '';
                noteDescription('');
            }
            if (noteStatus.status === 'red') inputEl.current.focus();
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
            <div className="errors-wrapper">
                {validationError !== '' && (
                    <small className="red">{validationError}</small>
                )}
                {noteStatus.status && (
                    <small className={noteStatus.status}>
                        {noteStatus.message}
                    </small>
                )}
            </div>
            <input type="submit" value="Criar anotação" />
        </form>
    );
};
