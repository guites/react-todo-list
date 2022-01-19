export const Item = ({ item }) => {
    return (
        <li className="listItem">
            <div className="listLeft">{item.date}</div>
            <div className="listRight">{item.note}</div>
        </li>
    );
};
