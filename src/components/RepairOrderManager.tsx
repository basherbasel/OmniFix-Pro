import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Wrench, 
  Plus, 
  Search, 
  Filter, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  User, 
  Phone, 
  Smartphone,
  ChevronRight,
  MoreVertical,
  Edit,
  Trash2,
  X,
  Save,
  DollarSign
} from 'lucide-react';
import { repairService } from '../lib/firebaseRepair';
import { RepairOrder, DeviceInfo } from '../types';
import { auth } from '../lib/firebase';

interface RepairOrderManagerProps {
  activeDevice?: DeviceInfo;
}

export const RepairOrderManager: React.FC<RepairOrderManagerProps> = ({ activeDevice }) => {
  const [orders, setOrders] = useState<RepairOrder[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // New order form state
  const [newOrder, setNewOrder] = useState<Partial<RepairOrder>>({
    customerName: '',
    customerPhone: '',
    deviceInfo: {
      brand: activeDevice?.brand || '',
      model: activeDevice?.model || '',
      serialNumber: activeDevice?.serialNumber || '',
    },
    faultDescription: '',
    status: 'pending',
    cost: 0,
    notes: ''
  });

  useEffect(() => {
    const unsubscribe = repairService.subscribeToOrders((updatedOrders) => {
      setOrders(updatedOrders);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrder.customerName || !newOrder.customerPhone) return;

    const orderNumber = 'ORD-' + Math.floor(1000 + Math.random() * 9000);
    
    await repairService.createOrder({
      ...newOrder,
      orderNumber,
      technicianId: auth.currentUser?.uid || 'temp-tech',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      partsUsed: [],
      imagesBefore: [],
      imagesAfter: []
    } as Omit<RepairOrder, 'id'>);

    setIsAdding(false);
    setNewOrder({
      customerName: '',
      customerPhone: '',
      deviceInfo: {
        brand: activeDevice?.brand || '',
        model: activeDevice?.model || '',
        serialNumber: activeDevice?.serialNumber || '',
      },
      faultDescription: '',
      status: 'pending',
      cost: 0,
      notes: ''
    });
  };

  const updateStatus = async (orderId: string, status: RepairOrder['status']) => {
    await repairService.updateOrder(orderId, { status });
  };

  const deleteOrder = async (orderId: string) => {
    if (confirm('هل أنت متأكد من حذف هذا الطلب؟')) {
      await repairService.deleteOrder(orderId);
    }
  };

  const filteredOrders = orders.filter(o => 
    o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.deviceInfo.model.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header & Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/40 p-6 rounded-3xl border border-slate-800/50 backdrop-blur-xl">
        <div>
          <h2 className="text-2xl font-black text-white flex items-center gap-3">
            <Wrench className="w-7 h-7 text-indigo-400" />
            إدارة طلبات الصيانة
          </h2>
          <p className="text-slate-400 text-sm mt-1">تتبع وإدارة عمليات الإصلاح الحية عبر السحابة</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold transition-all shadow-lg shadow-indigo-900/20"
        >
          <Plus className="w-5 h-5" />
          طلب جديد
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input 
            type="text" 
            placeholder="البحث بالاسم، رقم الطلب، أو موديل الجهاز..."
            className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl py-3 pr-12 pl-4 text-white focus:border-indigo-500/50 outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="p-3 bg-slate-900/50 border border-slate-800 rounded-2xl text-slate-400">
            <Filter className="w-5 h-5" />
          </div>
          <select className="bg-slate-900/50 border border-slate-800 rounded-2xl py-3 px-4 text-slate-300 outline-none focus:border-indigo-500/50">
            <option>الكل</option>
            <option>قيد الانتظار</option>
            <option>قيد الإصلاح</option>
            <option>جاهز</option>
          </select>
        </div>
      </div>

      {/* Orders Grid/List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <AnimatePresence mode="popLayout">
          {filteredOrders.map((order) => (
            <motion.div 
              key={order.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900/40 border border-slate-800/50 rounded-3xl p-5 hover:border-indigo-500/30 transition-all group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                    order.status === 'ready' ? 'bg-emerald-500/10 text-emerald-400' :
                    order.status === 'repairing' ? 'bg-indigo-500/10 text-indigo-400' :
                    'bg-slate-800 text-slate-500'
                  }`}>
                    <Smartphone className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white">{order.customerName}</h3>
                    <p className="text-[10px] text-slate-500 font-mono tracking-wider">{order.orderNumber}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-slate-800 rounded-lg text-slate-500 transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => deleteOrder(order.id)}
                    className="p-2 hover:bg-red-500/10 rounded-lg text-slate-500 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="p-3 bg-slate-950/40 rounded-2xl border border-slate-800/50">
                  <p className="text-[10px] text-slate-500 mb-1">الجهاز</p>
                  <p className="text-xs font-bold text-slate-300">{order.deviceInfo.brand} {order.deviceInfo.model}</p>
                </div>
                <div className="p-3 bg-slate-950/40 rounded-2xl border border-slate-800/50">
                  <p className="text-[10px] text-slate-500 mb-1">الهاتف</p>
                  <p className="text-xs font-bold text-slate-300">{order.customerPhone}</p>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-[10px] text-slate-500 mb-1">وصف العطل</p>
                <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">{order.faultDescription}</p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-800/50">
                <div className="flex items-center gap-2">
                  <select 
                    value={order.status}
                    onChange={(e) => updateStatus(order.id, e.target.value as any)}
                    className={`text-[10px] font-bold px-3 py-1.5 rounded-full border bg-slate-950 outline-none transition-all ${
                      order.status === 'ready' ? 'border-emerald-500/30 text-emerald-400' :
                      order.status === 'repairing' ? 'border-indigo-500/30 text-indigo-400' :
                      'border-slate-700 text-slate-500'
                    }`}
                  >
                    <option value="pending">قيد الانتظار</option>
                    <option value="diagnosing">قيد التشخيص</option>
                    <option value="repairing">قيد الإصلاح</option>
                    <option value="ready">جاهز للاستلام</option>
                    <option value="delivered">تم التسليم</option>
                    <option value="cancelled">ملغي</option>
                  </select>
                </div>
                <div className="flex items-center gap-1 text-emerald-400 font-black">
                  <DollarSign className="w-3.5 h-3.5" />
                  <span className="text-sm">{order.cost}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {!loading && filteredOrders.length === 0 && (
        <div className="text-center py-20 bg-slate-900/20 rounded-3xl border border-dashed border-slate-800">
          <div className="w-16 h-16 bg-slate-800/50 text-slate-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-400">لا توجد طلبات تطابق بحثك</h3>
          <p className="text-slate-600 text-sm">ابدأ بإضافة طلب صيانة جديد</p>
        </div>
      )}

      {/* Add Order Modal */}
      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAdding(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                <h2 className="text-xl font-black text-white">إضافة طلب صيانة جديد</h2>
                <button onClick={() => setIsAdding(false)} className="p-2 hover:bg-slate-800 rounded-xl text-slate-500 transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <form onSubmit={handleCreateOrder} className="p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 mr-2">اسم العميل</label>
                    <div className="relative">
                      <User className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input 
                        required
                        type="text" 
                        className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-3 pr-11 pl-4 text-sm text-white focus:border-indigo-500/50 outline-none"
                        value={newOrder.customerName}
                        onChange={e => setNewOrder({...newOrder, customerName: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 mr-2">رقم الهاتف</label>
                    <div className="relative">
                      <Phone className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input 
                        required
                        type="tel" 
                        className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-3 pr-11 pl-4 text-sm text-white focus:border-indigo-500/50 outline-none"
                        value={newOrder.customerPhone}
                        onChange={e => setNewOrder({...newOrder, customerPhone: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-950/50 rounded-2xl border border-slate-800 space-y-3">
                  <p className="text-xs font-black text-indigo-400 uppercase tracking-widest">بيانات الجهاز</p>
                  <div className="grid grid-cols-2 gap-3">
                    <input 
                      type="text" 
                      placeholder="الماركة"
                      className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                      value={newOrder.deviceInfo?.brand}
                      onChange={e => setNewOrder({...newOrder, deviceInfo: {...newOrder.deviceInfo!, brand: e.target.value}})}
                    />
                    <input 
                      type="text" 
                      placeholder="الموديل"
                      className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                      value={newOrder.deviceInfo?.model}
                      onChange={e => setNewOrder({...newOrder, deviceInfo: {...newOrder.deviceInfo!, model: e.target.value}})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 mr-2">وصف العطل</label>
                  <textarea 
                    rows={3}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-3 px-4 text-sm text-white focus:border-indigo-500/50 outline-none resize-none"
                    value={newOrder.faultDescription}
                    onChange={e => setNewOrder({...newOrder, faultDescription: e.target.value})}
                  />
                </div>

                <div className="flex items-center gap-4 pt-4">
                  <button 
                    type="submit"
                    className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-indigo-900/20 flex items-center justify-center gap-2"
                  >
                    <Save className="w-5 h-5" />
                    حفظ الطلب
                  </button>
                  <button 
                    type="button"
                    onClick={() => setIsAdding(false)}
                    className="px-6 py-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-2xl transition-all"
                  >
                    إلغاء
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
