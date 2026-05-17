'use client';

import { useCallback, useMemo, useState } from 'react';
import { Mail, Phone, MapPin, Instagram, Send, Check } from 'lucide-react';
import { ValidatedField, invalidFieldClass } from '@/components/validated-field';
import {
  trimValue,
  normalizePhoneDigits,
  validateName,
  validatePakistaniPhone,
  validateEmail,
  validateMessage,
} from '@/lib/validation';
import { useFieldValidation } from '@/hooks/use-field-validation';

const INPUT_CLASS =
  'w-full px-4 py-3 border border-[#FAC1B5]/30 rounded-xl focus:outline-none focus:border-[#F283AE] focus:ring-2 focus:ring-[#F283AE]/20 transition-colors';

type ContactFields = 'name' | 'phone' | 'email' | 'message';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validators = useMemo(
    () => ({
      name: () => validateName(formData.name),
      phone: () => validatePakistaniPhone(formData.phone),
      email: () => validateEmail(formData.email, true),
      message: () => validateMessage(formData.message),
    }),
    [formData]
  );

  const { touched, errors, blurValidate, validateAll, isValid } =
    useFieldValidation<ContactFields>(validators);

  const update = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateAll(['name', 'phone', 'email', 'message'])) return;

    setFormData({
      name: trimValue(formData.name),
      phone: normalizePhoneDigits(formData.phone),
      email: trimValue(formData.email),
      message: trimValue(formData.message),
    });
    setIsSubmitted(true);
  };

  const fieldInvalid = useCallback(
    (field: ContactFields) => Boolean(touched[field] && errors[field]),
    [touched, errors]
  );

  if (isSubmitted) {
    return (
      <div className="min-h-screen pt-20 px-6 md:px-12 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-20 h-20 bg-[#98B8B9] rounded-full flex items-center justify-center mx-auto mb-8">
            <Check size={40} className="text-white" />
          </div>
          <h1 className="text-3xl font-serif text-[#2C2C2C] mb-4">Message Sent!</h1>
          <p className="text-lg text-[#98898D] mb-8">
            Thank you for reaching out. We&apos;ll get back to you as soon as possible.
          </p>
          <button
            type="button"
            onClick={() => {
              setIsSubmitted(false);
              setFormData({ name: '', phone: '', email: '', message: '' });
            }}
            className="px-8 py-3 bg-[#F283AE] text-white rounded-full font-semibold hover:bg-[#E86FA3] transition-colors"
          >
            Send Another Message
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 px-6 md:px-12 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-serif text-[#2C2C2C] mb-3">Contact Us</h1>
          <p className="text-lg text-[#98898D]">We&apos;d love to hear from you. Get in touch with us today!</p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-serif text-[#2C2C2C] mb-6">Information</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#F283AE]/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone size={20} className="text-[#F283AE]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#2C2C2C] mb-1">Phone</h3>
                    <a href="tel:03270203490" className="text-[#98898D] hover:text-[#F283AE] transition-colors">
                      03270203490
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#C59FBE]/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail size={20} className="text-[#C59FBE]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#2C2C2C] mb-1">Email</h3>
                    <a
                      href="mailto:minasbakeshopp@gmail.com"
                      className="text-[#98898D] hover:text-[#F283AE] transition-colors"
                    >
                      minasbakeshopp@gmail.com
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#98B8B9]/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin size={20} className="text-[#98B8B9]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#2C2C2C] mb-1">Address</h3>
                    <p className="text-[#98898D]">Nawab Town, Lahore, Pakistan</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-serif text-[#2C2C2C] mb-6">Social Media</h2>
              <div className="space-y-4">
                <a
                  href="https://www.instagram.com/minasbakeshopp?igsh=MXZueGVnMzh0MjNmbA=="
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 bg-[#F283AE]/5 rounded-xl hover:bg-[#F283AE]/10 transition-colors"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-[#F283AE] to-[#C59FBE] rounded-full flex items-center justify-center">
                    <Instagram size={24} className="text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#2C2C2C]">Instagram</p>
                    <p className="text-sm text-[#98898D]">@minasbakeshopp</p>
                  </div>
                </a>
                <a
                  href="https://wa.me/923270203490"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 bg-[#98B8B9]/5 rounded-xl hover:bg-[#98B8B9]/10 transition-colors"
                >
                  <div className="w-12 h-12 bg-[#25D366] rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-[#2C2C2C]">WhatsApp</p>
                    <p className="text-sm text-[#98898D]">03270203490</p>
                  </div>
                </a>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-[#FAC1B5]/20 p-8">
            <h2 className="text-2xl font-serif text-[#2C2C2C] mb-6">Send us a Message</h2>
            <form onSubmit={handleSubmit} noValidate className="space-y-6">
              <ValidatedField label="Name" htmlFor="contact-name" required error={errors.name} touched={touched.name}>
                <input
                  id="contact-name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => update('name', e.target.value)}
                  onBlur={() => blurValidate('name')}
                  placeholder="Your name"
                  aria-invalid={fieldInvalid('name')}
                  className={invalidFieldClass(fieldInvalid('name'), INPUT_CLASS)}
                />
              </ValidatedField>

              <ValidatedField label="Phone Number" htmlFor="contact-phone" required error={errors.phone} touched={touched.phone}>
                <input
                  id="contact-phone"
                  type="tel"
                  inputMode="tel"
                  value={formData.phone}
                  onChange={(e) => update('phone', e.target.value)}
                  onBlur={() => blurValidate('phone')}
                  placeholder="03XX XXXXXXX"
                  aria-invalid={fieldInvalid('phone')}
                  className={invalidFieldClass(fieldInvalid('phone'), INPUT_CLASS)}
                />
              </ValidatedField>

              <ValidatedField label="Email" htmlFor="contact-email" required error={errors.email} touched={touched.email}>
                <input
                  id="contact-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => update('email', e.target.value)}
                  onBlur={() => blurValidate('email')}
                  placeholder="your@email.com"
                  aria-invalid={fieldInvalid('email')}
                  className={invalidFieldClass(fieldInvalid('email'), INPUT_CLASS)}
                />
              </ValidatedField>

              <ValidatedField label="Message" htmlFor="contact-message" required error={errors.message} touched={touched.message}>
                <textarea
                  id="contact-message"
                  value={formData.message}
                  onChange={(e) => update('message', e.target.value)}
                  onBlur={() => blurValidate('message')}
                  placeholder="Write your message here..."
                  rows={5}
                  aria-invalid={fieldInvalid('message')}
                  className={invalidFieldClass(fieldInvalid('message'), `${INPUT_CLASS} resize-none`)}
                />
              </ValidatedField>

              <button
                type="submit"
                disabled={!isValid}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-[#F283AE] text-white rounded-xl font-semibold hover:bg-[#E86FA3] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={20} />
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
