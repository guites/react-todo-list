import { Item } from 'components';
import Table from 'react-bootstrap/Table';

export const List = ({ items }) => {
    return (
        <Table>
            <caption>Lista de anotações existentes </caption>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Data</th>
                    <th>Nota</th>
                </tr>
            </thead>
            <tbody>
                {items.map(item => (
                    <Item key={item.id} item={item} />
                ))}
            </tbody>
        </Table>
    );
};
