// SMD mount for RP2040-Zero like boards, such as the Waveshare RP2040-Zero or the Supermini RP2040 Zero.
// Default paramaters should work OK for the Waveshare variant.
module.exports = {
  params: {
    designator: 'MCU',
    side: 'F',
    reversible: false,
    width: 18,
    height: 23.50,
    gap: 2.54,
    inner_pad_h_length: 2.1,
    inner_pad_v_length: 2.34,
    outer_pad_h_length: 2,
    outer_pad_v_length: 2,
    pad_width: 1.5,
    via: true,
    via_inner: true,
    via_size: 0.6,
    via_drill: 0.3,
    via_gap: 0.3,
    silkscreen_text: true,
    silkscreen_outline: true,
    flip: false,
    oval: true,
    // Left side
    V5: { type: 'net', value: 'V5' },
    GND: { type: 'net', value: 'GND' },
    V3: { type: 'net', value: 'V3' },
    P29: { type: 'net', value: 'P29' },
    P28: { type: 'net', value: 'P28' },
    P27: { type: 'net', value: 'P27' },
    P26: { type: 'net', value: 'P26' },
    P15: { type: 'net', value: 'P15' },
    P14: { type: 'net', value: 'P14' },
    // Right side
    P0: { type: 'net', value: 'P0' },
    P1: { type: 'net', value: 'P1' },
    P2: { type: 'net', value: 'P2' },
    P3: { type: 'net', value: 'P3' },
    P4: { type: 'net', value: 'P4' },
    P5: { type: 'net', value: 'P5' },
    P6: { type: 'net', value: 'P6' },
    P7: { type: 'net', value: 'P7' },
    P8: { type: 'net', value: 'P8' },
    P9: { type: 'net', value: 'P9' },
    // Bottom
    P10: { type: 'net', value: 'P10' },
    P11: { type: 'net', value: 'P11' },
    P12: { type: 'net', value: 'P12' },
    P13: { type: 'net', value: 'P13' },
  },
  body: p => {
    const th = p.height
    const tw = p.width

    let pins = Object.entries(p)
      .filter(([, value]) => 
        typeof value === 'object' && 
        value.str &&
        value.str.includes('net')
      )
      .map(([, value]) => value);

    const common_start = `
        (footprint "Supermini-RP2040-smd-longpads"
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

    const text = (side) => {
      const layer = `${side}.${p.silkscreen_text ? "SilkS" : "Fab"}`
      const mirror = side == "B" ? "(justify mirror)" : ""

      return `
            (fp_text user "MCU" (at 0 ${th/2 + p.outer_pad_v_length + 1} ${p.rot}) (layer "${layer}")
              (effects (font (size 1 1) (thickness 0.15)) ${mirror})
            )`
    }

    const outline = (side) => {
      const layer = `${side}.${p.silkscreen_outline ? "SilkS" : "Fab"}`

      return `(fp_rect (start ${-tw / 2} -${th / 2}) (end ${tw / 2} ${th / 2}) (layer "${layer}") (width 0.1) (fill none))`
    }


    // Adjustable variables
    let layer = p.reversible ? "*" : p.side
    layer = `layers "${layer}.Cu" "${layer}.Paste" "${layer}.Mask"`

    let padNo = 0

    const via = (number, x, y, pin) =>
      `(pad "${number}" thru_hole circle
          (at ${x} ${y}) 
          (size ${p.via_size} ${p.via_size}) 
          (drill ${p.via_drill}) 
          (layers "*.Cu")
          ${pin.str}
        )`

    const pad = (x, y, pin, horizontal) => {
      const inner = horizontal ? p.inner_pad_h_length : p.inner_pad_v_length;
      const outer = horizontal ? p.outer_pad_h_length : p.outer_pad_v_length;
      const [w, h] = horizontal ? [inner + outer, p.pad_width] : [p.pad_width, inner + outer];
      const side = Math.sign(horizontal ? x : y);

      const pX = x + (horizontal ? side * (w / 2 - inner) : 0);
      const pY = y + (horizontal ? 0 : side * (h / 2 - inner));

      const viaSide = side * (-1) ** p.via_inner
      const viaOffset = viaSide * (((horizontal ? w : h) - p.via_size) / 2 - p.via_gap);
      const [vX, vY] = horizontal ? [pX + viaOffset, pY] : [pX, pY + viaOffset];

      return `
          (pad "${++padNo}" smd ${p.oval ? "oval" : "roundrect"}
            (at ${pX} ${pY} ${p.rot}) (size ${w} ${h}) (${layer})
            (roundrect_rratio 0.25) ${pin.str}
          ) ${p.via ? via(padNo, vX, vY, pin) : ""}`;
    };

    const pads = pins.map((pin, i) => {
      const gap = p.gap
      const flip = (-1) ** p.flip

      let horizontal = i < 18
      let x = tw/2 * (-1) ** (i < 9) * flip
      let y = (i % 9 - 4) * gap

      if (i >= 18) {
        x = -(i % 18 - 2) * gap * flip
        y = th/2
      }

      return pad(x, y, pin, horizontal)
    }).join("\n");

    let out = common_start + pads;

    ["F", "B"].forEach(side => {
      if ((p.side === side || p.reversible)) {
        out += text(side) + outline(side)
      }
    })

    return out + ")"
  }
}
