// For Molex 54819-0589
module.exports = {
    params: {
        side: 'F',
        VBUS: { type: 'net', value: 'VBUS' },
        DMIN: { type: 'net', value: 'DMIN' },
        DPLUS: { type: 'net', value: 'DPLUS' },
        ID: { type: 'net', value: 'ID' },
        GND: { type: 'net', value: 'GND' },
    },

    body: p => {
        // Width and height
        const h = 7.6
        const w = 9

        let padNo = 1
        
        const mh = (x, y) => {
            return `
                (pad "${padNo++}" thru_hole roundrect
                    (at ${x} ${y - h/2} ${p.rot})
                    (size 1.7 2.7)
                    (drill oval 0.7 1.9)
                    (layers "*.Cu" "*.Mask")
                    (roundrect_rratio 0.5)
                )
            `
        }

        const term = (x, y, pin) => {
            return `
                (pad ${padNo++} smd rect 
                    (at ${x} ${y - h/2} ${p.rot})
                    (size 0.5 2.25) 
                    (layers ${p.side}.Cu ${p.side}.Paste ${p.side}.Mask) 
                    ${pin.str}
                )
            `
        }

        const praSizeX = 6.2
        const praSizeY = 1.2

        const out = `
            (footprint "Molex 54819-0589"
            (layer "${p.side}.Cu")
            ${p.at}
            (property "Reference" "${p.ref}"
                (at 0 5.5 ${p.r})
                (layer "${p.side}.SilkS")
                ${p.ref_hide}
                (effects (font (size 1 1) (thickness 0.15)))
            )
            (attr smd)

            (fp_text user "USB\\nMini-B" (at 0 -1 ${p.rot}) (layer "${p.side}.SilkS")
                (effects (font (size 1 1) (thickness 0.15)) ${p.side == "B" ? "(justify mirror)" : ""} )
            )

        	(zone
                (net 0)
                (net_name "")
                (layer "${p.side}.Cu")
                (name "USB Mini-B - Pattern Restricted Area ")
                (hatch full 0.5)
                (connect_pads
                    (clearance 0)
                )
                (min_thickness 0.25)
                (filled_areas_thickness no)
                (keepout
                    (tracks not_allowed)
                    (vias not_allowed)
                    (pads not_allowed)
                    (copperpour not_allowed)
                    (footprints allowed)
                )
                (fill
                    (thermal_gap 0.5)
                    (thermal_bridge_width 0.5)
                )
                (polygon
                    (pts
                        (xy ${p.eaxy(-praSizeX/2, -h/2)})
                        (xy ${p.eaxy(praSizeX/2, -h/2)})
                        (xy ${p.eaxy(praSizeX/2, -h/2 + praSizeY)})
                        (xy ${p.eaxy(-praSizeX/2, -h/2 + praSizeY)})
                    )
                )
            )
            ${term(1.6, 6.225, p.VBUS)}
            ${term(0.8, 6.225, p.DMIN)}
            ${term(0, 6.225, p.DPLUS)}
            ${term(-0.8, 6.225, p.ID)}
            ${term(-1.6, 6.225, p.GND)}

            ${mh(-3.65, 1.75)}
            ${mh(3.65, 1.75)}
            ${mh(-3.65, 6.25)}
            ${mh(3.65, 6.25)}

            )
            `

        return out
    }
}
