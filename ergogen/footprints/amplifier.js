// Amplification circuit for speaker, not for piezo
// NOTE! Untested
module.exports = {
    params: {
        side: 'F',
        reversible: false,
        VCC: {type: 'net', value: 'VCC'},
        GND: {type: 'net', value: 'GND'},
        AUDIO_IN: {type: 'net', value: 'AUDIO_IN'},
        AUDIO_OUT_POS: {type: 'net', value: 'AUDIO_OUT+'},
        AUDIO_OUT_NEG: {type: 'net', value: 'AUDIO_OUT-'},
        SDB: {type: 'net',  value: 'VCC'},
        AMP_IN_NEG: {type: 'net',  value: 'AMP_IN-'},
        AMP_IN_POS: {type: 'net',  value: 'AMP_BYPASS'},
        HPF: {type: 'net',  value: 'HPF_NODE'},
        BYPASS: {type: 'net',  value: 'AMP_BYPASS'},
    },

    body: p => {

        const start = `
            (footprint "IS31AP4991A-GRLS2-TR Amplifier Circuit"
                (layer "${p.side}.Cu")
                ${p.at}
                (property "Reference" "${p.ref}"
                (at 0 5.5 ${p.r})
                (layer "${p.side}.SilkS")
                ${p.ref_hide}
                (effects (font (size 1 1) (thickness 0.15)))
                )
        `
        let justify = p.side == "B" ? '(justify mirror)' : ''

        let amp = `
            (fp_rect (start -1.95 -2.55) (end 1.95 2.55)
                (stroke (width 0.1) (type default)) (fill none) (layer "${p.side}.SilkS"))
            (fp_text user "Amp" (at 0 3.6 ${p.rot}) (layer ${p.side}.SilkS)
                (effects (font (size 1 1) (thickness 0.15)) ${justify}))
        `
        const amp_pads = {
            1: { x: -2.425, y: -1.905, net: p.SDB },
            2: { x: -2.425, y: -0.635, net: p.BYPASS },
            3: { x: -2.425, y: 0.635, net: p.AMP_IN_POS },
            4: { x: -2.425, y: 1.905, net: p.AMP_IN_NEG },
            5: { x: 2.425, y: 1.905, net: p.AUDIO_OUT_POS },
            6: { x: 2.425, y: 0.635, net: p.VCC },
            7: { x: 2.425, y: -0.635, net: p.GND },
            8: { x: 2.425, y: -1.905, net: p.AUDIO_OUT_NEG }
        };
        
        const amp_pad_size_x = 2.07;
        const amp_pad_size_y = 0.66;
        const amp_pad_layer = `layers "${p.side}.Cu" "${p.side}.Paste" "${p.side}.Mask"`;
        const amp_pad_rratio = 0.25;
        
        for (let id in amp_pads) {
            const pad = amp_pads[id];
            amp += `(pad "${id}" smd roundrect
                    (at ${pad.x} ${pad.y} ${p.r})
                    (size ${amp_pad_size_x} ${amp_pad_size_y})
                    (${amp_pad_layer})
                    (roundrect_rratio ${amp_pad_rratio}) ${pad.net.str})\n`;
        }

        let comp_count = 1
        const comp_smd = (x, y, pin1, pin2, text, vertical = false) => {
     
            const box_offset = 0.15
            const size_x = 1.075
            const size_y = 0.95

            const offset = 0.8625
            const xOffset = vertical ? 0 : offset
            const yOffset = vertical ? offset : 0
        
            // Function to generate pad
            const pad = (num, xPos, yPos) => `
                (pad "${comp_count}_${num}" smd roundrect
                    (at ${xPos} ${yPos} ${p.r})
                    (size ${size_x} ${size_y})
                    (layers "${p.side}.Cu" "${p.side}.Paste" "${p.side}.Mask")
                    (roundrect_rratio 0.25)
                    ${num === 1 ? pin1.str : pin2.str}
                )
            `
        
            let out = `
                ${pad(1, x - xOffset, y - yOffset)}
                ${pad(2, x + xOffset, y + yOffset)}
        
                (fp_rect 
                    (start 
                        ${x - xOffset - box_offset - size_x/2} 
                        ${y - yOffset - box_offset - size_y/2}
                    ) 
                    (end 
                        ${x + xOffset + box_offset + size_x/2} 
                        ${y + yOffset + box_offset + size_y/2}
                    )
                (stroke (width 0.1) (type default)) (fill none) (layer "${p.side}.SilkS"))
            `
        
            comp_count += 1
            return out
        }

        let cS = comp_smd(amp_pads[7].x + 2.15, (amp_pads[7].y + amp_pads[6].y) / 2, p.GND, p.VCC, "1uF", true)

        let cIn = comp_smd(amp_pads[3].x - 2, (amp_pads[3].y + amp_pads[4].y) / 2 + 0.22, p.AUDIO_IN, p.HPF, "0.1uF", true)

        let rIn = comp_smd(amp_pads[4].x - 0.865, amp_pads[4].y + 1.6975, p.HPF, p.AMP_IN_NEG, "20kΩ")
        
        let rF = comp_smd(amp_pads[8].x - 0.865, amp_pads[8].y - 1.5, p.AMP_IN_NEG, p.AUDIO_OUT_NEG, "20kΩ")


        let cBypass = comp_smd(amp_pads[2].x - 2, (amp_pads[1].y + amp_pads[2].y) / 2 - 0.22, p.GND, p.BYPASS,  "0.47uF", true)


        let out = start + amp + cS + cIn + rIn + rF + cBypass

        return out += ")"
    }
}
  
  