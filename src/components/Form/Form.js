export const Form = ({ note, noteDescription, createNote }) => {
    const validateNote = e => {
        e.preventDefault();
        if (note.length > 0) {
            createNote(note);
        }
    };
    return (
        <form onSubmit={validateNote}>
            <label htmlFor="note">Anotação</label>
            <textarea
                placeholder="Descreva sua anotação..."
                id="note"
                type="text"
                onChange={e => noteDescription(e.target.value)}
            />
            <input type="submit" value="Criar anotação" />
        </form>
    );
};
