import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, CheckCircle2 } from 'lucide-react';
import { mockCats } from '../lib/mockData';
import { supabase } from '../lib/supabase';

export function AdoptionForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    catId: "",
    message: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    const selectedCat = mockCats.find(cat => cat.id === formData.catId);
    const catName = selectedCat ? selectedCat.name : (formData.catId === 'undecided' ? 'Undecided' : '');

    const { error } = await supabase
      .from('adoption_applications')
      .insert([
        { 
          first_name: formData.firstName, 
          last_name: formData.lastName, 
          email: formData.email, 
          phone: formData.phone, 
          cat_id: formData.catId, 
          cat_name: catName,
          message: formData.message 
        }
      ]);

    setIsSubmitting(false);

    if (error) {
      setErrorMsg(error.message);
    } else {
      setIsSubmitted(true);
      setFormData({ firstName: "", lastName: "", email: "", phone: "", catId: "", message: "" });
    }
  };

  return (
    <section className="py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Ready to Adopt?
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Fill out the form below to start the adoption process. We'll get back to you within 48 hours.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 p-8 md:p-12 overflow-hidden relative">
          <AnimatePresence mode="wait">
            {isSubmitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-12"
              >
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                  Application Received!
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-8">
                  Thank you for your interest in adopting. Our team will review your application and contact you soon.
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="text-orange-600 dark:text-orange-400 font-medium hover:underline"
                >
                  Submit another application
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -20 }}
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">First Name</label>
                    <input required type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none transition-all" placeholder="Jane" />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Last Name</label>
                    <input required type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none transition-all" placeholder="Doe" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Email Address</label>
                    <input required type="email" id="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none transition-all" placeholder="jane@example.com" />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Phone Number</label>
                    <input required type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none transition-all" placeholder="(555) 123-4567" />
                  </div>
                </div>

                <div>
                  <label htmlFor="catId" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Which cat are you interested in?</label>
                  <select required id="catId" name="catId" value={formData.catId} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none transition-all appearance-none">
                    <option value="" disabled>Select a cat...</option>
                    {mockCats.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                    <option value="undecided">I'm not sure yet!</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Tell us a bit about your home</label>
                  <textarea required id="message" name="message" value={formData.message} onChange={handleChange} rows={4} className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none transition-all resize-none" placeholder="Do you have other pets? A yard?"></textarea>
                </div>

                {errorMsg && (
                  <p className="text-red-500 text-sm font-medium">{errorMsg}</p>
                )}

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isSubmitting}
                  type="submit"
                  className="w-full flex items-center justify-center py-4 px-6 rounded-xl text-white bg-orange-600 hover:bg-orange-700 focus:ring-4 focus:ring-orange-500/20 font-medium transition-all disabled:opacity-70"
                >
                  {isSubmitting ? (
                    "Submitting..."
                  ) : (
                    <>
                      Submit Application
                      <Send className="w-5 h-5 ml-2" />
                    </>
                  )}
                </motion.button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
