import Button from 'react-bootstrap/Button';

export const Item = ({ item, editFn, deleteFn }) => {
    return (
        <>
            <td data-testid={'item-' + item.id}>{item.id}</td>
            <td>{item.date}</td>
            <td>{item.note}</td>
            <td>
                <Button
                    onClick={() => editFn(item)}
                    variant="secondary"
                    className="btn-sm"
                    data-testid={'edit-btn-' + item.id}
                >
                    Editar
                </Button>
            </td>
            <td>
                <Button
                    onClick={() => deleteFn(item)}
                    variant="danger"
                    className="btn-sm"
                    data-testid={'delete-btn-' + item.id}
                >
                    Deletar
                </Button>
            </td>
        </>
    );
};
