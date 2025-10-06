
import React, { useState } from 'react';
import { Profile } from '../types';
import { UserIcon, BriefcaseIcon, SparklesIcon, DocumentTextIcon } from './Icons';

interface ProfileEditorProps {
  profile: Profile;
  setProfile: React.Dispatch<React.SetStateAction<Profile>>;
}

const ProfileEditor: React.FC<ProfileEditorProps> = ({ profile, setProfile }) => {
  const [newSkill, setNewSkill] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleAddSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newSkill.trim()) {
      e.preventDefault();
      if (!profile.skills.includes(newSkill.trim())) {
        setProfile(prev => ({ ...prev, skills: [...prev.skills, newSkill.trim()] }));
      }
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setProfile(prev => ({ ...prev, skills: prev.skills.filter(skill => skill !== skillToRemove) }));
  };

  return (
    <div className="flex flex-col space-y-6 overflow-y-auto pr-2 -mr-2">
      <h2 className="text-xl font-semibold text-slate-200">Your Profile</h2>
      
      <div className="space-y-4">
        <label className="flex items-center text-sm font-medium text-slate-400"><UserIcon className="h-4 w-4 mr-2"/> Full Name</label>
        <input type="text" name="fullName" value={profile.fullName} onChange={handleInputChange} className="w-full bg-slate-700/50 rounded-md p-2 border border-slate-600 focus:ring-cyan-500 focus:border-cyan-500 transition"/>

        <label className="flex items-center text-sm font-medium text-slate-400"><BriefcaseIcon className="h-4 w-4 mr-2"/> Desired Role</label>
        <input type="text" name="desiredRole" value={profile.desiredRole} onChange={handleInputChange} className="w-full bg-slate-700/50 rounded-md p-2 border border-slate-600 focus:ring-cyan-500 focus:border-cyan-500 transition"/>

        <label className="flex items-center text-sm font-medium text-slate-400"><DocumentTextIcon className="h-4 w-4 mr-2"/> Professional Summary</label>
        <textarea name="professionalSummary" value={profile.professionalSummary} onChange={handleInputChange} rows={5} className="w-full bg-slate-700/50 rounded-md p-2 border border-slate-600 focus:ring-cyan-500 focus:border-cyan-500 transition resize-none"/>

        <label className="flex items-center text-sm font-medium text-slate-400"><SparklesIcon className="h-4 w-4 mr-2"/> Skills</label>
        <div className="flex flex-wrap gap-2">
          {profile.skills.map(skill => (
            <span key={skill} className="flex items-center bg-cyan-900/50 text-cyan-300 text-xs font-medium px-2.5 py-1 rounded-full">
              {skill}
              <button onClick={() => handleRemoveSkill(skill)} className="ml-1.5 text-cyan-400 hover:text-white">&times;</button>
            </span>
          ))}
        </div>
        <input 
          type="text" 
          value={newSkill} 
          onChange={(e) => setNewSkill(e.target.value)} 
          onKeyDown={handleAddSkill}
          placeholder="Type skill and press Enter"
          className="w-full bg-slate-700/50 rounded-md p-2 border border-slate-600 focus:ring-cyan-500 focus:border-cyan-500 transition"
        />
      </div>
    </div>
  );
};

export default ProfileEditor;
