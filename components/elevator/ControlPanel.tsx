import { Heart, Search, Shuffle, User as UserIcon, LogOut } from "lucide-react";
import { ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";

interface ControlPanelProps {
    currentFloor: string;
    handleFloorChange: (floor: string, path: string) => void;
    handleRandom: () => void;
}

export default function ControlPanel({ currentFloor, handleFloorChange, handleRandom }: ControlPanelProps) {
    const { user, login, logout } = useAuth();

    return (
        <aside className="
             bg-wall-light 
             shadow-2xl z-50 relative shrink-0 
             
             /* Mobile: Bottom Bar */
             w-full h-auto border-t-4 border-wall-dark flex flex-row items-center justify-around py-4 order-last
             
             /* Desktop: Right Panel */
             md:w-32 md:h-full md:border-l-8 md:border-t-0 md:flex-col md:py-8 md:gap-4 md:order-none md:overflow-hidden
        ">
           {/* Texture overlay */}
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/brushed-alum.png')] opacity-20 pointer-events-none" />

           {/* Scrollable Container for Desktop Vertical Height */}
           <div className="flex md:flex-col w-full h-full md:overflow-y-auto no-scrollbar items-center justify-around md:justify-start gap-4 md:gap-[2vh] pt-2 pb-12">
               
               {/* Identity Card (Auth) */}
               <div className="md:mb-4 shrink-0">
                 <button 
                    onClick={user ? logout : login}
                    className="flex flex-col items-center group relative"
                 >
                    <div className={`
                         w-10 h-10 md:w-16 md:h-16 rounded-full border-[3px] md:border-4 overflow-hidden flex items-center justify-center transition-all duration-300
                         ${user ? "border-green-500 shadow-[0_0_10px_#00ff00aa]" : "border-wall-dark bg-wall-dark/10 hover:border-brass-accent hover:bg-brass-accent/20"}
                    `}>
                        {user?.photoURL ? (
                            <img src={user.photoURL} alt="ID" className="w-full h-full object-cover" />
                        ) : (
                            <UserIcon className={user ? "text-green-500" : "text-wall-dark/50"} />
                        )}
                    </div>
                    
                    {/* Tooltip */}
                     <span className="hidden group-hover:block md:block absolute -left-20 md:-left-24 top-1/2 -translate-y-1/2 bg-black/90 text-white text-[10px] font-bold px-2 py-1 rounded border border-white/20 tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                        {user ? "SIGN OUT" : "LOGIN"}
                    </span>
                 </button>
               </div>

               {/* Floor Controls */}
               <div className="flex md:flex-col gap-2 md:gap-[2vh]">
                   <ControlBtn label="1" sub="Trend" active={currentFloor === "1"} onClick={() => handleFloorChange("1", "/")} />
                   <ControlBtn label="2" sub="Top" active={currentFloor === "2"} onClick={() => handleFloorChange("2", "/top-rated")} />
                   <ControlBtn label="3" sub="Mov" active={currentFloor === "3"} onClick={() => handleFloorChange("3", "/movies")} />
                   <ControlBtn label="G" sub="Lobby" active={currentFloor === "G"} onClick={() => handleFloorChange("G", "/guestbook")} />
               </div>

               {/* Divider */}
               <div className="h-8 w-[1px] bg-wall-dark/20 mx-2 md:h-2 md:w-16 md:bg-wall-dark/20 md:border-b-2 md:mx-0 md:my-2 shrink-0" />
               
               {/* Utility Controls */}
               <div className="flex md:flex-col gap-2 md:gap-[2vh]">
                   <ControlBtn label="L" sub="Log" icon={<Heart size={18} />} active={currentFloor === "L"} onClick={() => handleFloorChange("L", "/favorites")} />
                   <ControlBtn label="R" icon={<Shuffle size={18} />} active={currentFloor === "??"} onClick={handleRandom} />
                   <ControlBtn label="S" icon={<Search size={18} />} active={currentFloor === "S"} onClick={() => handleFloorChange("S", "/search")} />
               </div>
           </div>
        </aside>
    );
}

function ControlBtn({ label, sub, onClick, active, icon }: any) {
    return (
        <button 
           onClick={onClick}
           className={`
             rounded-full border-[3px] md:border-4 flex flex-col items-center justify-center transition-all duration-200 active:scale-90 relative group
             w-10 h-10 md:w-12 md:h-12 shrink-0
             
             ${active 
               ? 'bg-[#ffeebb] border-[#ffb300] text-[#554400] shadow-[0_0_15px_rgba(255,200,0,0.8)] scale-110 z-10' 
               : 'bg-brass-accent border-wall-dark text-wall-dark shadow-[4px_4px_0px_rgba(0,0,0,0.3)] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_rgba(0,0,0,0.2)] hover:bg-[#e6c200]'}
           `}
        >
            {icon ? icon : <span className="font-display font-bold text-lg md:text-xl leading-none tracking-widest">{label}</span>}
            
            {/* Anime Speed Line / Shine */}
            <div className="absolute top-1 left-2 w-2 h-2 rounded-full bg-white/60 blur-[0.5px]" />
            
            {/* Sub label tooltip styled as anime caption */}
            {sub && (
                <span className="hidden group-hover:block md:block absolute -left-16 md:-left-20 bg-black/80 text-[#ffd700] text-[10px] font-bold px-2 py-1 rounded backdrop-blur-sm border border-[#ffd700]/30 tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-20">
                    {sub}
                </span>
            )}
        </button>
    )
}
