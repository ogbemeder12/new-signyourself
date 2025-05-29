
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, User, Zap, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import LoadingSpinner from '@/components/LoadingSpinner.jsx';
import { waitingListConfig } from '@/lib/config';

const WaitingListForm = ({ initialEmail = '', initialName = '', onSubmit, isLoading, error }) => {
  const [email, setEmail] = useState(initialEmail);
  const [name, setName] = useState(initialName);

  useEffect(() => {
    setEmail(initialEmail);
  }, [initialEmail]);

  useEffect(() => {
    setName(initialName);
  }, [initialName]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ email, name });
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.4, duration: 0.5 }}
      className="max-w-lg mx-auto mt-10 bg-white/10 backdrop-blur-md p-8 rounded-xl shadow-2xl"
    >
      <div className="space-y-6">
        <div>
          <Label htmlFor="name-ewl-form" className="text-sm font-medium text-yellow-300 flex items-center mb-1">
            <User className="w-4 h-4 mr-2" /> Name (Optional)
          </Label>
          <Input
            id="name-ewl-form"
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-white/20 border-0 text-white placeholder-gray-300 focus:ring-yellow-400 focus:ring-2"
          />
        </div>
        <div>
          <Label htmlFor="email-ewl-form" className="text-sm font-medium text-yellow-300 flex items-center mb-1">
            <Mail className="w-4 h-4 mr-2" /> Email Address*
          </Label>
          <Input
            id="email-ewl-form"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-white/20 border-0 text-white placeholder-gray-300 focus:ring-yellow-400 focus:ring-2"
          />
        </div>
      </div>

      {error && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 text-sm text-red-300 bg-red-900/50 p-3 rounded-md flex items-center"
        >
          <AlertTriangle size={18} className="mr-2" /> {error}
        </motion.p>
      )}

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full mt-8 bg-yellow-400 hover:bg-yellow-500 text-purple-700 font-bold text-lg py-3 rounded-lg shadow-lg transition-transform transform hover:scale-105 flex items-center justify-center"
      >
        {isLoading ? (
          <LoadingSpinner size="sm" />
        ) : (
          <>
            <Zap className="w-5 h-5 mr-2" /> Join the Elite List
          </>
        )}
      </Button>
      <p className="text-xs mt-4 opacity-80">
        {waitingListConfig.footerText || "We respect your privacy. No spam, ever."}
      </p>
    </motion.form>
  );
};

export default WaitingListForm;
