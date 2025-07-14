'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Mail, Phone, MapPin, Instagram, Check } from 'lucide-react';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // 실제 구현시 API 엔드포인트로 전송
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    
    // 3초 후 폼 리셋
    setTimeout(() => {
      setFormData({ name: '', email: '', subject: '', message: '' });
      setIsSubmitted(false);
    }, 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <section className="section-padding bg-black min-h-screen">
      <div className="container max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
            CONTACT
          </h1>
          <p className="text-lg text-gray-400 max-w-3xl">
            REDUX와 함께 새로운 프로젝트를 시작하세요
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
              <p className="text-gray-400 mb-8">
                협업 문의, 전시 제안, 또는 일반적인 문의사항이 있으시다면 
                언제든지 연락해 주세요. 영업일 기준 2-3일 이내에 답변드리겠습니다.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white/10 rounded-lg">
                  <Mail size={20} />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Email</h3>
                  <a href="mailto:contact@redux.kr" className="text-gray-400 hover:text-white transition-colors">
                    contact@redux.kr
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-white/10 rounded-lg">
                  <Phone size={20} />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Phone</h3>
                  <a href="tel:+82-2-1234-5678" className="text-gray-400 hover:text-white transition-colors">
                    +82 2-1234-5678
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-white/10 rounded-lg">
                  <MapPin size={20} />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Address</h3>
                  <p className="text-gray-400">
                    서울특별시 강남구 선릉로 123<br />
                    REDUX Studio, 3F
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-white/10 rounded-lg">
                  <Instagram size={20} />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Instagram</h3>
                  <a 
                    href="https://instagram.com/redux_official" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    @redux_official
                  </a>
                </div>
              </div>
            </div>

            {/* Office Hours */}
            <div className="pt-8 border-t border-gray-800">
              <h3 className="font-medium mb-4">Office Hours</h3>
              <div className="space-y-2 text-gray-400">
                <p>월요일 - 금요일: 10:00 - 18:00</p>
                <p>토요일: 11:00 - 16:00</p>
                <p>일요일 및 공휴일: 휴무</p>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                    placeholder="홍길동"
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
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                    placeholder="your@email.com"
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
                  className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                >
                  <option value="">선택해주세요</option>
                  <option value="collaboration">협업 제안</option>
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
                  rows={6}
                  className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 transition-all resize-none"
                  placeholder="문의하실 내용을 자세히 작성해주세요"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || isSubmitted}
                className="w-full px-6 py-4 bg-white text-black font-medium rounded-lg hover:bg-gray-200 disabled:bg-gray-500 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
              >
                {isSubmitted ? (
                  <>
                    <Check size={20} />
                    <span>전송 완료</span>
                  </>
                ) : (
                  <>
                    <Send size={20} />
                    <span>{isSubmitting ? '전송 중...' : '메시지 보내기'}</span>
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}