import React, { useState, useMemo, useCallback, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import QuizView from './components/QuizView';
import QuizCompletedView from './components/QuizCompletedView';
import LoginView from './components/LoginView';
import QuestionManager from './components/QuestionManager';
import { MODULE_DATA } from './constants';
import type { Module, QuestionBank, Question } from './types';

type View = 'dashboard' | 'quiz' | 'completed';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [activeModule, setActiveModule] = useState<Module | null>(null);
  const [activeSubTopic, setActiveSubTopic] = useState<string | null>(null);
  const [completedModules, setCompletedModules] = useState<Set<number>>(new Set());
  
  // Admin and Question Bank State
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [isQuestionManagerOpen, setQuestionManagerOpen] = useState(false);
  const [questionBank, setQuestionBank] = useState<QuestionBank>({});
  const [moduleVisibility, setModuleVisibility] = useState<{ [moduleId: number]: boolean }>({});


  // Load data from local storage on initial render
  useEffect(() => {
    // Load Question Bank
    try {
      const savedBank = localStorage.getItem('questionBank');
      if (savedBank) {
        setQuestionBank(JSON.parse(savedBank));
      }
    } catch (error) {
      console.error("Failed to load question bank from local storage:", error);
    }

    // Load Module Visibility
    try {
        const savedVisibility = localStorage.getItem('moduleVisibility');
        const initialVisibility = MODULE_DATA.reduce((acc, module) => {
            acc[module.id] = true; // Default to visible
            return acc;
        }, {} as { [moduleId: number]: boolean });

        if (savedVisibility) {
            const parsedVisibility = JSON.parse(savedVisibility);
            setModuleVisibility({ ...initialVisibility, ...parsedVisibility });
        } else {
            setModuleVisibility(initialVisibility);
        }
    } catch (error) {
        console.error("Failed to load module visibility settings:", error);
        const defaultVisibility = MODULE_DATA.reduce((acc, module) => ({ ...acc, [module.id]: true }), {});
        setModuleVisibility(defaultVisibility);
    }
  }, []);

  const modules = useMemo(() => MODULE_DATA, []);

  const handleStartQuiz = useCallback((module: Module, subTopic?: string) => {
    setActiveModule(module);
    setActiveSubTopic(subTopic || null);
    setCurrentView('quiz');
  }, []);

  const handleCompleteQuiz = useCallback((moduleId: number) => {
    if (!activeSubTopic) {
      setCompletedModules(prev => new Set(prev).add(moduleId));
    }
    setCurrentView('completed');
  }, [activeSubTopic]);

  const handleReturnToDashboard = useCallback(() => {
    setActiveModule(null);
    setActiveSubTopic(null);
    setQuestionManagerOpen(false);
    setCurrentView('dashboard');
  }, []);
  
  const handleResetProgress = useCallback(() => {
    setCompletedModules(new Set());
  }, []);

  const handleAdminLogin = (success: boolean) => {
    if (success) {
      setIsAdmin(true);
      setLoginModalOpen(false);
    } else {
      alert("Invalid credentials!");
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
  };
  
  const handleManageQuestions = useCallback((module: Module, subTopic: string) => {
    setActiveModule(module);
    setActiveSubTopic(subTopic);
    setQuestionManagerOpen(true);
  }, []);

  const updateQuestionBank = useCallback((newBank: QuestionBank) => {
    setQuestionBank(newBank);
    localStorage.setItem('questionBank', JSON.stringify(newBank));
  }, []);

  const handleToggleModuleVisibility = useCallback((moduleId: number) => {
    setModuleVisibility(prev => {
        const newVisibility = { ...prev, [moduleId]: !prev[moduleId] };
        localStorage.setItem('moduleVisibility', JSON.stringify(newVisibility));
        return newVisibility;
    });
  }, []);

  const handleSaveQuestions = (moduleId: number, subTopic: string, questions: Question[]) => {
      const newBank = { ...questionBank };
      if (!newBank[moduleId]) {
        newBank[moduleId] = {};
      }
      newBank[moduleId][subTopic] = questions;
      updateQuestionBank(newBank);
  };

  const handleExportQuestions = useCallback(() => {
    if (Object.keys(questionBank).length === 0) {
      alert("Question bank is empty. Nothing to export.");
      return;
    }
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(questionBank, null, 2)
    )}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = "cyber-security-question-bank.json";
    link.click();
  }, [questionBank]);

  const handleImportQuestions = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result;
        if (typeof text !== 'string') {
          throw new Error("Failed to read file.");
        }
        const importedBank = JSON.parse(text);
        if (typeof importedBank === 'object' && importedBank !== null && !Array.isArray(importedBank)) {
          updateQuestionBank(importedBank);
          alert("Question bank imported successfully!");
        } else {
          throw new Error("Invalid JSON format. The file should contain a JSON object.");
        }
      } catch (error) {
        const err = error as Error;
        console.error("Failed to import question bank:", err);
        alert(`Failed to import question bank. Please ensure the file is valid JSON. Error: ${err.message}`);
      }
      event.target.value = '';
    };
     reader.onerror = () => {
        alert("Error reading the file.");
        event.target.value = '';
    }
    reader.readAsText(file);
  }, [updateQuestionBank]);

  const handleExportSubTopic = useCallback((module: Module, subTopic: string) => {
    const questionsToExport = questionBank[module.id]?.[subTopic];
    if (!questionsToExport || questionsToExport.length === 0) {
      alert(`No questions to export for ${subTopic}.`);
      return;
    }
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(questionsToExport, null, 2)
    )}`;
    const link = document.createElement("a");
    link.href = jsonString;
    const safeFilename = subTopic.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    link.download = `${safeFilename}_questions.json`;
    link.click();
  }, [questionBank]);

  const handleImportSubTopic = useCallback((event: React.ChangeEvent<HTMLInputElement>, module: Module, subTopic: string) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result;
        if (typeof text !== 'string') {
          throw new Error("Failed to read file.");
        }
        const importedQuestions = JSON.parse(text);
        
        // Validate that it's an array of questions
        if (Array.isArray(importedQuestions) && (importedQuestions.length === 0 || (
            importedQuestions[0].id && 
            importedQuestions[0].question &&
            Array.isArray(importedQuestions[0].options) &&
            importedQuestions[0].correctAnswer
        ))) {
            const newBank = { ...questionBank };
            if (!newBank[module.id]) {
                newBank[module.id] = {};
            }
            newBank[module.id][subTopic] = importedQuestions as Question[];
            updateQuestionBank(newBank);
            alert(`Successfully imported ${importedQuestions.length} questions for ${subTopic}.`);
        } else {
          throw new Error("Invalid JSON format. File must contain an array of questions.");
        }
      } catch (error) {
        const err = error as Error;
        console.error(`Failed to import questions for ${subTopic}:`, err);
        alert(`Failed to import questions. Please ensure the file is a valid JSON array of questions. Error: ${err.message}`);
      }
      // Reset file input so the same file can be selected again
      event.target.value = '';
    };
    reader.readAsText(file);
  }, [questionBank, updateQuestionBank]);

  const renderContent = () => {
    if (isQuestionManagerOpen && activeModule && activeSubTopic) {
      return <QuestionManager 
        module={activeModule}
        subTopic={activeSubTopic}
        initialQuestions={questionBank[activeModule.id]?.[activeSubTopic] || []}
        onSave={handleSaveQuestions}
        onClose={handleReturnToDashboard}
      />
    }

    switch (currentView) {
      case 'quiz':
        return activeModule && <QuizView module={activeModule} subTopic={activeSubTopic} questionBank={questionBank} onCompleteQuiz={handleCompleteQuiz} />;
      case 'completed':
        return activeModule && <QuizCompletedView moduleTitle={activeSubTopic || activeModule.title} onReturnToDashboard={handleReturnToDashboard} />;
      case 'dashboard':
      default:
        return <Dashboard 
                  modules={modules} 
                  completedModules={completedModules} 
                  onStartQuiz={handleStartQuiz} 
                  onResetProgress={handleResetProgress}
                  isAdmin={isAdmin}
                  onAdminLoginClick={() => setLoginModalOpen(true)}
                  onLogout={handleLogout}
                  onManageQuestions={handleManageQuestions}
                  onExportQuestions={handleExportQuestions}
                  onImportQuestions={handleImportQuestions}
                  onExportSubTopic={handleExportSubTopic}
                  onImportSubTopic={handleImportSubTopic}
                  moduleVisibility={moduleVisibility}
                  onToggleModuleVisibility={handleToggleModuleVisibility}
                />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-purple-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {renderContent()}
      {isLoginModalOpen && <LoginView onLogin={handleAdminLogin} onClose={() => setLoginModalOpen(false)} />}
    </div>
  );
};

export default App;
