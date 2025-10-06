import React from 'react';
import { SpinnerIcon, CheckCircleIcon, ExclamationCircleIcon } from '../Icons';

type TestStatus = 'idle' | 'testing' | 'success' | 'error';

interface TestResultIndicatorProps {
    status: TestStatus;
    error?: string;
}

const TestResultIndicator: React.FC<TestResultIndicatorProps> = ({ status, error }) => {
    if (status === 'idle') {
        return <div className="h-5"></div>; // Placeholder for layout consistency
    }

    const getIndicatorContent = () => {
        switch (status) {
            case 'testing':
                return (
                    <>
                        <SpinnerIcon className="h-5 w-5 text-slate-400 animate-spin" />
                        <span className="text-slate-400">Testing connection...</span>
                    </>
                );
            case 'success':
                return (
                    <>
                        <CheckCircleIcon className="h-5 w-5 text-green-400" />
                        <span className="text-green-400">Connection successful!</span>
                    </>
                );
            case 'error':
                 return (
                    <>
                        <ExclamationCircleIcon className="h-5 w-5 text-red-400" />
                        <span className="text-red-400 truncate" title={error}>
                           Connection failed: {error}
                        </span>
                    </>
                );
            default:
                return null;
        }
    };
    
    return (
        <div className="flex items-center space-x-2 text-sm">
            {getIndicatorContent()}
        </div>
    );
};

export default TestResultIndicator;
