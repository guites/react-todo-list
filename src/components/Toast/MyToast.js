import { useEffect, useState } from 'react';
import Toast from 'react-bootstrap/Toast';
import ProgressBar from 'react-bootstrap/ProgressBar';

export const MyToast = ({ mode, onClose, message, title, progress }) => {
    //TODO #2 getting many rerenders of this components, must bring back useMemo
    const [currProg, setCurrProg] = useState(0);
    const [toastVariant, setToastVariant] = useState(mode);

    useEffect(() => {
        const interval = setInterval(() => {
            if (parseInt(currProg) >= 100)
                return setToastVariant('warning');
            setCurrProg(parseInt(currProg) + 2);
        }, 100);
        return () => clearInterval(interval);
    });

    return (
        <Toast
            show={toastVariant !== 'warning'}
            bg={toastVariant}
            onClose={onClose}
        >
            <Toast.Header>
                <img
                    src="holder.js/20x20?text=%20"
                    className="rounded me-2"
                    alt=""
                />
                <strong className="me-auto text-dark">{title}</strong>
            </Toast.Header>
            <Toast.Body>
                <p style={mode === 'success' ? { color: '#000' } : ''}>
                    {message}
                </p>
            </Toast.Body>
            {progress && (
                <ProgressBar
                    style={{
                        borderRadius: '0',
                        transition: 'width 0 linear',
                        transitionDelay: '0',
                    }}
                    animated
                    variant={toastVariant}
                    now={currProg}
                />
            )}
        </Toast>
    );
};
