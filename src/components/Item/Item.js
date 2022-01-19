export const Item = ({ item }) => {
    return (
        <tr>
            <td>{item.id}</td>
            <td>{item.date}</td>
            <td>{item.note}</td>
        </tr>
    );
};
