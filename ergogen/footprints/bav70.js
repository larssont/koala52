// BAV70 diode, designed around the BAV70 RFG from Taiwan Semiconductor
// See https://services.taiwansemi.com/storage/resources/datasheet/BAW56%20SERIES_I2001.pdf
module.exports = {
    params: {
        side: 'F',
        vias: true,
        swap_nets: false,
        pad_width: 0.85,
        pad_height: 1.25,
        A1: { type: 'net', value: undefined },
        A2: { type: 'net', value: undefined },
        C: { type: 'net', value: undefined },
    },

    body: p => {
        const justify = p.side == "B" ? "(justify mirror)" : ""
        if (p.swap_nets) {
            [p.A1, p.A2] = [p.A2, p.A1];
        }

        let padNo = 1
        const pad = (x, y, pin) => {
            return `
                (pad "${padNo++}" smd roundrect
                    (at ${x} ${y} ${p.rot})
                    (size ${p.pad_width} ${p.pad_height})
                    (layers "${p.side}.Cu" "${p.side}.Paste" "${p.side}.Mask")
                    (roundrect_rratio 0.1)
                    ${pin.str}
                )`
        }

        const lines = (...coords) => {
            if (coords.length % 2 !== 0 || coords.length < 4) {
                throw new Error("Input must include at least two points (x1, y1, x2, y2).");
            }
        
            let result = '';
        
            for (let i = 0; i < coords.length - 2; i += 2) {
                const [x1, y1, x2, y2] = [coords[i], coords[i + 1], coords[i + 2], coords[i + 3]];
                result += `(fp_line (start ${x1} ${y1}) (end ${x2} ${y2}) (layer "${p.side}.SilkS") (stroke (width 0.12) (type solid)))\n`;
            }
        
            return result.trim();
        };
        
        const h = 2*p.pad_height + 1.1
        const w = 2*p.pad_width + 1.1

        const cx = 0
        const cy = -(h - p.pad_height)/2

        const a1x = -(w - p.pad_width)/2
        const a2x = a1x * -1
        const ay = cy * -1

        const q = p.pad_width/2 + 0.25

        return `
            (footprint "BAV70 SOT23" (version 20211014) (generator pcbnew)
                (layer "${p.side}.Cu")
                ${p.at}
                (property "Reference" "${p.ref}"
                    (at 0 0 ${p.r})
                    (layer "${p.side}.SilkS")
                    ${p.ref_hide}
                    (effects (font (size 1 1) (thickness 0.15)) ${justify})
                )
                (attr smd)
                (fp_text value "BAV70" (at 0 0 ${p.rot}) (layer ${p.side}.Fab)
                    (effects (font (size 1 1) (thickness 0.15)) ${justify})
                )

                ${lines(cx - q, -0.65, -1.46, -0.65, -1.46, 0.30)}
                ${lines(cx + q, -0.65,  1.46, -0.65, 1.46, 0.30)}
                ${lines(a1x + q, 0.65, a2x - q, 0.65)}

                ${pad(a1x, ay, p.A1)}
                ${pad(a2x, ay, p.A2)}
                ${pad(cx, cy, p.C)}
        )
        `
    }
}
