import Box from '@mui/material/Box';
import type { SxProps, Theme } from '@mui/material/styles';

/**
 * TaskTurtle brand mark — geometric rounded-shell turtle.
 * Single source of truth for the logo glyph across in-app and marketing surfaces.
 * Colour is driven by the `color` prop (applied as `stroke`), so each surface
 * can tint it to its own palette.
 */
export default function TurtleMark({
    size = 30,
    color = 'currentColor',
    sx,
}: {
    size?: number;
    color?: string;
    sx?: SxProps<Theme>;
}) {
    return (
        <Box
            component="svg"
            viewBox="0 0 512 512"
            aria-hidden="true"
            fill="none"
            stroke={color}
            strokeWidth={30}
            strokeLinecap="round"
            strokeLinejoin="round"
            sx={{ width: size, height: size, flexShrink: 0, display: 'block', ...sx }}
        >
            <rect x="146" y="146" width="220" height="220" rx="70" />
            <polygon points="256,212 300,256 256,300 212,256" />
            <circle cx="256" cy="116" r="26" />
            <path d="M170,178 L132,140 M342,178 L380,140 M170,334 L132,372 M342,334 L380,372 M256,366 L256,396" />
        </Box>
    );
}
