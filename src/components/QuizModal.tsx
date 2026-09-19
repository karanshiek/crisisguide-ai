import React, { useState } from 'react';
import { PREPAREDNESS_QUIZZES } from '../data/emergencyKnowledge';
import { 
  X, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  Award, 
  RotateCcw, 
  ArrowRight 
} from 'lucide-react';

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdatePreparednessScore?: (score: number) => void;
}

export const QuizModal: React.FC<QuizModalProps> = ({
  isOpen,
  onClose,
  onUpdatePreparednessScore
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  if (!isOpen) return null;

  const currentQ = PREPAREDNESS_QUIZZES[currentQuestionIndex];
  // Best answer is the one with the highest points
  const correctIndex = currentQ ? currentQ.options.findIndex(o => o.points === Math.max(...currentQ.options.map(x => x.points))) : 0;

  const handleSelectOption = (index: number) => {
    if (showExplanation) return;
    setSelectedOption(index);
    setShowExplanation(true);
    if (index === correctIndex) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    setShowExplanation(false);

    if (currentQuestionIndex + 1 < PREPAREDNESS_QUIZZES.length) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setIsCompleted(true);
      const calculatedScore = Math.round((score / PREPAREDNESS_QUIZZES.length) * 100);
      if (onUpdatePreparednessScore) onUpdatePreparednessScore(calculatedScore);
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setShowExplanation(false);
    setScore(0);
    setIsCompleted(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-xs">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50 dark:bg-zinc-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 flex items-center justify-center">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                Disaster Survival Knowledge Quiz
              </h2>
              <p className="text-xs text-zinc-500">
                Test your instinct & calculate your emergency preparedness score
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {!isCompleted ? (
            <div className="space-y-5">
              {/* Progress indicator */}
              <div className="flex items-center justify-between text-xs text-zinc-500 font-semibold">
                <span>Question {currentQuestionIndex + 1} of {PREPAREDNESS_QUIZZES.length}</span>
                <span>Current Score: {score}</span>
              </div>

              <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-amber-500 h-full transition-all"
                  style={{ width: `${((currentQuestionIndex + 1) / PREPAREDNESS_QUIZZES.length) * 100}%` }}
                />
              </div>

              {/* Question */}
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 leading-snug">
                {currentQ.question}
              </h3>

              {/* Options */}
              <div className="space-y-2.5">
                {currentQ.options.map((option, idx) => {
                  let btnStyle = 'bg-zinc-50 dark:bg-zinc-800/60 border-zinc-200 dark:border-zinc-700 hover:border-amber-400';
                  
                  if (showExplanation) {
                    if (idx === correctIndex) {
                      btnStyle = 'bg-emerald-100 dark:bg-emerald-950/70 border-emerald-500 text-emerald-900 dark:text-emerald-100 font-bold';
                    } else if (idx === selectedOption) {
                      btnStyle = 'bg-rose-100 dark:bg-rose-950/70 border-rose-500 text-rose-900 dark:text-rose-100';
                    } else {
                      btnStyle = 'opacity-40 bg-zinc-50 dark:bg-zinc-800/40 border-zinc-200';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(idx)}
                      disabled={showExplanation}
                      className={`w-full text-left p-3.5 rounded-2xl border text-xs sm:text-sm font-medium transition-all flex items-center justify-between ${btnStyle}`}
                    >
                      <span>{option.text}</span>
                      {showExplanation && idx === correctIndex && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 ml-2" />
                      )}
                      {showExplanation && idx === selectedOption && idx !== correctIndex && (
                        <XCircle className="w-4 h-4 text-rose-600 shrink-0 ml-2" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation & Next Button */}
              {showExplanation && (
                <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-xs text-amber-900 dark:text-amber-200 space-y-3">
                  <div>
                    <strong>Survival Fact: </strong> {currentQ.explanation}
                  </div>
                  <button
                    onClick={handleNext}
                    className="w-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-1.5 shadow-sm hover:opacity-90"
                  >
                    Next Question <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-600 mx-auto flex items-center justify-center">
                <Award className="w-8 h-8" />
              </div>

              <h3 className="text-xl font-black text-zinc-900 dark:text-zinc-100">
                Quiz Completed!
              </h3>

              <div className="text-3xl font-black text-amber-600">
                {Math.round((score / PREPAREDNESS_QUIZZES.length) * 100)}%
              </div>

              <p className="text-xs text-zinc-600 dark:text-zinc-400 max-w-sm mx-auto">
                You answered {score} out of {PREPAREDNESS_QUIZZES.length} scenarios correctly. Regular refresher reviews significantly enhance calm reactions under extreme stress.
              </p>

              <div className="pt-4 flex justify-center gap-3">
                <button
                  onClick={handleRestart}
                  className="px-4 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-xs font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Retake Quiz
                </button>
                <button
                  onClick={onClose}
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
