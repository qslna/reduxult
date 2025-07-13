'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import SimpleImageManager from '@/components/SimpleImageManager';
import { useToast } from '@/components/ToastProvider';

interface ContactForm {
  name: string;
  email: string;
  company?: string;
  subject: string;
  message: string;
  inquiryType: 'collaboration' | 'commission' | 'exhibition' | 'press' | 'other';
}

const contactInfo = {
  email: 'hello@redux.kr',
  phone: '+82-2-1234-5678',
  address: 'Seoul, South Korea',
  social: {
    instagram: '@redux_collective',
    behance: 'redux-collective',
    vimeo: 'redux'
  }
};

const teamMembers = [
  {
    name: 'Kim Bomin',
    role: 'Creative Director',
    email: 'bomin@redux.kr',
    specialty: 'Creative Direction, Brand Strategy'
  },
  {
    name: 'Choi Eunsol',
    role: 'Art Director',
    email: 'eunsol@redux.kr',
    specialty: 'Photography, Visual Direction'
  },
  {
    name: 'Lee Taehyeon',
    role: 'Fashion Designer',
    email: 'taehyeon@redux.kr',
    specialty: 'Sustainable Fashion, Innovation'
  },
  {
    name: 'Kim Gyeongsu',
    role: 'Installation Artist',
    email: 'gyeongsu@redux.kr',
    specialty: 'Interactive Design, Spatial Art'
  },
  {
    name: 'Hwang Jinsu',
    role: 'Film Director',
    email: 'jinsu@redux.kr',
    specialty: 'Fashion Film, Cinematography'
  },
  {
    name: 'Park Parang',
    role: 'Visual Artist',
    email: 'parang@redux.kr',
    specialty: 'Digital Art, Graphic Design'
  }
];

const inquiryTypes = [
  { value: 'collaboration', label: '콜라보레이션 문의' },
  { value: 'commission', label: '작업 의뢰' },
  { value: 'exhibition', label: '전시 관련' },
  { value: 'press', label: '언론/미디어' },
  { value: 'other', label: '기타' }
];

export default function ContactPage() {
  const [formData, setFormData] = useState<ContactForm>({
    name: '',
    email: '',
    company: '',
    subject: '',
    message: '',
    inquiryType: 'collaboration'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { success, error } = useToast();
  
  const heroRef = useRef(null);
  const formRef = useRef(null);
  const teamRef = useRef(null);
  
  const isHeroInView = useInView(heroRef, { once: true });
  const isFormInView = useInView(formRef, { once: true, margin: '-100px' });
  const isTeamInView = useInView(teamRef, { once: true, margin: '-100px' });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        company: '',
        subject: '',
        message: '',
        inquiryType: 'collaboration'
      });
      
      success('메시지가 성공적으로 전송되었습니다. 빠른 시일 내에 답변드리겠습니다.');
    } catch (err) {
      error('메시지 전송에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      {/* Hero Section */}
      <section className="h-screen relative overflow-hidden" ref={heroRef}>
        <div className="absolute inset-0">
          <SimpleImageManager
            src="/images/about/memory/IMG_1728.jpeg"
            alt="Contact Hero"
            fill
            className="object-cover"
            folder="contact"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/50"></div>
        </div>

        <div className="relative z-10 h-full flex items-center justify-center px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 1.5 }}
          >
            <h1 className="font-serif text-6xl md:text-8xl lg:text-9xl font-light tracking-wider text-white mb-6">
              Contact
            </h1>
            <motion.p
              className="text-base md:text-lg text-white/90 uppercase tracking-[0.3em] font-light mb-8"
              initial={{ opacity: 0, y: 30 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 1.5, delay: 0.3 }}
            >
              함께 창조할 준비가 되어있습니다
            </motion.p>
            
            <motion.div
              className="space-y-2 text-white/80"
              initial={{ opacity: 0, y: 30 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 1, delay: 0.6 }}
            >
              <p>{contactInfo.email}</p>
              <p>{contactInfo.phone}</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-6 md:px-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="font-serif text-3xl md:text-4xl font-normal tracking-wide text-black mb-10">
              새로운 협업의 시작
            </h2>
            <div className="space-y-6 text-base md:text-lg leading-relaxed text-gray-700">
              <p>
                REDUX는 언제나 새로운 협업과 창작 기회를 기다리고 있습니다.
                브랜드 콜라보레이션부터 전시 기획, 특별한 프로젝트 의뢰까지
                여러분의 아이디어를 현실로 만들어드립니다.
              </p>
              <p>
                6명의 전문가가 각자의 영역에서 최고의 결과물을 위해 협력하겠습니다.
                창의적인 여정을 함께 시작해보세요.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-16 md:py-24 bg-gray-50" ref={formRef}>
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={isFormInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
              transition={{ duration: 0.8 }}
            >
              <h3 className="font-serif text-3xl font-medium text-black mb-8">
                메시지 보내기
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    이름 *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
                    placeholder="홍길동"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    이메일 *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
                    placeholder="hello@example.com"
                  />
                </div>

                {/* Company */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    회사/단체
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
                    placeholder="회사명 또는 단체명"
                  />
                </div>

                {/* Inquiry Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    문의 유형 *
                  </label>
                  <select
                    name="inquiryType"
                    value={formData.inquiryType}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
                  >
                    {inquiryTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    제목 *
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
                    placeholder="문의 제목을 입력해주세요"
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    메시지 *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 resize-none"
                    placeholder="프로젝트에 대한 상세한 내용을 알려주세요..."
                  />
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-black text-white py-4 px-8 rounded-lg font-medium uppercase tracking-wider hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300"
                  whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                  whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                >
                  {isSubmitting ? '전송중...' : '메시지 보내기'}
                </motion.button>
              </form>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={isFormInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
              transition={{ duration: 0.8 }}
            >
              <h3 className="font-serif text-3xl font-medium text-black mb-8">
                연락처 정보
              </h3>
              
              {/* Direct Contact */}
              <div className="mb-8">
                <h4 className="font-medium text-black mb-4">직접 연락</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-black rounded-full flex-shrink-0"></div>
                    <div>
                      <p className="text-gray-600 text-sm">이메일</p>
                      <p className="text-black">{contactInfo.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-black rounded-full flex-shrink-0"></div>
                    <div>
                      <p className="text-gray-600 text-sm">전화</p>
                      <p className="text-black">{contactInfo.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-black rounded-full flex-shrink-0"></div>
                    <div>
                      <p className="text-gray-600 text-sm">위치</p>
                      <p className="text-black">{contactInfo.address}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="mb-8">
                <h4 className="font-medium text-black mb-4">소셜 미디어</h4>
                <div className="space-y-2">
                  <p className="text-gray-600">
                    <span className="font-medium">Instagram:</span> {contactInfo.social.instagram}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Behance:</span> {contactInfo.social.behance}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Vimeo:</span> {contactInfo.social.vimeo}
                  </p>
                </div>
              </div>

              {/* Business Hours */}
              <div className="mb-8">
                <h4 className="font-medium text-black mb-4">업무 시간</h4>
                <div className="space-y-2 text-gray-600">
                  <p>월요일 - 금요일: 09:00 - 18:00</p>
                  <p>토요일: 10:00 - 16:00</p>
                  <p>일요일: 휴무</p>
                </div>
              </div>

              {/* Response Time */}
              <div className="bg-gray-100 p-6 rounded-lg">
                <h4 className="font-medium text-black mb-3">응답 시간</h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  일반적으로 24-48시간 내에 답변드립니다. 
                  복잡한 프로젝트의 경우 검토에 더 많은 시간이 필요할 수 있으며, 
                  이 경우 별도로 연락드리겠습니다.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team Contact */}
      <section className="py-16 md:py-24" ref={teamRef}>
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <motion.h2
            className="font-serif text-4xl md:text-5xl font-light tracking-wider text-center text-black mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={isTeamInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8 }}
          >
            팀 멤버 연락처
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.name}
                className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                initial={{ opacity: 0, y: 60 }}
                animate={isTeamInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <h3 className="font-serif text-xl font-medium text-black mb-2">
                  {member.name}
                </h3>
                <p className="text-gray-500 text-sm mb-3">{member.role}</p>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  {member.specialty}
                </p>
                <a 
                  href={`mailto:${member.email}`}
                  className="text-black hover:text-gray-600 transition-colors text-sm font-medium"
                >
                  {member.email}
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-24 bg-black text-white">
        <div className="max-w-4xl mx-auto px-6 md:px-10">
          <motion.h2
            className="font-serif text-4xl md:text-5xl font-light tracking-wider text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            자주 묻는 질문
          </motion.h2>
          
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div>
              <h3 className="text-xl font-medium mb-3">프로젝트 진행 과정은 어떻게 되나요?</h3>
              <p className="text-gray-300 leading-relaxed">
                첫 미팅에서 프로젝트 목표와 요구사항을 파악한 후, 
                맞춤형 제안서를 작성합니다. 승인 후 기획-디자인-제작-검수 단계로 진행됩니다.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-medium mb-3">프로젝트 비용은 어떻게 산정되나요?</h3>
              <p className="text-gray-300 leading-relaxed">
                프로젝트 규모, 기간, 참여 인원 등을 종합적으로 고려하여 
                맞춤형 견적을 제공합니다. 상담을 통해 예산에 맞는 최적의 솔루션을 제안드립니다.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-medium mb-3">작업 기간은 얼마나 걸리나요?</h3>
              <p className="text-gray-300 leading-relaxed">
                프로젝트 성격에 따라 다르지만, 일반적으로 2주-3개월 정도 소요됩니다. 
                정확한 일정은 초기 상담에서 논의하여 결정합니다.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-medium mb-3">해외 프로젝트도 가능한가요?</h3>
              <p className="text-gray-300 leading-relaxed">
                네, 해외 프로젝트도 진행 가능합니다. 
                원격 협업 시스템을 갖추고 있으며, 필요시 현지 출장도 검토할 수 있습니다.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}