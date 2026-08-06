'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';

export interface FAQItem {
    q: string;
    a: string;
}

interface FAQProps {
    items: FAQItem[];
}

const FAQ: React.FC<FAQProps> = ({ items }) => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggle = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="section section-faq" id="faq">
            <div className="container">
                <motion.div
                    className="text-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <div className="section-label">Got questions?</div>
                    <h2 className="section-title center">Frequently Asked Questions</h2>
                    <p className="section-subtitle center">
                        Everything you need to know about ResuCraft.
                    </p>
                </motion.div>

                <motion.div
                    className="faq-list"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ delay: 0.1 }}
                >
                    {items.map((item, i) => {
                        const isOpen = openIndex === i;
                        return (
                            <motion.div
                                key={i}
                                className={`faq-item ${isOpen ? 'open' : ''}`}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.05 }}
                            >
                                <button
                                    className="faq-question"
                                    onClick={() => toggle(i)}
                                    aria-expanded={isOpen}
                                >
                                    <span className="faq-question-icon">
                                        <HelpCircle size={16} />
                                    </span>
                                    <span className="faq-question-text">{item.q}</span>
                                    <motion.span
                                        className="faq-chevron"
                                        animate={{ rotate: isOpen ? 180 : 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <ChevronDown size={16} />
                                    </motion.span>
                                </button>
                                <AnimatePresence initial={false}>
                                    {isOpen && (
                                        <motion.div
                                            className="faq-answer"
                                            key="content"
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.25, ease: 'easeInOut' }}
                                        >
                                            <p>{item.a}</p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>
        </section>
    );
};

export default FAQ;
