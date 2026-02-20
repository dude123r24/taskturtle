import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Link from 'next/link';

export default function TermsOfServicePage() {
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
                        Terms of Service
                    </Typography>
                    <Typography variant="body1" paragraph color="text.secondary">
                        Last updated: {new Date().toLocaleDateString()}
                    </Typography>
                    <Typography variant="h6" fontWeight={600} mt={4} mb={2}>
                        1. Acceptance of Terms
                    </Typography>
                    <Typography variant="body1" paragraph color="text.secondary">
                        By accessing or using our services, you agree to be bound by these Terms. If you disagree with any part of the terms then you may not access the service.
                    </Typography>
                    <Typography variant="h6" fontWeight={600} mt={4} mb={2}>
                        2. Use License
                    </Typography>
                    <Typography variant="body1" paragraph color="text.secondary">
                        Permission is granted to temporarily download one copy of the materials on TaskTurtle's website for personal, non-commercial transitory viewing only.
                    </Typography>
                    <Typography variant="h6" fontWeight={600} mt={4} mb={2}>
                        3. Disclaimer
                    </Typography>
                    <Typography variant="body1" paragraph color="text.secondary">
                        The materials on TaskTurtle's website are provided on an 'as is' basis. TaskTurtle makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                    </Typography>
                    <Typography variant="h6" fontWeight={600} mt={4} mb={2}>
                        4. Limitations
                    </Typography>
                    <Typography variant="body1" paragraph color="text.secondary">
                        In no event shall TaskTurtle or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on TaskTurtle's website.
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
