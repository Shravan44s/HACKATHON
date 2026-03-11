'use client';

import { useState } from 'react';
import { useTeamStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Team, TeamMember, Phase } from '@/lib/types';
import { Plus, Trash2, Users } from 'lucide-react';
import { toast } from 'sonner';

interface ManageTeamDialogProps {
    team: Team;
    currentPhase: Phase;
}

export default function ManageTeamDialog({ team, currentPhase }: ManageTeamDialogProps) {
    const [open, setOpen] = useState(false);
    const { updateTeam } = useTeamStore();
    const [members, setMembers] = useState<TeamMember[]>(team.members);

    // Allow modification from enrollment up until (but not during) hackathon
    const isAllowed = ['enrollment', 'ideation', 'development'].includes(currentPhase);

    if (!isAllowed) return null;

    const handleAdd = () => {
        if (members.length >= 4) {
            toast.error("Maximum 4 members allowed (excluding leader).");
            return;
        }
        setMembers([...members, { id: crypto.randomUUID(), name: '', email: '', role: '', employeeId: '' }]);
    };

    const handleRemove = (id: string) => {
        setMembers(members.filter(m => m.id !== id));
    };

    const handleChange = (id: string, field: keyof TeamMember, value: string) => {
        setMembers(members.map(m => m.id === id ? { ...m, [field]: value } : m));
    };

    const handleSave = () => {
        // Validation
        for (const m of members) {
            if (!m.name || !m.email || !m.role || !m.employeeId) {
                toast.error("Please fill in all member fields before saving.");
                return;
            }
        }

        updateTeam(team.id, { members });
        toast.success("Team updated successfully!");
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger
                render={
                    <Button variant="outline" size="sm" className="w-full mt-4 border-dashed border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)]/10">
                        <Users className="w-4 h-4 mr-2" />
                        Manage Team
                    </Button>
                }
            />
            <DialogContent className="max-w-2xl bg-[var(--surface)] border-[var(--surface-border)]">
                <DialogHeader>
                    <DialogTitle>Manage Team Members</DialogTitle>
                </DialogHeader>
                <div className="py-4 space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                    <p className="text-sm text-muted-foreground">
                        You can add or remove team members until the hackathon begins. Once the 24h Hackathon phase starts, the roster will be locked.
                    </p>

                    {members.map((member, index) => (
                        <div key={member.id} className="p-4 rounded-xl border border-[var(--surface-border)] bg-[var(--surface-raised)] grid grid-cols-1 sm:grid-cols-2 gap-3 relative">
                            <div className="space-y-1">
                                <Label className="text-xs">Name</Label>
                                <Input value={member.name} onChange={e => handleChange(member.id, 'name', e.target.value)} className="h-9 text-sm" placeholder="Member Name" />
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs">Email</Label>
                                <Input value={member.email} onChange={e => handleChange(member.id, 'email', e.target.value)} className="h-9 text-sm" placeholder="email@example.com" />
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs">Role</Label>
                                <Input value={member.role} onChange={e => handleChange(member.id, 'role', e.target.value)} className="h-9 text-sm" placeholder="Developer" />
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs">Employee ID</Label>
                                <Input value={member.employeeId} onChange={e => handleChange(member.id, 'employeeId', e.target.value)} className="h-9 text-sm" placeholder="EMP-123" />
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleRemove(member.id)}
                                className="absolute top-2 right-2 h-7 w-7 text-red-400 hover:text-red-500 hover:bg-red-50"
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    ))}

                    {members.length < 4 && (
                        <Button variant="outline" onClick={handleAdd} className="w-full border-dashed">
                            <Plus className="w-4 h-4 mr-2" /> Add Member
                        </Button>
                    )}
                </div>
                <div className="flex justify-end gap-3 pt-4 border-t border-[var(--surface-border)]">
                    <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={handleSave} className="btn-primary">Save Changes</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
