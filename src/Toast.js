import React, { useEffect, useRef, useState } from 'react';
import { keyframes } from '@emotion/core';
import styled from '@emotion/styled';
import { Message } from 'semantic-ui-react';

const Toast = ({ header, message, delay, onHide, error }) => {
	const [show, setShow] = useState(false);
	const timeoutRef = useRef(null);

	useEffect(() => {
		if (message) setShow(true);
	}, [message]);

	useEffect(() => {
		if (timeoutRef.current) clearTimeout(timeoutRef.current);

		timeoutRef.current = setTimeout(() => {
			setShow(false);
			onHide();
		}, delay);
	}, [show]);

	return (
		show && (
			<ToastContainer duration={delay / 1000}>
				<Message onDismiss={null} info={!error} error={error} header={header} content={message} />
			</ToastContainer>
		)
	);
};

const fadeInOut = keyframes({
	'0%': { opacity: 0 },
	'10%': { opacity: 1 },
	'90%': { opacity: 1 },
	'100%': { opacity: 0 },
});

const ToastContainer = styled.div(({ duration }) => ({
	position: 'absolute',
	top: 70,
	right: 0,
	animation: `${fadeInOut} ${duration}s linear`,
}));

export default Toast;
