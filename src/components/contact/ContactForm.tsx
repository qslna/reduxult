'use client';

import { useState } from 'react';
import { Send } from 'lucide-react';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6 md:mb-8 text-center md:text-left">Send Message</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2">
              이름 *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 md:px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg focus:outline-none focus:border-white transition-colors text-sm md:text-base"
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              이메일 *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-3 md:px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg focus:outline-none focus:border-white transition-colors text-sm md:text-base"
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="subject" className="block text-sm font-medium mb-2">
            문의 유형 *
          </label>
          <select
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
            className="w-full px-3 md:px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg focus:outline-none focus:border-white transition-colors text-sm md:text-base"
          >
            <option value="">선택해주세요</option>
            <option value="collaboration">협업 문의</option>
            <option value="exhibition">전시 문의</option>
            <option value="press">언론 문의</option>
            <option value="general">일반 문의</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="message" className="block text-sm font-medium mb-2">
            메시지 *
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows={4}
            className="w-full px-3 md:px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg focus:outline-none focus:border-white transition-colors resize-none text-sm md:text-base min-h-[120px] md:min-h-[140px]"
          />
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full px-4 md:px-6 py-3 md:py-4 bg-white text-black font-medium rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm md:text-base"
        >
          {isSubmitting ? (
            '전송 중...'
          ) : (
            <>
              <Send className="w-4 h-4 md:w-5 md:h-5" />
              메시지 보내기
            </>
          )}
        </button>
        
        {submitStatus === 'success' && (
          <div className="p-3 md:p-4 bg-green-900/20 border border-green-900 rounded-lg text-green-400 text-sm md:text-base">
            메시지가 성공적으로 전송되었습니다. 빠른 시일 내에 연락드리겠습니다.
          </div>
        )}
        
        {submitStatus === 'error' && (
          <div className="p-3 md:p-4 bg-red-900/20 border border-red-900 rounded-lg text-red-400 text-sm md:text-base">
            메시지 전송에 실패했습니다. 다시 시도해주세요.
          </div>
        )}
      </form>
    </div>
  );
}