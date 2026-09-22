import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { Lock, User as UserIcon, Key, ShieldCheck, CreditCard, ChevronRight, Users, CheckCircle, XCircle, Zap, Cpu } from 'lucide-react';
import { collection, doc, updateDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { handleFirestoreError, OperationType } from '../lib/firebaseRepair';

export const LoginScreen = ({ onSwitch }: { onSwitch: () => void }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, loginWithGoogle } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(username, password);
    } catch (err: any) {
      setError(err.message || 'حدث خطأ أثناء تسجيل الدخول');
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    try {
      await loginWithGoogle();
    } catch (err: any) {
      setError(err.message || 'حدث خطأ أثناء تسجيل الدخول عبر جوجل');
    }
  };

  return (
    <div className="min-h-screen bg-[#050B14] flex flex-col items-center justify-center p-4 font-['Cairo'] relative overflow-hidden" dir="rtl">
      {/* Advanced Futuristic Background Effects */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-emerald-600/20 rounded-full blur-[120px] pointer-events-none"></div>
      
      {/* Title */}
      <div className="text-center mb-8 z-10">
        <div className="inline-flex items-center justify-center p-4 bg-indigo-500/10 rounded-2xl mb-4 border border-indigo-500/30 shadow-[0_0_30px_rgba(79,70,229,0.2)]">
          <Cpu className="w-10 h-10 text-indigo-400" />
        </div>
        <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400 tracking-wider">
          Universal AI Master Studio
        </h1>
        <p className="text-slate-400 mt-2 text-sm">البوكس الأذكى والأقوى عالمياً لصيانة وتفليش الهواتف</p>
      </div>

      {/* Login Box - Glassmorphism */}
      <div className="w-full max-w-md bg-slate-900/60 backdrop-blur-2xl border border-indigo-500/30 rounded-3xl p-8 shadow-[0_0_50px_rgba(79,70,229,0.15)] relative overflow-hidden z-10">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
        <h2 className="text-2xl font-black text-white mb-6 text-center">تسجيل الدخول</h2>
        
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-xl mb-6 text-sm text-center font-bold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 text-right">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-2 flex items-center gap-2">
              <UserIcon className="w-4 h-4 text-indigo-400" /> اسم المستخدم أو البريد
            </label>
            <input required type="text" value={username} onChange={e => setUsername(e.target.value)} className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition shadow-inner" placeholder="admin@bashar.com" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-2 flex items-center gap-2">
              <Key className="w-4 h-4 text-indigo-400" /> كلمة المرور (مشفرة)
            </label>
            <input required type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition shadow-inner" placeholder="••••••••" />
          </div>
          <button type="submit" className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-3.5 rounded-xl shadow-lg hover:shadow-indigo-500/30 hover:scale-[1.02] transition-all flex items-center justify-center gap-2">
            دخول مشفر <ShieldCheck className="w-5 h-5" />
          </button>
          
          <div className="relative flex items-center justify-center py-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800"></div>
            </div>
            <span className="relative bg-[#050B14] px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">أو</span>
          </div>

          <button 
            type="button"
            onClick={handleGoogleLogin}
            className="w-full bg-white text-slate-900 font-bold py-3 rounded-xl shadow-lg hover:bg-slate-100 hover:scale-[1.02] transition-all flex items-center justify-center gap-3"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            الدخول عبر جوجل
          </button>
        </form>
        <div className="mt-6 text-center text-xs text-slate-400 pt-4 border-t border-slate-800/50">
          ليس لديك حساب؟ <button onClick={onSwitch} className="text-indigo-400 font-bold hover:text-indigo-300 transition px-2 py-1 bg-indigo-500/10 rounded hover:bg-indigo-500/20">إنشاء حساب جديد</button>
        </div>
      </div>
    </div>
  );
};

export const RegisterScreen = ({ onSwitch }: { onSwitch: () => void }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [requestTrial, setRequestTrial] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await register(username, email, password, requestTrial);
      setSuccess('تم تسجيل الحساب بنجاح! سيتم تحويلك الآن.');
    } catch (err: any) {
      setError(err.message || 'حدث خطأ أثناء التسجيل');
    }
  };

  return (
    <div className="min-h-screen bg-[#050B14] flex flex-col items-center justify-center p-4 font-['Cairo'] relative overflow-hidden" dir="rtl">
      {/* Advanced Futuristic Background Effects */}
      <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-emerald-600/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md bg-slate-900/60 backdrop-blur-2xl border border-emerald-500/30 rounded-3xl p-8 shadow-[0_0_50px_rgba(16,185,129,0.15)] relative z-10">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-600"></div>
        <h2 className="text-2xl font-black text-white mb-6 text-center">إنشاء حساب جديد</h2>
        
        {error && <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-xl mb-6 text-sm text-center font-bold">{error}</div>}
        {success && <div className="bg-emerald-500/10 border border-emerald-500/50 text-emerald-400 p-3 rounded-xl mb-6 text-sm text-center font-bold">{success}</div>}

        <form onSubmit={handleSubmit} className="space-y-4 text-right">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">اسم المستخدم بالكامل</label>
            <input required type="text" value={username} onChange={e => setUsername(e.target.value)} className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">البريد الإلكتروني</label>
            <input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">كلمة المرور (تشفير عالي 256-bit)</label>
            <input required type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition" />
          </div>
          
          <label className="flex items-center gap-3 cursor-pointer mt-4 p-3 bg-indigo-500/10 border border-indigo-500/30 rounded-xl hover:bg-indigo-500/20 transition">
            <input type="checkbox" checked={requestTrial} onChange={(e) => setRequestTrial(e.target.checked)} className="w-5 h-5 rounded bg-slate-900 border-indigo-500 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-slate-900" />
            <div className="flex flex-col">
              <span className="text-sm font-bold text-indigo-300">تفعيل حساب تجريبي مجاني (7 أيام)</span>
              <span className="text-[10px] text-slate-400">ستحصل على وصول فوري ومجاني لجميع الأدوات المتقدمة لمدة أسبوع.</span>
            </div>
          </label>

          <button type="submit" className="w-full mt-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold py-3.5 rounded-xl shadow-lg hover:shadow-emerald-500/30 hover:scale-[1.02] transition-all">
            إنشاء وبدء الاستخدام
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-400 pt-4 border-t border-slate-800/50">
          لديك حساب بالفعل؟ <button onClick={onSwitch} className="text-emerald-400 font-bold hover:text-emerald-300 transition px-2 py-1 bg-emerald-500/10 rounded hover:bg-emerald-500/20">تسجيل الدخول</button>
        </div>
      </div>
    </div>
  );
};

export const ActivationScreen = () => {
  const { logout, user } = useAuth();
  
  return (
    <div className="min-h-screen bg-[#050B14] flex flex-col items-center justify-center p-4 font-['Cairo'] relative overflow-hidden" dir="rtl">
      {/* High-Tech Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-amber-600/10 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="w-full max-w-lg bg-slate-900/80 backdrop-blur-2xl border border-amber-500/30 rounded-3xl p-8 shadow-[0_0_60px_rgba(245,158,11,0.15)] text-center relative z-10">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-orange-600"></div>
        <div className="w-24 h-24 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(245,158,11,0.2)]">
          <Lock className="w-12 h-12" />
        </div>
        
        {user?.isTrial === false ? (
          <>
            <h2 className="text-2xl font-black text-white mb-2">انتهت الفترة التجريبية</h2>
            <p className="text-slate-400 text-sm mb-6">لقد استمتعت بتجربة أقوى بوكس صيانة في العالم، حان الوقت لتفعيل اشتراكك الدائم.</p>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-black text-white mb-2">الحساب قيد التفعيل</h2>
            <p className="text-slate-400 text-sm mb-6">مرحباً بك في أذكى وأقوى بوكس صيانة في العالم.</p>
          </>
        )}
        
        <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-6 mb-6 shadow-inner">
          <CreditCard className="w-10 h-10 text-amber-500 mx-auto mb-4 opacity-80" />
          <p className="text-slate-300 font-bold text-sm mb-4 leading-relaxed">
            لتفعيل جميع خدمات الذكاء الاصطناعي بشكل دائم، يرجى تحويل مبلغ <span className="text-amber-400 text-lg bg-amber-500/10 px-2 py-0.5 rounded">500 جنيه مصري</span> إلى محفظة فودافون كاش على الرقم:
          </p>
          <div className="bg-slate-900 border border-amber-500/50 p-4 rounded-xl text-3xl font-black text-amber-400 tracking-widest font-mono select-all shadow-[0_0_20px_rgba(245,158,11,0.1)]">
            01119427643
          </div>
          <p className="text-xs text-slate-500 mt-4 leading-loose">
            بعد التحويل، سيقوم "المهندس بشار باسل" بمراجعة العملية وتفعيل الحساب فوراً.
          </p>
        </div>
        
        <button onClick={logout} className="text-slate-400 text-sm font-bold hover:text-white transition flex items-center justify-center gap-2 mx-auto py-2 px-4 rounded-lg hover:bg-slate-800">
          تسجيل الخروج المبرمج <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export const AdminDashboard = () => {
  const [users, setUsers] = useState<any[]>([]);
  const { user: currentUser, logout } = useAuth();

  useEffect(() => {
    if (currentUser?.role !== 'admin') return;
    
    const usersCollection = collection(db, 'users');
    const unsubscribe = onSnapshot(usersCollection, (snapshot) => {
      const usersList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(usersList);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'users');
    });

    return () => unsubscribe();
  }, [currentUser]);

  const toggleActivation = async (userId: string, currentStatus: boolean) => {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, { 
        isActive: true, 
        isTrial: false,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${userId}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#050B14] text-slate-200 p-6 font-['Cairo'] relative" dir="rtl">
      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Admin Header */}
        <div className="flex items-center justify-between mb-8 bg-slate-900/80 backdrop-blur-xl p-5 rounded-3xl border border-indigo-500/30 shadow-[0_0_40px_rgba(79,70,229,0.1)]">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/30 text-white">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">لوحة تحكم البوكس المركزي</h1>
              <p className="text-sm text-indigo-400 font-bold tracking-wide">المهندس بشار باسل | نظام عالي التشفير</p>
            </div>
          </div>
          <button onClick={logout} className="bg-slate-800/80 border border-slate-700 hover:bg-slate-700 hover:border-slate-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition shadow-lg">تسجيل الخروج</button>
        </div>

        {/* Users Table */}
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-3xl overflow-hidden shadow-2xl">
          <div className="p-5 border-b border-slate-800/80 flex items-center gap-3 bg-slate-900/80">
            <Users className="w-6 h-6 text-indigo-400" />
            <h2 className="font-bold text-white text-lg">قاعدة بيانات المشتركين</h2>
            <span className="mr-auto bg-indigo-500/20 text-indigo-300 text-xs font-bold px-3 py-1 rounded-full border border-indigo-500/30">
              إجمالي: {users.length}
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-right text-sm">
              <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="p-5 font-bold">اسم المستخدم</th>
                  <th className="p-5 font-bold">البريد</th>
                  <th className="p-5 font-bold">الدور</th>
                  <th className="p-5 font-bold">تاريخ التسجيل</th>
                  <th className="p-5 font-bold">الحالة (الدفع)</th>
                  <th className="p-5 font-bold">النوع</th>
                  <th className="p-5 font-bold text-left">إجراءات إدارية</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-slate-800/40 transition group">
                    <td className="p-5 font-bold text-white flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-slate-600 group-hover:bg-indigo-400 transition-colors"></div>
                      {u.username}
                    </td>
                    <td className="p-5 text-slate-400 font-mono text-xs">{u.email}</td>
                    <td className="p-5">
                      {u.role === 'admin' ? 
                        <span className="bg-purple-500/20 text-purple-400 border border-purple-500/30 px-2 py-1 rounded-lg text-xs font-bold shadow-sm">مدير</span> : 
                        <span className="bg-slate-700/50 text-slate-300 border border-slate-600 px-2 py-1 rounded-lg text-xs">مستخدم</span>}
                    </td>
                    <td className="p-5 text-slate-500 font-mono text-xs">{new Date(u.createdAt).toLocaleDateString('ar-EG')}</td>
                    <td className="p-5">
                      {u.isActive ? 
                         <span className="flex items-center gap-1.5 text-emerald-400 font-bold"><CheckCircle className="w-4 h-4"/> مفعل</span> : 
                         <span className="flex items-center gap-1.5 text-amber-500 font-bold"><XCircle className="w-4 h-4"/> غير مفعل (انتظار الدفع)</span>
                      }
                    </td>
                    <td className="p-5 text-xs font-bold text-slate-300">
                      {u.isTrial ? (
                        <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-1 rounded-lg flex items-center gap-1 w-max">
                          <Zap className="w-3 h-3"/> فترة تجريبية
                        </span>
                      ) : (
                        <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-1 rounded-lg flex items-center gap-1 w-max">
                          <ShieldCheck className="w-3 h-3"/> دائم
                        </span>
                      )}
                    </td>
                    <td className="p-5 text-left">
                      {u.role !== 'admin' && (
                        <button 
                          onClick={() => toggleActivation(u.id, u.isActive)}
                          disabled={u.isActive && !u.isTrial}
                          className={`px-4 py-2 rounded-xl font-bold text-xs transition shadow-sm border ${
                            u.isActive && !u.isTrial 
                              ? 'bg-slate-800 border-slate-700 text-slate-500 cursor-not-allowed opacity-50' 
                              : 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/30 hover:shadow-emerald-500/20'
                          }`}
                        >
                          {u.isActive && !u.isTrial ? 'اشتراك دائم (مكتمل)' : 'تحويل لاشتراك دائم (تم الدفع)'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
