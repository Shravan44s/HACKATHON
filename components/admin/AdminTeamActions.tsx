'use client';

import { useState } from 'react';
import { useTeamStore, useAnnouncementStore, useChecklistStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Team } from '@/lib/types';
import { toast } from 'sonner';
import { Send, CheckSquare } from 'lucide-react';

interface AdminTeamActionsProps {
    team: Team;
}

export default function AdminTeamActions({ team }: AdminTeamActionsProps) {
    const { updateTeam } = useTeamStore();
    const { addAnnouncement } = useAnnouncementStore();
    const { checklistItems } = useChecklistStore();

    const [msgOpen, setMsgOpen] = useState(false);
    const [msgTitle, setMsgTitle] = useState('');
    const [msgBody, setMsgBody] = useState('');

    const handleCheckToggle = (itemId: string, checked: boolean) => {
        const newChecklist = { ...(team.checklist || {}) };
        newChecklist[itemId] = checked;
        updateTeam(team.id, { checklist: newChecklist });
        toast.success(checked ? "Checklist item marked as complete." : "Checklist item unchecked.");
    };

    const handleSendMessage = () => {
        if (!msgTitle || !msgBody) {
            toast.error("Please fill in both title and body.");
            return;
        }

        addAnnouncement({
            id: crypto.randomUUID(),
            title: msgTitle,
            body: msgBody,
            target: 'specific_team',
            targetId: team.id,
            createdAt: new Date().toISOString(),
            pinned: false
        });

        toast.success(`Message sent to ${team.teamName}`);
        setMsgOpen(false);
        setMsgTitle('');
        setMsgBody('');
    };

    return (
        <div className="mt-6 flex flex-col sm:flex-row gap-6 border-t border-[var(--surface-border)] pt-4">

            {/* Checklist Section */}
            <div className="flex-1 space-y-3">
                <h4 className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                    <CheckSquare className="w-4 h-4 text-[var(--primary)]" />
                    Admin Checklist
                </h4>
                <div className="space-y-2">
                    {checklistItems.map((item) => (
                        <div key={item.id} className="flex items-center space-x-2">
                            <Checkbox
                                id={`check-${team.id}-${item.id}`}
                                checked={team.checklist?.[item.id] || false}
                                onCheckedChange={(checked) => handleCheckToggle(item.id, checked === true)}
                                className="data-[state=checked]:bg-[var(--primary)] data-[state=checked]:border-[var(--primary)]"
                            />
                            <Label
                                htmlFor={`check-${team.id}-${item.id}`}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                {item.label}
                            </Label>
                        </div>
                    ))}
                </div>
            </div>

            {/* Messaging Section */}
            <div className="flex-1 space-y-3">
                <h4 className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                    <Send className="w-4 h-4 text-[var(--primary)]" />
                    Direct Message
                </h4>
                <p className="text-xs text-muted-foreground mb-2">
                    Send a direct alert to this team. It will appear in their Participant Dashboard.
                </p>
                <Dialog open={msgOpen} onOpenChange={setMsgOpen}>
                    <DialogTrigger
                        render={
                            <Button variant="outline" size="sm" className="w-full sm:w-auto border-[var(--primary)]/30 text-[var(--primary)] hover:bg-[var(--primary)]/10">
                                Send Message
                            </Button>
                        }
                    />
                    <DialogContent className="max-w-md bg-[var(--surface)] border-[var(--surface-border)]">
                        <DialogHeader>
                            <DialogTitle>Message to {team.teamName}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label>Subject</Label>
                                <Input
                                    placeholder="Missing project repository link"
                                    className="h-10 text-sm bg-[var(--surface-raised)] border-[var(--surface-border)]"
                                    value={msgTitle}
                                    onChange={(e) => setMsgTitle(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Message</Label>
                                <Textarea
                                    placeholder="Please update your development submission to include a valid GitHub link..."
                                    className="min-h-[100px] text-sm bg-[var(--surface-raised)] border-[var(--surface-border)]"
                                    value={msgBody}
                                    onChange={(e) => setMsgBody(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 pt-2">
                            <Button variant="ghost" onClick={() => setMsgOpen(false)}>Cancel</Button>
                            <Button onClick={handleSendMessage} className="bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-[var(--primary-foreground)]">Send Message</Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

        </div>
    );
}
