import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Link from 'next/link';

export default function PrivacyPolicyPage() {
    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                p: 3,
                background:
                    'radial-gradient(ellipse at 50% 0%, rgba(108,99,255,0.15) 0%, transparent 60%), #0F0E17',
            }}
        >
            <Card
                sx={{
                    maxWidth: 800,
                    width: '100%',
                    background: 'rgba(26, 25, 41, 0.8)',
                    border: '1px solid rgba(108,99,255,0.2)',
                    backdropFilter: 'blur(20px)',
                }}
            >
                <CardContent sx={{ p: { xs: 3, md: 5 } }}>
                    <Typography variant="h4" fontWeight={700} mb={4}>
                        Privacy Policy
                    </Typography>
                    <Typography variant="body1" paragraph color="text.secondary">
                        Last updated: {new Date().toLocaleDateString()}
                    </Typography>
                    <Typography variant="h6" fontWeight={600} mt={4} mb={2}>
                        1. Data Collection
                    </Typography>
                    <Typography variant="body1" paragraph color="text.secondary">
                        We collect information you provide directly to us, such as when you create or modify your account, request on-demand services, contact customer support, or otherwise communicate with us.
                    </Typography>
                    <Typography variant="h6" fontWeight={600} mt={4} mb={2}>
                        2. Use of Data
                    </Typography>
                    <Typography variant="body1" paragraph color="text.secondary">
                        We use the information we collect about you to provide, maintain, and improve our services, including to facilitate payments, send receipts, provide products and services you request (and send related information), develop new features, provide customer support to Users, develop safety features, authenticate users, and send product updates and administrative messages.
                    </Typography>
                    <Typography variant="h6" fontWeight={600} mt={4} mb={2}>
                        3. Sharing of Data
                    </Typography>
                    <Typography variant="body1" paragraph color="text.secondary">
                        We may share the information we collect about you as described in this Statement or as described at the time of collection or sharing, including as follows: with third party service providers; in response to a request for information by a competent authority if we believe disclosure is in accordance with, or is otherwise required by, any applicable law, regulation, or legal process; with law enforcement officials, government authorities, or other third parties if we believe your actions are inconsistent with our User agreements, Terms of Service, or policies, or to protect the rights, property, or safety of TaskTurtle or others.
                    </Typography>

                    <Box sx={{ mt: 6, textAlign: 'center' }}>
                        <Button component={Link} href="/login" variant="outlined">
                            Back to Login
                        </Button>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
}
