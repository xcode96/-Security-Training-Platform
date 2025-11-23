
import React, { useRef, useState } from 'react';
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import type { QuizResult } from '../types';
import ProgressCircle from './ProgressCircle';
import Icon from './Icon';

interface QuizResultsViewProps {
    result: QuizResult;
    onReturnToDashboard: () => void;
    onViewProgress: () => void;
}

const formatTime = (seconds: number): string => {
    if (isNaN(seconds) || seconds < 0) return "0s";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    if (minutes > 0) {
        return `${minutes}m ${remainingSeconds}s`;
    }
    return `${remainingSeconds}s`;
};

const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 50) return "text-yellow-500";
    return "text-red-500";
};

const getSpeedLabel = (avgTime: number) => {
    if (avgTime <= 10) return { label: "Very Fast", color: "text-green-500" };
    if (avgTime <= 20) return { label: "Fast", color: "text-sky-500" };
    if (avgTime <= 30) return { label: "Moderate", color: "text-yellow-500" };
    return { label: "Slow", color: "text-orange-500" };
}

const ResultCard: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="bg-gray-50 p-4 sm:p-6 rounded-2xl border border-gray-200 flex flex-col items-center justify-center text-center">
        {children}
    </div>
);

const QuizResultsView: React.FC<QuizResultsViewProps> = ({ result, onReturnToDashboard, onViewProgress }) => {
    const { score, correctCount, totalQuestions, avgTimePerQuestion, totalTime, userAnswers } = result;
    const incorrectCount = totalQuestions - correctCount;
    const speed = getSpeedLabel(avgTimePerQuestion);
    
    const incorrectAnswers = userAnswers.filter(a => !a.isCorrect);
    
    const reportRef = useRef<HTMLDivElement>(null);
    const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

    const handleDownloadPdf = async () => {
        if (!reportRef.current) return;
        setIsGeneratingPdf(true);

        try {
            const element = reportRef.current;
            // Use html2canvas to take a screenshot of the specific div
            const canvas = await html2canvas(element, {
                scale: 2, // Higher scale for better quality
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff'
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const imgWidth = canvas.width;
            const imgHeight = canvas.height;
            const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
            
            const imgX = (pdfWidth - imgWidth * ratio) / 2;
            const imgY = 10; 

            // Calculate height of the image in the PDF
            const imgHeightInPdf = imgHeight * ratio;

            // If content is longer than one page, we might need logic here, 
            // but for a results summary, scaling to fit width usually works fine for single page summaries.
            // If it's very long, let's just let it fit width-wise and maybe span pages (simplified here to single page fit-width).
            
            if (imgHeightInPdf > pdfHeight) {
                 // Simple fit to page if too long
                 pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, (imgHeight * pdfWidth) / imgWidth);
            } else {
                 pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, imgHeightInPdf);
            }

            pdf.save(`quiz-results-${new Date().toISOString().split('T')[0]}.pdf`);
        } catch (error) {
            console.error("Error generating PDF:", error);
            alert("Failed to generate PDF. Please try again.");
        } finally {
            setIsGeneratingPdf(false);
        }
    };

    return (
        <div className="w-full max-w-4xl my-4 sm:my-8">
            {/* Content to capture for PDF */}
            <div ref={reportRef} className="bg-white p-4 sm:p-8 lg:p-12 rounded-2xl shadow-xl text-center text-gray-800 border border-gray-200">
                <h1 className="text-3xl sm:text-4xl font-bold mb-4">Quiz Results</h1>
                <p className="text-gray-600 mb-8 sm:mb-10">
                    <span className="text-purple-600 font-semibold">🔮 Every expert was once a beginner.</span> Keep studying!
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                    {/* Score Card */}
                    <ResultCard>
                        <div className="relative h-32 w-32 sm:h-40 sm:w-40 mb-4">
                             <svg className="absolute inset-0 w-full h-full" viewBox="0 0 120 120">
                                <circle className="text-gray-200" strokeWidth="8" stroke="currentColor" fill="transparent" r="52" cx="60" cy="60" />
                                <circle 
                                    className={getScoreColor(score)}
                                    strokeWidth="8" 
                                    strokeDasharray={52 * 2 * Math.PI}
                                    strokeDashoffset={(52 * 2 * Math.PI) * (1 - score / 100)}
                                    strokeLinecap="round" 
                                    stroke="currentColor" 
                                    fill="transparent" 
                                    r="52" 
                                    cx="60" 
                                    cy="60"
                                    style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%', transition: 'stroke-dashoffset 0.8s ease-out' }}
                                 />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-3xl sm:text-4xl font-bold">{score}%</span>
                                <span className="text-xs sm:text-sm text-gray-500">SCORE</span>
                            </div>
                        </div>
                        <p className={`font-bold text-lg ${getScoreColor(score)}`}>{score >= 50 ? 'Good Job!' : 'Keep Practicing'}</p>
                        <p className="text-sm text-gray-500">{correctCount} out of {totalQuestions} correct</p>
                    </ResultCard>

                    {/* Speed Card */}
                    <ResultCard>
                        <div className="text-5xl sm:text-6xl font-bold mb-4">
                            {avgTimePerQuestion}<span className="text-2xl text-gray-500">s</span>
                        </div>
                        <p className="text-sm text-gray-500 mb-2">AVG/QUESTION</p>
                        <p className={`font-bold text-xl ${speed.color}`}>{speed.label}</p>
                        <p className="text-sm text-gray-500 mt-auto pt-4">Total: {formatTime(totalTime)}</p>
                    </ResultCard>
                    
                    {/* Answer Breakdown Card */}
                    <ResultCard>
                         <div className="flex w-full justify-around items-center mb-4 flex-grow">
                            <div className="flex flex-col items-center">
                                 <span className="text-4xl sm:text-5xl font-bold text-green-500">{correctCount}</span>
                                 <span className="text-xs text-gray-500 font-bold uppercase mt-2">Correct</span>
                            </div>
                            <div className="w-px h-12 sm:h-16 bg-gray-300"></div>
                            <div className="flex flex-col items-center">
                                 <span className="text-4xl sm:text-5xl font-bold text-red-500">{incorrectCount}</span>
                                 <span className="text-xs text-gray-500 font-bold uppercase mt-2">Wrong</span>
                            </div>
                         </div>
                         <p className="text-sm text-gray-500 mb-2 uppercase tracking-wide">Answer Breakdown</p>
                        <p className="text-sm text-gray-500 mt-auto pt-4">{totalQuestions} total questions</p>
                    </ResultCard>
                </div>
                
                {/* Incorrect Answers Review Section */}
                {incorrectAnswers.length > 0 && (
                    <div className="mb-6 text-left">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                            Review Incorrect Answers
                            <span className="bg-red-100 text-red-600 text-sm px-2 py-1 rounded-full">{incorrectAnswers.length}</span>
                        </h2>
                        <div className="space-y-6">
                            {incorrectAnswers.map((ans, idx) => (
                                <div key={idx} className="bg-white border-l-4 border-red-500 shadow-sm rounded-r-lg p-4 sm:p-6 border border-gray-200">
                                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">{ans.questionText}</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                                        <div className="bg-red-50 p-3 rounded-lg border border-red-100">
                                            <p className="text-xs text-red-500 font-bold uppercase mb-1">Your Answer</p>
                                            <p className="text-red-700 font-medium text-sm sm:text-base">{ans.selectedAnswer}</p>
                                        </div>
                                        <div className="bg-green-50 p-3 rounded-lg border border-green-100">
                                            <p className="text-xs text-green-500 font-bold uppercase mb-1">Correct Answer</p>
                                            <p className="text-green-700 font-medium text-sm sm:text-base">{ans.correctAnswer}</p>
                                        </div>
                                    </div>
                                    {ans.explanation && (
                                        <div className="text-sm text-gray-600 mt-2 bg-gray-50 p-3 rounded-lg">
                                            <span className="font-semibold text-gray-700 block mb-1">Explanation:</span>
                                            {ans.explanation}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                
                {/* Navigation Buttons - Hidden in PDF */}
                <div data-html2canvas-ignore className="mt-10">
                    <button
                        onClick={onViewProgress}
                        className="w-full max-w-sm mx-auto py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity duration-300 text-sm sm:text-lg shadow-lg mb-3 block"
                    >
                        → View Your Complete Domain Progress
                    </button>
                    
                    <button
                        onClick={handleDownloadPdf}
                        disabled={isGeneratingPdf}
                        className="w-full max-w-sm mx-auto py-3 bg-white border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors duration-300 text-sm sm:text-lg shadow-sm mb-3 flex items-center justify-center gap-2"
                    >
                        {isGeneratingPdf ? (
                             <span>Generating PDF...</span>
                        ) : (
                            <>
                                <Icon iconName="download" className="h-5 w-5 text-gray-500" />
                                <span>Download Results PDF</span>
                            </>
                        )}
                    </button>

                    <p className="text-xs sm:text-sm text-gray-600 mt-3">Track your performance, identify weak areas, and monitor improvement over time.</p>
                    <button
                        onClick={onReturnToDashboard}
                        className="mt-8 text-gray-500 hover:text-gray-800 transition-colors text-sm sm:text-base"
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QuizResultsView;
