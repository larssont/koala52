// Text footprint with support for custom font faces and estimated centering.
// Adjust the width and height factors depending on the font of choice to ensure that centering works as expected.
module.exports = {
    params: {
      side: 'F',
      reversible: false,
      mirrored: false,
      align: 'top left',
      text: 'Your Text Here',
      face: 'Cascadia Mono', // Font face
      widthFactor: 0.816, // With factor of font
      heightFactor: 1, // Height factor of font
      thickness: 0.15,
      height: 1,
      width: 1,
    },
    body: p => {
        const getTextDimensions = (text, fontSize = { x: 1, y: 1 }) => {
            const charWidth = fontSize.x * p.widthFactor;
            const charHeight = fontSize.y * p.heightFactor
    
            // Split the text into lines
            const lines = text.split('\\n');
    
            // Calculate width of the longest line
            const textWidth = Math.max(...lines.map(line => line.length * charWidth));
    
            // Calculate height based on number of lines
            const textHeight = lines.length * charHeight + (lines.length - 1) * 0.66 * charHeight;
    
            return { textWidth, textHeight };
        };

        const { textWidth, textHeight } = getTextDimensions(p.text, { x: p.width, y: p.height });

        let offset_x = (textWidth / 2) * (p.align?.includes("left") ? -1 : 1)
        let offset_y = textHeight / 2;

        // Handle justification
        let justify = `(justify ${p.align} ${p.mirrored ? 'mirror' : ''})`

        // Generate front and back text based on parameters
        const front = `
            (fp_text user "${p.text}" (at ${-offset_x} ${-offset_y} ${p.rot}) (layer F.SilkS)
            (effects (font ${p.face != '' ? '(face "' + p.face + '")' : ''} (size ${p.height} ${p.width} ) (thickness ${p.thickness})) ${justify}))`

        const back = `
            (fp_text user "${p.text}" (at ${-offset_x} ${-offset_y} ${p.rot}) (layer B.SilkS)
            (effects (font ${p.face != '' ? '(face "' + p.face + '")' : ''} (size ${p.height} ${p.width} ) (thickness ${p.thickness})) ${justify}))`

        let fp_text = ""
        if (p.side == "F" || p.reversible) {
            fp_text += front;
        }
        if (p.side == "B" || p.reversible) {
            fp_text += back
        }

        return `
            (footprint "Text" (layer "${p.side}.Cu")
            ${p.at}
            (property "Reference" "${p.ref}"
                (at 0 0 ${p.r})
                (layer "${p.reversible ? 'F' : p.side}.SilkS")
                ${p.ref_hide}
                (effects (font (size 1 1) (thickness 0.15)))
            )
            (attr board_only exclude_from_pos_files exclude_from_bom)
            ${fp_text}
            )
        `
        }
  }
  