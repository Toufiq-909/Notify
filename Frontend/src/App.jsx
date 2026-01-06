
import { Check } from "../ApiCall/fetch";
import { useState, useEffect } from "react";

function App() {
  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans selection:bg-blue-100">
      {/* Refined Navbar with Gradient */}
      <div className="bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 px-6 py-16 text-white shadow-xl mb-12 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <svg width="100%" height="100%"><pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/></pattern><rect width="100%" height="100%" fill="url(#grid)" /></svg>
        </div>
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <span className="bg-white/20 p-2 rounded-xl backdrop-blur-md">🔔</span>
            <h1 className="text-5xl font-black tracking-tight italic">Notify</h1>
          </div>
          <p className="text-blue-100 text-xl font-medium max-w-md opacity-90 leading-relaxed">
            Your daily meal companion. Fresh updates, delivered straight to you.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Main Content Area */}
          <div className="lg:col-span-7 space-y-8">
            <Meal />
            <Button />
          </div>

          {/* Sidebar Image Area */}
          <div className="lg:col-span-5 sticky top-8">
            <div className="group relative rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white transition-transform duration-500 hover:-rotate-1">
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10"></div>
              <img 
                src="/img3.jpeg" 
                className="w-full h-[400px] object-cover group-hover:scale-110 transition-transform duration-700" 
                alt="Meal illustration"
              />
              <div className="absolute bottom-6 left-6 z-20">
                <p className="text-white font-bold text-lg">Freshly Prepared</p>
                <p className="text-white/80 text-sm">Quality ingredients everyday</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="py-12 text-center border-t border-slate-200 bg-white">
        <p className="font-serif italic text-slate-500 text-lg">Made with love for a better dining experience ❤️</p>
      </footer>
    </div>
  );
}

function Meal() {
  let [menu, setmenu] = useState("");
  let [meal, setmeal] = useState("");

  useEffect(() => {
    let call = async () => {
      let res = await fetch(import.meta.env.VITE_API1);
      let result = await res.json();
      setmenu(result.meal);
      setmeal(result.menu);
    };
    call();
  }, []);

  return (
    <div className="card bg-white shadow-sm border border-slate-200 rounded-[2rem] overflow-hidden">
      <div className="bg-slate-50/50 px-8 py-4 border-b border-slate-100 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Live Kitchen Update</span>
        </div>
      </div>
      
      <div className="card-body p-10">
        {meal === "" ? (
          <div className="space-y-4">
            <div className="h-10 w-48 bg-slate-100 animate-pulse rounded-lg"></div>
            <div className="space-y-2">
              <div className="h-4 w-full bg-slate-50 animate-pulse rounded-md"></div>
              <div className="h-4 w-5/6 bg-slate-50 animate-pulse rounded-md"></div>
            </div>
          </div>
        ) : (
          <div className="animate-in fade-in zoom-in-95 duration-700">
            <h2 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight leading-tight">
                {menu}
            </h2>
            <div className="h-1 w-12 bg-blue-500 rounded-full mb-6"></div>
            <p className="text-xl text-slate-600 leading-relaxed font-medium italic">
                "{meal}"
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function Button() {
  let [status, setstatus] = useState("");
  let [breakfast, setbreakfast] = useState(false);
  let [lunch, setlunch] = useState(false);
  let [snack, setsnack] = useState(false);
  let [dinner, setdinner] = useState(false);
  let [error, errormsg] = useState(false);
  let [btn, setbtn] = useState(false);

  let res = localStorage.getItem("token");

  // Reusable card wrapper for logic branches
  const ActionCard = ({ children }) => (
    <div className="card bg-white shadow-xl shadow-slate-200/50 border border-slate-200 rounded-[2rem] p-10">
        {children}
    </div>
  );

  if (res === null) {
    return (
      <ActionCard>
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-slate-800 mb-2">Never miss a meal</h3>
          <p className="text-slate-500">Select which updates you'd like to receive on your device.</p>
        </div>
        
        <div className="grid grid-cols-2 gap-3 mb-8">
          {[
            { id: 'bf', label: 'Breakfast', icon: '🍳', state: breakfast, setter: setbreakfast },
            { id: 'ln', label: 'Lunch', icon: '🍲', state: lunch, setter: setlunch },
            { id: 'sn', label: 'Snacks', icon: '☕', state: snack, setter: setsnack },
            { id: 'dn', label: 'Dinner', icon: '🍽️', state: dinner, setter: setdinner },
          ].map((item) => (
            <button 
              key={item.id}
              className={`flex items-center justify-center gap-3 p-4 rounded-2xl border-2 transition-all duration-300 font-bold
                ${item.state 
                  ? "border-blue-600 bg-blue-50 text-blue-700 shadow-md scale-[1.02]" 
                  : "border-slate-100 bg-slate-50 text-slate-500 hover:border-slate-200"}`} 
              onClick={() => item.setter(prev => !prev)}
            >
              <span className="text-xl">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>

        {/* Status Messages - Styled as subtle alerts */}
        <div className="min-h-[60px] flex flex-col justify-center items-center mb-4 transition-all">
            {status === "12" && <span className="loading loading-spinner loading-md text-blue-600"></span>}
            {status === "403" && <p className="text-amber-600 bg-amber-50 px-4 py-2 rounded-full text-sm font-bold border border-amber-100">⚠️ Please allow notifications in your browser</p>}
            {status === "400" && <p className="text-red-600 bg-red-50 px-4 py-2 rounded-full text-sm font-bold border border-red-100">🚫 Try another browser for notifications</p>}
            {status === "500" && <p className="text-red-600 bg-red-50 px-4 py-2 rounded-full text-sm font-bold border border-red-100">❌ Server error. Please try again.</p>}
            {error && <p className="text-red-600 animate-bounce text-sm font-bold">Select at least one meal to continue!</p>}
            
            {status === "200" && (
                <div className="bg-emerald-50 text-emerald-700 p-4 rounded-2xl border border-emerald-100 flex items-center gap-3 w-full">
                    <div className="bg-emerald-500 text-white rounded-full p-1">✓</div>
                    <p className="font-bold">Notifications Activated!</p>
                </div>
            )}
        </div>

        <button 
          className="btn btn-lg w-full rounded-2xl bg-blue-600 hover:bg-blue-700 border-none text-white shadow-lg shadow-blue-200 transition-all active:scale-[0.98]" 
          onClick={async () => {
            setbtn(true)
            if (!breakfast && !lunch && !dinner && !snack) {
              errormsg(true);
              setbtn(false);
            } else {
              let msg = [];
              if (breakfast) msg.push("breakfast");
              if (lunch) msg.push("lunch");
              if (snack) msg.push("snacks");
              if (dinner) msg.push("dinner");
              errormsg(false);
              setstatus("12");
              let res = await Check(msg);
              setbtn(false);
              if(res==="200") setstatus("200");
              else if(res=="403") setstatus("403");
              else setstatus("500");
            }
          }}
          disabled={btn}
        >
          {btn ? "Processing..." : "Notify Me"}
        </button>
      </ActionCard>
    );
  } else {
    return (
      <div className="card bg-gradient-to-br from-emerald-500 to-teal-600 text-white p-10 rounded-[2rem] shadow-xl shadow-emerald-200 flex flex-col md:flex-row items-center gap-6">
        <div className="text-6xl animate-bounce">🎉</div>
        <div>
          <h3 className="text-2xl font-black mb-1">You're on the list!</h3>
          <p className="text-emerald-50 opacity-90 text-lg">We'll send you updates as soon as the menu changes. Enjoy your meal!</p>
        </div>
      </div>
    );
  }
}

export default App;