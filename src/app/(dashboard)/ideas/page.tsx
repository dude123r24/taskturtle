'use client';

import { Suspense, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import Rating from '@mui/material/Rating';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SpeedIcon from '@mui/icons-material/Speed'; // For Impact
import HandymanIcon from '@mui/icons-material/Handyman'; // For Effort
import AutoGraphIcon from '@mui/icons-material/AutoGraph'; // For Priority Score
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';
import { useSession } from 'next-auth/react';
import { useIdeaStore, type Idea, type IdeaStatus } from '@/store/ideaStore';

const STATUS_COLORS: Record<IdeaStatus, 'default' | 'info' | 'primary' | 'success' | 'error'> = {

    NEW: 'info',
    PLANNED: 'primary',
    IN_PROGRESS: 'primary',
    COMPLETED: 'success',
    REJECTED: 'error',
};

function IdeasContent() {
    const { data: session } = useSession();
    const isAdmin = session?.user?.email === 'sanghviamit@gmail.com';
    const { ideas, fetchIdeas, addIdea, updateIdea, removeIdea, isLoading } = useIdeaStore();
    const [filteredStatus, setFilteredStatus] = useState<IdeaStatus | 'ALL'>('ALL');
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [editingIdea, setEditingIdea] = useState<Partial<Idea> | null>(null);

    useEffect(() => {
        fetchIdeas();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Calculate priority: (Impact / Effort). We use (effort || 1) to avoid division by zero.
    // Higher ratio = higher priority.
    const _getPriorityScore = (impact: number, effort: number) => {
        return (impact / (effort || 1)).toFixed(1);
    };

    const sortedAndFilteredIdeas = ideas
        .filter(idea => filteredStatus === 'ALL' || idea.status === filteredStatus)
        .sort((a, b) => {
            const scoreA = a.impact / (a.effort || 1);
            const scoreB = b.impact / (b.effort || 1);
            if (scoreA !== scoreB) {
                return scoreB - scoreA; // Highest priority first
            }
            // Tie-breaker: Highest impact first
            return b.impact - a.impact;
        });

    const handleSaveIdea = async () => {
        if (!editingIdea?.title) return;

        if (editingIdea.id) {
            await updateIdea(editingIdea.id, editingIdea);
        } else {
            await addIdea({
                title: editingIdea.title,
                description: editingIdea.description || '',
                impact: editingIdea.impact || 5,
                effort: editingIdea.effort || 5,
                status: editingIdea.status || 'NEW',
            } as Idea);
        }
        setEditDialogOpen(false);
        setEditingIdea(null);
    };

    const handleOpenAddDialog = () => {
        setEditingIdea({ title: '', description: '', impact: 5, effort: 5, status: 'NEW' });
        setEditDialogOpen(true);
    };

    const handleQuickUpdate = async (id: string, field: 'impact' | 'effort' | 'status', value: number | string) => {
        await updateIdea(id, { [field]: value });
    };

    return (
        <Box sx={{ p: { xs: 2, sm: 3 }, maxWidth: 1200, mx: 'auto' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
                <Stack direction="row" alignItems="center" spacing={2}>
                    <LightbulbOutlinedIcon sx={{ fontSize: 32, color: 'primary.main' }} />
                    <Typography variant="h4" fontWeight={700}>
                        Features
                    </Typography>
                </Stack>
                <Button variant="contained" onClick={handleOpenAddDialog}>
                    Request feature
                </Button>
            </Stack>

            <Stack direction="row" spacing={1} mb={3} sx={{ overflowX: 'auto', pb: 1 }}>
                {['ALL', 'NEW', 'PLANNED', 'IN_PROGRESS', 'COMPLETED', 'REJECTED'].map((status) => (
                    <Chip
                        key={status}
                        label={status.replace('_', ' ')}
                        onClick={() => setFilteredStatus(status as IdeaStatus | 'ALL')}
                        color={filteredStatus === status ? 'primary' : 'default'}
                        variant={filteredStatus === status ? 'filled' : 'outlined'}
                    />
                ))}
            </Stack>

            {isLoading && <Typography>Loading features...</Typography>}
            {!isLoading && sortedAndFilteredIdeas.length === 0 && (
                <Card sx={{ p: 4, textAlign: 'center', bgcolor: 'transparent', border: '1px dashed', borderColor: 'divider' }}>
                    <Typography color="text.secondary">No features found in this category.</Typography>
                </Card>
            )}

            <Stack spacing={2} sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 2 }}>
                {sortedAndFilteredIdeas.map((idea) => (
                    <Card
                        key={idea.id}
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(26, 25, 41, 0.6)' : 'rgba(255,255,255,0.8)',
                            border: (theme) => `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)'}`,
                            transition: 'all 0.2s',
                            '&:hover': { transform: 'translateY(-2px)', boxShadow: 2 },
                        }}
                    >
                        <CardContent sx={{ flexGrow: 1, p: 2, pb: '16px !important' }}>
                            <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={1}>
                                <Typography variant="h6" fontWeight={600} sx={{ lineHeight: 1.2 }}>
                                    {idea.title}
                                </Typography>
                                <IconButton
                                    size="small"
                                    onClick={() => {
                                        setEditingIdea(idea);
                                        setEditDialogOpen(true);
                                    }}
                                    sx={{ mt: -0.5, mr: -0.5 }}
                                >
                                    <EditIcon fontSize="small" />
                                </IconButton>
                            </Stack>

                            {isAdmin ? (
                                <TextField
                                    select
                                    size="small"
                                    variant="standard"
                                    value={idea.status}
                                    onChange={(e) => handleQuickUpdate(idea.id, 'status', e.target.value)}
                                    InputProps={{ disableUnderline: true, sx: { fontSize: '0.75rem', fontWeight: 600, color: (theme) => STATUS_COLORS[idea.status] === 'default' ? theme.palette.text.primary : theme.palette[STATUS_COLORS[idea.status] as 'info' | 'primary' | 'success' | 'error'].main } }}
                                    sx={{ mb: 2 }}
                                >
                                    {['NEW', 'PLANNED', 'IN_PROGRESS', 'COMPLETED', 'REJECTED'].map((s) => (
                                        <MenuItem key={s} value={s} sx={{ fontSize: '0.8rem' }}>{s.replace('_', ' ')}</MenuItem>
                                    ))}
                                </TextField>
                            ) : (
                                <Box sx={{ mb: 2 }}>
                                    <Chip
                                        size="small"
                                        label={idea.status.replace('_', ' ')}
                                        color={STATUS_COLORS[idea.status] === 'default' ? 'default' : STATUS_COLORS[idea.status] as 'info' | 'primary' | 'success' | 'error'}
                                        sx={{ fontWeight: 600, fontSize: '0.75rem', height: 24 }}
                                    />
                                </Box>
                            )}

                            {idea.description && (
                                <Typography variant="body2" color="text.secondary" mb={3} sx={{
                                    display: '-webkit-box',
                                    WebkitLineClamp: 3,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden',
                                }}>
                                    {idea.description}
                                </Typography>
                            )}

                            <Box sx={{ mt: 'auto', p: 1.5, borderRadius: 2, bgcolor: 'background.default' }}>
                                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
                                    <Stack direction="row" alignItems="center" spacing={1}>
                                        <AutoGraphIcon fontSize="small" sx={{ color: 'primary.main' }} />
                                        <Typography variant="body2" fontWeight={600}>Priority Score</Typography>
                                    </Stack>
                                    <Typography variant="h6" fontWeight={700} color="primary.main" sx={{ lineHeight: 1 }}>
                                        {_getPriorityScore(idea.impact, idea.effort)}
                                    </Typography>
                                </Stack>

                                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={0.5}>
                                    <Stack direction="row" alignItems="center" spacing={1} sx={{ opacity: 0.8 }}>
                                        <SpeedIcon sx={{ fontSize: 14 }} color="success" />
                                        <Typography variant="caption" sx={{ minWidth: 45 }}>Impact</Typography>
                                    </Stack>
                                    <Rating
                                        value={idea.impact / 2} // Rating uses 5 stars, we have 1-10
                                        precision={0.5}
                                        size="small"
                                        onChange={(_, newValue) => {
                                            if (newValue) handleQuickUpdate(idea.id, 'impact', newValue * 2);
                                        }}
                                    />
                                </Stack>

                                <Stack direction="row" alignItems="center" justifyContent="space-between">
                                    <Stack direction="row" alignItems="center" spacing={1} sx={{ opacity: 0.8 }}>
                                        <HandymanIcon sx={{ fontSize: 14 }} color="error" />
                                        <Typography variant="caption" sx={{ minWidth: 45 }}>Effort</Typography>
                                    </Stack>
                                    <Rating
                                        value={idea.effort / 2}
                                        precision={0.5}
                                        size="small"
                                        onChange={(_, newValue) => {
                                            if (newValue) handleQuickUpdate(idea.id, 'effort', newValue * 2);
                                        }}
                                    />
                                </Stack>
                            </Box>
                        </CardContent>
                    </Card>
                ))}
            </Stack>

            <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>{editingIdea?.id ? 'Edit Feature' : 'New Feature'}</DialogTitle>
                <DialogContent>
                    <Stack spacing={3} sx={{ mt: 1 }}>
                        <TextField
                            label="Feature Title"
                            value={editingIdea?.title || ''}
                            onChange={(e) => setEditingIdea(prev => ({ ...prev, title: e.target.value }))}
                            fullWidth
                            autoFocus
                        />
                        <TextField
                            label="Description"
                            value={editingIdea?.description || ''}
                            onChange={(e) => setEditingIdea(prev => ({ ...prev, description: e.target.value }))}
                            multiline
                            rows={3}
                            fullWidth
                        />

                        <Box>
                            <Typography gutterBottom variant="subtitle2">Impact (1-10) — Output value</Typography>
                            <Rating
                                value={(editingIdea?.impact || 5) / 2}
                                precision={0.5}
                                onChange={(_, newValue) => {
                                    if (newValue) setEditingIdea(prev => ({ ...prev, impact: newValue * 2 }));
                                }}
                            />
                            <Typography variant="caption" display="block" color="text.secondary">
                                Higher is better. 10 = Game changer, 1 = Barely noticeable.
                            </Typography>
                        </Box>

                        <Box>
                            <Typography gutterBottom variant="subtitle2">Effort (1-10) — Cost to build</Typography>
                            <Rating
                                value={(editingIdea?.effort || 5) / 2}
                                precision={0.5}
                                onChange={(_, newValue) => {
                                    if (newValue) setEditingIdea(prev => ({ ...prev, effort: newValue * 2 }));
                                }}
                            />
                            <Typography variant="caption" display="block" color="text.secondary">
                                Lower is better for priority. 10 = Months of work, 1 = Trivial tweak.
                            </Typography>
                        </Box>

                    </Stack>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 3, justifyContent: 'space-between' }}>
                    {editingIdea?.id ? (
                        <Button color="error" onClick={() => {
                            removeIdea(editingIdea.id!);
                            setEditDialogOpen(false);
                        }}>
                            Delete Feature
                        </Button>
                    ) : (
                        <Box />
                    )}
                    <Box>
                        <Button onClick={() => setEditDialogOpen(false)} sx={{ mr: 1 }}>Cancel</Button>
                        <Button variant="contained" onClick={handleSaveIdea} disabled={!editingIdea?.title}>
                            Save Feature
                        </Button>
                    </Box>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default function IdeasPage() {
    return (
        <Suspense fallback={<Typography>Loading features...</Typography>}>
            <IdeasContent />
        </Suspense>
    );
}
