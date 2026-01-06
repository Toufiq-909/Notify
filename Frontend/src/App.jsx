import { Check } from "../ApiCall/fetch";
import { useState, useEffect } from "react";

function App() {
  return (
    <div className="min-h-screen bg-slate-50 font-[geist_mono]">
      {/* Top Navigation / Header */}
      <div className="Navbar bg-blue-600 px-6 py-10 text-white shadow-lg mb-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-extrabold tracking-tight">Notify</h1>
          <p className="text-blue-100 text-lg mt-2 opacity-90">
            Hey! Here’s the menu for the current meal.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 pb-20">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Main Content Area */}
          <div className="w-full md:w-2/3 space-y-6">
            <Meal />
            <Button />
          </div>

          {/* Sidebar Image Area (unchanged) */}
          <div className="w-full md:w-1/3">
            <div className="card bg-base-100 shadow-xl overflow-hidden rounded-3xl border border-slate-200">
              <img 
                src="/img3.jpeg" 
                className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500" 
                alt="Meal illustration"
              />
            </div>
          </div>
        </div>
      </div>

      <footer className="py-10 text-center font-[playFair] text-slate-400 border-t border-slate-200 bg-white mt-10">
        <p className="text-lg italic">Made with lots of love ❤️</p>
      </footer>
    </div>
  );
}

export default App;

/* ---------------- Meal ---------------- */

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
    <div className="card bg-white shadow-xl border border-slate-100">
      <div className="card-body p-8">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
            Live Menu
          </span>
        </div>

        {meal === "" ? (
          <div className="space-y-3">
            <div className="skeleton h-8 w-1/2"></div>
            <div className="skeleton h-4 w-full"></div>
            <div className="skeleton h-4 w-3/4"></div>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-700">
            <h2 className="card-title text-3xl font-black text-slate-800 mb-2">
              {menu}
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              {meal}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------------- Button ---------------- */

function Button() {
  let [status, setstatus] = useState("");
  let [breakfast, setbreakfast] = useState(false);
  let [lunch, setlunch] = useState(false);
  let [snack, setsnack] = useState(false);
  let [dinner, setdinner] = useState(false);
  let [error, errormsg] = useState(false);
  let [btn, setbtn] = useState(false);

  let res = localStorage.getItem("token");

  if (res === null) {
    return (
      <div className="card bg-white shadow-xl border border-slate-100 p-8">
        <div className="mb-6">
          <h3 className="text-xl font-bold text-slate-800">
            Stay Updated
          </h3>
          <p className="text-slate-500">
            Want this menu delivered straight to your notifications?
          </p>
        </div>

        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">
          Pick your preferred meals
        </p>

        {/* MEAL BUTTONS (UNCHANGED) */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <button className={`btn btn-md ${breakfast ? "btn-neutral" : "btn-outline"}`} onClick={() => setbreakfast(prev => !prev)}>
            🍳 Breakfast
          </button>
          <button className={`btn btn-md ${lunch ? "btn-neutral" : "btn-outline"}`} onClick={() => setlunch(prev => !prev)}>
            🍲 Lunch
          </button>
          <button className={`btn btn-md ${snack ? "btn-neutral" : "btn-outline"}`} onClick={() => setsnack(prev => !prev)}>
            ☕ Snacks
          </button>
          <button className={`btn btn-md ${dinner ? "btn-neutral" : "btn-outline"}`} onClick={() => setdinner(prev => !prev)}>
            🍽️ Dinner
          </button>
        </div>

        {status === "12" && (
          <div className="flex justify-center my-4">
            <span className="loading loading-dots loading-lg text-blue-600"></span>
          </div>
        )}

        {error && (
          <div className="alert alert-error shadow-sm py-2 mb-4">
            <span className="text-sm font-bold">
              Please select at least one meal!
            </span>
          </div>
        )}

        {/* ✅ ONLY FIXED BUTTON */}
        <button 
          className="btn btn-success btn-block 
                     text-base sm:text-lg
                     h-12 sm:h-auto
                     px-4
                     whitespace-nowrap
                     shadow-lg hover:shadow-green-200 mt-4"
          onClick={async () => {
            setbtn(true);
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
              if (res === "200") setstatus("200");
              else if (res === "403") setstatus("403");
              else setstatus("500");
            }
          }}
          disabled={btn}
        >
          Activate Notifications
        </button>
      </div>
    );
  }

  return (
    <div className="card bg-green-50 border border-green-200 p-6 flex flex-row items-center gap-4">
      <div className="text-3xl">✅</div>
      <div>
        <p className="font-bold text-green-800 text-lg">
          You're all set!
        </p>
        <p className="text-green-700 opacity-80">
          Congrats, you are officially notified! 😊
        </p>
      </div>
    </div>
  );
}
