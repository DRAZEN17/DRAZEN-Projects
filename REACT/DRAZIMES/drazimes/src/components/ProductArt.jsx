/**
 * Minimalist "fashion flat" line-art illustrations used as product imagery
 * placeholders. Pure line art on the shared `.product-frame` sand
 * background, drawn with currentColor so it can be recoloured via CSS.
 * Swap the `<ProductArt>` calls in constants/index.js for real photography
 * whenever it's ready — see the README.
 */
const arts = {
  coat: (
    <>
      <path d="M104,112 C104,98 122,88 150,88 C178,88 196,98 196,112 L206,300 L94,300 Z" />
      <path d="M128,96 L150,166" />
      <path d="M172,96 L150,166" />
      <path d="M150,166 L150,300" />
      <path d="M104,114 C82,126 68,168 72,236 L92,234 C90,178 96,140 112,118 Z" />
      <path d="M196,114 C218,126 232,168 228,236 L208,234 C210,178 204,140 188,118 Z" />
      <circle cx="140" cy="196" r="3.2" fill="currentColor" stroke="none" />
      <circle cx="140" cy="230" r="3.2" fill="currentColor" stroke="none" />
    </>
  ),
  cardigan: (
    <>
      <path d="M108,116 C108,100 126,90 150,90 C174,90 192,100 192,116 L198,270 L102,270 Z" />
      <path d="M130,98 L150,150" />
      <path d="M170,98 L150,150" />
      <path d="M150,150 L150,270" />
      <path d="M108,118 C88,130 76,164 80,214 L98,212 C96,172 102,142 116,122 Z" />
      <path d="M192,118 C212,130 224,164 220,214 L202,212 C204,172 198,142 184,122 Z" />
      <path d="M80,204 L98,202 M80,212 L98,210" />
      <path d="M220,204 L202,202 M220,212 L202,210" />
      <path d="M102,260 L198,260 M102,266 L198,266" />
    </>
  ),
  jacket: (
    <>
      <path d="M106,120 L120,100 L150,92 L180,100 L194,120 L200,268 L100,268 Z" />
      <path d="M120,100 L150,124 L180,100" />
      <path d="M150,124 L150,268" />
      <path d="M106,122 C86,134 74,168 78,220 L96,218 C94,176 100,146 114,126 Z" />
      <path d="M194,122 C214,134 226,168 222,220 L204,218 C206,176 200,146 186,126 Z" />
      <path d="M112,210 L134,210 M166,210 L188,210" />
    </>
  ),
  sweater: (
    <>
      <path d="M106,118 C106,100 122,90 150,90 C178,90 194,100 194,118 L200,272 L100,272 Z" />
      <path d="M130,94 C136,106 164,106 170,94" />
      <path d="M106,120 C84,132 72,166 76,214 L96,212 C94,172 100,142 116,124 Z" />
      <path d="M194,120 C216,132 228,166 224,214 L204,212 C206,172 200,142 184,124 Z" />
      <path d="M100,264 L200,264 M100,270 L200,270" />
      <path d="M76,204 L96,202 M76,210 L96,208" />
      <path d="M224,204 L204,202 M224,210 L204,208" />
    </>
  ),
  dress: (
    <>
      <path d="M122,100 C122,92 134,86 150,86 C166,86 178,92 178,100 L184,180 L116,180 Z" />
      <path d="M130,100 L134,84 M170,100 L166,84" />
      <path d="M116,180 C104,210 92,260 84,308 L216,308 C208,260 196,210 184,180 Z" />
      <path d="M118,180 L182,180" />
    </>
  ),
  tee: (
    <path d="M120,108 L96,124 L104,150 L118,140 L118,272 L182,272 L182,140 L196,150 L204,124 L180,108 C180,120 166,128 150,128 C134,128 120,120 120,108 Z" />
  ),
  blouse: (
    <>
      <path d="M118,110 L96,128 L106,152 L120,142 L120,276 L180,276 L180,142 L194,152 L204,128 L182,110 L150,132 Z" />
      <path d="M150,132 L150,148" />
      <circle cx="150" cy="162" r="2.6" fill="currentColor" stroke="none" />
      <circle cx="150" cy="182" r="2.6" fill="currentColor" stroke="none" />
      <circle cx="150" cy="202" r="2.6" fill="currentColor" stroke="none" />
    </>
  ),
  skirt: (
    <>
      <path d="M112,100 L188,100 L200,110 L214,290 L86,290 L100,110 Z" />
      <path d="M105,116 L195,116" />
    </>
  ),
  denim: (
    <>
      <path d="M112,120 C110,160 102,230 96,300 L120,300 C124,240 132,180 150,152 C168,180 176,240 180,300 L204,300 C198,230 190,160 188,120 L188,96 L112,96 Z" />
      <path d="M150,120 L150,152" />
      <path d="M112,120 L188,120" />
    </>
  ),
  bag: (
    <>
      <path d="M126,120 C126,96 174,96 174,120" />
      <path d="M104,132 L196,132 L206,268 C206,278 196,286 184,286 L116,286 C104,286 94,278 94,268 Z" />
      <path d="M104,132 L196,132 L192,180 L108,180 Z" />
      <circle cx="150" cy="168" r="5" />
    </>
  ),
  boots: (
    <>
      <path d="M116,88 L172,88 L172,206 C172,206 202,222 212,244 C218,258 210,270 194,270 L108,270 C98,270 90,262 90,250 L90,108 Z" />
      <path d="M90,258 L212,252" />
      <path d="M116,204 L172,204" />
      <path d="M126,116 L160,128 M126,136 L160,148 M126,156 L160,168" />
    </>
  ),
  ring: (
    <>
      <circle cx="150" cy="222" r="44" />
      <path d="M130,180 L150,150 L170,180 L162,196 L138,196 Z" />
    </>
  ),
  bracelet: (
    <>
      <ellipse cx="150" cy="192" rx="82" ry="48" />
      <ellipse cx="150" cy="192" rx="64" ry="34" />
    </>
  ),
  earrings: (
    <>
      <circle cx="112" cy="130" r="7" />
      <path d="M112,137 L112,150 C112,150 96,168 96,184 C96,198 128,198 128,184 C128,168 112,150 112,150" />
      <circle cx="188" cy="130" r="7" />
      <path d="M188,137 L188,150 C188,150 172,168 172,184 C172,198 204,198 204,184 C204,168 188,150 188,150" />
    </>
  ),
  necklace: (
    <>
      <path d="M104,96 C104,150 120,190 150,190 C180,190 196,150 196,96" />
      <path d="M138,186 L150,214 L162,186 Z" />
    </>
  ),
};

const ProductArt = ({ type = "coat", className = "w-full h-full" }) => {
  return (
    <svg
      viewBox="0 0 300 375"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {arts[type] ?? arts.coat}
    </svg>
  );
};

export default ProductArt;
