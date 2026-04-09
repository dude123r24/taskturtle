'use client';

import { useState, useEffect, useCallback } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import Skeleton from '@mui/material/Skeleton';
import CircularProgress from '@mui/material/CircularProgress';
import CloseIcon from '@mui/icons-material/Close';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import ShareIcon from '@mui/icons-material/Share';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';

interface ShareModalProps {
    open: boolean;
    onClose: () => void;
}

export default function ShareModal({ open, onClose }: ShareModalProps) {
    const [token, setToken] = useState<string | null>(null);
    const [friendsJoined, setFriendsJoined] = useState<number>(0);
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const [canShare, setCanShare] = useState(false);

    useEffect(() => {
        setCanShare(typeof navigator !== 'undefined' && !!navigator.share);
    }, []);

    const fetchOrCreate = useCallback(async () => {
        if (!open) return;
        setLoading(true);
        try {
            // First try GET to get existing token + stats
            const getRes = await fetch('/api/invite');
            if (getRes.ok) {
                const data = await getRes.json() as { token: string | null; friendsJoined: number };
                setFriendsJoined(data.friendsJoined);
                if (data.token) {
                    setToken(data.token);
                    setLoading(false);
                    return;
                }
            }
            // No existing token — create one
            const postRes = await fetch('/api/invite', { method: 'POST' });
            if (postRes.ok) {
                const data = await postRes.json() as { token: string };
                setToken(data.token);
            }
        } finally {
            setLoading(false);
        }
    }, [open]);

    useEffect(() => {
        if (open) {
            void fetchOrCreate();
        } else {
            // Reset copied state when closed
            setCopied(false);
        }
    }, [open, fetchOrCreate]);

    const inviteUrl = token
        ? `${typeof window !== 'undefined' ? window.location.origin : ''}/login?invite=${token}`
        : '';

    const handleCopy = async () => {
        if (!inviteUrl) return;
        try {
            await navigator.clipboard.writeText(inviteUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        } catch {
            // Fallback for older browsers
            const el = document.createElement('textarea');
            el.value = inviteUrl;
            document.body.appendChild(el);
            el.select();
            document.execCommand('copy');
            document.body.removeChild(el);
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        }
    };

    const handleNativeShare = async () => {
        if (!inviteUrl) return;
        try {
            await navigator.share({
                title: 'Join me on TaskTurtle',
                text: 'I use TaskTurtle to stay on top of my priorities. Join me!',
                url: inviteUrl,
            });
        } catch {
            // User cancelled or share not supported — fall through
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            aria-labelledby="share-modal-title"
            aria-modal="true"
            maxWidth="xs"
            fullWidth
            PaperProps={{ sx: { borderRadius: 3 } }}
        >
            <DialogTitle
                id="share-modal-title"
                sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}
            >
                <Typography variant="h6" fontWeight={700} letterSpacing="-0.02em">
                    Invite friends
                </Typography>
                <IconButton
                    onClick={onClose}
                    aria-label="Close invite dialog"
                    size="small"
                    sx={{ color: 'text.secondary' }}
                >
                    <CloseIcon fontSize="small" />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ pt: 0 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
                    Share your personal invite link. Friends who sign up through it get their own private workspace.
                </Typography>

                {/* Friends joined count */}
                {friendsJoined > 0 && (
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            mb: 2,
                            px: 1.5,
                            py: 1,
                            borderRadius: 2,
                            bgcolor: 'action.hover',
                        }}
                    >
                        <PeopleAltOutlinedIcon sx={{ fontSize: 18, color: 'primary.main' }} />
                        <Typography variant="body2" fontWeight={600} color="primary.main">
                            {friendsJoined} {friendsJoined === 1 ? 'friend' : 'friends'} joined via your link
                        </Typography>
                    </Box>
                )}

                {/* Invite link field */}
                {loading ? (
                    <Skeleton variant="rounded" height={56} sx={{ borderRadius: 2 }} />
                ) : (
                    <OutlinedInput
                        readOnly
                        value={inviteUrl}
                        fullWidth
                        aria-label="Your invite link"
                        sx={{
                            borderRadius: 2,
                            fontSize: '0.8125rem',
                            pr: 0.5,
                            '& input': { overflow: 'hidden', textOverflow: 'ellipsis' },
                        }}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    onClick={() => void handleCopy()}
                                    aria-label={copied ? 'Copied!' : 'Copy invite link'}
                                    sx={{
                                        minWidth: 44,
                                        minHeight: 44,
                                        color: copied ? 'success.main' : 'text.secondary',
                                        transition: 'color 0.2s',
                                    }}
                                >
                                    {copied ? <CheckIcon sx={{ fontSize: 20 }} /> : <ContentCopyIcon sx={{ fontSize: 20 }} />}
                                </IconButton>
                            </InputAdornment>
                        }
                    />
                )}

                {copied && (
                    <Typography
                        variant="caption"
                        color="success.main"
                        fontWeight={600}
                        sx={{ display: 'block', mt: 0.75, ml: 0.5 }}
                        role="status"
                        aria-live="polite"
                    >
                        Link copied to clipboard
                    </Typography>
                )}
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2.5, pt: 0, gap: 1 }}>
                {loading ? (
                    <CircularProgress size={20} />
                ) : (
                    <>
                        <Button
                            variant="outlined"
                            onClick={() => void handleCopy()}
                            startIcon={copied ? <CheckIcon /> : <ContentCopyIcon />}
                            sx={{ flex: 1, borderRadius: 2, textTransform: 'none', minHeight: 44 }}
                            color={copied ? 'success' : 'primary'}
                        >
                            {copied ? 'Copied!' : 'Copy link'}
                        </Button>
                        {canShare && (
                            <Button
                                variant="contained"
                                onClick={() => void handleNativeShare()}
                                startIcon={<ShareIcon />}
                                sx={{ flex: 1, borderRadius: 2, textTransform: 'none', minHeight: 44 }}
                                disableElevation
                            >
                                Share
                            </Button>
                        )}
                    </>
                )}
            </DialogActions>
        </Dialog>
    );
}
