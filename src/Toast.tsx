/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import { Message } from 'semantic-ui-react';

const Toast = ({
	header,
	message,
	delay,
	onHide,
	error,
}: {
	header?: string;
	message?: string;
	delay: number;
	onHide: () => void;
	error?: boolean;
}) => {
	const [show, setShow] = useState(false);
	let timeoutId: null | ReturnType<typeof setTimeout> = null;

	useEffect(() => {
		if (message) setShow(true);
	}, [message]);

	useEffect(() => {
		if (timeoutId) clearTimeout(timeoutId || undefined);

		timeoutId = setTimeout(() => {
			setShow(false);
			onHide();
		}, delay);
	}, [show]);

	return show ? (
		<ToastContainer duration={delay / 1000}>
			<Message info={!error} error={error} header={header} content={message} />
		</ToastContainer>
	) : null;
};

const fadeInOut = keyframes({
	'0%': { opacity: 0 },
	'10%': { opacity: 1 },
	'90%': { opacity: 1 },
	'100%': { opacity: 0 },
});

type ToastProps = {
	duration: number;
};

const ToastContainer = styled.div<ToastProps>(({ duration }) => ({
	position: 'absolute',
	top: 70,
	right: 5,
	animation: `${fadeInOut} ${duration}s linear`,
}));

Toast.defaultProps = {
	header: '',
	message: '',
	error: false,
};

export default Toast;
