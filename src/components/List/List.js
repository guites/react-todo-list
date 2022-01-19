import { Item } from 'components';
import styles from './styles.module.css';

export const List = ({ items }) => {
    return (
        <div>
            <h2>Anotações existentes</h2>
            <ul className={styles.list}>
                <li className="listItem">
                    <div className="listLeft">Data</div>
                    <div className="listRight">Nota</div>
                </li>
                {items.map(item => (
                    <Item key={item.id} item={item} />
                ))}
            </ul>
        </div>
    );
};
