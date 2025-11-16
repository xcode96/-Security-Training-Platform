import React, { useState } from 'react';
import type { Module, Question } from '../types';
import QuestionForm from './QuestionForm';
import { generateQuestionSuggestions } from '../services/geminiService';
import Icon from './Icon';

interface QuestionManagerProps {
  module: Module;
  subTopic: string;
  initialQuestions: Question[];
  onSave: (moduleId: number, subTopic: string, questions: Question[]) => void;
  onClose: () => void;
}

const QuestionManager: React.FC<QuestionManagerProps> = ({ module, subTopic, initialQuestions, onSave, onClose }) => {
  const [questions, setQuestions] = useState<Question[]>(initialQuestions);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [suggestions, setSuggestions] = useState<Question[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);

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

  const handleGenerateSuggestions = async () => {
    setIsLoadingSuggestions(true);
    setSuggestions([]);
    try {
        const generated = await generateQuestionSuggestions(module.title, subTopic);
        setSuggestions(generated.map(q => ({...q, id: new Date().toISOString() + Math.random() })));
    } catch (error) {
        alert("Failed to generate suggestions. Please check the console.");
        console.error(error);
    }
    setIsLoadingSuggestions(false);
  };

  const handleAddSuggestion = (suggestion: Question) => {
    setQuestions([...questions, suggestion]);
    setSuggestions(suggestions.filter(s => s.id !== suggestion.id));
  };
  
  const handleSaveChanges = () => {
    onSave(module.id, subTopic, questions);
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
        <p className="text-gray-500">{module.title}: <span className="font-semibold text-gray-700">{subTopic}</span></p>
      </header>
      <main className="flex-1 p-6 space-y-4 overflow-y-auto">
        {renderContent()}
      </main>
      <aside className="p-6 border-t bg-slate-50">
        <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2"><Icon iconName="sparkles" className="h-5 w-5 text-indigo-500" /> AI Suggestions</h3>
        <button onClick={handleGenerateSuggestions} disabled={isLoadingSuggestions} className="w-full py-2 bg-indigo-100 text-indigo-700 font-semibold rounded-lg hover:bg-indigo-200 disabled:opacity-50">
            {isLoadingSuggestions ? 'Generating...' : 'Generate 3 Suggestions with Gemini'}
        </button>
        {suggestions.length > 0 && <div className="mt-4 space-y-2">
            {suggestions.map(sugg => (
                <div key={sugg.id} className="p-3 bg-indigo-50 rounded-lg flex justify-between items-center">
                    <p className="text-sm text-gray-700 flex-1">{sugg.question}</p>
                    <button onClick={() => handleAddSuggestion(sugg)} className="px-3 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded-full hover:bg-green-200">Add</button>
                </div>
            ))}
        </div>}
      </aside>
      <footer className="p-6 border-t border-gray-200 flex justify-end gap-4">
        <button onClick={onClose} className="px-6 py-2 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200">Close</button>
        <button onClick={handleSaveChanges} className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700">Save & Close</button>
      </footer>
    </div>
  );
};

export default QuestionManager;