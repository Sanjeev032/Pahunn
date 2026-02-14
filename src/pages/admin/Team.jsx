import React, { useState } from 'react';
import { User, Shield, Mail, MoreVertical, Plus } from 'lucide-react';
import './Team.css';

const MOCK_TEAM = [
    { id: 1, name: 'Sanjeev Kumar', email: 'sanjeev@pahunn.com', role: 'Admin', status: 'Active', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=100' },
];

const Team = () => {
    const [team, setTeam] = useState(MOCK_TEAM);

    return (
        <div className="team-page">
            <header className="team-header">
                <div>
                    <h1>Team Management</h1>
                    <p>Manage admin access and roles</p>
                </div>
                <button className="add-member-btn">
                    <Plus size={20} /> Add Member
                </button>
            </header>

            <div className="team-grid">
                {team.map(member => (
                    <div key={member.id} className="team-card">
                        <div className="team-card__header">
                            <img src={member.avatar} alt={member.name} className="member-avatar" />
                            <span className={`status-indicator ${member.status.toLowerCase()}`}>
                                {member.status}
                            </span>
                        </div>

                        <div className="team-card__info">
                            <h3>{member.name}</h3>
                            <div className="member-detail">
                                <Mail size={14} />
                                <span>{member.email}</span>
                            </div>
                            <div className="member-detail">
                                <Shield size={14} />
                                <span>{member.role}</span>
                            </div>
                        </div>

                        <button className="team-options-btn">
                            <MoreVertical size={18} />
                        </button>
                    </div>
                ))}

                {/* Add New Placeholder */}
                <div className="team-card add-new">
                    <div className="add-new-content">
                        <div className="add-icon">
                            <Plus size={32} />
                        </div>
                        <h3>Add New Admin</h3>
                        <p>Grant access to a new team member</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Team;
