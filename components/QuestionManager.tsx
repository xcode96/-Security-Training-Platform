import React, { useState } from 'react';
import type { Module, Question } from '../types';
import QuestionForm from './QuestionForm';
import Icon from './Icon';

interface QuestionManagerProps {
  module: Module;
  subTopic: string;
  contentPoint?: string | null;
  initialQuestions: Question[];
  onSave: (questions: Question[]) => void;
  onClose: () => void;
}

const QuestionManager: React.FC<QuestionManagerProps> = ({ module, subTopic, contentPoint, initialQuestions, onSave, onClose }) => {
  const [questions, setQuestions] = useState<Question[]>(initialQuestions);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddOrUpdateQuestion = (question: Question) => {
    let updatedQuestions;
    const existingIndex = questions.findIndex(q => q.id === question.id);
    if (existingIndex > -1) {
      updatedQuestions = [...questions];
      updatedQuestions[existingIndex] = question;
    } else {
      updatedQuestions = [...questions, question];
    }
    setQuestions(updatedQuestions);
    setEditingQuestion(null);
    setIsAdding(false);
  };
  
  const handleDeleteQuestion = (questionId: string) => {
    if (window.confirm("Are you sure you want to delete this question?")) {
        setQuestions(questions.filter(q => q.id !== questionId));
    }
  };
  
  const handleSaveChanges = () => {
    onSave(questions);
    onClose();
  };

  const renderContent = () => {
    if (isAdding || editingQuestion) {
      return <QuestionForm 
        initialQuestion={editingQuestion}
        onSubmit={handleAddOrUpdateQuestion}
        onCancel={() => { setIsAdding(false); setEditingQuestion(null); }}
      />
    }
    return (
      <>
        {questions.map((q, index) => (
          <div key={q.id} className="p-4 bg-gray-50 rounded-lg flex justify-between items-center">
            <p className="text-gray-700 flex-1">{index + 1}. {q.question}</p>
            <div className="flex gap-2">
              <button onClick={() => setEditingQuestion(q)} className="px-3 py-1 text-sm font-semibold text-blue-700 bg-blue-100 rounded-full hover:bg-blue-200">Edit</button>
              <button onClick={() => handleDeleteQuestion(q.id)} className="px-3 py-1 text-sm font-semibold text-red-700 bg-red-100 rounded-full hover:bg-red-200">Delete</button>
            </div>
          </div>
        ))}
        {questions.length === 0 && <p className="text-center text-gray-500 py-4">No questions defined for this sub-topic yet.</p>}
        <button onClick={() => setIsAdding(true)} className="w-full mt-4 py-2 border-2 border-dashed border-gray-300 text-gray-600 font-semibold rounded-lg hover:bg-gray-100">
          + Add New Question
        </button>
      </>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-xl flex flex-col overflow-hidden" style={{ minHeight: '90vh' }}>
      <header className="p-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-800">Manage Questions</h1>
        <p className="text-gray-500">{module.title}: <span className="font-semibold text-gray-700">{contentPoint ? `${subTopic} > ${contentPoint}` : subTopic}</span></p>
      </header>
      <main className="flex-1 p-6 space-y-4 overflow-y-auto">
        {renderContent()}
      </main>
      <footer className="p-6 border-t border-gray-200 flex justify-end gap-4">
        <button onClick={onClose} className="px-6 py-2 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200">Close</button>
        <button onClick={handleSaveChanges} className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700">Save & Close</button>
      </footer>
    </div>
  );
};

export default QuestionManager;