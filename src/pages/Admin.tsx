import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import Seo from '../components/Seo';
import { clearInterests, getInterests, type InterestRecord } from '../lib/interests';

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
}

export default function Admin() {
  const navigate = useNavigate();
  const [interests, setInterests] = useState<InterestRecord[]>(() => getInterests());

  const expertiseInterests = useMemo(
    () => interests.filter((interest) => interest.source === 'expertise'),
    [interests]
  );
  const portfolioInterests = useMemo(
    () => interests.filter((interest) => interest.source === 'portfolio'),
    [interests]
  );

  const handleClear = () => {
    clearInterests();
    setInterests([]);
  };

  return (
    <main className="min-h-screen bg-obsidian text-parchment px-6 py-10 md:px-16 md:py-16">
      <Seo
        title="Indraam Studio Admin | Interest Dashboard"
        description="Internal interest dashboard for Indraam Studio."
        keywords={['Indraam Studio', 'admin dashboard', 'interest dashboard']}
        path="/admin"
        noIndex
      />

      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-mono text-[10px] tracking-[0.35em] uppercase text-saffron/70 mb-2">
              Admin
            </p>
            <h1 className="font-display text-[clamp(34px,6vw,80px)] leading-none">Interest Dashboard</h1>
            <p className="text-fog/60 mt-3">
              All interests from Expertise and Portfolio sections are listed below.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 border border-white/15 text-fog/80 hover:text-parchment hover:border-saffron/40 transition-colors"
            >
              Back to Home
            </button>
            <button
              onClick={handleClear}
              className="px-4 py-2 border border-saffron/40 text-saffron hover:bg-saffron hover:text-obsidian transition-colors"
            >
              Clear All
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border border-white/10 p-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-fog/60">Total</p>
            <p className="font-display text-4xl mt-2">{interests.length}</p>
          </div>
          <div className="border border-white/10 p-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-fog/60">Expertise</p>
            <p className="font-display text-4xl mt-2">{expertiseInterests.length}</p>
          </div>
          <div className="border border-white/10 p-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-fog/60">Portfolio</p>
            <p className="font-display text-4xl mt-2">{portfolioInterests.length}</p>
          </div>
        </div>

        <section className="border border-white/10 p-5 md:p-7">
          <h2 className="font-display text-3xl">Expertise Interests</h2>
          {expertiseInterests.length === 0 ? (
            <p className="text-fog/60 mt-4">No expertise requests yet.</p>
          ) : (
            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-[720px] text-left">
                <thead>
                  <tr className="border-b border-white/10 font-mono text-[10px] uppercase tracking-[0.2em] text-fog/60">
                    <th className="py-3 pr-4">Time</th>
                    <th className="py-3 pr-4">Service</th>
                    <th className="py-3 pr-4">Name</th>
                    <th className="py-3 pr-4">Business</th>
                    <th className="py-3 pr-4">Phone</th>
                    <th className="py-3">Email</th>
                  </tr>
                </thead>
                <tbody>
                  {expertiseInterests.map((interest) => (
                    <tr key={interest.id} className="border-b border-white/5 text-sm text-fog/85">
                      <td className="py-3 pr-4">{formatDate(interest.createdAt)}</td>
                      <td className="py-3 pr-4">{interest.service || '-'}</td>
                      <td className="py-3 pr-4">{interest.name || '-'}</td>
                      <td className="py-3 pr-4">{interest.businessName || '-'}</td>
                      <td className="py-3 pr-4">{interest.contactNumber || '-'}</td>
                      <td className="py-3">{interest.email || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="border border-white/10 p-5 md:p-7">
          <h2 className="font-display text-3xl">Portfolio Interests</h2>
          {portfolioInterests.length === 0 ? (
            <p className="text-fog/60 mt-4">No portfolio interests yet.</p>
          ) : (
            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-[520px] text-left">
                <thead>
                  <tr className="border-b border-white/10 font-mono text-[10px] uppercase tracking-[0.2em] text-fog/60">
                    <th className="py-3 pr-4">Time</th>
                    <th className="py-3 pr-4">Project</th>
                    <th className="py-3">Category</th>
                  </tr>
                </thead>
                <tbody>
                  {portfolioInterests.map((interest) => (
                    <tr key={interest.id} className="border-b border-white/5 text-sm text-fog/85">
                      <td className="py-3 pr-4">{formatDate(interest.createdAt)}</td>
                      <td className="py-3 pr-4">
                        {interest.projectNum ? `${interest.projectNum} - ` : ''}
                        {interest.projectTitle || '-'}
                      </td>
                      <td className="py-3">{interest.projectCategory || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
