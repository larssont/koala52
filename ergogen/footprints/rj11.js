// Designed around the Molex 44144-0004
// NOTE! Untested
module.exports = {
    params: {
        side: 'F',
        reversible: false,
        vias: true,
        TX: { type: 'net', value: 'TX' },
        RX: { type: 'net', value: 'RX' },
        POWER: { type: 'net', value: 'POWER' },
        GND: { type: 'net', value: 'GND' }
    },

    body: p => {
        // Width and height
        const w = 13.21
        const h = 16.89

        // Terminal tails' pad size
        const termSizeX = 0.64 
        const termSizeY = 2.54

        const termSpacing = 1.27
        const termY = 0.58 - (h + termSizeY)/2

        // Fitting nails' pad size
        const nailSizeX = 2.54
        const nailSizeY = 5.21

        const layer = p.reversible ? "*" : p.side

        let padNo = 1

        const start = `
            (footprint "RJ11 44144-0004"
            (layer "${p.side}.Cu")
            ${p.at}
            (property "Reference" "${p.ref}"
                (at 0 5.5 ${p.r})
                (layer "${p.side}.SilkS")
                ${p.ref_hide}
                (effects (font (size 1 1) (thickness 0.15)))
            )
            (attr smd)
            `

        const textF = `
            (fp_text user "RJ11\\n6P4C" (at 0 0 ${p.rot}) (layer "F.SilkS")
                (effects (font (size 1 1) (thickness 0.15)))
            )
        `

        const textB = `
            (fp_text user "RJ11\\n6P4C" (at 0 0 ${p.rot}) (layer "B.SilkS")
                (effects (font (size 1 1) (thickness 0.15)) (justify mirror))
            )
        `

        const vias = `
            (pad ${padNo++} thru_hole circle (at ${-termSpacing*3/2} ${termY - termSizeY/2.75} ${p.rot}) (size 0.6 0.6) (drill 0.3) (layers ${layer}.Cu ${layer}.Paste ${layer}.Mask) ${p.GND.str})
            (pad ${padNo++} thru_hole circle (at ${-termSpacing/2} ${termY - termSizeY/2.75} ${p.rot}) (size 0.6 0.6) (drill 0.3) (layers ${layer}.Cu ${layer}.Paste ${layer}.Mask) ${p.RX.str})
            (pad ${padNo++} thru_hole circle (at ${termSpacing/2} ${termY - termSizeY/2.75} ${p.rot}) (size 0.6 0.6) (drill 0.3) (layers ${layer}.Cu ${layer}.Paste ${layer}.Mask) ${p.TX.str})
            (pad ${padNo++} thru_hole circle (at ${termSpacing*3/2} ${termY - termSizeY/2.75} ${p.rot}) (size 0.6 0.6) (drill 0.3) (layers ${layer}.Cu ${layer}.Paste ${layer}.Mask) ${p.POWER.str})
        `

        let body = ""

        if (p.side == "F" || p.reversible) {
            body += textF
        }
        if (p.side == "B" || p.reversible) {
            body += textB
        }
        if (p.vias) {
            body += vias
        }

        body += `
            (fp_line (start ${-w / 2} ${-h / 2}) (end ${w / 2} ${-h / 2}) (layer ${layer}.Fab) (width 0.2))
            (fp_line (start ${w / 2} ${-h / 2}) (end ${w / 2} ${h / 2}) (layer ${layer}.Fab) (width 0.2))
            (fp_line (start ${w / 2} ${h / 2}) (end ${-w / 2} ${h / 2}) (layer ${layer}.Fab) (width 0.2))
            (fp_line (start ${-w / 2} ${h / 2}) (end ${-w / 2} ${-h / 2}) (layer ${layer}.Fab) (width 0.2))

            (pad ${padNo++} smd rect (at ${-termSpacing*3/2} ${termY} ${p.rot}) (size ${termSizeX} ${termSizeY}) (layers ${layer}.Cu ${layer}.Paste ${layer}.Mask) ${p.GND.str})
            (pad ${padNo++} smd rect (at ${-termSpacing/2} ${termY} ${p.rot}) (size ${termSizeX} ${termSizeY}) (layers ${layer}.Cu ${layer}.Paste ${layer}.Mask) ${p.RX.str})
            (pad ${padNo++} smd rect (at ${termSpacing/2} ${termY} ${p.rot}) (size ${termSizeX} ${termSizeY}) (layers ${layer}.Cu ${layer}.Paste ${layer}.Mask) ${p.TX.str})
            (pad ${padNo++} smd rect (at ${termSpacing*3/2} ${termY} ${p.rot}) (size ${termSizeX} ${termSizeY}) (layers ${layer}.Cu ${layer}.Paste ${layer}.Mask) ${p.POWER.str})

            (pad ${padNo++} smd rect (at ${(nailSizeX - w) / 2} ${8.5 + (nailSizeY - h) / 2} ${p.rot}) (size ${nailSizeX} ${nailSizeY}) (layers ${layer}.Cu ${layer}.Paste ${layer}.Mask))
            (pad ${padNo++} smd rect (at ${(w - nailSizeX) / 2} ${8.5 + (nailSizeY - h) / 2} ${p.rot}) (size ${nailSizeX} ${nailSizeY}) (layers ${layer}.Cu ${layer}.Paste ${layer}.Mask))
        )`

        return start + body 
    }
}
