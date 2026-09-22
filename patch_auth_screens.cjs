const fs = require('fs');
let code = fs.readFileSync('src/components/AuthScreens.tsx', 'utf8');

// Update LoginScreen styling for glassmorphism
code = code.replace(/<div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">/g, 
  '<div className="w-full max-w-md bg-slate-900/60 backdrop-blur-xl border border-indigo-500/30 rounded-3xl p-8 shadow-[0_0_50px_rgba(79,70,229,0.15)] relative overflow-hidden">');

// Update RegisterScreen styling and add trial checkbox
const registerFormRegex = /<form onSubmit=\{handleSubmit\} className="space-y-4 text-right">([\s\S]*?)<\/form>/;
code = code.replace(registerFormRegex, (match, p1) => {
  return `<form onSubmit={handleSubmit} className="space-y-4 text-right">
${p1.replace('</form>', '')}
          <label className="flex items-center gap-2 cursor-pointer mt-2 text-sm text-slate-300">
            <input type="checkbox" id="requestTrial" className="rounded bg-slate-900 border-slate-700 text-indigo-500 focus:ring-indigo-500" />
            <span>الحصول على فترة تجريبية مجانية (7 أيام)</span>
          </label>
        </form>`;
});

// Update handleRegister to read the trial checkbox
const handleRegisterRegex = /const handleSubmit = async \(e: React.FormEvent\) => \{\s+e\.preventDefault\(\);\s+setError\(''\);\s+try \{/;
code = code.replace(handleRegisterRegex, `const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const requestTrial = (document.getElementById('requestTrial') as HTMLInputElement)?.checked || false;
    try {`);

// Update fetch to send requestTrial
code = code.replace(/body: JSON.stringify\(\{ username, email, password \}\)/g, 'body: JSON.stringify({ username, email, password, requestTrial })');

// Update styling in RegisterScreen
code = code.replace(/<div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">/g, 
  '<div className="w-full max-w-md bg-slate-900/60 backdrop-blur-xl border border-indigo-500/30 rounded-3xl p-8 shadow-[0_0_50px_rgba(79,70,229,0.15)] relative overflow-hidden">');

// Update Admin table to show trial status
const tableHeaderRegex = /<th className="p-4">الحالة \(الدفع\)<\/th>/;
code = code.replace(tableHeaderRegex, '<th className="p-4">الحالة (الدفع)</th><th className="p-4">النوع</th>');

const tableRowRegex = /<td className="p-4">\s*\{u\.isActive \?\s*<span className="flex items-center gap-1 text-emerald-400 font-bold"><CheckCircle className="w-4 h-4"\/> مفعل<\/span> :\s*<span className="flex items-center gap-1 text-amber-500 font-bold"><XCircle className="w-4 h-4"\/> غير مفعل \(انتظار الدفع\)<\/span>\s*\}\s*<\/td>/;
code = code.replace(tableRowRegex, `<td className="p-4">
                      {u.isActive ? 
                         <span className="flex items-center gap-1 text-emerald-400 font-bold"><CheckCircle className="w-4 h-4"/> مفعل</span> : 
                         <span className="flex items-center gap-1 text-amber-500 font-bold"><XCircle className="w-4 h-4"/> غير مفعل (انتظار الدفع)</span>
                      }
                    </td>
                    <td className="p-4 text-xs font-bold text-slate-300">
                      {u.isTrial ? <span className="text-indigo-400">فترة تجريبية</span> : 'اشتراك دائم'}
                    </td>`);

fs.writeFileSync('src/components/AuthScreens.tsx', code);
