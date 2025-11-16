
import React from 'react';

interface QuizCompletedViewProps {
    moduleTitle: string;
    onReturnToDashboard: () => void;
}

const QuizCompletedView: React.FC<QuizCompletedViewProps> = ({ moduleTitle, onReturnToDashboard }) => {
    return (
        <div className="w-full max-w-lg bg-white p-8 sm:p-12 rounded-2xl shadow-xl text-center">
            <div className="mx-auto bg-green-100 rounded-full h-16 w-16 flex items-center justify-center mb-6">
                <svg className="h-8 w-8 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Module Complete!</h1>
            <p className="text-gray-600 mb-8">
                You have successfully finished the <span className="font-semibold">{moduleTitle}</span> quiz. Your overall module progress has been saved.
            </p>
            <button
                onClick={onReturnToDashboard}
                className="w-full max-w-xs mx-auto py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
            >
                Submit & Return to Dashboard
            </button>
        </div>
    );
};

export default QuizCompletedView;