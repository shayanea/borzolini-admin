
import { useEffect } from 'react';

const ForceError = () => {
	useEffect(() => {
		throw new Error('This is a test error to demonstrate the Error Boundary UI.');
	}, []);

	return <div className="p-8 text-center">Loading crash test...</div>;
};

export default ForceError;
