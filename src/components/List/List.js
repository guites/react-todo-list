import { useState, useEffect, useCallback } from 'react';
import { Item } from 'components';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import {
    formatForDateInput,
    formatForTimeInput,
    capitalize,
} from 'shared';

export const List = ({ items, onEditClick, onDeleteClick }) => {
    const [listItems, setListItems] = useState([]);
    const [orderBy, setOrderBy] = useState('id');
    const [order, setOrder] = useState('asc');

    const orderHandler = {
        orderByDate: (a, b, _order) => {
            const aDate = new Date(
                formatForDateInput(a.date) +
                    ' ' +
                    formatForTimeInput(a.date),
            );
            const bDate = new Date(
                formatForDateInput(b.date) +
                    ' ' +
                    formatForTimeInput(b.date),
            );
            if (_order === 'desc') return bDate - aDate;
            return aDate - bDate;
        },
        orderById: (a, b, _order) => {
            if (_order === 'asc') return b.id - a.id;
            return a.id - b.id;
        },
    };

    const changeOrder = (_orderBy, _order, _listItems, shouldSort) => {
        let newOrder;
        if (shouldSort !== false) {
            newOrder = _order === 'asc' ? 'desc' : 'asc';
        } else {
            newOrder = _order;
        }
        const newOrderBy = _orderBy;
        const newList = _listItems.slice();
        newList.sort((a, b) => {
            const res = orderHandler[`orderBy${capitalize(_orderBy)}`](
                a,
                b,
                newOrder,
            );
            return res;
        });
        return { newList, newOrderBy, newOrder };
    };

    const sortAndSetState = (_orderBy, _order, _listItems, _sort) => {
        const sortedList = changeOrder(
            _orderBy,
            _order,
            _listItems,
            _sort,
        );
        setListItems(sortedList.newList);
        setOrderBy(sortedList.newOrderBy);
        setOrder(sortedList.newOrder);
    };

    useEffect(() => {
        const _items = items.slice();
        sortAndSetState(orderBy, order, _items, false);
    }, [items]);

    return (
        <Table className="table-hover">
            <caption>Lista de anotações existentes </caption>
            <thead>
                <tr>
                    <th>
                        <Button
                            onClick={() => {
                                sortAndSetState('id', order, listItems);
                            }}
                            className="text-dark ps-0 pe-4 pb-0 pt-0"
                            variant="link"
                        >
                            #
                        </Button>
                    </th>
                    <th>
                        <Button
                            onClick={() => {
                                sortAndSetState('date', order, listItems);
                            }}
                            className="text-dark ps-0 pe-4 pb-0 pt-0"
                            variant="link"
                        >
                            Data
                        </Button>
                    </th>
                    <th>Nota</th>
                    <th>Editar</th>
                    <th>Deletar</th>
                </tr>
            </thead>
            <tbody>
                {listItems.map(item => (
                    <tr
                        data-testid={'row-' + item.id}
                        key={'row-' + item.id}
                    >
                        <Item
                            item={item}
                            editFn={onEditClick}
                            deleteFn={onDeleteClick}
                        />
                    </tr>
                ))}
            </tbody>
        </Table>
    );
};
