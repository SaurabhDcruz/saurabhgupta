import { useState, useRef, useEffect } from 'react';
import emailjs from '@emailjs/browser';

const useContactForm = () => {
    const formRef = useRef();
    const [isSending, setIsSending] = useState(false);
    const [statusMessage, setStatusMessage] = useState('');
    const [errors, setErrors] = useState({});

    useEffect(() => {
        emailjs.init('igHgbkgHLzDIhLaut');
    }, []);

    const sendEmail = (e) => {
        e.preventDefault();

        const formData = new FormData(formRef.current);
        const name = formData.get('name')?.trim();
        const email = formData.get('email')?.trim();
        const phone = formData.get('phone')?.trim();
        const title = formData.get('title')?.trim();
        const message = formData.get('message')?.trim();

        const newErrors = {};
        if (!name) newErrors.name = true;
        if (!email) newErrors.email = true;
        if (!phone) newErrors.phone = true;
        if (!title) newErrors.title = true;
        if (!message) newErrors.message = true;

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setStatusMessage('Please fill in all fields properly. ⚠️');
            setTimeout(() => setStatusMessage(''), 5000);
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setErrors(prev => ({ ...prev, email: true }));
            setStatusMessage('Please enter a valid email address. 📧');
            setTimeout(() => setStatusMessage(''), 5000);
            return;
        }

        setErrors({});
        setIsSending(true);
        setStatusMessage('Sending your message...');

        emailjs.sendForm('service_hkijshf', 'template_x6fo10p', formRef.current)
            .then(() => {
                setIsSending(false);
                setStatusMessage('Message sent successfully! ✨');
                formRef.current.reset();
                setTimeout(() => setStatusMessage(''), 5000);
            }, (error) => {
                setIsSending(false);
                setStatusMessage(`Failed: ${error.text || 'Check console'}`);
                setTimeout(() => setStatusMessage(''), 5000);
            });
    };

    return {
        formRef,
        isSending,
        statusMessage,
        errors,
        setErrors,
        sendEmail,
    };
};

export default useContactForm;
