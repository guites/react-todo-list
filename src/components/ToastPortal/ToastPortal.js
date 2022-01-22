import { uuid } from 'shared';
import ReactDOM from 'react-dom';
import { MyToast } from 'components';
import { useToastPortal, useToastAutoClose } from 'hooks';
import { useState, forwardRef, useImperativeHandle } from 'react';

/**
 * The parent of this component should not have
 * to worry about maintaining a list of message
 * objects. That would require the parent to
 * also manage the deletion of toasts, etc.
 *
 * To accommodate this, we are using a combination
 * of useImperativeHandle and forwardRef to give
 * the parent access to this component's addMessage
 * functionality.
 */

export const ToastPortal = forwardRef(
    ({ autoClose = {}, autoCloseTime = 10000 }, ref) => {
        const [toasts, setToasts] = useState([]);
        const { loaded, portalId } = useToastPortal();

        useToastAutoClose({
            toasts,
            setToasts,
            autoClose,
            autoCloseTime,
        });

        const removeToast = id => {
            setToasts(toasts.filter(t => t.id !== id));
        };

        useImperativeHandle(ref, () => ({
            addMessage(toast) {
                const toastId = uuid();
                setToasts([...toasts, { ...toast, id: toastId }]);
                return toastId;
            },
        }));

        return loaded ? (
            ReactDOM.createPortal(
                <div>
                    {toasts.map(t => (
                        <MyToast
                            key={t.id}
                            mode={t.mode}
                            progress={autoClose?.toastId === t.id}
                            message={t.message}
                            title={t.title}
                            onClose={() => removeToast(t.id)}
                        />
                    ))}
                </div>,

                document.getElementById(portalId),
            )
        ) : (
            <></>
        );
    },
);
