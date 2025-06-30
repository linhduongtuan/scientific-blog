"use client";
import React, { useState } from "react";

export default function RecruitPage() {
  // Calculate max date for 10 years old
  const today = new Date();
  const minDob = "1900-01-01";
  const maxDob = new Date(today.getFullYear() - 10, today.getMonth(), today.getDate())
    .toISOString()
    .slice(0, 10);

  // Full ISO country list for nationality suggestion
  const nationalityList = [
    "Afghan", "Albanian", "Algerian", "American", "Andorran", "Angolan", "Antiguans", "Argentinean", "Armenian", "Australian", "Austrian", "Azerbaijani", "Bahamian", "Bahraini", "Bangladeshi", "Barbadian", "Barbudans", "Batswana", "Belarusian", "Belgian", "Belizean", "Beninese", "Bhutanese", "Bolivian", "Bosnian", "Brazilian", "British", "Bruneian", "Bulgarian", "Burkinabe", "Burmese", "Burundian", "Cambodian", "Cameroonian", "Canadian", "Cape Verdean", "Central African", "Chadian", "Chilean", "Chinese", "Colombian", "Comoran", "Congolese", "Costa Rican", "Croatian", "Cuban", "Cypriot", "Czech", "Danish", "Djibouti", "Dominican", "Dutch", "East Timorese", "Ecuadorean", "Egyptian", "Emirian", "Equatorial Guinean", "Eritrean", "Estonian", "Ethiopian", "Fijian", "Filipino", "Finnish", "French", "Gabonese", "Gambian", "Georgian", "German", "Ghanaian", "Greek", "Grenadian", "Guatemalan", "Guinea-Bissauan", "Guinean", "Guyanese", "Haitian", "Herzegovinian", "Honduran", "Hungarian", "I-Kiribati", "Icelander", "Indian", "Indonesian", "Iranian", "Iraqi", "Irish", "Israeli", "Italian", "Ivorian", "Jamaican", "Japanese", "Jordanian", "Kazakhstani", "Kenyan", "Kittian and Nevisian", "Kuwaiti", "Kyrgyz", "Laotian", "Latvian", "Lebanese", "Liberian", "Libyan", "Liechtensteiner", "Lithuanian", "Luxembourger", "Macedonian", "Malagasy", "Malawian", "Malaysian", "Maldivan", "Malian", "Maltese", "Marshallese", "Mauritanian", "Mauritian", "Mexican", "Micronesian", "Moldovan", "Monacan", "Mongolian", "Moroccan", "Mosotho", "Motswana", "Mozambican", "Namibian", "Nauruan", "Nepalese", "New Zealander", "Nicaraguan", "Nigerian", "Nigerien", "North Korean", "Northern Irish", "Norwegian", "Omani", "Pakistani", "Palauan", "Panamanian", "Papua New Guinean", "Paraguayan", "Peruvian", "Polish", "Portuguese", "Qatari", "Romanian", "Russian", "Rwandan", "Saint Lucian", "Salvadoran", "Samoan", "San Marinese", "Sao Tomean", "Saudi", "Scottish", "Senegalese", "Serbian", "Seychellois", "Sierra Leonean", "Singaporean", "Slovakian", "Slovenian", "Solomon Islander", "Somali", "South African", "South Korean", "Spanish", "Sri Lankan", "Sudanese", "Surinamer", "Swazi", "Swedish", "Swiss", "Syrian", "Taiwanese", "Tajik", "Tanzanian", "Thai", "Togolese", "Tongan", "Trinidadian or Tobagonian", "Tunisian", "Turkish", "Tuvaluan", "Ugandan", "Ukrainian", "Uruguayan", "Uzbekistani", "Venezuelan", "Vietnamese", "Welsh", "Yemenite", "Zambian", "Zimbabwean", "Other"
  ];

  const [form, setForm] = useState({
    name: "",
    email: "",
    gender: "",
    dob: "",
    nationality: "",
    position: "PhD Student",
    coverLetter: "",
    coverLetterFile: null as File | null,
    cv: null as File | null,
    recommendationLetters: [] as File[],
    certificates: [] as File[],
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, files } = e.target as any;
    if (name === "cv" && files) {
      setForm((prev) => ({ ...prev, cv: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccess(null);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("email", form.email);
      formData.append("gender", form.gender);
      formData.append("dob", form.dob);
      formData.append("nationality", form.nationality);
      formData.append("position", form.position);
      formData.append("coverLetter", form.coverLetter);
      if (form.coverLetterFile) formData.append("coverLetterFile", form.coverLetterFile);
      if (form.cv) formData.append("cv", form.cv);
      form.recommendationLetters.forEach((file, idx) => {
        if (file) formData.append(`recommendationLetters`, file);
      });
      form.certificates.forEach((file, idx) => {
        if (file) formData.append(`certificates`, file);
      });

      const res = await fetch("/api/recruit/apply", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        setSuccess("Application submitted successfully!");
        setForm({ name: "", email: "", gender: "", dob: "", nationality: "", position: "PhD Student", coverLetter: "", coverLetterFile: null, cv: null, recommendationLetters: [], certificates: [] });
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data?.error || "Failed to submit application.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-4">Join Our Lab: Open Positions</h1>
      <p className="mb-6">We are always looking for talented and motivated students and postdocs to join our team. If you are interested in computational biology, machine learning, or interdisciplinary research, we encourage you to apply!</p>
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Current Openings</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>PhD Students:</strong> Multiple positions available. Background in bioinformatics, computer science, or related fields preferred.</li>
          <li><strong>Postdoctoral Fellows:</strong> Openings for candidates with experience in genomics, AI, or translational medicine.</li>
          <li><strong>Internships:</strong> Short-term research internships for undergraduates and master’s students.</li>
        </ul>
      </section>
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">How to Apply</h2>
        <p>Fill out the application form below, or send your CV and a brief statement of interest to <a href="mailto:your.email@university.edu" className="text-blue-600 hover:underline">your.email@university.edu</a>. Please specify the position you are applying for in the subject line.</p>
      </section>
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Application Form</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block font-medium mb-1" htmlFor="name">Full Name<span className="text-red-600">*</span></label>
            <input type="text" id="name" name="name" required className="w-full border rounded px-3 py-2" value={form.name} onChange={handleChange} />
          </div>
          <div>
            <label className="block font-medium mb-1" htmlFor="email">Email<span className="text-red-600">*</span></label>
            <input type="email" id="email" name="email" required className="w-full border rounded px-3 py-2" value={form.email} onChange={handleChange} />
          </div>
          <div>
            <label className="block font-medium mb-1" htmlFor="gender">Gender<span className="text-red-600">*</span></label>
            <select id="gender" name="gender" required className="w-full border rounded px-3 py-2" value={form.gender} onChange={handleChange}>
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
              <option value="Prefer not to say">Prefer not to say</option>
            </select>
          </div>
          <div>
            <label className="block font-medium mb-1" htmlFor="dob">Date of Birth<span className="text-red-600">*</span></label>
            <input
              type="date"
              id="dob"
              name="dob"
              required
              className="w-full border rounded px-3 py-2"
              value={form.dob}
              onChange={handleChange}
              min={minDob}
              max={maxDob}
            />
            <span className="text-xs text-gray-500">Applicants must be at least 10 years old.</span>
          </div>
          <div>
            <label className="block font-medium mb-1" htmlFor="nationality">Nationality<span className="text-red-600">*</span></label>
            <input
              type="text"
              id="nationality"
              name="nationality"
              required
              className="w-full border rounded px-3 py-2"
              value={form.nationality}
              onChange={handleChange}
              list="nationality-list"
            />
            <datalist id="nationality-list">
              {nationalityList.map((nat) => (
                <option value={nat} key={nat} />
              ))}
            </datalist>
          </div>
          <div>
            <label className="block font-medium mb-1" htmlFor="position">Position<span className="text-red-600">*</span></label>
            <select id="position" name="position" className="w-full border rounded px-3 py-2" value={form.position} onChange={handleChange}>
              <option>PhD Student</option>
              <option>Postdoctoral Fellow</option>
              <option>Internship</option>
            </select>
          </div>
          <div>
            <label className="block font-medium mb-1" htmlFor="cv">CV (PDF, DOC, DOCX, max 5MB)<span className="text-red-600">*</span></label>
            <input
              type="file"
              id="cv"
              name="cv"
              accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              required
              className="w-full"
              onChange={e => {
                const file = e.target.files?.[0] || null;
                if (file && file.size > 5 * 1024 * 1024) {
                  alert("CV file must be less than 5MB");
                  return;
                }
                handleChange(e);
              }}
            />
          </div>
          <div>
            <label className="block font-medium mb-1" htmlFor="coverLetter">Cover Letter<span className="text-red-600">*</span></label>
            <textarea id="coverLetter" name="coverLetter" rows={4} placeholder="Write your cover letter here or upload a file below" className="w-full border rounded px-3 py-2" value={form.coverLetter} onChange={handleChange} />
            <div className="mt-2">
              <label className="block font-medium mb-1" htmlFor="coverLetterFile">Or upload Cover Letter (PDF, DOC, DOCX, max 5MB)</label>
              <input
                type="file"
                id="coverLetterFile"
                name="coverLetterFile"
                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                className="w-full"
                onChange={e => {
                  const file = e.target.files?.[0] || null;
                  if (file && file.size > 5 * 1024 * 1024) {
                    alert("Cover letter file must be less than 5MB");
                    return;
                  }
                  setForm(f => ({ ...f, coverLetterFile: file }));
                }}
              />
            </div>
            <span className="text-xs text-gray-500">You may either write your cover letter above or upload a file. If both are provided, the file will be used.</span>
          </div>
          <div>
            <label className="block font-medium mb-1" htmlFor="recommendationLetters">Recommendation Letters (PDF, DOC, DOCX, max 3 files, each ≤ 5MB)</label>
            {form.recommendationLetters.map((file, idx) => (
              <div key={idx} className="flex items-center gap-2 mb-1">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  className="w-full"
                  onChange={e => {
                    const f = e.target.files?.[0];
                    if (f && f.size > 5 * 1024 * 1024) {
                      alert("Each recommendation letter must be less than 5MB");
                      return;
                    }
                    setForm(prev => {
                      const arr = [...prev.recommendationLetters];
                      arr[idx] = f || null;
                      return { ...prev, recommendationLetters: arr.filter(Boolean) };
                    });
                  }}
                />
                <button type="button" className="text-red-600" onClick={() => {
                  setForm(prev => {
                    const arr = [...prev.recommendationLetters];
                    arr.splice(idx, 1);
                    return { ...prev, recommendationLetters: arr };
                  });
                }}>Remove</button>
                {file && <span className="text-xs text-gray-600">{file.name}</span>}
              </div>
            ))}
            {form.recommendationLetters.length < 3 && (
              <button
                type="button"
                className="mt-1 px-2 py-1 rounded text-sm bg-blue-600 text-white dark:bg-blue-300 dark:text-blue-900 hover:bg-blue-700 dark:hover:bg-blue-200 transition-colors border border-blue-700 dark:border-blue-800 font-semibold shadow"
                onClick={() => setForm(prev => ({ ...prev, recommendationLetters: [...prev.recommendationLetters, null as any] }))}
              >Add another</button>
            )}
          </div>
          <div>
            <label className="block font-medium mb-1" htmlFor="certificates">Certificates (PDF, DOC, DOCX, max 5 files, each ≤ 5MB)</label>
            {form.certificates.map((file, idx) => (
              <div key={idx} className="flex items-center gap-2 mb-1">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  className="w-full"
                  onChange={e => {
                    const f = e.target.files?.[0];
                    if (f && f.size > 5 * 1024 * 1024) {
                      alert("Each certificate must be less than 5MB");
                      return;
                    }
                    setForm(prev => {
                      const arr = [...prev.certificates];
                      arr[idx] = f || null;
                      return { ...prev, certificates: arr.filter(Boolean) };
                    });
                  }}
                />
                <button type="button" className="text-red-600" onClick={() => {
                  setForm(prev => {
                    const arr = [...prev.certificates];
                    arr.splice(idx, 1);
                    return { ...prev, certificates: arr };
                  });
                }}>Remove</button>
                {file && <span className="text-xs text-gray-600">{file.name}</span>}
              </div>
            ))}
            {form.certificates.length < 5 && (
              <button
                type="button"
                className="mt-1 px-2 py-1 rounded text-sm bg-blue-600 text-white dark:bg-blue-300 dark:text-blue-900 hover:bg-blue-700 dark:hover:bg-blue-200 transition-colors border border-blue-700 dark:border-blue-800 font-semibold shadow"
                onClick={() => setForm(prev => ({ ...prev, certificates: [...prev.certificates, null as any] }))}
              >Add another</button>
            )}
          </div>
          {success && <div className="text-green-600 font-medium">{success}</div>}
          {error && <div className="text-red-600 font-medium">{error}</div>}
          <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded disabled:opacity-60" disabled={submitting}>{submitting ? "Submitting..." : "Submit Application"}</button>
        </form>
      </section>
      <section>
        <h2 className="text-2xl font-semibold mb-2">Why Join Us?</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Work on cutting-edge research projects</li>
          <li>Collaborate with a diverse and international team</li>
          <li>Access to state-of-the-art facilities and resources</li>
          <li>Opportunities for career development and networking</li>
        </ul>
      </section>
    </main>
  );
}
