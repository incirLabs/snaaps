export const XLogo: React.FC<JSX.IntrinsicElements['svg']> = (props) => {
  return (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g clip-path="url(#clip0_309_1478)">
        <mask
          id="mask0_309_1478"
          style={{maskType: 'luminance'}}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="32"
          height="32"
        >
          <path d="M32 0H0V32H32V0Z" fill="white" />
        </mask>
        <g mask="url(#mask0_309_1478)">
          <path
            d="M28.25 0H3.75C1.67893 0 0 1.67893 0 3.75V28.25C0 30.3211 1.67893 32 3.75 32H28.25C30.3211 32 32 30.3211 32 28.25V3.75C32 1.67893 30.3211 0 28.25 0Z"
            fill="black"
          />
          <path
            d="M22.2441 6.25H25.5521L18.3251 14.51L26.8271 25.75H20.1701L14.9561 18.933L8.99012 25.75H5.68015L13.4101 16.915L5.25415 6.25H12.0801L16.7931 12.481L22.2441 6.25ZM21.0831 23.77H22.9161L11.0841 8.126H9.11712L21.0831 23.77Z"
            fill="white"
          />
        </g>
      </g>
      <defs>
        <clipPath id="clip0_309_1478">
          <rect width="32" height="32" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};
