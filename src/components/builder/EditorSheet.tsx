"use client";

import { WizardState } from "@/lib/types";
import { EditSection } from "./BuilderProfile";

interface EditorSheetProps {
  section: EditSection | null;
  data: WizardState;
  slug: string;
  onChange: (updates: Partial<WizardState>) => void;
  onClose: () => void;
}

export default function EditorSheet({ section, data, onChange, onClose }: EditorSheetProps) {
  if (!section) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-end" onClick={onClose}>
      <div
        className="w-full bg-[#111] border-t border-white/10 rounded-t-2xl p-6 max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold capitalize">Edit {section}</h2>
          <button onClick={onClose} className="text-white/40 hover:text-white text-xl leading-none">×</button>
        </div>

        {section === "basic" && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-white/40 block mb-1">First Name</label>
                <input
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white"
                  value={data.firstName}
                  onChange={(e) => onChange({ firstName: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs text-white/40 block mb-1">Last Name</label>
                <input
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white"
                  value={data.lastName}
                  onChange={(e) => onChange({ lastName: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-white/40 block mb-1">Team</label>
                <input
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white"
                  value={data.team}
                  onChange={(e) => onChange({ team: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs text-white/40 block mb-1">League</label>
                <input
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white"
                  value={data.league}
                  onChange={(e) => onChange({ league: e.target.value })}
                />
              </div>
            </div>
          </div>
        )}

        {section === "story" && (
          <div className="space-y-3">
            <div>
              <label className="text-xs text-white/40 block mb-1">Bio</label>
              <textarea
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white"
                rows={5}
                value={data.bio}
                onChange={(e) => onChange({ bio: e.target.value })}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
