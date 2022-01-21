import { useMemo } from 'react';
import Toast from 'react-bootstrap/Toast';
import ProgressBar from 'react-bootstrap/ProgressBar';

export const MyToast = ({ mode, onClose, message, title, progress }) => {
    return (
        <Toast bg={mode} onClose={onClose}>
            <Toast.Header>
                <img
                    src="holder.js/20x20?text=%20"
                    className="rounded me-2"
                    alt=""
                />
                <strong className="me-auto text-dark">{title}</strong>
                <small
                    style={
                        mode === 'success'
                            ? { color: 'rgb(71 77 82)' }
                            : ''
                    }
                >
                    11 mins ago
                </small>
            </Toast.Header>
            <Toast.Body>
                <p style={mode === 'success' ? { color: '#000' } : ''}>
                    {message}
                </p>
            </Toast.Body>
            <ProgressBar
                style={{ borderRadius: '0' }}
                animated
                variant={mode}
                now={100}
            />
        </Toast>
    );
};
