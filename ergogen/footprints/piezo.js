// KLJ-1102 Piezo Element
//
// Nets
//    A: corresponds to pin 1
//    B: corresponds to pin 2
module.exports = {
    params: {
      side: 'F',
      reversible: false,
      A: { type: 'net', value: undefined },
      B: { type: 'net', value: undefined },
      swap_nets: true
    },
    body: p => {
      if (p.swap_nets) {
        [p.from, p.to] = [p.to, p.from];
      }

      const start = `
        (footprint "KLJ-1102_Piezo"
          (layer "${p.side}.Cu")
          ${p.at}
          (property "Reference" "${p.ref}"
            (at 0 5.5 ${p.r})
            (layer "${p.side}.SilkS")
            ${p.ref_hide}
            (effects (font (size 1 1) (thickness 0.15)))
          )
        `

      const front = `
          (fp_text user "Piezo" (at 0 5.5 ${p.rot}) (layer F.SilkS)
          (effects (font (size 1 1) (thickness 0.15))))
          
          (fp_rect (start -5.5 -4.5) (end 5.5 4.5)
          (stroke (width 0.1) (type default)) (fill none) (layer "F.SilkS"))
          
          (pad "1" smd rect (at -7.1 0 ${p.rot}) (size 3.2 3.2) (layers "F.Cu" "F.Paste" "F.Mask") ${p.A.str})
          (pad "2" smd rect (at 7.1 0 ${p.rot}) (size 3.2 3.2) (layers "F.Cu" "F.Paste" "F.Mask") ${p.B.str})
          `
          
      const back = `
          (fp_text user "Piezo" (at 0 5.5 ${p.rot}) (layer B.SilkS)
          (effects (font (size 1 1) (thickness 0.15)) (justify mirror)))
          
          (fp_rect (start -5.5 -4.5) (end 5.5 4.5)
          (stroke (width 0.1) (type default)) (fill none) (layer "B.SilkS"))
          
          (pad "1" smd rect (at -7.1 0 ${p.rot}) (size 3.2 3.2) (layers "B.Cu" "B.Paste" "B.Mask") ${p.A.str})
          (pad "2" smd rect (at 7.1 0 ${p.rot}) (size 3.2 3.2) (layers "B.Cu" "B.Paste" "B.Mask") ${p.B.str})`

      const r = `
        (pad "1" thru_hole circle (at -8.7 0) (size 0.5 0.5) (drill 0.25) (layers "*.Cu" "*.Mask") ${p.A.str})
        (pad "2" thru_hole circle (at 8.7 0) (size 0.5 0.5) (drill 0.25) (layers "*.Cu" "*.Mask") ${p.B.str})`

      const end = `)`


      let out = start
      if (p.side == "F" || p.reversible) {
        out += front
      }
      if (p.side == "B" || p.reversible) {
        out += back
      }
      if (p.reversible) {
        out += r
      }

      return out += end
    }
  }
  
  