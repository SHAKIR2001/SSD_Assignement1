import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  function onChange(e) {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  }

  function onSubmit(e) {
    e.preventDefault();

    axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/contact`,{
      name : form.name,
      email : form.email,
      phone : form.phone,
      subject : form.subject,
      message : form.message

    }).then(()=>{
      toast.success("Message sent succeessfully");
    }).catch((e)=>{
      console.log(e);
      toast.error("Faild to send a message")
    })


    

  }

  return (
    <div className="w-full min-h-screen px-6 py-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <h1 className="text-3xl md:text-5xl font-bold text-gray-800">Contact Us</h1>
          <p className="text-gray-600 mt-3 max-w-2xl">
            Have a question about a product, pricing, or availability? Send us a message and we’ll
            get back to you.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Contact Info */}
          <div className="md:col-span-1 space-y-4">
            <div className="bg-white rounded-2xl shadow p-6">
              <h3 className="font-bold text-gray-800">KV Audio & Lights</h3>
              <p className="text-sm text-gray-600 mt-2">
                Support hours: 9.00 AM – 6.00 PM
              </p>
              <div className="mt-4 text-sm text-gray-700 space-y-2">
                <p>
                  <span className="font-semibold">Phone:</span> +94 xx xxx xxxx
                </p>
                <p>
                  <span className="font-semibold">Email:</span> support@kvaudio.lk
                </p>
                <p>
                  <span className="font-semibold">Location:</span> Sri Lanka
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow p-6">
              <h3 className="font-bold text-gray-800">Quick Note</h3>
              <p className="text-sm text-gray-600 mt-2">
                Include the product name if you’re asking about a specific item.
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="md:col-span-2 bg-white rounded-2xl shadow p-6 md:p-8">
            <h2 className="text-xl font-bold text-gray-800">Send a Message</h2>

            <form onSubmit={onSubmit} className="mt-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Your Name
                  </label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={onChange}
                    required
                    className="w-full h-11 px-3 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-purple-300"
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={onChange}
                    required
                    className="w-full h-11 px-3 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-purple-300"
                    placeholder="name@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Phone (optional)
                  </label>
                  <input
                    type = "tel"
                    inputMode="numeric"
                    maxLength={10}
                    name="phone"
                    value={form.phone}
                    onChange={onChange}
                    className="w-full h-11 px-3 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-purple-300"
                    placeholder="+94 ..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Subject
                  </label>
                  <input
                    name="subject"
                    value={form.subject}
                    onChange={onChange}
                    required
                    className="w-full h-11 px-3 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-purple-300"
                    placeholder="Product inquiry / Pricing / Support"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={onChange}
                  required
                  rows={6}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-purple-300 resize-y"
                  placeholder="Write your message..."
                />
              </div>

              <button
                type="submit"
                className="w-full h-11 inline-flex items-center justify-center rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 transition"
              >
                Send Message
              </button>

              <p className="text-xs w-35 text-black-500 bg-red-600">
                
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}